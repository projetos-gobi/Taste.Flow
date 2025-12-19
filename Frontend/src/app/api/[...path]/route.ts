import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBackendOrigin() {
  // Preferir uma env server-side, mas aceitar NEXT_PUBLIC_API_URL para compatibilidade.
  // Fallback hardcoded garante que não quebra login se env não estiver configurada na Vercel.
  const raw =
    process.env.BACKEND_ORIGIN ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://tasteflow-backend.fly.dev";

  // Remover /api final se existir e barras finais
  return raw.replace(/\/api\/?$/i, "").replace(/\/+$/, "");
}

function isRetryable(method: string, path: string) {
  const m = method.toUpperCase();
  if (m === "GET" || m === "HEAD" || m === "OPTIONS") return true;
  // nosso padrão no projeto: POST /get-* são leituras
  if (m === "POST" && (path.includes("/get-") || path.includes("/get_"))) return true;
  // auth também pode ser retry em caso de rede/timeout (não em 401/403)
  if (m === "POST" && (path.includes("/Authentication/login") || path.includes("/Authentication/refresh-token"))) return true;
  return false;
}

function stripHopByHop(headers: Headers) {
  const hop = [
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
  ];
  hop.forEach((h) => headers.delete(h));
}

async function proxy(req: NextRequest, pathParts: string[] | undefined) {
  try {
    const origin = getBackendOrigin();
    if (!origin) {
      return Response.json(
        { error: "proxy_misconfigured", message: "Backend origin não configurado." },
        { status: 500 }
      );
    }

    // Extrair pathParts do URL se não vier nos params (fallback seguro)
    if (!pathParts || pathParts.length === 0) {
      const inUrl = new URL(req.url);
      const pathMatch = inUrl.pathname.match(/^\/api\/(.+)$/);
      pathParts = pathMatch ? pathMatch[1].split("/").filter(Boolean) : [];
    }

    const inUrl = new URL(req.url);
    const apiPath = "/" + (pathParts.length > 0 ? pathParts.join("/") : "");
    const targetUrl = `${origin}/api${apiPath}${inUrl.search}`;

    const method = req.method.toUpperCase();

    // Copiar headers relevantes
    const headers = new Headers(req.headers);
    stripHopByHop(headers);
    // Evitar repassar headers que podem conflitar com o fetch/buffer no Node runtime
    headers.delete("accept-encoding");
    headers.delete("content-length");

    // Body (somente para métodos que permitem)
    let body: ArrayBuffer | undefined = undefined;
    if (!(method === "GET" || method === "HEAD")) {
      body = await req.arrayBuffer();
    }

    const doFetch = async (timeoutMs: number) => {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(targetUrl, {
          method,
          headers,
          body: body && body.byteLength > 0 ? body : undefined,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(t);
      }
    };

    const retryable = isRetryable(method, `/api${apiPath}`);

    let resp: Response | null = null;
    // Timeout reduzido: 5s para operações críticas (login), 8s para leituras
    const timeoutMs = apiPath.includes("/Authentication/login") ? 5000 : 8000;
    
    try {
      resp = await doFetch(timeoutMs);
    } catch (e) {
      // Retry apenas 1x para operações críticas, sem delay desnecessário
      if (!retryable) {
        return Response.json(
          { error: "proxy_fetch_failed", message: "Falha ao chamar upstream.", upstream: targetUrl },
          { status: 502 }
        );
      }

      // Retry rápido (150ms) apenas para login
      if (apiPath.includes("/Authentication/login")) {
        await new Promise((r) => setTimeout(r, 150));
        try {
          resp = await doFetch(timeoutMs);
        } catch (e2) {
          return Response.json(
            { error: "proxy_error", message: "Falha ao contatar o backend (upstream) via proxy /api.", upstream: targetUrl },
            { status: 502 }
          );
        }
      } else {
        return Response.json(
          { error: "proxy_error", message: "Falha ao contatar o backend (upstream) via proxy /api.", upstream: targetUrl },
          { status: 502 }
        );
      }
    }

    // Remover retry para 5xx: deixa o Axios do frontend lidar com isso

    // Repasse de headers (inclui Server-Timing / X-TF-Server-Timing)
    const outHeaders = new Headers(resp.headers);
    stripHopByHop(outHeaders);

    // Resposta same-origin: não precisa CORS, mas manter cache-control previsível
    outHeaders.set("cache-control", "no-store");
    outHeaders.set("x-tf-proxy", "next-route");

    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: outHeaders,
    });
  } catch (e: any) {
    // Nunca deixar estourar 500 sem corpo (isso vira "Failed to load resource 500" no console)
    return Response.json(
      { error: "proxy_unhandled", message: String(e?.message ?? e ?? "unknown") },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  const params = await Promise.resolve(ctx.params);
  return proxy(req, params?.path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  const params = await Promise.resolve(ctx.params);
  return proxy(req, params?.path);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  const params = await Promise.resolve(ctx.params);
  return proxy(req, params?.path);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  const params = await Promise.resolve(ctx.params);
  return proxy(req, params?.path);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  const params = await Promise.resolve(ctx.params);
  return proxy(req, params?.path);
}
export async function OPTIONS(req: NextRequest, ctx: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  const params = await Promise.resolve(ctx.params);
  return proxy(req, params?.path);
}


