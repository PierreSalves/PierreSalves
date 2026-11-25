// Forma da configuração da página (o que o painel /admin edita e o D1 guarda).
// Sem React: é usado pela página, pelo painel e pelo Worker (que valida tudo o que chega).
//
// - TIPOS_SECAO: as seções que existem e as variações de desenho de cada uma.
// - LAYOUTS: modelos prontos de página (ordem + seções ligadas + variações).
// - limparConfig(bruto): devolve uma configuração completa e segura. Campo que falta
//   vem do padrão (app/site.config.js); campo desconhecido é descartado; texto é cortado
//   no tamanho máximo; link, imagem, cor e ícone são conferidos.

import padrao from "../site.config.js";

export const TIPOS_SECAO = {
  abertura: {
    nome: "Abertura",
    descricao: "Primeira coisa que aparece: título, texto e botões.",
    icone: "site",
    variantes: [
      { id: "dispositivos", nome: "Com navegador e celular", descricao: "Texto à esquerda e duas telas do produto à direita." },
      { id: "imagem", nome: "Com uma imagem", descricao: "Texto à esquerda e uma imagem grande com cantos arredondados." },
      { id: "centralizada", nome: "Centralizada", descricao: "Só texto e botões, no meio da página." },
    ],
  },
  vitrine: {
    nome: "Vitrine",
    descricao: "Cartões grandes dos projetos (aba Projetos > Vitrine).",
    icone: "apps",
    variantes: [
      { id: "carrossel", nome: "Carrossel", descricao: "Cartões lado a lado, com setas para passar." },
      { id: "grade", nome: "Grade", descricao: "Todos os cartões visíveis, em colunas." },
    ],
  },
  diferenciais: {
    nome: "Diferenciais",
    descricao: "Título, texto e uma lista curta de vantagens com ícone.",
    icone: "ideia",
    variantes: [
      { id: "destaque", nome: "Bloco colorido", descricao: "Fundo na cor do tema, chama atenção." },
      { id: "simples", nome: "Simples", descricao: "Sem fundo, com os itens em cartões." },
    ],
  },
  servicos: {
    nome: "Serviços",
    descricao: "Planos ou serviços, cada um com botão de pedido.",
    icone: "loja",
    variantes: [
      { id: "cartoes", nome: "Cartões", descricao: "Um cartão por serviço, lado a lado." },
      { id: "lista", nome: "Lista", descricao: "Um serviço por linha, com o botão à direita." },
    ],
  },
  portfolio: {
    nome: "Sobre / portfólio",
    descricao: "Quem está por trás do negócio e a lista de outros projetos.",
    icone: "pessoas",
    variantes: [
      { id: "duasColunas", nome: "Duas colunas", descricao: "Pessoa de um lado, lista de projetos do outro." },
      { id: "empilhado", nome: "Empilhado", descricao: "Pessoa em cima, ocupando a largura, e a lista embaixo." },
    ],
  },
  localizacao: {
    nome: "Localização",
    descricao: "Mapa ou Street View do Google com endereço e horários.",
    icone: "explorar",
    variantes: [
      { id: "mapaETexto", nome: "Mapa e texto", descricao: "Endereço e horários de um lado, mapa do outro." },
      { id: "mapaLargo", nome: "Mapa largo", descricao: "Mapa ocupando a largura, com o endereço por cima." },
    ],
  },
  avaliacoes: {
    nome: "Avaliações do Google",
    descricao: "Nota e até 5 avaliações reais do Google Maps.",
    icone: "medalha",
    variantes: [
      { id: "cartoes", nome: "Cartões", descricao: "Avaliações em cartões, em colunas." },
      { id: "lista", nome: "Lista", descricao: "Nota grande à esquerda e as avaliações em lista." },
    ],
  },
  contato: {
    nome: "Contato",
    descricao: "Chamada final com o botão de pedido.",
    icone: "email",
    variantes: [
      { id: "faixa", nome: "Faixa", descricao: "Título e botão na mesma linha." },
      { id: "centralizado", nome: "Centralizado", descricao: "Título e botão no meio, com mais respiro." },
    ],
  },
};

