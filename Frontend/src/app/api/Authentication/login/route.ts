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
  const rawConnectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres.twcwycecokaiiaeptndq:vmedxADqPy5mDBgG@aws-1-sa-east-1.pooler.supabase.com:6543/postgres";
  
  // Remover parâmetros SSL da URL (vamos configurar via objeto Pool)
  const connectionString = rawConnectionString.split("?")[0];

  pool = new Pool({
    connectionString,
    max: 5, // Pool pequeno para serverless
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    // Configurar SSL para aceitar certificados do Supabase
    // IMPORTANTE: ssl deve ser um objeto, não uma string
    ssl: process.env.NODE_ENV === "production" 
      ? { rejectUnauthorized: false } // Produção: aceitar certificado auto-assinado do Supabase
      : { rejectUnauthorized: false }, // Desenvolvimento também
  });

  return pool;
}

// SHA256 hash (mesma lógica do .NET: password.Trim() + salt)
function toSha256Hash(password: string, salt: string): string {
  // Garantir que password e salt são strings válidas
  const trimmedPassword = (password || "").trim();
  const saltStr = (salt || "").toString();
  
  // Criar hash SHA256
  const hash = crypto.createHash("sha256");
  hash.update(trimmedPassword + saltStr, "utf8");
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
    // Não incluir 'iss' aqui - será adicionado via opções 'issuer'
    profileId: user.accessProfileId,
    enterpriseId: user.enterpriseId || "",
    name: user.name,
    email: user.email,
    mustchangepassword: user.mustChangePassword.toString(),
    changepasswordcode: user.changePasswordCode || "",
  };

  return jwt.sign(claims, secret, {
    issuer, // 'iss' será adicionado automaticamente aqui
    audience,
    expiresIn: `${expiryMinutes}m`,
  });
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    // Aceitar tanto Email/Password (frontend) quanto email/password (padrão)
    const email = (body.Email || body.email || "").trim().toLowerCase();
    const password = body.Password || body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const db = getPool();
    let client;
    
    try {
      client = await db.connect();
    } catch (dbError: any) {
      console.error("[LOGIN DB CONNECT ERROR]", dbError);
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao conectar ao banco de dados.",
          error: String(dbError?.message || dbError),
        },
        { status: 500 }
      );
    }

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

      // Log para debug
      console.log("[LOGIN] User MustChangePassword from DB:", {
        value: user.MustChangePassword,
        type: typeof user.MustChangePassword,
        isTrue: user.MustChangePassword === true,
        isNull: user.MustChangePassword === null,
      });

      // Validar senha (SHA256 + salt)
      const passwordHash = toSha256Hash(password, user.PasswordSalt);
      
      // Debug: log para verificar hash (sempre logar para debug)
      console.log("[LOGIN DEBUG]", {
        email,
        passwordLength: password.length,
        saltLength: user.PasswordSalt?.length,
        saltPreview: user.PasswordSalt?.substring(0, 10) + "...",
        computedHashPreview: passwordHash.substring(0, 20) + "...",
        storedHashPreview: user.PasswordHash?.substring(0, 20) + "...",
        hashesMatch: passwordHash === user.PasswordHash,
        hashLength: passwordHash.length,
        storedHashLength: user.PasswordHash?.length,
      });
      
      if (passwordHash !== user.PasswordHash) {
        console.log("[LOGIN] Hash mismatch - returning 401");
        return NextResponse.json(
          { 
            success: false, 
            message: "Credenciais inválidas.",
          },
          { status: 401 }
        );
      }

      console.log("[LOGIN] Password validated, fetching enterprise and password code...");

      // Buscar EnterpriseId (se existir)
      let enterpriseId = null;
      try {
        const enterpriseResult = await client.query(
          `SELECT "EnterpriseId"
           FROM "UserEnterprise"
           WHERE "UserId" = $1
             AND COALESCE("IsActive", true) = true
             AND NOT COALESCE("IsDeleted", false) = true
           LIMIT 1`,
          [user.Id]
        );
        enterpriseId = enterpriseResult.rows[0]?.EnterpriseId || null;
        console.log("[LOGIN] EnterpriseId fetched:", enterpriseId);
      } catch (enterpriseError: any) {
        console.error("[LOGIN] Error fetching EnterpriseId:", enterpriseError);
        // Continua sem enterpriseId
      }

      // Buscar changePasswordCode (se existir)
      let changePasswordCode = null;
      try {
        const passwordMgmtResult = await client.query(
          `SELECT "Code"
           FROM "UserPasswordManagement"
           WHERE "UserId" = $1
           ORDER BY "CreatedOn" DESC
           LIMIT 1`,
          [user.Id]
        );
        changePasswordCode = passwordMgmtResult.rows[0]?.Code || null;
        console.log("[LOGIN] ChangePasswordCode fetched:", changePasswordCode ? "exists" : "null");
      } catch (passwordCodeError: any) {
        console.error("[LOGIN] Error fetching ChangePasswordCode:", passwordCodeError);
        // Continua sem changePasswordCode
      }

      console.log("[LOGIN] Generating JWT...");
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
      console.log("[LOGIN] JWT generated successfully");

      // Criar refresh token
      const refreshTokenId = crypto.randomUUID();
      const refreshTokenValue = crypto.randomUUID();
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 3); // 3 horas
      const now = new Date();

      try {
        await client.query(
          `INSERT INTO "UserRefreshToken"
           ("Id", "UserId", "RefreshToken", "ExpirationDate", "CreatedOn", "CreatedBy", "IsActive", "IsDeleted")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            refreshTokenId,
            user.Id,
            refreshTokenValue,
            expirationDate,
            now,
            user.Id,
            true,
            false,
          ]
        );
      } catch (refreshError: any) {
        // Log mas não falha o login se refresh token falhar
        console.error("[LOGIN REFRESH TOKEN ERROR]", refreshError);
        // Continua sem refresh token (login ainda funciona)
      }

      const elapsed = Date.now() - startTime;

      console.log("[LOGIN] Returning success response", {
        hasToken: !!token,
        tokenLength: token?.length,
        hasRefreshToken: !!refreshTokenValue,
        userId: user.Id,
        elapsed: `${elapsed}ms`,
      });

      // Formato compatível com o backend .NET e frontend
      return NextResponse.json(
        {
          success: true,
          data: {
            token,
            refreshToken: refreshTokenValue,
            userId: user.Id,
            email: user.EmailAddress,
            name: user.Name,
            role: user.AccessProfileId, // Frontend espera 'role' (AccessProfileId)
            accessProfileId: user.AccessProfileId,
            enterpriseId: enterpriseId,
            authenticationStatus: "Success", // Frontend verifica isso
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
    const errorMessage = error?.message || String(error);
    const errorStack = error?.stack;
    
    // Log detalhado para debug
    console.error("[LOGIN ERROR DETAILS]", {
      message: errorMessage,
      stack: errorStack,
      name: error?.name,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao processar a autenticação.",
        // Sempre retornar erro detalhado para debug (remover em produção se necessário)
        error: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

