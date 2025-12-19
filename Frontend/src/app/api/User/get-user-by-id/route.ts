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
          message: "ID do usuário é obrigatório.",
        },
        { status: 400 }
      );
    }

    const db = getPool();
    const client = await db.connect();

    try {
      // Query SQL com JOINs (mesma estrutura do GetUserByIdAsync do .NET)
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
        WHERE u."Id" = $1
          AND NOT COALESCE(u."IsDeleted", false) = true
        LIMIT 1
      `;

      const result = await client.query(selectSql, [userId]);

      if (result.rows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Usuário não encontrado.",
          },
          { status: 404 }
        );
      }

      const row = result.rows[0];

      // Mapear resultado (mesmo formato do .NET)
      const user = {
        id: String(row.Id),
        name: row.Name || "",
        emailAddress: row.EmailAddress || "",
        accessProfileId: String(row.AccessProfileId),
        enterpriseName: row.EnterpriseName || "",
        licenseName: row.LicenseName || "",
        contact: row.Contact || "",
        accessProfileName: row.AccessProfileName || "",
        isActive: row.IsActive ?? true,
      };

      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: user,
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
    console.error("[GET USER BY ID ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao buscar usuário.",
        error: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}

