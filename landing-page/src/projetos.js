// Cards de projetos guardados no D1 (binding DB) e imagens no R2 (binding IMAGENS).
//
// Público:
//   GET  /api/projetos              cards publicados, por seção e ordem
//   GET  /midia/*                   imagens enviadas pelo admin (R2)
// Admin (só com sessão do login do painel, ver src/login.js):
//   GET    /api/admin/eu            e-mail de quem entrou e se é dono
//   GET    /api/admin/acessos       donos e e-mails liberados (só donos)
//   POST   /api/admin/acessos       { email } libera um e-mail (só donos)
//   DELETE /api/admin/acessos/:email  tira o acesso e encerra as sessões dele (só donos)
//   GET    /api/admin/projetos      todos os cards, inclusive os ocultos
//   POST   /api/admin/projetos      cria um card
//   PUT    /api/admin/projetos/:id  edita um card
//   DELETE /api/admin/projetos/:id  apaga um card (e as imagens que só ele usava)
//   PUT    /api/admin/ordem         { secao, ids: [...] } muda a ordem
//   POST   /api/admin/imagens       corpo = bytes da imagem; devolve { url }
//   GET    /api/admin/exportar      backup em JSON
//   POST   /api/admin/importar      troca todos os cards pelos do backup

import { sessaoAtual, rotaLogin, ehDono, emailsDonos } from "./login.js";

export const SECOES = ["vitrine", "outros"];

// ---------------------------------------------------------------- validação

const texto = (v, max) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const textoLongo = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const nomeIcone = (v) => (typeof v === "string" && /^[a-zA-Z]{1,30}$/.test(v) ? v : "");
const lista = (v, max) => (Array.isArray(v) ? v.slice(0, max) : []);

// Links: só http(s) ou caminho do próprio site. Nada de javascript:, data: etc.
export function urlSegura(v) {
  const u = texto(v, 500);
  if (/^https?:\/\/[^\s]+$/i.test(u)) return u;
  if (/^\/(?!\/)[^\s]*$/.test(u)) return u;
  return "";
}
// Imagens: só do próprio site (/img/ do build ou /midia/ do R2), por causa da CSP.
const urlImagem = (v) => {
  const u = texto(v, 300);
  return /^\/(img|midia)\/[A-Za-z0-9._\/-]+$/.test(u) && !u.includes("..") ? u : "";
};
const posicao = (v) => {
  const p = texto(v, 30);
  return /^[a-z% 0-9]+$/.test(p) ? p : "";
};

// Devolve { dados } limpo, ou { erro } com o campo que falta.
export function limparProjeto(secao, bruto) {
  if (!SECOES.includes(secao)) return { erro: "secao" };
  if (!bruto || typeof bruto !== "object") return { erro: "dados" };

  if (secao === "outros") {
    const dados = { icone: nomeIcone(bruto.icone), nome: texto(bruto.nome, 80), texto: texto(bruto.texto, 240), url: urlSegura(bruto.url) };
    if (!dados.nome) return { erro: "nome" };
    if (!dados.url) return { erro: "url" };
    return { dados };
  }

  const status = bruto.status && typeof bruto.status === "object" ? bruto.status : {};
  const dados = {
    nome: texto(bruto.nome, 80),
    publico: texto(bruto.publico, 120),
    icone: nomeIcone(bruto.icone),
    status: { texto: texto(status.texto, 40), icone: nomeIcone(status.icone) },
    resumo: textoLongo(bruto.resumo, 400),
    telas: lista(bruto.telas, 8)
      .map((t) => ({ imagem: urlImagem(t?.imagem), legenda: texto(t?.legenda, 60), posicao: posicao(t?.posicao) }))
      .filter((t) => t.imagem),
    semTelas: texto(bruto.semTelas, 60),
    recursos: lista(bruto.recursos, 8)
      .map((r) => ({ icone: nomeIcone(r?.icone), titulo: texto(r?.titulo, 80), texto: textoLongo(r?.texto, 240) }))
      .filter((r) => r.titulo),
    tecnologias: [...new Set(lista(bruto.tecnologias, 12).map((t) => texto(t, 30)).filter(Boolean))],
    links: lista(bruto.links, 4)
      .map((l) => ({ texto: texto(l?.texto, 40), url: urlSegura(l?.url), icone: nomeIcone(l?.icone), discreto: l?.discreto === true }))
      .filter((l) => l.texto && l.url),
  };
  for (const t of dados.telas) if (!t.posicao) delete t.posicao;
  for (const l of dados.links) if (!l.discreto) delete l.discreto;
  if (!dados.nome) return { erro: "nome" };
  if (!dados.status.texto) dados.status = { texto: "No ar", icone: "ok" };
  return { dados };
}

