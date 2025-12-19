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
    const page = body.Query?.Page || body.query?.page || 1;
    const pageSize = body.Query?.PageSize || body.query?.pageSize || 10;
    const filter = body.Filter || body.filter || {};

    const db = getPool();
    const client = await db.connect();

    try {
      const offset = (page - 1) * pageSize;

      // Query SQL (mesma do .NET - sem ORDER BY explícito, sem filtros aplicados ainda)
      // Nota: O .NET não aplica filtros do UserFilter no GetUsersPagedDirectAsync atualmente
      const selectSql = `
        SELECT "Id", "Name", "EmailAddress", "AccessProfileId", "IsActive"
        FROM "Users"
        WHERE NOT COALESCE("IsDeleted", false)
        LIMIT $1 OFFSET $2
      `;

      const result = await client.query(selectSql, [pageSize, offset]);

      // Mapear resultados (mesmo formato do .NET)
      const users = result.rows.map((row) => ({
        id: row.Id,
        name: row.Name || "",
        emailAddress: row.EmailAddress || "",
        accessProfileId: row.AccessProfileId,
        enterpriseName: "", // Não carregamos ainda
        licenseName: "", // Não carregamos ainda
        contact: "", // Não carregamos ainda
        accessProfileName: "", // Não carregamos ainda
        isActive: row.IsActive ?? true,
      }));

      // Contar total (query separada para performance)
      const countResult = await client.query(
        `SELECT COUNT(*) FROM "Users" WHERE NOT COALESCE("IsDeleted", false)`
      );
      const totalCount = parseInt(countResult.rows[0].count, 10);

      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: {
            items: users,
            totalCount: totalCount,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
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
    console.error("[GET USERS PAGED ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao buscar usuários.",
        error: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}

