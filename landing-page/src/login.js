// Login do painel /admin, sem senha: a pessoa digita o e-mail, recebe um código de
// 6 dígitos pelo Resend e, com o código certo, ganha uma sessão (cookie HttpOnly).
// Só entram os donos (ADMIN_EMAILS) e os e-mails liberados na aba Acessos. Códigos e sessões ficam no D1, só como hash.
//
//   POST /api/admin/entrar/codigo  { email }          manda o código (resposta igual para qualquer e-mail)
//   POST /api/admin/entrar         { email, codigo }  confere e cria a sessão
//   POST /api/admin/sair                              encerra a sessão
//
// Variáveis: ADMIN_EMAILS, LOGIN_DE ("Nome <login@dominio>"), SITE_NOME (opcional),
// SESSAO_DIAS (opcional, padrão 7).
// Envio do código: pelo Resend quando houver o segredo RESEND_API_KEY (LOGIN_DE num domínio
// verificado no Resend). Sem ele, usa o e-mail da Cloudflare (binding EMAIL, o mesmo do
// formulário de pedido), que só entrega para endereços verificados no Email Routing da conta.
// A prévia usa esse segundo caminho, para a chave do Resend ficar só no site oficial.

import { COR, FONTE, escaparHtml } from "./email-pedido.js";

const COOKIE = "__Host-tgh_admin";
const CODIGO_MINUTOS = 10;
const MAX_TENTATIVAS = 5;
const REENVIO_SEGUNDOS = 60;
const MAX_ENVIOS_HORA = 5;
const EMAIL_VALIDO = /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[^\s@<>()"',;:]{2,}$/;

const agora = () => Math.floor(Date.now() / 1000);
const normalizar = (e) => String(e || "").trim().toLowerCase().slice(0, 200);
// Donos: e-mails fixos em ADMIN_EMAILS. Podem entrar e gerenciar quem mais entra.
export const emailsDonos = (env) => String(env.ADMIN_EMAILS || "").toLowerCase().split(",").map((e) => e.trim()).filter(Boolean);
export const ehDono = (env, email) => emailsDonos(env).includes(normalizar(email));

// Pode entrar: dono ou e-mail liberado na aba Acessos do painel (tabela admin_usuarios).
export async function emailLiberado(env, email) {
  const e = normalizar(email);
  if (!e) return false;
  if (ehDono(env, e)) return true;
  if (!env.DB) return false;
  return !!(await env.DB.prepare("SELECT 1 AS ok FROM admin_usuarios WHERE email = ?").bind(e).first());
}

async function sha256(texto) {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto)));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function iguais(a, b) {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i++) diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferenca === 0;
}

function codigoAleatorio() {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return String(n).padStart(6, "0");
}

function tokenAleatorio() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function lerCookie(request, nome) {
  const cabecalho = request.headers.get("Cookie") || "";
  for (const parte of cabecalho.split(";")) {
    const [k, ...v] = parte.trim().split("=");
    if (k === nome) return v.join("=");
  }
  return "";
}

function json(dados, status = 200, extra = {}) {
  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  for (const [k, v] of Object.entries(extra)) headers.append(k, v);
  return new Response(JSON.stringify(dados), { status, headers });
}

// E-mail de quem está logado, ou null.
export async function sessaoAtual(request, env) {
  const url = new URL(request.url);
  // Só para `wrangler dev` na própria máquina: nunca vale num endereço público.
  if (env.ADMIN_DEV_EMAIL && (url.hostname === "localhost" || url.hostname === "127.0.0.1")) return env.ADMIN_DEV_EMAIL;
  if (!env.DB) return null;
  const token = lerCookie(request, COOKIE);
  if (!token || token.length > 100) return null;
  const linha = await env.DB.prepare("SELECT email, expira FROM admin_sessoes WHERE hash = ?").bind(await sha256(token)).first();
  if (!linha || linha.expira < agora()) return null;
  // Se o e-mail sair de ADMIN_EMAILS, a sessão deixa de valer na hora.
  return (await emailLiberado(env, linha.email)) ? linha.email : null;
}

// ---------------------------------------------------------------- e-mail do código

