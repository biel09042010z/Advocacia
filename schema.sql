CREATE TABLE IF NOT EXISTS areas_atuacao (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  icone TEXT,
  descricao TEXT,
  topicos TEXT[],
  ativa BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blog_artigos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  categoria TEXT,
  leitura TEXT,
  resumo TEXT,
  conteudo TEXT,
  publicado BOOLEAN DEFAULT false,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mensagens_contato (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  area TEXT,
  mensagem TEXT,
  lida BOOLEAN DEFAULT false,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipe (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  oab TEXT NOT NULL,
  especialidade TEXT,
  cargo TEXT,
  bio TEXT,
  ordem INT DEFAULT 0
);
