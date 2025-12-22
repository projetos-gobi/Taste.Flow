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
    const enterpriseId = body.id || body.Id || "";

    if (!enterpriseId) {
      return NextResponse.json(
        { success: false, message: "ID da empresa é obrigatório." },
        { status: 400 }
      );
    }

    const db = getPool();
    const client = await db.connect();

    try {
      // Buscar empresa com endereços e contatos
      const enterpriseResult = await client.query(
        `SELECT 
            e."Id", 
            e."LicenseId", 
            e."FantasyName", 
            e."SocialReason", 
            e."Cnpj",
            e."StateRegistration",
            e."MunicipalRegistration",
            e."Observation",
            e."LicenseQuantity",
            e."HasUnlimitedLicenses",
            e."IsActive",
            l."Name" AS "LicenseName"
         FROM "Enterprise" e
         LEFT JOIN "License" l ON e."LicenseId" = l."Id" AND COALESCE(l."IsActive", true) AND NOT COALESCE(l."IsDeleted", false)
         WHERE e."Id" = $1
           AND NOT COALESCE(e."IsDeleted", false)
         LIMIT 1`,
        [enterpriseId]
      );

      if (enterpriseResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: "Empresa não encontrada." },
          { status: 404 }
        );
      }

      const enterprise = enterpriseResult.rows[0];

      // Buscar endereços
      const addressesResult = await client.query(
        `SELECT 
            "Id", "PostalCode", "Street", "Number", "Complement", 
            "District", "City", "State"
         FROM "EnterpriseAddress"
         WHERE "EnterpriseId" = $1
           AND COALESCE("IsActive", true) = true
           AND NOT COALESCE("IsDeleted", false) = true
         ORDER BY "CreatedOn" ASC`,
        [enterpriseId]
      );

      // Buscar contatos
      const contactsResult = await client.query(
        `SELECT 
            "Id", "Telephone", "EmailAddress", "Responsible"
         FROM "EnterpriseContact"
         WHERE "EnterpriseId" = $1
           AND COALESCE("IsActive", true) = true
           AND NOT COALESCE("IsDeleted", false) = true
         ORDER BY "CreatedOn" ASC`,
        [enterpriseId]
      );

      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: {
            id: enterprise.Id,
            licenseId: enterprise.LicenseId || null,
            fantasyName: enterprise.FantasyName || "",
            socialReason: enterprise.SocialReason || null,
            cnpj: enterprise.Cnpj || null,
            stateRegistration: enterprise.StateRegistration || null,
            municipalRegistration: enterprise.MunicipalRegistration || null,
            observation: enterprise.Observation || null,
            licenseQuantity: enterprise.LicenseQuantity || 0,
            hasUnlimitedLicenses: enterprise.HasUnlimitedLicenses || false,
            licenseName: enterprise.LicenseName || "",
            isActive: enterprise.IsActive ?? true,
            enterpriseAddresses: addressesResult.rows.map((row) => ({
              id: row.Id,
              postalCode: row.PostalCode || "",
              street: row.Street || "",
              number: row.Number || "",
              complement: row.Complement || "",
              district: row.District || "",
              city: row.City || "",
              state: row.State || "",
            })),
            enterpriseContacts: contactsResult.rows.map((row) => ({
              id: row.Id,
              telephone: row.Telephone || "",
              emailAddress: row.EmailAddress || "",
              responsible: row.Responsible || "",
            })),
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
    console.error("[GET ENTERPRISE BY ID ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao buscar a empresa.",
        error: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}

