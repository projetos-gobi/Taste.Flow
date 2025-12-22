import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";

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

      // Construir WHERE clause baseado nos filtros
      const whereConditions: string[] = [
        `NOT COALESCE(e."IsDeleted", false)`,
        `COALESCE(e."IsActive", true) = true`,
      ];
      const queryParams: any[] = [];
      let paramIndex = 1;

      if (filter.fantasyName) {
        whereConditions.push(`LOWER(e."FantasyName") LIKE $${paramIndex}`);
        queryParams.push(`%${filter.fantasyName.toLowerCase()}%`);
        paramIndex++;
      }

      if (filter.cnpj) {
        whereConditions.push(`e."Cnpj" LIKE $${paramIndex}`);
        queryParams.push(`%${filter.cnpj.replace(/\D/g, "")}%`);
        paramIndex++;
      }

      if (filter.licenseId) {
        whereConditions.push(`e."LicenseId" = $${paramIndex}`);
        queryParams.push(filter.licenseId);
        paramIndex++;
      }

      const whereClause = whereConditions.join(" AND ");

      // Query SQL com JOINs para buscar dados relacionados
      const selectSql = `
        SELECT 
            e."Id", 
            e."FantasyName", 
            e."SocialReason", 
            e."Cnpj",
            e."LicenseId",
            e."LicenseQuantity",
            e."HasUnlimitedLicenses",
            e."IsActive",
            l."Name" AS "LicenseName",
            COALESCE(
                COUNT(ue."Id") FILTER (
                    WHERE COALESCE(ue."IsActive", true)
                      AND NOT COALESCE(ue."IsDeleted", false)
                      AND ue."LicenseManagementId" IS NOT NULL
                ), 0
            ) AS "UsedLicenses",
            STRING_AGG(DISTINCT ec."EmailAddress", ', ') AS "EmailAddress",
            STRING_AGG(DISTINCT ec."Telephone", ', ') AS "Contact",
            STRING_AGG(DISTINCT ea."Street" || ', ' || COALESCE(ea."Number", ''), ', ') AS "Address"
        FROM "Enterprise" e
        LEFT JOIN "License" l ON e."LicenseId" = l."Id" AND COALESCE(l."IsActive", true) AND NOT COALESCE(l."IsDeleted", false)
        LEFT JOIN "UserEnterprise" ue ON ue."EnterpriseId" = e."Id"
        LEFT JOIN "EnterpriseContact" ec ON ec."EnterpriseId" = e."Id" AND COALESCE(ec."IsActive", true) AND NOT COALESCE(ec."IsDeleted", false)
        LEFT JOIN "EnterpriseAddress" ea ON ea."EnterpriseId" = e."Id" AND COALESCE(ea."IsActive", true) AND NOT COALESCE(ea."IsDeleted", false)
        WHERE ${whereClause}
        GROUP BY 
            e."Id", e."FantasyName", e."SocialReason", e."Cnpj", e."LicenseId",
            e."LicenseQuantity", e."HasUnlimitedLicenses", e."IsActive", l."Name"
        ORDER BY e."FantasyName" ASC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryParams.push(pageSize, offset);

      const result = await client.query(selectSql, queryParams);

      // Mapear resultados
      const enterprises = result.rows.map((row) => {
        const licenseQuantity = row.HasUnlimitedLicenses
          ? 1000
          : (row.LicenseQuantity ?? 0) - (row.UsedLicenses ?? 0);

        return {
          id: row.Id,
          fantasyName: row.FantasyName || "",
          socialReason: row.SocialReason || null,
          cnpj: row.Cnpj || null,
          licenseId: row.LicenseId || null,
          licenseName: row.LicenseName || "",
          licenseQuantity: licenseQuantity,
          hasUnlimitedLicenses: row.HasUnlimitedLicenses || false,
          emailAddress: row.EmailAddress || "",
          contact: row.Contact || "",
          address: row.Address || "",
          isActive: row.IsActive ?? true,
        };
      });

      // Contar total (query separada para performance)
      const countSql = `
        SELECT COUNT(DISTINCT e."Id")
        FROM "Enterprise" e
        WHERE ${whereClause}
      `;

      const countResult = await client.query(countSql, queryParams.slice(0, -2)); // Remove LIMIT e OFFSET params
      const totalCount = parseInt(countResult.rows[0].count, 10);

      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: {
            count: totalCount,
            items: enterprises,
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
    console.error("[GET ENTERPRISES PAGED ERROR]", error);
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

