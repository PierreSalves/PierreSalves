import { test } from "node:test";
import assert from "node:assert/strict";
import { limparProjeto, urlSegura, verificarAcesso } from "../src/projetos.js";

test("card da vitrine: limpa campos e exige nome", () => {
  assert.equal(limparProjeto("vitrine", { nome: "  " }).erro, "nome");
  const { dados } = limparProjeto("vitrine", {
    nome: "App",
    extra: "some",
    telas: [{ imagem: "/midia/projetos/a.webp", legenda: "A" }, { imagem: "https://fora.com/x.png" }, { imagem: "/img/../x" }],
    links: [{ texto: "Abrir", url: "javascript:alert(1)" }, { texto: "Ok", url: "https://exemplo.com" }],
    tecnologias: ["React", "React", ""],
  });
  assert.equal(dados.extra, undefined);
  assert.deepEqual(dados.telas, [{ imagem: "/midia/projetos/a.webp", legenda: "A" }]);
  assert.deepEqual(dados.links, [{ texto: "Ok", url: "https://exemplo.com", icone: "", }]);
  assert.deepEqual(dados.tecnologias, ["React"]);
  assert.deepEqual(dados.status, { texto: "No ar", icone: "ok" });
});

test("outros projetos: exige nome e link válido", () => {
  assert.equal(limparProjeto("outros", { nome: "X", url: "ftp://a" }).erro, "url");
  assert.equal(limparProjeto("nada", { nome: "X" }).erro, "secao");
  assert.ok(limparProjeto("outros", { nome: "X", url: "https://github.com/x" }).dados);
});

test("urlSegura só aceita http(s) e caminhos locais", () => {
  assert.equal(urlSegura("//evil.com"), "");
  assert.equal(urlSegura("data:text/html,x"), "");
  assert.equal(urlSegura("/curriculo"), "/curriculo");
});

// Token do Access assinado com uma chave gerada aqui.
async function montar(corpo) {
  const { privateKey, publicKey } = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
  const jwk = { ...(await crypto.subtle.exportKey("jwk", publicKey)), kid: "k1" };
  const b64 = (x) => Buffer.from(x).toString("base64url");
  const cab = b64(JSON.stringify({ alg: "RS256", kid: "k1" }));
  const cor = b64(JSON.stringify(corpo));
  const sig = b64(new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(cab + "." + cor))));
  return { token: `${cab}.${cor}.${sig}`, chaves: async () => [jwk] };
}
const env = { ACCESS_TEAM_DOMAIN: "time.cloudflareaccess.com", ACCESS_AUD: "aud123", ADMIN_EMAILS: "tghservices.psa@gmail.com" };
const agora = () => Math.floor(Date.now() / 1000);
const req = (token, host = "tghservices.com.br") => new Request(`https://${host}/api/admin/eu`, { headers: token ? { "Cf-Access-Jwt-Assertion": token } : {} });

test("Access: aceita só o e-mail liberado, com aud, emissor e validade certos", async () => {
  const base = { aud: ["aud123"], iss: "https://time.cloudflareaccess.com", exp: agora() + 600, email: "TGHservices.psa@gmail.com" };
  let t = await montar(base);
  assert.equal(await verificarAcesso(req(t.token), env, t.chaves), "tghservices.psa@gmail.com");
  t = await montar({ ...base, email: "outro@gmail.com" });
  assert.equal(await verificarAcesso(req(t.token), env, t.chaves), null);
  t = await montar({ ...base, aud: ["outro"] });
  assert.equal(await verificarAcesso(req(t.token), env, t.chaves), null);
  t = await montar({ ...base, exp: agora() - 10 });
  assert.equal(await verificarAcesso(req(t.token), env, t.chaves), null);
  t = await montar({ ...base, iss: "https://falso.cloudflareaccess.com" });
  assert.equal(await verificarAcesso(req(t.token), env, t.chaves), null);
  // Assinatura de outra chave
  const outro = await montar(base);
  assert.equal(await verificarAcesso(req(outro.token), env, t.chaves), null);
});

test("Access: sem token, sem configuração, ou atalho de dev fora do localhost, ninguém entra", async () => {
  assert.equal(await verificarAcesso(req(null), env, async () => []), null);
  const t = await montar({ aud: ["aud123"], iss: "https://time.cloudflareaccess.com", exp: agora() + 600, email: "tghservices.psa@gmail.com" });
  assert.equal(await verificarAcesso(req(t.token), { ...env, ACCESS_AUD: "" }, t.chaves), null);
  assert.equal(await verificarAcesso(req(null), { ADMIN_DEV_EMAIL: "x@y.com" }), null);
  assert.equal(await verificarAcesso(req(null, "localhost"), { ADMIN_DEV_EMAIL: "x@y.com" }), "x@y.com");
});
