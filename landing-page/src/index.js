// Landing page da TGH Services.
// /           vitrine de apps + portfólio (public/index.html), status 200
// /curriculo  currículo do Pierre (public/curriculo.html), status 200
// /img/*, /app.js, /logo-tghservices.png, /robots.txt: arquivos estáticos
// Qualquer outra rota: 404 com link para a página inicial.

const ROTAS_CURRICULO = new Set(["/curriculo", "/curriculo/", "/curriculo.html"]);
const ROTAS_INICIO = new Set(["/", "/index.html"]);

// Página inicial: fontes do Google Fonts e o script próprio em /app.js.
const CSP_INICIO =
  "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
// Currículo e 404: só estilos inline e imagens locais.
const CSP_SIMPLES =
  "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

function cabecalhosHtml(origem, csp) {
  const headers = new Headers(origem);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Content-Security-Policy", csp);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return headers;
}

const PAGINA_404 = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Página não encontrada · TGH Services</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,sans-serif;background:#F4FBF8;color:#161D1C;text-align:center}a{color:#006A60;font-weight:600}@media (prefers-color-scheme:dark){body{background:#0E1513;color:#DDE4E1}a{color:#82D5C8}}</style></head><body><main><h1>Página não encontrada</h1><p>O endereço que você abriu não existe.</p><p><a href="/">Ir para a página inicial</a></p></main></body></html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const semCorpo = request.method === "HEAD";
    const caminho = url.pathname;

    if (caminho === "/logo-tghservices.png" || caminho === "/app.js" || caminho.startsWith("/img/")) {
      return env.ASSETS.fetch(request);
    }

    // 200 de propósito: com robots.txt em 5xx o Google para de rastrear o site inteiro.
    if (caminho === "/robots.txt") {
      const robots = await env.ASSETS.fetch(new URL("/robots.txt", url));
      const headers = new Headers(robots.headers);
      headers.set("Content-Type", "text/plain; charset=utf-8");
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Cache-Control", "public, max-age=3600");
      return new Response(semCorpo ? null : robots.body, { status: 200, headers });
    }

    if (ROTAS_CURRICULO.has(caminho)) {
      if (caminho !== "/curriculo") {
        return Response.redirect(new URL("/curriculo", url), 301);
      }
      const curriculo = await env.ASSETS.fetch(new URL("/curriculo", url));
      const headers = cabecalhosHtml(curriculo.headers, CSP_SIMPLES);
      headers.set("Cache-Control", "public, max-age=300");
      return new Response(semCorpo ? null : curriculo.body, { status: 200, headers });
    }

    if (ROTAS_INICIO.has(caminho)) {
      if (caminho !== "/") {
        return Response.redirect(new URL("/", url), 301);
      }
      const inicio = await env.ASSETS.fetch(new URL("/", url));
      const headers = cabecalhosHtml(inicio.headers, CSP_INICIO);
      headers.set("Cache-Control", "public, max-age=300");
      return new Response(semCorpo ? null : inicio.body, { status: 200, headers });
    }

    const headers = cabecalhosHtml({}, CSP_SIMPLES);
    headers.set("Cache-Control", "no-store");
    headers.set("X-Robots-Tag", "noindex");
    return new Response(semCorpo ? null : PAGINA_404, { status: 404, headers });
  },
};
