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

      // Query SQL com JOINs para buscar todas as informações necessárias
      const selectSql = `
        SELECT 
          u."Id",
          u."Name",
          u."EmailAddress",
          u."AccessProfileId",
          u."IsActive",
          u."Contact",
          ap."Name" AS "AccessProfileName",
          e."FantasyName" AS "EnterpriseName",
          l."Name" AS "LicenseName"
        FROM "Users" u
        LEFT JOIN "AccessProfile" ap ON ap."Id" = u."AccessProfileId"
        LEFT JOIN "UserEnterprise" ue ON ue."UserId" = u."Id"
          AND COALESCE(ue."IsActive", true) = true
          AND NOT COALESCE(ue."IsDeleted", false) = true
        LEFT JOIN "Enterprise" e ON e."Id" = ue."EnterpriseId"
          AND COALESCE(e."IsActive", true) = true
          AND NOT COALESCE(e."IsDeleted", false) = true
        LEFT JOIN "LicenseManagement" lm ON lm."Id" = ue."LicenseManagementId"
          AND COALESCE(lm."IsActive", true) = true
          AND NOT COALESCE(lm."IsDeleted", false) = true
        LEFT JOIN "License" l ON l."Id" = lm."LicenseId"
        WHERE NOT COALESCE(u."IsDeleted", false) = true
        GROUP BY u."Id", u."Name", u."EmailAddress", u."AccessProfileId", u."IsActive", u."Contact", ap."Name", e."FantasyName", l."Name"
        LIMIT $1 OFFSET $2
      `;

      const result = await client.query(selectSql, [pageSize, offset]);

      // Mapear resultados (mesmo formato do .NET)
      const users = result.rows.map((row) => ({
        id: row.Id,
        name: row.Name || "",
        emailAddress: row.EmailAddress || "",
        accessProfileId: row.AccessProfileId,
        enterpriseName: row.EnterpriseName || "",
        licenseName: row.LicenseName || "",
        contact: row.Contact || "",
        accessProfileName: row.AccessProfileName || "",
        isActive: row.IsActive ?? true,
      }));

      // Contar total (query separada para performance)
      const countResult = await client.query(
        `SELECT COUNT(*) FROM "Users" WHERE NOT COALESCE("IsDeleted", false)`
      );
      const totalCount = parseInt(countResult.rows[0].count, 10);

      const elapsed = Date.now() - startTime;

      // Formato compatível com PagedResult<T> do .NET
      return NextResponse.json(
        {
          success: true,
          data: {
            count: totalCount, // .NET usa "Count"
            items: users, // .NET usa "Items"
            page: page,
            pageSize: pageSize,
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

