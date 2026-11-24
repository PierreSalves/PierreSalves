// Worker da landing page (tghservices.com.br).
// /                 página em React + Material UI (build do Vite em dist/), status 200
// /curriculo        currículo em React (curriculo.html do build), status 200
// /assets/*         JS, CSS e fontes do build, com cache longo (os nomes têm hash)
// /img/*, logo, robots.txt: arquivos estáticos
// POST /api/pedido  formulário de pedido: valida e manda para o e-mail em PEDIDO_PARA
// Qualquer outra rota: 404 com link para a página inicial.

import { htmlPedido } from "./email-pedido.js";

const ROTAS_CURRICULO = new Set(["/curriculo", "/curriculo/", "/curriculo.html"]);
const ROTAS_INICIO = new Set(["/", "/index.html"]);

// Página inicial e currículo (React): o MUI injeta estilos em <style>, por isso 'unsafe-inline' só em style-src.
const CSP_INICIO =
  "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
// Página 404: só estilos inline e imagens locais.
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

function json(dados, status) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

const umaLinha = (s) => s.replace(/[\r\n]+/g, " ").trim();
const EMAIL_VALIDO = /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[^\s@<>()"',;:]{2,}$/;

// Valida o corpo do formulário. Devolve { pedido } ou { erro }.
export function validarPedido(corpo) {
  if (!corpo || typeof corpo !== "object") return { erro: "corpo-invalido" };
  const texto = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const pedido = {
    nome: umaLinha(texto(corpo.nome, 120)),
    email: umaLinha(texto(corpo.email, 200)),
    whatsapp: umaLinha(texto(corpo.whatsapp, 40)),
    // Texto do tipo escolhido no formulário (a lista fica em app/site.config.js).
    tipo: umaLinha(texto(corpo.tipoTexto, 80)) || "Pedido",
    mensagem: texto(corpo.mensagem, 4000),
  };
  // Campo escondido: só robôs preenchem.
  if (texto(corpo.empresa_site, 200)) return { robo: true };
  if (pedido.nome.length < 2) return { erro: "nome" };
  if (!EMAIL_VALIDO.test(pedido.email)) return { erro: "email" };
  if (pedido.mensagem.length < 10) return { erro: "mensagem" };
  return { pedido };
}

export function montarEmail(pedido, env) {
  const tipo = pedido.tipo;
  const subject = `Pedido pelo site: ${tipo} · ${pedido.nome}`;
  const linhas = [
    `Tipo: ${tipo}`,
    `Nome: ${pedido.nome}`,
    `E-mail: ${pedido.email}`,
    `WhatsApp: ${pedido.whatsapp || "não informado"}`,
    "",
    pedido.mensagem,
    "",
    "—",
    "Enviado pelo formulário de pedido de tghservices.com.br",
  ];
  return {
    from: { email: env.PEDIDO_DE, name: env.PEDIDO_NOME || "Site" },
    to: env.PEDIDO_PARA,
    replyTo: { email: pedido.email, name: pedido.nome },
    subject,
    text: linhas.join("\n"),
    html: htmlPedido(pedido, subject),
  };
}

async function receberPedido(request, env, url) {
  // Só aceita envios vindos da própria página.
  const origem = request.headers.get("Origin");
  if (origem && origem !== url.origin) return json({ ok: false, erro: "origem" }, 403);
  if (!(request.headers.get("Content-Type") || "").includes("application/json")) return json({ ok: false, erro: "formato" }, 415);
  const bruto = await request.text();
  if (bruto.length > 10000) return json({ ok: false, erro: "grande-demais" }, 413);

  let corpo;
  try {
    corpo = JSON.parse(bruto);
  } catch {
    return json({ ok: false, erro: "corpo-invalido" }, 400);
  }
  const { pedido, erro, robo } = validarPedido(corpo);
  if (robo) return json({ ok: true }, 200);
  if (erro) return json({ ok: false, erro }, 400);

  if (!env.EMAIL || !env.PEDIDO_PARA || !env.PEDIDO_DE) {
    console.error("pedido: envio de e-mail não configurado");
    return json({ ok: false, erro: "envio-indisponivel" }, 503);
  }
  try {
    await env.EMAIL.send(montarEmail(pedido, env));
  } catch (e) {
    console.error("pedido: falha ao enviar", e && e.message);
    return json({ ok: false, erro: "falha-no-envio" }, 502);
  }
  return json({ ok: true }, 200);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const semCorpo = request.method === "HEAD";
    const caminho = url.pathname;

    if (caminho === "/api/pedido") {
      if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
      return receberPedido(request, env, url);
    }

    if (caminho.startsWith("/assets/")) {
      const resp = await env.ASSETS.fetch(request);
      if (!resp.ok) return resp;
      const headers = new Headers(resp.headers);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      headers.set("X-Content-Type-Options", "nosniff");
      return new Response(resp.body, { status: resp.status, headers });
    }

    if (caminho === "/logo-tghservices.png" || caminho.startsWith("/img/")) {
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
      const headers = cabecalhosHtml(curriculo.headers, CSP_INICIO);
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
