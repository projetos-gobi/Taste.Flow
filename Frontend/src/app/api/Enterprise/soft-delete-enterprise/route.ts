import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let pool: Pool | null = null;

function getPool(): Pool {
  if (pool) return pool;

  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres.twcwycecokaiiaeptndq:vmedxADqPy5mDBgG@aws-1-sa-east-1.pooler.supabase.com:6543/postgres";

  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return pool;
}

function getUserIdFromToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || "K39Pg7Sa86QxAt0eQSmd6wRfjc1Ivl)@#(*";
    const decoded = jwt.verify(token, secret) as any;
    return decoded.userid || decoded.userId || null;
  } catch (error) {
    console.error("[SOFT DELETE ENTERPRISE] Token verification error:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const enterpriseIdToDelete = body.id || body.Id || "";

    if (!enterpriseIdToDelete) {
      return NextResponse.json(
        { success: false, message: "ID da empresa é obrigatório." },
        { status: 400 }
      );
    }

    // Verificar autenticação
    const authHeader = req.headers.get("authorization");
    const authenticatedUserId = getUserIdFromToken(authHeader);

    if (!authenticatedUserId) {
      return NextResponse.json(
        { success: false, message: "Não autorizado." },
        { status: 401 }
      );
    }

    const db = getPool();
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const now = new Date().toISOString();
      const systemUserId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

      // 1. Soft delete da empresa
      const enterpriseUpdateResult = await client.query(
        `UPDATE "Enterprise"
         SET 
           "IsDeleted" = true,
           "IsActive" = false,
           "DeletedOn" = $1,
           "DeletedBy" = $2,
           "ModifiedOn" = $1,
           "ModifiedBy" = $2
         WHERE "Id" = $3
           AND NOT COALESCE("IsDeleted", false) = true`,
        [now, systemUserId, enterpriseIdToDelete]
      );

      const enterpriseDeleted = enterpriseUpdateResult.rowCount > 0;

      if (!enterpriseDeleted) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          {
            success: false,
            data: { deleted: false, message: "Empresa não encontrada ou já deletada." },
          },
          { status: 404 }
        );
      }

      // 2. Soft delete dos endereços associados
      await client.query(
        `UPDATE "EnterpriseAddress"
         SET
           "IsDeleted" = true,
           "IsActive" = false,
           "DeletedOn" = $1,
           "DeletedBy" = $2,
           "ModifiedOn" = $1,
           "ModifiedBy" = $2
         WHERE "EnterpriseId" = $3
           AND NOT COALESCE("IsDeleted", false) = true`,
        [now, systemUserId, enterpriseIdToDelete]
      );

      // 3. Soft delete dos contatos associados
      await client.query(
        `UPDATE "EnterpriseContact"
         SET
           "IsDeleted" = true,
           "IsActive" = false,
           "DeletedOn" = $1,
           "DeletedBy" = $2,
           "ModifiedOn" = $1,
           "ModifiedBy" = $2
         WHERE "EnterpriseId" = $3
           AND NOT COALESCE("IsDeleted", false) = true`,
        [now, systemUserId, enterpriseIdToDelete]
      );

      await client.query("COMMIT");

      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: {
            deleted: true,
            message: "Empresa deletada com sucesso.",
          },
        },
        {
          status: 200,
          headers: {
            "X-Request-Id": crypto.randomUUID(),
            "Server-Timing": `app;dur=${elapsed}`,
          },
        }
      );
    } catch (transactionError: any) {
      await client.query("ROLLBACK");
      console.error("[SOFT DELETE ENTERPRISE TRANSACTION ERROR]", transactionError);
      return NextResponse.json(
        {
          success: false,
          message: "Ocorreu um erro ao deletar a empresa.",
          error: String(transactionError?.message || transactionError),
        },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[SOFT DELETE ENTERPRISE ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro inesperado ao processar a requisição.",
        error: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}

