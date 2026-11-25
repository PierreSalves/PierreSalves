// Configuração da página guardada no D1 (tabelas em migrations/0003_config.sql).
//
// Admin (com sessão do painel; a rota chega aqui por src/projetos.js > rotaAdmin):
//   GET  /api/admin/config             rascunho, publicado e lista do histórico
//   PUT  /api/admin/config             { config } salva o rascunho (validado)
//   POST /api/admin/config/publicar    o rascunho vira o que o site mostra
//   POST /api/admin/config/descartar   o rascunho volta a ser igual ao publicado
//   POST /api/admin/config/restaurar   { id } põe uma publicação antiga no rascunho
// Público:
//   GET  /api/avaliacoes               nota e avaliações do Google do negócio (ver abaixo)

import { limparConfig, secaoDo, FORMATO_BACKUP } from "../app/config/esquema.js";

const MAX_CONFIG = 300_000;
const MAX_HISTORICO = 30;

function json(dados, status = 200, extra = {}) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extra },
  });
}

// Lê "rascunho" ou "publicado". Devolve a configuração limpa ou null (sem linha, sem tabela).
export async function lerConfig(db, chave) {
  if (!db) return null;
  try {
    const linha = await db.prepare("SELECT dados, atualizado_em, atualizado_por FROM site_config WHERE chave = ?").bind(chave).first();
    if (!linha) return null;
    return { config: limparConfig(JSON.parse(linha.dados)), atualizado_em: linha.atualizado_em, atualizado_por: linha.atualizado_por };
  } catch (e) {
    console.error("config: falha ao ler", chave, e && e.message);
    return null;
  }
}

// Configuração que a página mostra: a publicada, ou o rascunho na prévia do painel.
export async function configDaPagina(db, { rascunho = false } = {}) {
  if (rascunho) {
    const r = await lerConfig(db, "rascunho");
    if (r) return r.config;
  }
  return (await lerConfig(db, "publicado"))?.config || null;
}

const salvarLinha = (db, chave, dados, email) =>
  db
    .prepare(
      "INSERT INTO site_config (chave, dados, atualizado_em, atualizado_por) VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), ?) " +
        "ON CONFLICT(chave) DO UPDATE SET dados = excluded.dados, atualizado_em = excluded.atualizado_em, atualizado_por = excluded.atualizado_por",
    )
    .bind(chave, dados, email);

async function listarHistorico(db) {
  const { results } = await db.prepare("SELECT id, publicado_em, publicado_por FROM site_config_historico ORDER BY id DESC LIMIT ?").bind(MAX_HISTORICO).all();
  return results;
}

// Validação para gravar: limpa e confere o tamanho. Devolve { texto } ou { erro }.
export function prepararConfig(bruto) {
  if (!bruto || typeof bruto !== "object" || Array.isArray(bruto)) return { erro: "dados" };
  const texto = JSON.stringify(limparConfig(bruto));
  if (texto.length > MAX_CONFIG) return { erro: "grande-demais" };
  return { texto };
}

// Partes do backup (src/projetos.js monta o arquivo com os projetos).
export async function configParaBackup(db) {
  const [rascunho, publicado] = await Promise.all([lerConfig(db, "rascunho"), lerConfig(db, "publicado")]);
  return { rascunho: rascunho?.config || null, publicado: publicado?.config || null };
}
export function linhasRestaurarConfig(db, config, email) {
  const linhas = [];
  for (const chave of ["rascunho", "publicado"]) {
    if (!config?.[chave]) continue;
    const { texto, erro } = prepararConfig(config[chave]);
    if (erro) return { erro: `config-invalida:${erro}` };
    linhas.push(salvarLinha(db, chave, texto, email));
  }
  return { linhas };
}
export { FORMATO_BACKUP };

export async function rotaConfigAdmin(request, env, caminho, metodo, email, lerJson) {
  const db = env.DB;

  if (caminho === "/api/admin/config") {
    if (metodo === "GET") {
      const [rascunho, publicado, historico] = await Promise.all([lerConfig(db, "rascunho"), lerConfig(db, "publicado"), listarHistorico(db)]);
      return json({ ok: true, rascunho, publicado, historico, chaveGoogle: !!env.GOOGLE_PLACES_KEY });
    }
    if (metodo === "PUT") {
      const { corpo, erro } = await lerJson(request, MAX_CONFIG * 2);
      if (erro) return erro;
      const pronto = prepararConfig(corpo?.config);
      if (pronto.erro) return json({ ok: false, erro: pronto.erro }, 400);
      await salvarLinha(db, "rascunho", pronto.texto, email).run();
      return json({ ok: true, config: JSON.parse(pronto.texto), atualizado_em: new Date().toISOString() });
    }
    return new Response(null, { status: 405, headers: { Allow: "GET, PUT" } });
  }

  if (metodo !== "POST") return null;

  if (caminho === "/api/admin/config/publicar") {
    const rascunho = await db.prepare("SELECT dados FROM site_config WHERE chave = 'rascunho'").first();
    if (!rascunho) return json({ ok: false, erro: "nada-para-publicar" }, 400);
    const dados = JSON.stringify(limparConfig(JSON.parse(rascunho.dados)));
    await db.batch([
      salvarLinha(db, "publicado", dados, email),
      db.prepare("INSERT INTO site_config_historico (dados, publicado_por) VALUES (?, ?)").bind(dados, email),
      db.prepare("DELETE FROM site_config_historico WHERE id NOT IN (SELECT id FROM site_config_historico ORDER BY id DESC LIMIT ?)").bind(MAX_HISTORICO),
    ]);
    return json({ ok: true, historico: await listarHistorico(db) });
  }

  if (caminho === "/api/admin/config/descartar") {
    const publicado = await db.prepare("SELECT dados FROM site_config WHERE chave = 'publicado'").first();
    if (publicado) await salvarLinha(db, "rascunho", publicado.dados, email).run();
    else await db.prepare("DELETE FROM site_config WHERE chave = 'rascunho'").run();
    return json({ ok: true, rascunho: (await lerConfig(db, "rascunho"))?.config || null });
  }

  if (caminho === "/api/admin/config/restaurar") {
    const { corpo, erro } = await lerJson(request);
    if (erro) return erro;
    const id = Number(corpo?.id);
    if (!Number.isInteger(id)) return json({ ok: false, erro: "dados" }, 400);
    const versao = await db.prepare("SELECT dados FROM site_config_historico WHERE id = ?").bind(id).first();
    if (!versao) return json({ ok: false, erro: "nao-encontrado" }, 404);
    const dados = JSON.stringify(limparConfig(JSON.parse(versao.dados)));
    await salvarLinha(db, "rascunho", dados, email).run();
    return json({ ok: true, config: JSON.parse(dados) });
  }

  return null;
}