// Layouts prontos. Seções que não aparecem na lista ficam desligadas, no fim.
export const LAYOUTS = [
  {
    id: "vitrine",
    nome: "Vitrine de apps",
    descricao: "Mostra os produtos primeiro. É o layout atual da TGH.",
    secoes: [
      ["abertura", "dispositivos"],
      ["vitrine", "carrossel"],
      ["diferenciais", "destaque"],
      ["servicos", "cartoes"],
      ["portfolio", "duasColunas"],
      ["contato", "faixa"],
    ],
  },
  {
    id: "servicos",
    nome: "Serviços primeiro",
    descricao: "Para quem vende serviços: o que oferece, por que escolher e exemplos.",
    secoes: [
      ["abertura", "centralizada"],
      ["servicos", "cartoes"],
      ["diferenciais", "simples"],
      ["vitrine", "grade"],
      ["avaliacoes", "cartoes"],
      ["contato", "centralizado"],
    ],
  },
  {
    id: "negocioLocal",
    nome: "Negócio local",
    descricao: "Loja, clínica, academia: serviços, avaliações do Google e mapa.",
    secoes: [
      ["abertura", "imagem"],
      ["diferenciais", "destaque"],
      ["servicos", "lista"],
      ["avaliacoes", "lista"],
      ["localizacao", "mapaETexto"],
      ["contato", "faixa"],
    ],
  },
  {
    id: "pessoal",
    nome: "Portfólio pessoal",
    descricao: "Foco na pessoa: apresentação, trabalhos e contato.",
    secoes: [
      ["abertura", "centralizada"],
      ["portfolio", "empilhado"],
      ["vitrine", "grade"],
      ["contato", "centralizado"],
    ],
  },
  {
    id: "simples",
    nome: "Página simples",
    descricao: "Só o essencial: abertura, diferenciais e contato.",
    secoes: [
      ["abertura", "imagem"],
      ["diferenciais", "simples"],
      ["contato", "centralizado"],
    ],
  },
];

// Estilos do algoritmo de cores do Material 3 (Variant da material-color-utilities).
export const ESTILOS = [
  { id: "tonalSpot", nome: "Equilibrado", descricao: "O padrão do Material 3. Cores calmas, derivadas da principal." },
  { id: "fidelity", nome: "Fiel à cor", descricao: "Mantém a cor principal o mais parecida possível com a escolhida." },
  { id: "vibrant", nome: "Vibrante", descricao: "Cores mais saturadas." },
  { id: "expressive", nome: "Expressivo", descricao: "Mistura tons diferentes, mais ousado." },
  { id: "neutral", nome: "Neutro", descricao: "Quase cinza, com um toque da cor." },
  { id: "monochrome", nome: "Monocromático", descricao: "Preto, branco e cinzas." },
];

export const CANTOS = [
  { id: "arredondado", nome: "Arredondados", base: 4 },
  { id: "suave", nome: "Suaves", base: 2.5 },
  { id: "reto", nome: "Retos", base: 1 },
];

export const MODOS = [
  { id: "system", nome: "Igual ao aparelho" },
  { id: "light", nome: "Claro" },
  { id: "dark", nome: "Escuro" },
];

