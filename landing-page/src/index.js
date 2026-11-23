// Raiz e rotas desconhecidas: página de manutenção com status 503 e Retry-After.
// /curriculo: currículo do Pierre com status 200. Logo e robots.txt: servidos com status 200.
const RETRY_AFTER_SEGUNDOS = "3600";
const ROTAS_CURRICULO = new Set(["/curriculo", "/curriculo/", "/curriculo.html"]);
const CSP =
  "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

function definirCabecalhosSeguranca(headers) {
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Content-Security-Policy", CSP);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const semCorpo = request.method === "HEAD";

    if (url.pathname === "/logo-tghservices.png") {
      return env.ASSETS.fetch(request);
    }

    // 200 de propósito: com robots.txt em 5xx o Google para de rastrear o site inteiro, /curriculo junto.
    if (url.pathname === "/robots.txt") {
      const robots = await env.ASSETS.fetch(new URL("/robots.txt", url));
      const headers = new Headers(robots.headers);
      headers.set("Content-Type", "text/plain; charset=utf-8");
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Cache-Control", "public, max-age=3600");
      return new Response(semCorpo ? null : robots.body, { status: 200, headers });
    }

    if (ROTAS_CURRICULO.has(url.pathname)) {
      if (url.pathname !== "/curriculo") {
        return Response.redirect(new URL("/curriculo", url), 301);
      }
      const curriculo = await env.ASSETS.fetch(new URL("/curriculo", url));
      const headers = new Headers(curriculo.headers);
      definirCabecalhosSeguranca(headers);
      headers.set("Cache-Control", "public, max-age=300");
      return new Response(semCorpo ? null : curriculo.body, { status: 200, headers });
    }

    const pagina = await env.ASSETS.fetch(new URL("/", url));
    const headers = new Headers(pagina.headers);
    definirCabecalhosSeguranca(headers);
    headers.set("Retry-After", RETRY_AFTER_SEGUNDOS);
    headers.set("Cache-Control", "no-store");
    headers.set("X-Robots-Tag", "noindex");

    return new Response(semCorpo ? null : pagina.body, { status: 503, headers });
  },
};