export function emailDoCodigo(codigo, { siteNome, siteUrl }) {
  const nome = escaparHtml(siteNome);
  const logo = `${siteUrl}/logo-tghservices.png`;
  const assunto = `${codigo} é o seu código de acesso ao painel ${siteNome}`;
  const html = `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${escaparHtml(assunto)}</title></head>
<body style="margin:0;padding:0;background:${COR.fundo}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${COR.fundo}">Use ${codigo} para entrar no painel. Vale por ${CODIGO_MINUTOS} minutos.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COR.fundo}">
<tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px">
<tr><td align="center" style="padding:8px 0 20px">
<a href="${escaparHtml(siteUrl)}" target="_blank" style="text-decoration:none"><img src="${escaparHtml(logo)}" width="160" height="80" alt="${nome}" style="display:block;width:160px;height:80px;border:0;outline:none"></a>
</td></tr>
<tr><td style="background:${COR.cartao};border-radius:28px;padding:32px 28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="padding-bottom:12px">
<span style="display:inline-block;background:${COR.tonal};color:${COR.naTonal};border-radius:8px;padding:4px 12px;font-family:${FONTE};font-size:13px;font-weight:500;line-height:20px">Painel do site</span>
</td></tr>
<tr><td style="padding-bottom:8px;font-family:${FONTE};font-size:24px;line-height:32px;font-weight:500;color:${COR.texto}">Seu código de acesso</td></tr>
<tr><td style="padding-bottom:24px;font-family:${FONTE};font-size:15px;line-height:24px;color:${COR.textoSuave}">Digite este código na tela de entrada do painel. Ele vale por ${CODIGO_MINUTOS} minutos e só pode ser usado uma vez.</td></tr>
<tr><td align="center" style="padding-bottom:24px">
<div style="display:inline-block;background:${COR.superficie};border-radius:16px;padding:16px 28px;font-family:${FONTE};font-size:36px;line-height:44px;font-weight:600;letter-spacing:10px;color:${COR.primaria}">${codigo}</div>
</td></tr>
<tr><td style="font-family:${FONTE};font-size:13px;line-height:20px;color:${COR.textoSuave}">Se não foi você que pediu, pode ignorar este e-mail: ninguém entra sem o código.</td></tr>
</table>
</td></tr>
<tr><td align="center" style="padding:20px 16px 8px;font-family:${FONTE};font-size:12px;line-height:18px;color:${COR.textoSuave}">
Enviado por <a href="${escaparHtml(siteUrl)}" target="_blank" style="color:${COR.primaria};text-decoration:none;font-weight:500">${nome}</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  const text = `Seu código de acesso ao painel ${siteNome}: ${codigo}\n\nEle vale por ${CODIGO_MINUTOS} minutos e só pode ser usado uma vez.\nSe não foi você que pediu, ignore este e-mail.`;
  return { assunto, html, text };
}

// "Nome <email@dominio>" -> { name, email }
export function separarRemetente(texto) {
  const m = String(texto || "").match(/^\s*(.*?)\s*<([^<>\s]+@[^<>\s]+)>\s*$/);
  return m ? { name: m[1] || undefined, email: m[2] } : { email: String(texto || "").trim() };
}

async function enviarPelaCloudflare(env, para, mensagem) {
  await env.EMAIL.send({ from: separarRemetente(env.LOGIN_DE), to: para, subject: mensagem.assunto, html: mensagem.html, text: mensagem.text });
}

async function enviarCodigo(env, para, mensagem) {
  if (env.RESEND_API_KEY) return enviarPeloResend(env, para, mensagem);
  return enviarPelaCloudflare(env, para, mensagem);
}

async function enviarPeloResend(env, para, mensagem) {
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.LOGIN_DE, to: [para], subject: mensagem.assunto, html: mensagem.html, text: mensagem.text }),
  });
  if (!resp.ok) throw new Error(`resend ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
}

// ---------------------------------------------------------------- rotas

async function lerCorpo(request) {
  if (!(request.headers.get("Content-Type") || "").includes("application/json")) return null;
  const bruto = await request.text();
  if (bruto.length > 2000) return null;
  try {
    return JSON.parse(bruto);
  } catch {
    return null;
  }
}

