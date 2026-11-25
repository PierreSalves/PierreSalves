-- Configuração da página (aparência, seções, textos), editada em /admin.
-- chave "rascunho": o que está sendo editado; chave "publicado": o que o site mostra.
-- Prévia e site oficial usam o mesmo banco, por isso nada aparece no site antes de "Publicar".
CREATE TABLE IF NOT EXISTS site_config (
  chave TEXT PRIMARY KEY CHECK (chave IN ('rascunho', 'publicado')),
  dados TEXT NOT NULL,
  atualizado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  atualizado_por TEXT NOT NULL DEFAULT ''
);
-- Cada publicação fica guardada (as 30 últimas) para poder voltar a ela.
CREATE TABLE IF NOT EXISTS site_config_historico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dados TEXT NOT NULL,
  publicado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  publicado_por TEXT NOT NULL DEFAULT ''
);
-- Contadores simples, por exemplo consultas de avaliações do Google no mês ("avaliacoes:2026-11").
CREATE TABLE IF NOT EXISTS contadores (
  chave TEXT PRIMARY KEY,
  valor INTEGER NOT NULL DEFAULT 0
);
