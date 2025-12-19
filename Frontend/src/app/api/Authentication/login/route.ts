import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Pool de conexões PostgreSQL (singleton)
let pool: Pool | null = null;

function getPool(): Pool {
  if (pool) return pool;

  // Connection string do Supabase (mesma do backend)
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres.twcwycecokaiiaeptndq:vmedxADqPy5mDBgG@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pooling=true&min_pool_size=1&max_pool_size=5";

  pool = new Pool({
    connectionString,
    max: 5, // Pool pequeno para serverless
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  return pool;
}

// SHA256 hash (mesma lógica do .NET: password.Trim() + salt)
function toSha256Hash(password: string, salt: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(password.trim() + salt);
  return hash.digest("hex");
}

// Gerar JWT (mesma estrutura do .NET)
function generateToken(user: {
  id: string;
  email: string;
  name: string;
  accessProfileId: string;
  mustChangePassword: boolean;
  enterpriseId?: string;
  changePasswordCode?: string;
}): string {
  const secret = process.env.JWT_SECRET || "K39Pg7Sa86QxAt0eQSmd6wRfjc1Ivl)@#(*";
  const issuer = process.env.JWT_ISSUER || "TasteFlowServer";
  const audience = process.env.JWT_AUDIENCE || "TasteFlowClient";
  const expiryMinutes = parseInt(process.env.JWT_EXPIRY_MINUTES || "60", 10);

  const claims = {
    sub: user.accessProfileId,
    userid: user.id,
    jti: crypto.randomUUID(),
    iss: issuer,
    profileId: user.accessProfileId,
    enterpriseId: user.enterpriseId || "",
    name: user.name,
    email: user.email,
    mustchangepassword: user.mustChangePassword.toString(),
    changepasswordcode: user.changePasswordCode || "",
  };

  return jwt.sign(claims, secret, {
    issuer,
    audience,
    expiresIn: `${expiryMinutes}m`,
  });
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const db = getPool();
    const client = await db.connect();

    try {
      // Buscar usuário (mesma query do .NET)
      const userResult = await client.query(
        `SELECT "Id", "EmailAddress", "PasswordHash", "PasswordSalt", "Name", "AccessProfileId", "MustChangePassword"
         FROM "Users"
         WHERE LOWER("EmailAddress") = $1
           AND COALESCE("IsActive", true) = true
           AND NOT COALESCE("IsDeleted", false) = true
         LIMIT 1`,
        [email]
      );

      if (userResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: "Usuário não encontrado." },
          { status: 401 }
        );
      }

      const user = userResult.rows[0];

      // Validar senha (SHA256 + salt)
      const passwordHash = toSha256Hash(password, user.PasswordSalt);
      if (passwordHash !== user.PasswordHash) {
        return NextResponse.json(
          { success: false, message: "Credenciais inválidas." },
          { status: 401 }
        );
      }

      // Buscar EnterpriseId (se existir)
      const enterpriseResult = await client.query(
        `SELECT "EnterpriseId"
         FROM "UserEnterprise"
         WHERE "UserId" = $1
           AND COALESCE("IsActive", true) = true
           AND NOT COALESCE("IsDeleted", false) = true
         LIMIT 1`,
        [user.Id]
      );

      const enterpriseId = enterpriseResult.rows[0]?.EnterpriseId || null;

      // Buscar changePasswordCode (se existir)
      const passwordMgmtResult = await client.query(
        `SELECT "Code"
         FROM "UserPasswordManagement"
         WHERE "UserId" = $1
         ORDER BY "CreatedOn" DESC
         LIMIT 1`,
        [user.Id]
      );

      const changePasswordCode = passwordMgmtResult.rows[0]?.Code || null;

      // Gerar JWT
      const token = generateToken({
        id: user.Id,
        email: user.EmailAddress,
        name: user.Name,
        accessProfileId: user.AccessProfileId,
        mustChangePassword: user.MustChangePassword,
        enterpriseId: enterpriseId,
        changePasswordCode: changePasswordCode,
      });

      // Criar refresh token
      const refreshTokenId = crypto.randomUUID();
      const refreshTokenValue = crypto.randomUUID();
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 3); // 3 horas

      await client.query(
        `INSERT INTO "UserRefreshToken"
         ("Id", "UserId", "RefreshToken", "ExpirationDate", "CreatedOn", "CreatedBy", "IsActive", "IsDeleted")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          refreshTokenId,
          user.Id,
          refreshTokenValue,
          expirationDate,
          new Date(),
          user.Id,
          true,
          false,
        ]
      );

      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: {
            token,
            refreshToken: refreshTokenValue,
            userId: user.Id,
            email: user.EmailAddress,
            name: user.Name,
            accessProfileId: user.AccessProfileId,
            enterpriseId: enterpriseId,
          },
          message: "Autenticação realizada com sucesso.",
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
    console.error("[LOGIN ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao processar a autenticação.",
        error: process.env.NODE_ENV === "development" ? String(error?.message) : undefined,
      },
      { status: 500 }
    );
  }
}