export async function rotaLogin(request, env, url, caminho) {
  if (!["/api/admin/entrar/codigo", "/api/admin/entrar", "/api/admin/sair"].includes(caminho)) return null;
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  const origem = request.headers.get("Origin");
  if (!origem || origem !== url.origin) return json({ ok: false, erro: "origem" }, 403);
  if (!env.DB) return json({ ok: false, erro: "sem-banco" }, 503);
  const db = env.DB;

  if (caminho === "/api/admin/sair") {
    const token = lerCookie(request, COOKIE);
    if (token) await db.prepare("DELETE FROM admin_sessoes WHERE hash = ?").bind(await sha256(token)).run();
    return json({ ok: true }, 200, { "Set-Cookie": `${COOKIE}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0` });
  }

  const corpo = await lerCorpo(request);
  const email = normalizar(corpo?.email);
  if (!EMAIL_VALIDO.test(email)) return json({ ok: false, erro: "email" }, 400);
  const liberado = await emailLiberado(env, email);
  const t = agora();

  if (caminho === "/api/admin/entrar/codigo") {
    const modoDev = env.LOGIN_DEV_MOSTRAR_CODIGO && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
    if (!modoDev && (!env.LOGIN_DE || (!env.RESEND_API_KEY && !env.EMAIL))) {
      console.error("login: configure LOGIN_DE e RESEND_API_KEY (ou o binding EMAIL)");
      return json({ ok: false, erro: "envio-indisponivel" }, 503);
    }
    // E-mail não liberado: mesma resposta, para não revelar quem é administrador.
    if (!liberado) return json({ ok: true });
    const anterior = await db.prepare("SELECT enviado_em, envios_hora, hora_inicio FROM admin_codigos WHERE email = ?").bind(email).first();
    if (anterior && t - anterior.enviado_em < REENVIO_SEGUNDOS) return json({ ok: false, erro: "aguarde", segundos: REENVIO_SEGUNDOS - (t - anterior.enviado_em) }, 429);
    const novaHora = !anterior || t - anterior.hora_inicio >= 3600;
    const envios = novaHora ? 1 : anterior.envios_hora + 1;
    if (envios > MAX_ENVIOS_HORA) return json({ ok: false, erro: "muitos-envios" }, 429);

    const codigo = codigoAleatorio();
    await db
      .prepare(
        `INSERT INTO admin_codigos (email, hash, expira, tentativas, enviado_em, envios_hora, hora_inicio) VALUES (?, ?, ?, 0, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET hash = excluded.hash, expira = excluded.expira, tentativas = 0, enviado_em = excluded.enviado_em, envios_hora = excluded.envios_hora, hora_inicio = excluded.hora_inicio`,
      )
      .bind(email, await sha256(email + ":" + codigo), t + CODIGO_MINUTOS * 60, t, envios, novaHora ? t : anterior.hora_inicio)
      .run();
    // Só em `wrangler dev` na própria máquina: mostra o código no terminal em vez de enviar.
    if (env.LOGIN_DEV_MOSTRAR_CODIGO && (url.hostname === "localhost" || url.hostname === "127.0.0.1")) {
      console.log(`login (dev): código de ${email}: ${codigo}`);
      return json({ ok: true });
    }
    try {
      await enviarCodigo(env, email, emailDoCodigo(codigo, { siteNome: env.SITE_NOME || "TGH Services", siteUrl: url.origin }));
    } catch (e) {
      console.error("login: falha ao enviar o código", e && e.message);
      return json({ ok: false, erro: "falha-no-envio" }, 502);
    }
    return json({ ok: true });
  }

  // /api/admin/entrar
  const codigo = String(corpo?.codigo || "").replace(/\D/g, "");
  if (codigo.length !== 6) return json({ ok: false, erro: "codigo" }, 400);
  const linha = await db.prepare("SELECT hash, expira, tentativas FROM admin_codigos WHERE email = ?").bind(email).first();
  if (!liberado || !linha || linha.expira < t) return json({ ok: false, erro: "codigo-expirado" }, 400);
  if (linha.tentativas >= MAX_TENTATIVAS) return json({ ok: false, erro: "muitas-tentativas" }, 429);
  if (!iguais(linha.hash, await sha256(email + ":" + codigo))) {
    await db.prepare("UPDATE admin_codigos SET tentativas = tentativas + 1 WHERE email = ?").bind(email).run();
    return json({ ok: false, erro: "codigo-errado", restantes: MAX_TENTATIVAS - linha.tentativas - 1 }, 400);
  }

  const dias = Math.min(30, Math.max(1, Number(env.SESSAO_DIAS) || 7));
  const token = tokenAleatorio();
  await db.batch([
    db.prepare("DELETE FROM admin_codigos WHERE email = ?").bind(email),
    db.prepare("DELETE FROM admin_sessoes WHERE expira < ?").bind(t),
    db.prepare("INSERT INTO admin_sessoes (hash, email, expira, criada_em) VALUES (?, ?, ?, ?)").bind(await sha256(token), email, t + dias * 86400, t),
  ]);
  return json({ ok: true, email }, 200, { "Set-Cookie": `${COOKIE}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${dias * 86400}` });
}
