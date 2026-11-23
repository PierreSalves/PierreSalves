import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { validarPedido, montarEmail } from "../src/index.js";

const valido = { nome: "Maria Teste", email: "maria@exemplo.com", whatsapp: "", tipoTexto: "Landing page", mensagem: "Quero uma página para a minha loja." };
const env = { PEDIDO_PARA: "dono@exemplo.com", PEDIDO_DE: "site@exemplo.com", PEDIDO_NOME: "Site" };

test("aceita um pedido completo", () => {
  const { pedido, erro } = validarPedido(valido);
  assert.equal(erro, undefined);
  assert.equal(pedido.tipo, "Landing page");
});

test("recusa e-mail inválido, nome curto e mensagem curta", () => {
  assert.equal(validarPedido({ ...valido, email: "sem-arroba" }).erro, "email");
  assert.equal(validarPedido({ ...valido, nome: "A" }).erro, "nome");
  assert.equal(validarPedido({ ...valido, mensagem: "oi" }).erro, "mensagem");
});

test("campo escondido preenchido é tratado como robô", () => {
  assert.equal(validarPedido({ ...valido, empresa_site: "x" }).robo, true);
});

test("quebras de linha não entram no assunto e o HTML é escapado", () => {
  const { pedido } = validarPedido({ ...valido, nome: "Ana\r\nBcc: x@y.com", mensagem: "<script>alert(1)</script> texto" });
  const email = montarEmail(pedido, env);
  assert.ok(!/[\r\n]/.test(email.subject));
  assert.ok(!email.html.includes("<script>"));
  assert.equal(email.to, "dono@exemplo.com");
  assert.equal(email.replyTo.email, "maria@exemplo.com");
});

function req(corpo, headers = {}) {
  return new Request("https://site.test/api/pedido", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://site.test", ...headers },
    body: JSON.stringify(corpo),
  });
}

test("POST /api/pedido envia o e-mail pelo binding", async () => {
  const enviados = [];
  const r = await worker.fetch(req(valido), { ...env, EMAIL: { send: async (m) => enviados.push(m) } });
  assert.equal(r.status, 200);
  assert.equal(enviados.length, 1);
  assert.match(enviados[0].subject, /Landing page/);
});

test("POST /api/pedido sem binding responde 503", async () => {
  const r = await worker.fetch(req(valido), env);
  assert.equal(r.status, 503);
});

test("POST /api/pedido de outra origem é recusado", async () => {
  const r = await worker.fetch(req(valido, { Origin: "https://outro.test" }), { ...env, EMAIL: { send: async () => {} } });
  assert.equal(r.status, 403);
});

test("GET /api/pedido responde 405", async () => {
  const r = await worker.fetch(new Request("https://site.test/api/pedido"), env);
  assert.equal(r.status, 405);
});
