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

function getEnterpriseIdFromToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || "K39Pg7Sa86QxAt0eQSmd6wRfjc1Ivl)@#(*";
    const decoded = jwt.verify(token, secret) as any;
    return decoded.enterpriseId || decoded.enterpriseid || null;
  } catch (error) {
    console.error("[GET PRODUCT INTERMEDIATES PAGED] Token verification error:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const page = body.Query?.Page || body.query?.page || 1;
    const pageSize = body.Query?.PageSize || body.query?.pageSize || 10;
    const filter = body.Filter || body.filter || {};

    // Verificar autenticação e obter EnterpriseId
    const authHeader = req.headers.get("authorization");
    const enterpriseId = getEnterpriseIdFromToken(authHeader);

    if (!enterpriseId) {
      return NextResponse.json(
        { success: false, message: "Não autorizado." },
        { status: 401 }
      );
    }

    const db = getPool();
    const client = await db.connect();

    try {
      const offset = (page - 1) * pageSize;

      // Construir WHERE clause baseado nos filtros
      const whereConditions: string[] = [
        `pi."EnterpriseId" = $1`,
        `NOT COALESCE(pi."IsDeleted", false)`,
        `COALESCE(pi."IsActive", true) = true`,
      ];
      const queryParams: any[] = [enterpriseId];
      let paramIndex = 2;

      if (filter.name) {
        whereConditions.push(`LOWER(pi."Name") LIKE $${paramIndex}`);
        queryParams.push(`%${filter.name.toLowerCase()}%`);
        paramIndex++;
      }

      if (filter.categoryId) {
        whereConditions.push(`pi."CategoryId" = $${paramIndex}`);
        queryParams.push(filter.categoryId);
        paramIndex++;
      }

      if (filter.subCategoryId) {
        whereConditions.push(`pi."SubCategoryId" = $${paramIndex}`);
        queryParams.push(filter.subCategoryId);
        paramIndex++;
      }

      if (filter.minPrice) {
        whereConditions.push(`pi."Price" >= $${paramIndex}`);
        queryParams.push(parseFloat(filter.minPrice));
        paramIndex++;
      }

      if (filter.maxPrice) {
        whereConditions.push(`pi."Price" <= $${paramIndex}`);
        queryParams.push(parseFloat(filter.maxPrice));
        paramIndex++;
      }

      const whereClause = whereConditions.join(" AND ");

      // Query SQL com JOINs para buscar dados relacionados
      const selectSql = `
        SELECT 
            pi."Id",
            pi."Name",
            pi."Price",
            pi."Yield",
            pi."CategoryId",
            pi."SubCategoryId",
            pi."IsActive",
            c."Name" AS "CategoryName",
            sc."Name" AS "SubCategoryName"
        FROM "ProductIntermediate" pi
        LEFT JOIN "Category" c ON pi."CategoryId" = c."Id" AND COALESCE(c."IsActive", true) AND NOT COALESCE(c."IsDeleted", false)
        LEFT JOIN "SubCategory" sc ON pi."SubCategoryId" = sc."Id" AND COALESCE(sc."IsActive", true) AND NOT COALESCE(sc."IsDeleted", false)
        WHERE ${whereClause}
        ORDER BY pi."Name" ASC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryParams.push(pageSize, offset);

      const result = await client.query(selectSql, queryParams);

      // Mapear resultados
      const products = result.rows.map((row) => ({
        id: row.Id,
        name: row.Name || "",
        price: row.Price || 0,
        yield: row.Yield || null,
        categoryId: row.CategoryId || null,
        subCategoryId: row.SubCategoryId || null,
        categoryName: row.CategoryName || "",
        subCategoryName: row.SubCategoryName || "",
        isActive: row.IsActive ?? true,
      }));

      // Contar total (query separada para performance)
      const countSql = `
        SELECT COUNT(DISTINCT pi."Id")
        FROM "ProductIntermediate" pi
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
            items: products,
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
    console.error("[GET PRODUCT INTERMEDIATES PAGED ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao buscar produtos intermediários.",
        error: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}

