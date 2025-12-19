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

// SHA256 hash (mesma lógica do .NET)
function toSha256Hash(password: string, salt: string): string {
  const trimmedPassword = (password || "").trim();
  const saltStr = (salt || "").toString();
  const hash = crypto.createHash("sha256");
  hash.update(trimmedPassword + saltStr, "utf8");
  return hash.digest("hex");
}

// Gerar senha aleatória (mesma lógica do .NET)
function generateRandomPassword(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$&#@*";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Gerar código de licença (mesma lógica do .NET)
function generateLicenseCode(length: number = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log("[CREATE USERS] Starting...");

  try {
    const body = await req.json();
    console.log("[CREATE USERS] Body received", { usersCount: (body.users || body.Users || []).length, hasEnterpriseId: !!(body.enterpriseId || body.EnterpriseId) });
    
    const users = body.users || body.Users || [];
    const enterpriseId = body.enterpriseId || body.EnterpriseId || null;

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: {
            created: false,
            message: "Nenhum usuário fornecido.",
          },
        },
        { status: 400 }
      );
    }

    // Validar emails duplicados (mesma regra do .NET)
    const emailMap = new Map<string, number>();
    const duplicatedEmails: string[] = [];
    
    for (const user of users) {
      const email = (user.emailAddress || user.EmailAddress || "").toLowerCase().trim();
      if (email) {
        const count = (emailMap.get(email) || 0) + 1;
        emailMap.set(email, count);
        if (count === 2) {
          duplicatedEmails.push(email);
        }
      }
    }

    if (duplicatedEmails.length > 0) {
      return NextResponse.json(
        {
          success: false,
          data: {
            created: false,
            message: `Os seguintes e-mails estão duplicados: ${duplicatedEmails.join(", ")}`,
          },
        },
        { status: 400 }
      );
    }

    const db = getPool();
    console.log("[CREATE USERS] Getting database connection...");
    const client = await db.connect();
    console.log("[CREATE USERS] Database connection acquired");

    try {
      console.log("[CREATE USERS] Starting transaction...");
      await client.query("BEGIN");
      console.log("[CREATE USERS] Transaction started");

      // Usar o ID do usuário admin que existe no banco (não o GUID hardcoded que não existe)
      // O admin é: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
      const systemUserId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
      console.log("[CREATE USERS] SystemUserId set:", systemUserId);
      
      const now = new Date().toISOString();
      console.log("[CREATE USERS] Now timestamp:", now);
      
      const createdUserIds: string[] = [];
      console.log("[CREATE USERS] CreatedUserIds array initialized");

      // Criar usuários
      console.log(`[CREATE USERS] Creating ${users.length} users...`);
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        console.log(`[CREATE USERS] Creating user ${i + 1}/${users.length}: ${user.name || user.Name || "N/A"}`);
        
        const userId = crypto.randomUUID();
        const passwordSalt = crypto.randomUUID();
        const randomPassword = generateRandomPassword(12);
        const passwordHash = toSha256Hash(randomPassword, passwordSalt);

        console.log(`[CREATE USERS] User ${i + 1} prepared, executing INSERT...`);
        try {
          const insertParams = [
          userId,
          user.accessProfileId || user.AccessProfileId,
          user.name || user.Name || "",
          user.emailAddress || user.EmailAddress || "",
          user.contact || user.Contact || "",
          passwordHash,
          passwordSalt,
          now,
          systemUserId,
          user.isActive !== undefined ? user.isActive : true,
          false,
          true, // MustChangePassword = true para novos usuários
        ];
        
        console.log(`[CREATE USERS] User ${i + 1} params prepared, executing INSERT...`);
        const insertResult = await client.query(
          `INSERT INTO "Users"
           ("Id", "AccessProfileId", "Name", "EmailAddress", "Contact", "PasswordHash", "PasswordSalt",
            "CreatedOn", "CreatedBy", "IsActive", "IsDeleted", "MustChangePassword")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          insertParams
        );
        console.log(`[CREATE USERS] User ${i + 1} INSERT completed`);
        console.log(`[CREATE USERS] User ${i + 1} inserted successfully`);
        } catch (userError: any) {
          console.error(`[CREATE USERS] Error inserting user ${i + 1}:`, userError);
          throw userError;
        }

        createdUserIds.push(userId);
      }

      console.log(`[CREATE USERS] Users created: ${createdUserIds.length}`);

      // Se houver EnterpriseId, criar licenças e vínculos
      if (enterpriseId) {
        console.log(`[CREATE USERS] EnterpriseId provided: ${enterpriseId}, fetching enterprise...`);
        // Buscar empresa
        const enterpriseResult = await client.query(
          `SELECT "Id", "LicenseId", "LicenseQuantity", "HasUnlimitedLicenses"
           FROM "Enterprise"
           WHERE "Id" = $1
             AND COALESCE("IsActive", true) = true
             AND NOT COALESCE("IsDeleted", false) = true`,
          [enterpriseId]
        );
        console.log(`[CREATE USERS] Enterprise query result: ${enterpriseResult.rows.length} rows`);

        if (enterpriseResult.rows.length > 0) {
          const enterprise = enterpriseResult.rows[0];
          const licenseId = enterprise.LicenseId;
          const licenseQuantity = enterprise.LicenseQuantity || 0;
          const hasUnlimitedLicenses = enterprise.HasUnlimitedLicenses === true;

          // Contar licenças existentes
          const existingLicensesResult = await client.query(
            `SELECT COUNT(*) FROM "LicenseManagement"
             WHERE "EnterpriseId" = $1 AND NOT COALESCE("IsDeleted", false) = true`,
            [enterpriseId]
          );
          const currentCount = parseInt(existingLicensesResult.rows[0].count, 10);

          // Validar se pode adicionar mais licenças
          const canAdd = hasUnlimitedLicenses || currentCount + users.length <= licenseQuantity;

          if (canAdd) {
            // Criar LicenseManagements
            const licenseManagementIds: string[] = [];
            for (let i = 0; i < users.length; i++) {
              const licenseId_uuid = crypto.randomUUID();
              const licenseCode = generateLicenseCode(10);
              const expirationDate = new Date();
              expirationDate.setFullYear(expirationDate.getFullYear() + 2);

              await client.query(
                `INSERT INTO "LicenseManagement"
                 ("Id", "EnterpriseId", "LicenseId", "LicenseCode", "ExpirationDate", "IsIndefinite",
                  "CreatedOn", "CreatedBy", "IsActive", "IsDeleted")
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [
                  licenseId_uuid,
                  enterpriseId,
                  licenseId,
                  licenseCode,
                  expirationDate.toISOString(),
                  false,
                  now,
                  systemUserId,
                  true,
                  false,
                ]
              );

              licenseManagementIds.push(licenseId_uuid);
            }

            // Criar UserEnterprises
            for (let i = 0; i < createdUserIds.length; i++) {
              const userEnterpriseId = crypto.randomUUID();
              await client.query(
                `INSERT INTO "UserEnterprise"
                 ("Id", "UserId", "EnterpriseId", "LicenseManagementId", "ProfileTypeId",
                  "CreatedOn", "CreatedBy", "IsActive", "IsDeleted")
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                  userEnterpriseId,
                  createdUserIds[i],
                  enterpriseId,
                  licenseManagementIds[i],
                  null,
                  now,
                  systemUserId,
                  true,
                  false,
                ]
              );
            }
          }
        }
      }

      console.log("[CREATE USERS] Committing transaction...");
      await client.query("COMMIT");
      console.log("[CREATE USERS] Transaction committed successfully");

      const elapsed = Date.now() - startTime;
      console.log(`[CREATE USERS] Total time: ${elapsed}ms`);

      return NextResponse.json(
        {
          success: true,
          data: {
            created: createdUserIds.length > 0,
            message:
              createdUserIds.length > 0
                ? "Usuários criados com sucesso."
                : "Não foi possível criar os usuários no sistema.",
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
    } catch (error: any) {
      console.error("[CREATE USERS] Error in transaction, rolling back...", error);
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError: any) {
        console.error("[CREATE USERS] Rollback error:", rollbackError);
      }
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[CREATE USERS RANGE ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        data: {
          created: false,
          message: "Ocorreu um erro durante o processo de criação de usuários.",
          error: String(error?.message || error),
        },
      },
      { status: 500 }
    );
  }
}