// Papéis de cor do Material 3 que podem ser ajustados à mão, em pares (cor, texto em cima).
export const PAPEIS = [
  { grupo: "Principal", papeis: ["primary", "onPrimary", "primaryContainer", "onPrimaryContainer"] },
  { grupo: "Secundária", papeis: ["secondary", "onSecondary", "secondaryContainer", "onSecondaryContainer"] },
  { grupo: "Terciária", papeis: ["tertiary", "onTertiary", "tertiaryContainer", "onTertiaryContainer"] },
  {
    grupo: "Fundos e textos",
    papeis: ["surface", "surfaceContainerLow", "surfaceContainer", "surfaceContainerHigh", "surfaceContainerHighest", "onSurface", "onSurfaceVariant", "outline", "outlineVariant"],
  },
];
export const NOMES_PAPEIS = {
  primary: "Principal",
  onPrimary: "Texto sobre a principal",
  primaryContainer: "Fundo principal suave",
  onPrimaryContainer: "Texto sobre o fundo principal",
  secondary: "Secundária",
  onSecondary: "Texto sobre a secundária",
  secondaryContainer: "Fundo secundário (botões tonais)",
  onSecondaryContainer: "Texto sobre o fundo secundário",
  tertiary: "Terciária",
  onTertiary: "Texto sobre a terciária",
  tertiaryContainer: "Fundo terciário (selos)",
  onTertiaryContainer: "Texto sobre o fundo terciário",
  surface: "Fundo da página",
  surfaceContainerLow: "Cartões",
  surfaceContainer: "Cartões em destaque",
  surfaceContainerHigh: "Blocos elevados",
  surfaceContainerHighest: "Chips e detalhes",
  onSurface: "Texto principal",
  onSurfaceVariant: "Texto secundário",
  outline: "Contornos",
  outlineVariant: "Divisórias",
};
const TODOS_PAPEIS = new Set(PAPEIS.flatMap((g) => g.papeis));

// ---------------------------------------------------------------- limpeza de valores

const tirarControles = (s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
export const texto = (v, max = 200) => (typeof v === "string" ? tirarControles(v).replace(/\s+/g, " ").trim().slice(0, max) : "");
export const textoLongo = (v, max = 1200) => (typeof v === "string" ? tirarControles(v).trim().slice(0, max) : "");
export const nomeIcone = (v) => (typeof v === "string" && /^[a-zA-Z]{1,30}$/.test(v) ? v : "");
export const corHex = (v) => (typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v.trim()) ? v.trim().toUpperCase() : "");