// ---------------------------------------------------------------- banco

const linhaParaProjeto = (l) => ({ id: l.id, secao: l.secao, ordem: l.ordem, publicado: l.publicado === 1, dados: JSON.parse(l.dados), atualizado_em: l.atualizado_em });

export async function listarProjetos(db, { todos = false } = {}) {
  const sql = `SELECT * FROM projetos ${todos ? "" : "WHERE publicado = 1"} ORDER BY secao, ordem, criado_em`;
  const { results } = await db.prepare(sql).all();
  return results.map(linhaParaProjeto);
}

// Formato que a página usa: { vitrine: [dados...], outros: [dados...] }
export async function projetosDaPagina(db) {
  const todos = await listarProjetos(db);
  const saida = { vitrine: [], outros: [] };
  for (const p of todos) saida[p.secao].push({ id: p.id, ...p.dados });
  return saida;
}

const imagensDe = (dados) => (dados?.telas || []).map((t) => t.imagem).filter((u) => u.startsWith("/midia/"));

// Apaga do R2 as imagens que deixaram de ser usadas por qualquer card.
async function limparImagens(env, candidatas) {
  if (!env.IMAGENS || candidatas.length === 0) return;
  const emUso = new Set((await listarProjetos(env.DB, { todos: true })).flatMap((p) => imagensDe(p.dados)));
  const apagar = [...new Set(candidatas)].filter((u) => !emUso.has(u)).map((u) => u.slice("/midia/".length));
  if (apagar.length) await env.IMAGENS.delete(apagar);
}

// ---------------------------------------------------------------- respostas

function json(dados, status = 200, extra = {}) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extra },
  });
}

async function lerJson(request, max = 200_000) {
  if (!(request.headers.get("Content-Type") || "").includes("application/json")) return { erro: json({ ok: false, erro: "formato" }, 415) };
  const bruto = await request.text();
  if (bruto.length > max) return { erro: json({ ok: false, erro: "grande-demais" }, 413) };
  try {
    return { corpo: JSON.parse(bruto) };
  } catch {
    return { erro: json({ ok: false, erro: "corpo-invalido" }, 400) };
  }
}

