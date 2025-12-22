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
    console.error("[UPDATE ENTERPRISE] Token verification error:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const {
      id,
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

    if (!id || !socialReason || !cnpj) {
      return NextResponse.json(
        { success: false, message: "ID, Razão Social e CNPJ são obrigatórios." },
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

      // Verificar se empresa existe
      const existingCheck = await client.query(
        `SELECT "Id" FROM "Enterprise" 
         WHERE "Id" = $1 AND NOT COALESCE("IsDeleted", false)`,
        [id]
      );

      if (existingCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { success: false, message: "Empresa não encontrada." },
          { status: 404 }
        );
      }

      // Verificar se CNPJ já existe em outra empresa
      const cnpjClean = cnpj.replace(/\D/g, "");
      const cnpjCheck = await client.query(
        `SELECT "Id" FROM "Enterprise" 
         WHERE REPLACE(REPLACE(REPLACE(REPLACE("Cnpj", '.', ''), '/', ''), '-', ''), ' ', '') = $1
           AND "Id" != $2
           AND NOT COALESCE("IsDeleted", false)`,
        [cnpjClean, id]
      );

      if (cnpjCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { success: false, message: "Já existe outra empresa cadastrada com este CNPJ." },
          { status: 400 }
        );
      }

      // Calcular licenseQuantity
      const hasUnlimitedLicenses = licenseQuantity === "unlimited" || licenseQuantity === "Ilimitadas";
      const finalLicenseQuantity = hasUnlimitedLicenses ? 1000 : parseInt(licenseQuantity || "1", 10);

      // Atualizar empresa
      await client.query(
        `UPDATE "Enterprise"
         SET 
           "LicenseId" = $1,
           "FantasyName" = $2,
           "SocialReason" = $3,
           "Cnpj" = $4,
           "StateRegistration" = $5,
           "MunicipalRegistration" = $6,
           "Observation" = $7,
           "LicenseQuantity" = $8,
           "HasUnlimitedLicenses" = $9,
           "IsActive" = $10,
           "ModifiedOn" = $11,
           "ModifiedBy" = $12
         WHERE "Id" = $13`,
        [
          licenseId || null,
          fantasyName || null,
          socialReason,
          cnpjClean,
          stateRegistration || null,
          municipalRegistration || null,
          observation || null,
          finalLicenseQuantity,
          hasUnlimitedLicenses,
          isActive !== undefined ? isActive : true,
          now,
          systemUserId,
          id,
        ]
      );

      // Soft delete endereços existentes
      await client.query(
        `UPDATE "EnterpriseAddress"
         SET "IsDeleted" = true, "IsActive" = false, "ModifiedOn" = $1, "ModifiedBy" = $2
         WHERE "EnterpriseId" = $3`,
        [now, systemUserId, id]
      );

      // Inserir novos endereços
      if (enterpriseAddresses && enterpriseAddresses.length > 0) {
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
              id,
              postalCodeClean || null,
              address.street || null,
              address.number || null,
              address.complement || null,
              address.district || null,
              address.city || null,
              address.state || null,
              true,
              false,
              now,
              systemUserId,
            ]
          );
        }
      }

      // Soft delete contatos existentes
      await client.query(
        `UPDATE "EnterpriseContact"
         SET "IsDeleted" = true, "IsActive" = false, "ModifiedOn" = $1, "ModifiedBy" = $2
         WHERE "EnterpriseId" = $3`,
        [now, systemUserId, id]
      );

      // Inserir novos contatos
      if (enterpriseContacts && enterpriseContacts.length > 0) {
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
              id,
              telephoneClean || null,
              contact.emailAddress || null,
              contact.responsible || null,
              true,
              false,
              now,
              systemUserId,
            ]
          );
        }
      }

      await client.query("COMMIT");

      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: {
            updated: true,
            message: "Empresa atualizada com sucesso.",
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
      console.error("[UPDATE ENTERPRISE TRANSACTION ERROR]", transactionError);
      return NextResponse.json(
        {
          success: false,
          message: "Ocorreu um erro ao atualizar a empresa.",
          error: String(transactionError?.message || transactionError),
        },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[UPDATE ENTERPRISE ERROR]", error);
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