// ---------------------------------------------------------------- avaliações do Google
//
// Usa a API de Places (New) > Place Details com o campo `reviews` (SKU "Enterprise +
// Atmosphere": 1.000 consultas grátis por mês na tabela de preços do Google em 2026-11).
// A chave fica no segredo GOOGLE_PLACES_KEY do Worker. As regras do Google não deixam
// guardar avaliações, então cada visita que chega à seção faz uma consulta; o contador
// mensal no D1 (tabela contadores) para as consultas no limite configurado na seção.

const PLACE_ID = /^[A-Za-z0-9_-]{10,300}$/;
export const linkDoLugar = (placeId) => `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`;

// Converte a resposta do Google no formato que a página usa.
export function formatarAvaliacoes(lugar, placeId) {
  const avaliacoes = (Array.isArray(lugar?.reviews) ? lugar.reviews : []).slice(0, 5).map((r) => ({
    autor: String(r.authorAttribution?.displayName || "Usuário do Google").slice(0, 80),
    linkAutor: /^https:\/\//.test(r.authorAttribution?.uri || "") ? r.authorAttribution.uri : "",
    foto: /^https:\/\/lh3\.googleusercontent\.com\//.test(r.authorAttribution?.photoUri || "") ? r.authorAttribution.photoUri : "",
    nota: Math.max(0, Math.min(5, Number(r.rating) || 0)),
    texto: String(r.text?.text || r.originalText?.text || "").slice(0, 2000),
    quando: String(r.relativePublishTimeDescription || "").slice(0, 60),
    link: /^https:\/\//.test(r.googleMapsUri || "") ? r.googleMapsUri : "",
  }));
  return {
    ok: true,
    nota: Number(lugar?.rating) || 0,
    total: Number(lugar?.userRatingCount) || 0,
    link: /^https:\/\//.test(lugar?.googleMapsUri || "") ? lugar.googleMapsUri : linkDoLugar(placeId),
    avaliacoes,
  };
}

export async function rotaAvaliacoes(request, env, url, sessaoAtual) {
  if (request.method !== "GET") return new Response(null, { status: 405, headers: { Allow: "GET" } });
  let placeId = "";
  let limite = 900;
  // Prévia do painel: usa o Place ID do rascunho, só com sessão.
  if (url.searchParams.has("rascunho") && (await sessaoAtual(request, env))) {
    placeId = url.searchParams.get("placeId") || "";
    const r = await configDaPagina(env.DB, { rascunho: true });
    if (r) limite = secaoDo(r, "avaliacoes")?.dados.limiteMensal ?? limite;
  } else {
    const config = await configDaPagina(env.DB);
    const secao = config && secaoDo(config, "avaliacoes");
    if (!secao?.visivel) return json({ ok: false, erro: "desligado" }, 404);
    placeId = secao.dados.placeId;
    limite = secao.dados.limiteMensal;
  }
  if (!PLACE_ID.test(placeId)) return json({ ok: false, erro: "sem-place-id" }, 400);
  const link = linkDoLugar(placeId);
  if (!env.GOOGLE_PLACES_KEY) return json({ ok: false, erro: "sem-chave", link });

  const mes = new Date().toISOString().slice(0, 7);
  try {
    const { valor } = await env.DB.prepare(
      "INSERT INTO contadores (chave, valor) VALUES (?, 1) ON CONFLICT(chave) DO UPDATE SET valor = valor + 1 RETURNING valor",
    )
      .bind(`avaliacoes:${mes}`)
      .first();
    if (valor > limite) return json({ ok: false, erro: "limite", link });
  } catch (e) {
    console.error("avaliacoes: contador falhou", e && e.message);
    return json({ ok: false, erro: "contador", link });
  }

  let resp;
  try {
    resp = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pt-BR&regionCode=BR`, {
      headers: { "X-Goog-Api-Key": env.GOOGLE_PLACES_KEY, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
    });
  } catch (e) {
    console.error("avaliacoes: rede", e && e.message);
    return json({ ok: false, erro: "google", link });
  }
  if (!resp.ok) {
    console.error("avaliacoes: Google respondeu", resp.status, (await resp.text()).slice(0, 300));
    return json({ ok: false, erro: "google", link });
  }
  return json(formatarAvaliacoes(await resp.json(), placeId));
}
