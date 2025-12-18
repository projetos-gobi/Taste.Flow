import { NextRequest } from "next/server";

function getBackendOrigin() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  // Esperado: https://tasteflow-backend.fly.dev (sem /api no final)
  return raw.replace(/\/+$/, "");
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

async function proxy(req: NextRequest, pathParts: string[]) {
  const origin = getBackendOrigin();
  if (!origin) {
    return new Response("Backend origin not configured", { status: 500 });
  }

  const inUrl = new URL(req.url);
  const apiPath = "/" + pathParts.join("/");
  const targetUrl = `${origin}/api${apiPath}${inUrl.search}`;

  const method = req.method.toUpperCase();

  // Copiar headers relevantes
  const headers = new Headers(req.headers);
  headers.set("host", new URL(origin).host);
  stripHopByHop(headers);
  // Evitar repassar Accept-Encoding (Next/fetch lida com isso)
  headers.delete("accept-encoding");

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
  try {
    resp = await doFetch(12000);
  } catch (e) {
    if (!retryable) throw e;
    await new Promise((r) => setTimeout(r, 350));
    resp = await doFetch(15000);
  }

  // Se backend respondeu 5xx e for retryable, tenta 1x
  if (retryable && resp.status >= 500) {
    await new Promise((r) => setTimeout(r, 250));
    resp = await doFetch(15000);
  }

  // Repasse de headers (inclui Server-Timing / X-TF-Server-Timing)
  const outHeaders = new Headers(resp.headers);
  stripHopByHop(outHeaders);

  // Resposta same-origin: não precisa CORS, mas manter cache-control previsível
  outHeaders.set("cache-control", "no-store");

  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: outHeaders,
  });
}

export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function POST(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function PUT(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function PATCH(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function DELETE(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function OPTIONS(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}


