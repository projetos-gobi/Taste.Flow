import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Pool de conexões PostgreSQL (singleton - reutilizar do login)
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

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const userId = body.id || body.Id || null;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          data: {
            deleted: false,
            message: "ID do usuário é obrigatório.",
          },
        },
        { status: 400 }
      );
    }

    const db = getPool();
    const client = await db.connect();

    try {
      // Verificar se o usuário existe
      const checkResult = await client.query(
        `SELECT "Id" FROM "Users" WHERE "Id" = $1 AND NOT COALESCE("IsDeleted", false) = true`,
        [userId]
      );

      if (checkResult.rows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            data: {
              deleted: false,
              message: "Usuário não encontrado.",
            },
          },
          { status: 404 }
        );
      }

      // Iniciar transação
      await client.query("BEGIN");

      try {
        // Soft delete do usuário (mesma lógica do .NET)
        const now = new Date().toISOString();
        const systemUserId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"; // Admin user ID

        // 1. Soft delete do usuário
        const updateUserResult = await client.query(
          `UPDATE "Users"
           SET 
             "IsDeleted" = true,
             "IsActive" = false,
             "DeletedOn" = $1,
             "DeletedBy" = $2
           WHERE "Id" = $3
             AND NOT COALESCE("IsDeleted", false) = true`,
          [now, systemUserId, userId]
        );

        // 2. Soft delete dos UserEnterprises associados e remover LicenseManagementId
        await client.query(
          `UPDATE "UserEnterprise"
           SET 
             "IsDeleted" = true,
             "IsActive" = false,
             "DeletedOn" = $1,
             "LicenseManagementId" = NULL
           WHERE "UserId" = $2
             AND NOT COALESCE("IsDeleted", false) = true`,
          [now, userId]
        );

        // Commit da transação
        await client.query("COMMIT");

        const deleted = updateUserResult.rowCount > 0;
        const elapsed = Date.now() - startTime;

        return NextResponse.json(
          {
            success: true,
            data: {
              deleted: deleted,
              message: deleted
                ? "Usuário foi deletado com sucesso."
                : "Não foi possível deletar o usuário.",
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
        // Rollback em caso de erro
        await client.query("ROLLBACK");
        throw transactionError;
      }
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[SOFT DELETE USER ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        data: {
          deleted: false,
          message: "Ocorreu um erro durante o processo soft delete de um usuário.",
          error: String(error?.message || error),
        },
      },
      { status: 500 }
    );
  }
}

