import { test } from "node:test";
import assert from "node:assert/strict";
import { limparProjeto, urlSegura } from "../src/projetos.js";
import { emailDoCodigo, ehDono } from "../src/login.js";

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

test("e-mail do código: mostra o código e escapa o nome do site", () => {
  const m = emailDoCodigo("012345", { siteNome: "Loja <b>", siteUrl: "https://exemplo.com" });
  assert.ok(m.assunto.startsWith("012345"));
  assert.ok(m.html.includes("012345"));
  assert.ok(!m.html.includes("<b>"));
  assert.ok(m.text.includes("012345"));
});

test("donos vêm de ADMIN_EMAILS, sem diferenciar maiúsculas", () => {
  const env = { ADMIN_EMAILS: "Dono@Gmail.com, outro@x.com" };
  assert.equal(ehDono(env, "dono@gmail.com"), true);
  assert.equal(ehDono(env, "  OUTRO@x.com "), true);
  assert.equal(ehDono(env, "alguem@x.com"), false);
});
