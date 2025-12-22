import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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

function toSha256Hash(password: string, salt: string): string {
  const trimmedPassword = (password || "").trim();
  const saltStr = (salt || "").toString();
  const hash = crypto.createHash("sha256");
  hash.update(trimmedPassword + saltStr, "utf8");
  return hash.digest("hex");
}

// Verificar token JWT e extrair userId
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
    console.error("[RECOVER PASSWORD] Token verification error:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log("[RECOVER PASSWORD] Starting...");

  try {
    const body = await req.json();
    const code = body.code || body.Code || "";
    const oldPassword = body.oldPassword || body.OldPassword || "";
    const newPassword = body.newPassword || body.NewPassword || "";

    console.log("[RECOVER PASSWORD] Request received:", {
      hasCode: !!code,
      codeLength: code.length,
      hasOldPassword: !!oldPassword,
      hasNewPassword: !!newPassword,
    });

    // Se code estiver vazio, permitir alteração apenas com senha antiga (para usuários novos sem código)
    if (!oldPassword || !newPassword) {
      console.log("[RECOVER PASSWORD] Missing required fields");
      return NextResponse.json(
        {
          success: false,
          message: "Senha antiga e nova senha são obrigatórias.",
        },
        { status: 400 }
      );
    }

    // Se não tiver código, validar apenas pela senha antiga (para novos usuários)
    const skipCodeValidation = !code || code === "";
    console.log("[RECOVER PASSWORD] SkipCodeValidation:", skipCodeValidation);

    // Verificar autenticação via token
    const authHeader = req.headers.get("authorization");
    const userId = getUserIdFromToken(authHeader);

    console.log("[RECOVER PASSWORD] Auth check:", {
      hasAuthHeader: !!authHeader,
      userId: userId,
    });

    if (!userId) {
      console.log("[RECOVER PASSWORD] Authentication failed");
      return NextResponse.json(
        {
          success: false,
          message: "Token de autenticação inválido ou ausente.",
        },
        { status: 401 }
      );
    }

    const db = getPool();
    const client = await db.connect();

    try {
      let token: any = null;

      // Se tiver código, validar o token
      if (!skipCodeValidation) {
        console.log("[RECOVER PASSWORD] Validating code:", code);
        const tokenResult = await client.query(
          `SELECT "Id", "UserId", "Code"
           FROM "UserPasswordManagement"
           WHERE "Code" = $1
             AND COALESCE("IsActive", true) = true
             AND NOT COALESCE("IsDeleted", false) = true
           ORDER BY "CreatedOn" DESC
           LIMIT 1`,
          [code]
        );

        console.log("[RECOVER PASSWORD] Token query result:", {
          found: tokenResult.rows.length > 0,
          userId: tokenResult.rows[0]?.UserId,
        });

        if (tokenResult.rows.length === 0) {
          console.log("[RECOVER PASSWORD] Code not found");
          return NextResponse.json(
            {
              success: false,
              message: "Token de redefinição de senha inválido ou não encontrado.",
            },
            { status: 404 }
          );
        }

        token = tokenResult.rows[0];

        // Verificar se o token pertence ao usuário autenticado
        if (token.UserId !== userId) {
          console.log("[RECOVER PASSWORD] Code belongs to different user:", {
            tokenUserId: token.UserId,
            authenticatedUserId: userId,
          });
          return NextResponse.json(
            {
              success: false,
              message: "Token de redefinição de senha inválido.",
            },
            { status: 403 }
          );
        }
        console.log("[RECOVER PASSWORD] Code validated successfully");
      } else {
        console.log("[RECOVER PASSWORD] Skipping code validation (code is empty)");
      }

      // Buscar usuário
      const userResult = await client.query(
        `SELECT "Id", "PasswordHash", "PasswordSalt", "MustChangePassword"
         FROM "Users"
         WHERE "Id" = $1
           AND COALESCE("IsActive", true) = true
           AND NOT COALESCE("IsDeleted", false) = true
         LIMIT 1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Usuário não encontrado.",
          },
          { status: 404 }
        );
      }

      const user = userResult.rows[0];

      // Validar senha antiga
      console.log("[RECOVER PASSWORD] Validating old password...");
      const oldPasswordHash = toSha256Hash(oldPassword, user.PasswordSalt);
      const passwordMatch = oldPasswordHash === user.PasswordHash;
      console.log("[RECOVER PASSWORD] Password validation:", {
        match: passwordMatch,
        oldHashPreview: oldPasswordHash.substring(0, 20) + "...",
        storedHashPreview: user.PasswordHash.substring(0, 20) + "...",
      });

      if (!passwordMatch) {
        console.log("[RECOVER PASSWORD] Old password mismatch");
        return NextResponse.json(
          {
            success: false,
            message: "Credenciais inválidas do usuário.",
          },
          { status: 401 }
        );
      }

      // Gerar novo salt e hash para a nova senha
      const newPasswordSalt = crypto.randomUUID();
      const newPasswordHash = toSha256Hash(newPassword, newPasswordSalt);

      // Atualizar senha e desabilitar MustChangePassword
      const now = new Date().toISOString();
      const updateResult = await client.query(
        `UPDATE "Users"
         SET 
           "PasswordHash" = $1,
           "PasswordSalt" = $2,
           "MustChangePassword" = false,
           "ModifiedOn" = $3
         WHERE "Id" = $4`,
        [newPasswordHash, newPasswordSalt, now, userId]
      );

      // Marcar token como usado (se existir)
      if (token && token.Id) {
        await client.query(
          `UPDATE "UserPasswordManagement"
           SET "ModifiedOn" = $1
           WHERE "Id" = $2`,
          [now, token.Id]
        );
      }

      const elapsed = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          message: "Senha alterada com sucesso.",
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
    console.error("[RECOVER PASSWORD ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao redefinir a senha do usuário.",
        error: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}

