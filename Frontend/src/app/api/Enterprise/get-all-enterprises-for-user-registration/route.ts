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
    const db = getPool();
    const client = await db.connect();

    try {
      // Query SQL otimizada (mesma do .NET - JOIN + GROUP BY)
      const sql = `
        SELECT 
          e."Id", 
          e."LicenseId", 
          e."FantasyName", 
          e."SocialReason", 
          e."Cnpj", 
          e."LicenseQuantity", 
          e."HasUnlimitedLicenses",
          COALESCE(
            COUNT(ue."Id") FILTER (
              WHERE COALESCE(ue."IsActive", true)
                AND NOT COALESCE(ue."IsDeleted", false)
                AND ue."LicenseManagementId" IS NOT NULL
            ), 0
          ) AS "UsedLicenses"
        FROM "Enterprise" e
        LEFT JOIN "UserEnterprise" ue
          ON ue."EnterpriseId" = e."Id"
        WHERE COALESCE(e."IsActive", true)
          AND NOT COALESCE(e."IsDeleted", false)
        GROUP BY 
          e."Id", e."LicenseId", e."FantasyName", e."SocialReason", e."Cnpj",
          e."LicenseQuantity", e."HasUnlimitedLicenses"
      `;

      const command = {
        text: sql,
        rowMode: "array" as const,
      };

      const result = await client.query(sql);

      // Mapear resultados (mesmo formato do .NET)
      const enterprises = result.rows.map((row) => {
        const licenseQuantity = row.LicenseQuantity != null ? parseInt(row.LicenseQuantity, 10) : null;
        const hasUnlimitedLicenses = row.HasUnlimitedLicenses === true;
        const usedLicenses = row.UsedLicenses != null ? parseInt(row.UsedLicenses, 10) : 0;

        // Calcular LicenseQuantity disponível (mesma lógica do .NET)
        const availableLicenses = hasUnlimitedLicenses 
          ? 1000 
          : (licenseQuantity ?? 0) - usedLicenses;

        return {
          id: row.Id,
          licenseId: row.LicenseId || null,
          fantasyName: row.FantasyName || "",
          socialReason: row.SocialReason || null,
          cnpj: row.Cnpj || null,
          licenseQuantity: availableLicenses, // Quantidade disponível (não total)
          hasUnlimitedLicenses: hasUnlimitedLicenses,
        };
      });

      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: enterprises,
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
    console.error("[GET ALL ENTERPRISES FOR USER REGISTRATION ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao buscar empresas.",
        error: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}

