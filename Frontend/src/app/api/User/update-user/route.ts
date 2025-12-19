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
    const user = body.user || body.User || body;

    const userId = user.id || user.Id;
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          data: {
            updated: false,
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
              updated: false,
              message: "Usuário não encontrado.",
            },
          },
          { status: 404 }
        );
      }

      // Atualizar usuário (mesma lógica do .NET)
      const updateSql = `
        UPDATE "Users"
        SET 
          "AccessProfileId" = $1,
          "Name" = $2,
          "EmailAddress" = $3,
          "Contact" = $4,
          "IsActive" = $5,
          "ModifiedOn" = $6
        WHERE "Id" = $7
          AND NOT COALESCE("IsDeleted", false) = true
      `;

      const updateResult = await client.query(updateSql, [
        user.accessProfileId || user.AccessProfileId,
        user.name || user.Name || "",
        user.emailAddress || user.EmailAddress || "",
        user.contact || user.Contact || "",
        user.isActive !== undefined ? user.isActive : true,
        new Date().toISOString(),
        userId,
      ]);

      const updated = updateResult.rowCount > 0;
      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: {
            updated: updated,
            message: updated
              ? "Usuário atualizado com sucesso."
              : "Não foi possível atualizar o usuário.",
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
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[UPDATE USER ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        data: {
          updated: false,
          message: "Ocorreu um erro durante o processo atualização de um usuário.",
          error: String(error?.message || error),
        },
      },
      { status: 500 }
    );
  }
}

