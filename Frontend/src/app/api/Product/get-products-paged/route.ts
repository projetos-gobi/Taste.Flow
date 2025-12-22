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
    console.error("[GET PRODUCTS PAGED] Token verification error:", error);
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
        `p."EnterpriseId" = $1`,
        `NOT COALESCE(p."IsDeleted", false)`,
        `COALESCE(p."IsActive", true) = true`,
      ];
      const queryParams: any[] = [enterpriseId];
      let paramIndex = 2;

      if (filter.name) {
        whereConditions.push(`LOWER(p."Name") LIKE $${paramIndex}`);
        queryParams.push(`%${filter.name.toLowerCase()}%`);
        paramIndex++;
      }

      if (filter.categoryId) {
        whereConditions.push(`p."CategoryId" = $${paramIndex}`);
        queryParams.push(filter.categoryId);
        paramIndex++;
      }

      if (filter.subCategoryId) {
        whereConditions.push(`p."SubCategoryId" = $${paramIndex}`);
        queryParams.push(filter.subCategoryId);
        paramIndex++;
      }

      if (filter.minPrice) {
        whereConditions.push(`p."Price" >= $${paramIndex}`);
        queryParams.push(parseFloat(filter.minPrice));
        paramIndex++;
      }

      if (filter.maxPrice) {
        whereConditions.push(`p."Price" <= $${paramIndex}`);
        queryParams.push(parseFloat(filter.maxPrice));
        paramIndex++;
      }

      const whereClause = whereConditions.join(" AND ");

      // Query SQL com JOINs para buscar dados relacionados
      const selectSql = `
        SELECT 
            p."Id",
            p."Name",
            p."Price",
            p."MarginValue",
            p."CategoryId",
            p."SubCategoryId",
            c."Name" AS "CategoryName",
            sc."Name" AS "SubCategoryName",
            COALESCE(
                COUNT(pa."Id") FILTER (
                    WHERE COALESCE(pa."IsActive", true)
                      AND NOT COALESCE(pa."IsDeleted", false)
                ), 0
            ) AS "AlternativeCount",
            CASE 
                WHEN p."Price" > 0 AND p."MarginValue" IS NOT NULL 
                THEN ROUND((p."MarginValue" / p."Price") * 100, 2)
                ELSE 0
            END AS "MarginPercent"
        FROM "Product" p
        LEFT JOIN "Category" c ON p."CategoryId" = c."Id" AND COALESCE(c."IsActive", true) AND NOT COALESCE(c."IsDeleted", false)
        LEFT JOIN "SubCategory" sc ON p."SubCategoryId" = sc."Id" AND COALESCE(sc."IsActive", true) AND NOT COALESCE(sc."IsDeleted", false)
        LEFT JOIN "ProductAlternative" pa ON pa."ProductId" = p."Id"
        WHERE ${whereClause}
        GROUP BY 
            p."Id", p."Name", p."Price", p."MarginValue", p."CategoryId", p."SubCategoryId",
            c."Name", sc."Name"
        ORDER BY p."Name" ASC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryParams.push(pageSize, offset);

      const result = await client.query(selectSql, queryParams);

      // Mapear resultados
      const products = result.rows.map((row) => ({
        id: row.Id,
        name: row.Name || "",
        price: row.Price || 0,
        marginValue: row.MarginValue || 0,
        categoryId: row.CategoryId || null,
        subCategoryId: row.SubCategoryId || null,
        categoryName: row.CategoryName || "",
        subCategoryName: row.SubCategoryName || "",
        alternativeCount: parseInt(row.AlternativeCount || "0", 10),
        marginPercent: parseFloat(row.MarginPercent || "0"),
      }));

      // Contar total (query separada para performance)
      const countSql = `
        SELECT COUNT(DISTINCT p."Id")
        FROM "Product" p
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
    console.error("[GET PRODUCTS PAGED ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao buscar produtos.",
        error: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}

