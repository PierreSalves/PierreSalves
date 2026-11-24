-- Cards de projetos que a página mostra (gerenciados em /admin).
-- secao: "vitrine" = cartões grandes de "Apps da TGH"; "outros" = lista "Outros projetos" do portfólio.
-- dados: JSON com os campos do cartão (os mesmos de app/site.config.js).
CREATE TABLE IF NOT EXISTS projetos (
  id TEXT PRIMARY KEY,
  secao TEXT NOT NULL CHECK (secao IN ('vitrine', 'outros')),
  ordem INTEGER NOT NULL DEFAULT 0,
  publicado INTEGER NOT NULL DEFAULT 1 CHECK (publicado IN (0, 1)),
  dados TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  atualizado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS projetos_secao_ordem ON projetos (secao, ordem);
