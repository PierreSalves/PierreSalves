import { test } from "node:test";
import assert from "node:assert/strict";
import { limparConfig, aplicarLayout, urlMapa, TIPOS_SECAO, LAYOUTS } from "../app/config/esquema.js";
import padrao from "../app/site.config.js";
import { prepararConfig, formatarAvaliacoes } from "../src/config.js";

test("sem nada, devolve o padrão completo com todas as seções", () => {
  const c = limparConfig(undefined);
  assert.equal(c.marca.nome, padrao.marca.nome);
  assert.deepEqual(c.secoes.map((s) => s.tipo), padrao.secoes.map((s) => s.tipo));
  assert.equal(c.projetosIniciais, undefined);
  assert.equal(limparConfig(c).secoes.length, Object.keys(TIPOS_SECAO).length);
});

test("descarta campos desconhecidos, links perigosos e cores inválidas", () => {
  const c = limparConfig({
    extra: 1,
    tema: { corPrincipal: "red", estilo: "inventado", ajustes: { claro: { primary: "#112233", hack: "#000000" }, escuro: { surface: "azul" } } },
    secoes: [{ tipo: "abertura", variante: "nao-existe", dados: { botaoPrincipal: { alvo: "javascript:alert(1)" }, navegador: { imagem: "https://fora.com/a.png" } } }],
  });
  assert.equal(c.extra, undefined);
  assert.equal(c.tema.corPrincipal, padrao.tema.corPrincipal);
  assert.equal(c.tema.estilo, "tonalSpot");
  assert.deepEqual(c.tema.ajustes, { claro: { primary: "#112233" }, escuro: {} });
  const ab = c.secoes[0];
  assert.equal(ab.variante, "dispositivos");
  assert.equal(ab.dados.botaoPrincipal.alvo, "");
  assert.equal(ab.dados.navegador.imagem, "");
});

test("seções: uma de cada, na ordem recebida, e as que faltam entram escondidas", () => {
  const c = limparConfig({ secoes: [{ tipo: "contato", visivel: true }, { tipo: "contato" }, { tipo: "xyz" }, { tipo: "abertura", visivel: true }] });
  assert.deepEqual(c.secoes.slice(0, 2).map((s) => s.tipo), ["contato", "abertura"]);
  assert.equal(c.secoes.length, Object.keys(TIPOS_SECAO).length);
  assert.ok(c.secoes.slice(2).every((s) => !s.visivel));
});

test("âncoras repetidas ganham sufixo", () => {
  const c = limparConfig({ secoes: [{ tipo: "abertura", ancora: "x" }, { tipo: "contato", ancora: "x" }] });
  assert.equal(c.secoes[0].ancora, "x");
  assert.equal(c.secoes[1].ancora, "x-2");
});

test("aplicar layout muda ordem, visibilidade e variação, sem mexer nos textos", () => {
  const base = limparConfig(undefined);
  const c = aplicarLayout(base, "negocioLocal");
  const layout = LAYOUTS.find((l) => l.id === "negocioLocal");
  assert.deepEqual(c.secoes.slice(0, layout.secoes.length).map((s) => [s.tipo, s.variante]), layout.secoes);
  assert.ok(c.secoes.slice(layout.secoes.length).every((s) => !s.visivel));
  assert.equal(c.secoes[0].dados.titulo, base.secoes[0].dados.titulo);
});

test("mapa: aceita o link ou o iframe colado do Google Maps, e nada mais", () => {
  const link = "https://www.google.com/maps/embed?pb=!1m18!1m12";
  assert.equal(urlMapa(link), link);
  assert.equal(urlMapa(`<iframe src="${link}" width="600"></iframe>`), link);
  assert.equal(urlMapa("https://evil.com/maps/embed?pb=1"), "");
  assert.equal(urlMapa("javascript:alert(1)"), "");
});

test("prepararConfig recusa o que não é objeto", () => {
  assert.equal(prepararConfig(null).erro, "dados");
  assert.equal(prepararConfig([]).erro, "dados");
  assert.ok(prepararConfig({}).texto);
});

test("avaliações do Google: só os campos usados, com links seguros", () => {
  const r = formatarAvaliacoes(
    {
      rating: 4.7,
      userRatingCount: 120,
      googleMapsUri: "https://maps.google.com/?cid=1",
      reviews: [
        { rating: 5, text: { text: "Ótimo" }, relativePublishTimeDescription: "há 2 semanas", googleMapsUri: "https://www.google.com/maps/reviews/x", authorAttribution: { displayName: "Ana", uri: "https://www.google.com/maps/contrib/1", photoUri: "https://lh3.googleusercontent.com/a/x" } },
        { rating: 9, authorAttribution: { photoUri: "javascript:x" } },
      ],
    },
    "ChIJ1234567890",
  );
  assert.equal(r.nota, 4.7);
  assert.equal(r.avaliacoes[0].autor, "Ana");
  assert.equal(r.avaliacoes[1].nota, 5);
  assert.equal(r.avaliacoes[1].foto, "");
  assert.equal(r.avaliacoes[1].autor, "Usuário do Google");
});
