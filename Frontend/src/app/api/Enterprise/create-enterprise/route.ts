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
    console.error("[CREATE ENTERPRISE] Token verification error:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log("[CREATE ENTERPRISE] Starting...");

  try {
    const body = await req.json();
    console.log("[CREATE ENTERPRISE] Body received", {
      hasFantasyName: !!body.fantasyName,
      hasSocialReason: !!body.socialReason,
      hasCnpj: !!body.cnpj,
      addressesCount: (body.enterpriseAddresses || []).length,
      contactsCount: (body.enterpriseContacts || []).length,
    });

    const {
      licenseId,
      fantasyName,
      socialReason,
      cnpj,
      stateRegistration,
      municipalRegistration,
      observation,
      licenseQuantity,
      isActive,
      enterpriseAddresses,
      enterpriseContacts,
    } = body;

    // Validações básicas
    if (!socialReason || !cnpj) {
      return NextResponse.json(
        {
          success: false,
          data: {
            created: false,
            message: "Razão Social e CNPJ são obrigatórios.",
          },
        },
        { status: 400 }
      );
    }

    // Verificar autenticação
    const authHeader = req.headers.get("authorization");
    const authenticatedUserId = getUserIdFromToken(authHeader);

    if (!authenticatedUserId) {
      return NextResponse.json(
        {
          success: false,
          data: {
            created: false,
            message: "Não autorizado.",
          },
        },
        { status: 401 }
      );
    }

    const db = getPool();
    const client = await db.connect();

    try {
      await client.query("BEGIN");
      console.log("[CREATE ENTERPRISE] Transaction started");

      const systemUserId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"; // Admin user ID
      const now = new Date().toISOString();
      const enterpriseId = crypto.randomUUID();

      // Verificar se CNPJ já existe
      const cnpjClean = cnpj.replace(/\D/g, "");
      const existingCheck = await client.query(
        `SELECT "Id" FROM "Enterprise" 
         WHERE REPLACE(REPLACE(REPLACE(REPLACE("Cnpj", '.', ''), '/', ''), '-', ''), ' ', '') = $1
           AND NOT COALESCE("IsDeleted", false)`,
        [cnpjClean]
      );

      if (existingCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          {
            success: false,
            data: {
              created: false,
              message: "Já existe uma empresa cadastrada com este CNPJ.",
            },
          },
          { status: 400 }
        );
      }

      // Calcular licenseQuantity (se for "unlimited", usar 1000 e marcar HasUnlimitedLicenses)
      const hasUnlimitedLicenses = licenseQuantity === "unlimited" || licenseQuantity === "Ilimitadas";
      const finalLicenseQuantity = hasUnlimitedLicenses ? 1000 : parseInt(licenseQuantity || "1", 10);

      // Inserir empresa
      console.log("[CREATE ENTERPRISE] Inserting enterprise...");
      await client.query(
        `INSERT INTO "Enterprise"
         ("Id", "LicenseId", "FantasyName", "SocialReason", "Cnpj", "StateRegistration", 
          "MunicipalRegistration", "Observation", "LicenseQuantity", "HasUnlimitedLicenses",
          "IsHeadOffice", "IsActive", "IsDeleted", "CreatedOn", "CreatedBy")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          enterpriseId,
          licenseId || null,
          fantasyName || null,
          socialReason,
          cnpjClean,
          stateRegistration || null,
          municipalRegistration || null,
          observation || null,
          finalLicenseQuantity,
          hasUnlimitedLicenses,
          true, // IsHeadOffice
          isActive !== undefined ? isActive : true,
          false, // IsDeleted
          now,
          systemUserId,
        ]
      );
      console.log("[CREATE ENTERPRISE] Enterprise inserted:", enterpriseId);

      // Inserir endereços
      if (enterpriseAddresses && enterpriseAddresses.length > 0) {
        console.log(`[CREATE ENTERPRISE] Inserting ${enterpriseAddresses.length} addresses...`);
        for (const address of enterpriseAddresses) {
          const addressId = crypto.randomUUID();
          const postalCodeClean = (address.postalCode || "").replace(/\D/g, "");

          await client.query(
            `INSERT INTO "EnterpriseAddress"
             ("Id", "EnterpriseId", "PostalCode", "Street", "Number", "Complement", 
              "District", "City", "State", "IsActive", "IsDeleted", "CreatedOn", "CreatedBy")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
              addressId,
              enterpriseId,
              postalCodeClean || null,
              address.street || null,
              address.number || null,
              address.complement || null,
              address.district || null,
              address.city || null,
              address.state || null,
              true, // IsActive
              false, // IsDeleted
              now,
              systemUserId,
            ]
          );
        }
        console.log("[CREATE ENTERPRISE] Addresses inserted");
      }

      // Inserir contatos
      if (enterpriseContacts && enterpriseContacts.length > 0) {
        console.log(`[CREATE ENTERPRISE] Inserting ${enterpriseContacts.length} contacts...`);
        for (const contact of enterpriseContacts) {
          const contactId = crypto.randomUUID();
          const telephoneClean = (contact.telephone || "").replace(/\D/g, "");

          await client.query(
            `INSERT INTO "EnterpriseContact"
             ("Id", "EnterpriseId", "Telephone", "EmailAddress", "Responsible", 
              "IsActive", "IsDeleted", "CreatedOn", "CreatedBy")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              contactId,
              enterpriseId,
              telephoneClean || null,
              contact.emailAddress || null,
              contact.responsible || null,
              true, // IsActive
              false, // IsDeleted
              now,
              systemUserId,
            ]
          );
        }
        console.log("[CREATE ENTERPRISE] Contacts inserted");
      }

      await client.query("COMMIT");
      console.log("[CREATE ENTERPRISE] Transaction committed");

      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: {
            created: true,
            message: "Empresa criada com sucesso.",
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
      console.error("[CREATE ENTERPRISE] Error in transaction, rolling back...", transactionError);
      await client.query("ROLLBACK");
      throw transactionError;
    } finally {
      client.release();
      console.log("[CREATE ENTERPRISE] Database client released.");
    }
  } catch (error: any) {
    console.error("[CREATE ENTERPRISE ERROR]", error);
    const errorMessage = error?.message || String(error);

    return NextResponse.json(
      {
        success: false,
        data: {
          created: false,
          message: "Ocorreu um erro ao criar a empresa.",
        },
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