// Links: só http(s), mailto, tel ou caminho/âncora do próprio site. Nada de javascript:, data: etc.
export function urlSegura(v) {
  const u = texto(v, 500);
  if (/^https?:\/\/[^\s"<>]+$/i.test(u)) return u;
  if (/^\/(?!\/)[^\s"<>]*$/.test(u)) return u;
  if (/^#[A-Za-z0-9_-]{1,60}$/.test(u)) return u;
  if (/^mailto:[^\s"<>]+@[^\s"<>]+$/i.test(u)) return u;
  if (/^tel:\+?[0-9 ()-]{3,30}$/i.test(u)) return u;
  return "";
}
// Imagens: só do próprio site (/img/ do build, /midia/ do R2 ou o logo), por causa da CSP.
export function urlImagem(v) {
  const u = texto(v, 300);
  if (u.includes("..")) return "";
  return /^\/(img|midia)\/[A-Za-z0-9._\/-]+$/.test(u) || /^\/[A-Za-z0-9._-]+\.(png|webp|jpg|jpeg|svg|avif)$/i.test(u) ? u : "";
}
// Mapa do Google: aceita o link de "Incorporar um mapa" ou o <iframe> inteiro colado.
export function urlMapa(v) {
  let u = typeof v === "string" ? v.trim() : "";
  const src = u.match(/src\s*=\s*["']([^"']+)["']/i);
  if (src) u = src[1];
  u = u.replace(/&amp;/g, "&").slice(0, 2000);
  return /^https:\/\/www\.google\.com\/maps\/embed(\/v1\/[a-z]+)?\?[^\s"'<>]+$/.test(u) ? u : "";
}
export const slug = (v, max = 40) =>
  texto(v, 80)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max);

// Regras por nome de campo (strings).
const REGRAS_TEXTO = {
  url: urlSegura,
  alvo: urlSegura,
  linkRota: urlSegura,
  imagem: urlImagem,
  logo: urlImagem,
  foto: urlImagem,
  mapa: urlMapa,
  icone: nomeIcone,
  corPrincipal: corHex,
  corSecundaria: corHex,
  corTerciaria: corHex,
  logoFundoNoEscuro: corHex,
  tipo: (v) => slug(v, 30),
  id: (v) => slug(v, 30),
  ancora: (v) => slug(v, 40),
  placeId: (v) => (typeof v === "string" && /^[A-Za-z0-9_-]{10,300}$/.test(v.trim()) ? v.trim() : ""),
  email: (v) => {
    const e = texto(v, 200);
    return /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[^\s@<>()"',;:]{2,}$/.test(e) ? e : "";
  },
  iniciais: (v) => texto(v, 3),
  preco: (v) => texto(v, 40),
};
const LONGOS = new Set(["texto", "bio", "resumo", "descricao", "sucesso", "erro", "ajudaMensagem", "endereco"]);
// Campos com lista fechada de valores.
const ENUMS = {
  estilo: ESTILOS.map((e) => e.id),
  cantos: CANTOS.map((c) => c.id),
  modoPadrao: MODOS.map((m) => m.id),
  layout: ["", ...LAYOUTS.map((l) => l.id)],
};
const NUMEROS = {
  contraste: [-1, 1, false],
  limiteMensal: [0, 100000, true],
  largura: [1, 10000, true],
  altura: [1, 10000, true],
  versao: [1, 1000, true],
};
// Máximo de itens por lista e o modelo de cada item.
const LISTAS = {
  tiposDePedido: [12, { id: "", texto: "" }],
  chips: [6, { icone: "", texto: "" }],
  itens: [12, null], // diferenciais: objetos; planos: textos (decidido pelo padrão)
  planos: [6, { icone: "", nome: "", resumo: "", preco: "", itens: [""], botao: { texto: "", tipo: "" }, destaque: false }],
  tags: [16, ""],
  links: [6, { texto: "", url: "", icone: "", principal: false }],
  horarios: [8, { dias: "", horas: "" }],
};
const MODELO_ITEM_DIFERENCIAL = { icone: "", titulo: "", texto: "" };

function limparValor(modelo, valor, chave) {
  if (typeof modelo === "string") {
    if (valor === undefined || valor === null) return modelo;
    if (ENUMS[chave]) return ENUMS[chave].includes(valor) ? valor : modelo;
    const regra = REGRAS_TEXTO[chave];
    if (regra) return regra(valor);
    return LONGOS.has(chave) ? textoLongo(valor) : texto(valor, chave === "titulo" ? 240 : 200);
  }
  if (typeof modelo === "number") {
    const n = Number(valor);
    if (valor === undefined || valor === null || valor === "" || !Number.isFinite(n)) return modelo;
    const [min, max, inteiro] = NUMEROS[chave] || [-1e6, 1e6, false];
    const limitado = Math.min(max, Math.max(min, n));
    return inteiro ? Math.round(limitado) : limitado;
  }
  if (typeof modelo === "boolean") return typeof valor === "boolean" ? valor : modelo;
  if (Array.isArray(modelo)) {
    if (!Array.isArray(valor)) return modelo;
    const [max, molde] = LISTAS[chave] || [20, null];
    let item = molde ?? modelo[0] ?? "";
    if (chave === "itens") item = typeof modelo[0] === "string" ? "" : MODELO_ITEM_DIFERENCIAL;
    return valor
      .slice(0, max)
      .map((v) => limparValor(item, v, typeof item === "string" ? chave : undefined))
      .filter((v) => (typeof v === "string" ? v !== "" : true));
  }
  if (modelo && typeof modelo === "object") {
    const fonte = valor && typeof valor === "object" && !Array.isArray(valor) ? valor : {};
    const saida = {};
    for (const k of Object.keys(modelo)) saida[k] = limparValor(modelo[k], fonte[k], k);
    return saida;
  }
  return modelo;
}

// Ajustes manuais de cor: { claro: { primary: "#..." }, escuro: {...} }, só papéis conhecidos.
function limparAjustes(v) {
  const saida = { claro: {}, escuro: {} };
  for (const modo of ["claro", "escuro"]) {
    const m = v && typeof v === "object" && v[modo] && typeof v[modo] === "object" ? v[modo] : {};
    for (const [papel, cor] of Object.entries(m)) {
      if (TODOS_PAPEIS.has(papel) && corHex(cor)) saida[modo][papel] = corHex(cor);
    }
  }
  return saida;
}

const SECAO_PADRAO = Object.fromEntries(padrao.secoes.map((s) => [s.tipo, s]));

function limparSecao(bruta) {
  const tipo = bruta?.tipo;
  const modelo = SECAO_PADRAO[tipo];
  if (!modelo) return null;
  const s = limparValor(modelo, bruta, undefined);
  s.tipo = tipo;
  if (!TIPOS_SECAO[tipo].variantes.some((v) => v.id === bruta?.variante)) s.variante = modelo.variante;
  else s.variante = bruta.variante;
  if (!s.ancora) s.ancora = modelo.ancora;
  if (!s.menu.texto) s.menu.texto = TIPOS_SECAO[tipo].nome;
  return s;
}

export function limparConfig(bruto) {
  const fonte = bruto && typeof bruto === "object" ? bruto : {};
  const { secoes: _s, ...resto } = padrao;
  const cfg = limparValor(resto, fonte, undefined);
  cfg.tema.ajustes = limparAjustes(fonte.tema?.ajustes);
  if (!cfg.tema.corPrincipal) cfg.tema.corPrincipal = padrao.tema.corPrincipal;
  if (!cfg.marca.nome) cfg.marca.nome = padrao.marca.nome;
  if (!cfg.marca.logo) cfg.marca.logo = padrao.marca.logo;
  if (cfg.tiposDePedido.length === 0) cfg.tiposDePedido = padrao.tiposDePedido.map((t) => ({ ...t }));
  // ids de pedido únicos e preenchidos
  const ids = new Set();
  cfg.tiposDePedido = cfg.tiposDePedido
    .map((t) => ({ id: t.id || slug(t.texto, 30), texto: t.texto }))
    .filter((t) => t.id && t.texto && !ids.has(t.id) && ids.add(t.id));

  // Seções: tipos conhecidos, um de cada, na ordem recebida; as que faltam entram desligadas no fim.
  const vistas = new Set();
  const secoes = [];
  for (const b of Array.isArray(fonte.secoes) ? fonte.secoes.slice(0, 30) : padrao.secoes) {
    const s = limparSecao(b);
    if (s && !vistas.has(s.tipo)) {
      vistas.add(s.tipo);
      secoes.push(s);
    }
  }
  for (const s of padrao.secoes) {
    if (!vistas.has(s.tipo)) secoes.push({ ...limparSecao(s), visivel: Array.isArray(fonte.secoes) ? false : s.visivel });
  }
  // Âncoras únicas.
  const ancoras = new Set();
  for (const s of secoes) {
    let a = s.ancora;
    for (let i = 2; ancoras.has(a); i++) a = `${s.ancora}-${i}`;
    s.ancora = a;
    ancoras.add(a);
  }
  cfg.secoes = secoes;
  return cfg;
}

// Aplica um layout pronto: muda ordem, quais aparecem e a variação. Os textos ficam.
export function aplicarLayout(config, idLayout) {
  const layout = LAYOUTS.find((l) => l.id === idLayout);
  if (!layout) return config;
  const porTipo = Object.fromEntries(config.secoes.map((s) => [s.tipo, s]));
  const usados = new Set(layout.secoes.map(([t]) => t));
  const secoes = [
    ...layout.secoes.filter(([t]) => porTipo[t]).map(([t, variante]) => ({ ...porTipo[t], visivel: true, variante })),
    ...config.secoes.filter((s) => !usados.has(s.tipo)).map((s) => ({ ...s, visivel: false })),
  ];
  return { ...config, layout: idLayout, secoes };
}

export const secaoDo = (config, tipo) => config.secoes.find((s) => s.tipo === tipo);

// Formato do arquivo de backup do painel.
export const FORMATO_BACKUP = "tghservices-site";
