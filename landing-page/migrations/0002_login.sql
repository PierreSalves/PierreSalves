-- Login do painel /admin: código de uso único enviado por e-mail e sessões.
-- Só guardamos o hash (SHA-256) do código e do token da sessão, nunca o valor.
CREATE TABLE IF NOT EXISTS admin_codigos (
  email TEXT PRIMARY KEY,
  hash TEXT NOT NULL,
  expira INTEGER NOT NULL,      -- epoch em segundos
  tentativas INTEGER NOT NULL DEFAULT 0,
  enviado_em INTEGER NOT NULL,  -- para limitar reenvios
  envios_hora INTEGER NOT NULL DEFAULT 1,
  hora_inicio INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS admin_sessoes (
  hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expira INTEGER NOT NULL,
  criada_em INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_sessoes_expira ON admin_sessoes (expira);
-- E-mails liberados pelo painel (aba Acessos). Os donos ficam em ADMIN_EMAILS e não saem daqui.
CREATE TABLE IF NOT EXISTS admin_usuarios (
  email TEXT PRIMARY KEY,
  criado_em INTEGER NOT NULL,
  criado_por TEXT NOT NULL
);