const TIPOS_IMAGEM = { "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "image/avif": "avif" };
const MAX_IMAGEM = 4 * 1024 * 1024;

// ---------------------------------------------------------------- rotas

export async function rotaPublica(request, env, caminho) {
  if (caminho === "/api/projetos") {
    if (request.method !== "GET" && request.method !== "HEAD") return new Response(null, { status: 405, headers: { Allow: "GET" } });
    if (!env.DB) return json({ ok: false, erro: "sem-banco" }, 503);
    return json({ ok: true, ...(await projetosDaPagina(env.DB)) }, 200, { "Cache-Control": "public, max-age=30" });
  }
  if (caminho.startsWith("/midia/")) {
    if (!env.IMAGENS) return new Response(null, { status: 404 });
    const chave = decodeURIComponent(caminho.slice("/midia/".length));
    if (!/^projetos\/[A-Za-z0-9-]+\.(webp|png|jpg|avif)$/.test(chave)) return new Response(null, { status: 404 });
    const obj = await env.IMAGENS.get(chave);
    if (!obj) return new Response(null, { status: 404 });
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("ETag", obj.httpEtag);
    // O nome é único (uuid) e nunca é reaproveitado: pode ficar em cache para sempre.
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("X-Content-Type-Options", "nosniff");
    return new Response(request.method === "HEAD" ? null : obj.body, { headers });
  }
  return null;
}

export async function rotaAdmin(request, env, url) {
  const login = await rotaLogin(request, env, url, url.pathname.replace(/\/+$/, ""));
  if (login) return login;
  const email = await sessaoAtual(request, env);
  if (!email) return json({ ok: false, erro: "sem-acesso" }, 403);
  if (!env.DB) return json({ ok: false, erro: "sem-banco" }, 503);

  const metodo = request.method;
  // Alterações só vindas da própria página do admin.
  if (metodo !== "GET") {
    const origem = request.headers.get("Origin");
    if (!origem || origem !== url.origin) return json({ ok: false, erro: "origem" }, 403);
  }

  const caminho = url.pathname.replace(/\/+$/, "");
  const db = env.DB;

  if (caminho === "/api/admin/eu" && metodo === "GET") return json({ ok: true, email, dono: ehDono(env, email) });

  if (caminho === "/api/admin/acessos" || caminho.startsWith("/api/admin/acessos/")) {
    if (!ehDono(env, email)) return json({ ok: false, erro: "so-dono" }, 403);
    if (caminho === "/api/admin/acessos" && metodo === "GET") {
      const { results } = await db.prepare("SELECT email, criado_em, criado_por FROM admin_usuarios ORDER BY criado_em").all();
      return json({ ok: true, donos: emailsDonos(env), emails: results });
    }
    if (caminho === "/api/admin/acessos" && metodo === "POST") {
      const { corpo, erro } = await lerJson(request);
      if (erro) return erro;
      const novo = String(corpo?.email || "").trim().toLowerCase();
      if (!/^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[^\s@<>()"',;:]{2,}$/.test(novo) || novo.length > 200) return json({ ok: false, erro: "email" }, 400);
      if (ehDono(env, novo)) return json({ ok: false, erro: "ja-dono" }, 400);
      const { total } = await db.prepare("SELECT COUNT(*) AS total FROM admin_usuarios").first();
      if (total >= 50) return json({ ok: false, erro: "limite" }, 400);
      await db.prepare("INSERT OR IGNORE INTO admin_usuarios (email, criado_em, criado_por) VALUES (?, ?, ?)").bind(novo, Math.floor(Date.now() / 1000), email).run();
      return json({ ok: true }, 201);
    }
    const um = caminho.match(/^\/api\/admin\/acessos\/(.+)$/);
    if (um && metodo === "DELETE") {
      const alvo = decodeURIComponent(um[1]).toLowerCase();
      if (ehDono(env, alvo)) return json({ ok: false, erro: "ja-dono" }, 400);
      await db.batch([
        db.prepare("DELETE FROM admin_usuarios WHERE email = ?").bind(alvo),
        db.prepare("DELETE FROM admin_sessoes WHERE email = ?").bind(alvo),
        db.prepare("DELETE FROM admin_codigos WHERE email = ?").bind(alvo),
      ]);
      return json({ ok: true });
    }
    return json({ ok: false, erro: "nao-encontrado" }, 404);
  }

  if (caminho === "/api/admin/projetos") {
    if (metodo === "GET") return json({ ok: true, projetos: await listarProjetos(db, { todos: true }) });
    if (metodo === "POST") {
      const { corpo, erro } = await lerJson(request);
      if (erro) return erro;
      const secao = corpo?.secao;
      const limpo = limparProjeto(secao, corpo?.dados);
      if (limpo.erro) return json({ ok: false, erro: limpo.erro }, 400);
      const id = crypto.randomUUID();
      const { ultima } = await db.prepare("SELECT COALESCE(MAX(ordem), -1) AS ultima FROM projetos WHERE secao = ?").bind(secao).first();
      await db
        .prepare("INSERT INTO projetos (id, secao, ordem, publicado, dados) VALUES (?, ?, ?, ?, ?)")
        .bind(id, secao, ultima + 1, corpo.publicado === false ? 0 : 1, JSON.stringify(limpo.dados))
        .run();
      return json({ ok: true, id }, 201);
    }
    return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
  }

  const umProjeto = caminho.match(/^\/api\/admin\/projetos\/([A-Za-z0-9-]{1,64})$/);
  if (umProjeto) {
    const id = umProjeto[1];
    const atual = await db.prepare("SELECT * FROM projetos WHERE id = ?").bind(id).first();
    if (!atual) return json({ ok: false, erro: "nao-encontrado" }, 404);
    const antigas = imagensDe(JSON.parse(atual.dados));
    if (metodo === "PUT") {
      const { corpo, erro } = await lerJson(request);
      if (erro) return erro;
      const secao = SECOES.includes(corpo?.secao) ? corpo.secao : atual.secao;
      const limpo = limparProjeto(secao, corpo?.dados ?? JSON.parse(atual.dados));
      if (limpo.erro) return json({ ok: false, erro: limpo.erro }, 400);
      const publicado = typeof corpo.publicado === "boolean" ? (corpo.publicado ? 1 : 0) : atual.publicado;
      await db
        .prepare("UPDATE projetos SET secao = ?, publicado = ?, dados = ?, atualizado_em = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?")
        .bind(secao, publicado, JSON.stringify(limpo.dados), id)
        .run();
      await limparImagens(env, antigas);
      return json({ ok: true });
    }
    if (metodo === "DELETE") {
      await db.prepare("DELETE FROM projetos WHERE id = ?").bind(id).run();
      await limparImagens(env, antigas);
      return json({ ok: true });
    }
    return new Response(null, { status: 405, headers: { Allow: "PUT, DELETE" } });
  }

  if (caminho === "/api/admin/ordem" && metodo === "PUT") {
    const { corpo, erro } = await lerJson(request);
    if (erro) return erro;
    if (!SECOES.includes(corpo?.secao) || !Array.isArray(corpo.ids)) return json({ ok: false, erro: "dados" }, 400);
    const ids = corpo.ids.filter((i) => typeof i === "string").slice(0, 200);
    await db.batch(ids.map((id, i) => db.prepare("UPDATE projetos SET ordem = ? WHERE id = ? AND secao = ?").bind(i, id, corpo.secao)));
    return json({ ok: true });
  }

  if (caminho === "/api/admin/imagens" && metodo === "POST") {
    if (!env.IMAGENS) return json({ ok: false, erro: "sem-armazenamento" }, 503);
    const tipo = (request.headers.get("Content-Type") || "").split(";")[0].trim();
    const ext = TIPOS_IMAGEM[tipo];
    if (!ext) return json({ ok: false, erro: "tipo-de-imagem" }, 415);
    const tamanho = Number(request.headers.get("Content-Length") || 0);
    if (tamanho > MAX_IMAGEM) return json({ ok: false, erro: "grande-demais" }, 413);
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength === 0) return json({ ok: false, erro: "vazio" }, 400);
    if (bytes.byteLength > MAX_IMAGEM) return json({ ok: false, erro: "grande-demais" }, 413);
    const chave = `projetos/${crypto.randomUUID()}.${ext}`;
    await env.IMAGENS.put(chave, bytes, { httpMetadata: { contentType: tipo } });
    return json({ ok: true, url: `/midia/${chave}` }, 201);
  }

  if (caminho === "/api/admin/exportar" && metodo === "GET") {
    const projetos = (await listarProjetos(db, { todos: true })).map(({ id, secao, ordem, publicado, dados }) => ({ id, secao, ordem, publicado, dados }));
    const data = new Date().toISOString().slice(0, 10);
    return json({ formato: "tghservices-projetos", versao: 1, exportado_em: new Date().toISOString(), projetos }, 200, {
      "Content-Disposition": `attachment; filename="projetos-${data}.json"`,
    });
  }

  if (caminho === "/api/admin/importar" && metodo === "POST") {
    const { corpo, erro } = await lerJson(request, 2_000_000);
    if (erro) return erro;
    if (corpo?.formato !== "tghservices-projetos" || !Array.isArray(corpo.projetos)) return json({ ok: false, erro: "arquivo-invalido" }, 400);
    const linhas = [];
    for (const p of corpo.projetos.slice(0, 200)) {
      const limpo = limparProjeto(p?.secao, p?.dados);
      if (limpo.erro) return json({ ok: false, erro: `item-invalido:${limpo.erro}` }, 400);
      const id = typeof p.id === "string" && /^[A-Za-z0-9-]{1,64}$/.test(p.id) ? p.id : crypto.randomUUID();
      linhas.push(db.prepare("INSERT INTO projetos (id, secao, ordem, publicado, dados) VALUES (?, ?, ?, ?, ?)").bind(id, p.secao, Number.isInteger(p.ordem) ? p.ordem : linhas.length, p.publicado === false ? 0 : 1, JSON.stringify(limpo.dados)));
    }
    const antigas = (await listarProjetos(db, { todos: true })).flatMap((p) => imagensDe(p.dados));
    await db.batch([db.prepare("DELETE FROM projetos"), ...linhas]);
    await limparImagens(env, antigas);
    return json({ ok: true, total: linhas.length });
  }

  return json({ ok: false, erro: "nao-encontrado" }, 404);
}
