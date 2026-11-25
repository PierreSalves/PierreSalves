// Campos de cada seção e da aba "Geral" do painel, no formato de app/admin/Campos.jsx.
// `variantes` limita o campo a algumas variações da seção.

const botaoPedido = (rotulo, { mostrar = false, icone = false } = {}) => ({
  tipo: "grupo",
  rotulo,
  campos: [
    ...(mostrar ? [{ tipo: "booleano", campo: "mostrar", rotulo: "Mostrar o botão" }] : []),
    { campo: "texto", rotulo: "Texto do botão", max: 60 },
    ...(icone ? [{ tipo: "icone", campo: "icone" }] : []),
    { tipo: "pedido", campo: "tipo" },
  ],
});

export const CAMPOS_SECAO = {
  abertura: [
    { tipo: "lista", campo: "chips", rotulo: "Etiquetas acima do título", max: 6, novo: { icone: "ok", texto: "" }, tituloItem: (c) => c.texto || "Etiqueta", item: [{ tipo: "icone", campo: "icone" }, { campo: "texto", rotulo: "Texto", max: 40 }] },
    { campo: "titulo", rotulo: "Título", multilinha: true, max: 240 },
    { campo: "destaque", rotulo: "Final do título em destaque", ajuda: "Aparece na cor principal, depois do título. Pode ficar vazio.", max: 60 },
    { campo: "texto", rotulo: "Texto", multilinha: true, max: 600, contador: true },
    {
      tipo: "grupo",
      campo: "botaoPrincipal",
      rotulo: "Botão principal",
      campos: [
        { tipo: "booleano", campo: "mostrar", rotulo: "Mostrar o botão" },
        { campo: "texto", rotulo: "Texto do botão", max: 60 },
        { tipo: "icone", campo: "icone" },
        { tipo: "alvo", campo: "alvo" },
      ],
    },
    { ...botaoPedido("Botão de pedido", { mostrar: true }), campo: "botaoPedido" },
    {
      tipo: "grupo",
      campo: "navegador",
      rotulo: "Tela no navegador",
      variantes: ["dispositivos"],
      campos: [
        { tipo: "imagem", campo: "imagem", largura: "largura", altura: "altura", rotulo: "Imagem (tela de computador)", ajuda: "Esconda nomes, e-mails e outros dados pessoais antes de enviar." },
        { campo: "endereco", rotulo: "Endereço mostrado na barra", max: 80 },
        { campo: "alt", rotulo: "Descrição da imagem (para leitores de tela)", max: 160 },
      ],
    },
    {
      tipo: "grupo",
      campo: "celular",
      rotulo: "Tela no celular",
      variantes: ["dispositivos"],
      campos: [
        { tipo: "imagem", campo: "imagem", largura: "largura", altura: "altura", rotulo: "Imagem (tela de celular)" },
        { campo: "alt", rotulo: "Descrição da imagem", max: 160 },
      ],
    },
    {
      tipo: "grupo",
      campo: "imagem",
      rotulo: "Imagem",
      variantes: ["imagem"],
      campos: [
        { tipo: "imagem", campo: "imagem", largura: "largura", altura: "altura", rotulo: "Imagem grande ao lado do texto" },
        { campo: "alt", rotulo: "Descrição da imagem", max: 160 },
      ],
    },
  ],

  vitrine: [
    { tipo: "aviso", texto: "Os cartões desta seção são os projetos da aba Projetos > Vitrine." },
    { campo: "rotulo", rotulo: "Rótulo pequeno acima do título", max: 40 },
    { campo: "titulo", rotulo: "Título" },
    { ...botaoPedido("Botão “quero um parecido” em cada cartão", { mostrar: true }), campo: "pedidoParecido" },
    {
      tipo: "grupo",
      campo: "cartaoFinal",
      rotulo: "Cartão de pedido no fim",
      campos: [
        { tipo: "booleano", campo: "mostrar", rotulo: "Mostrar o cartão" },
        { campo: "titulo", rotulo: "Título", max: 80 },
        { campo: "texto", rotulo: "Texto", multilinha: true, max: 200 },
        { ...botaoPedido("Botão"), campo: "botao" },
      ],
    },
  ],

  diferenciais: [
    { campo: "rotulo", rotulo: "Rótulo pequeno acima do título", max: 40 },
    { campo: "titulo", rotulo: "Título", multilinha: true, max: 240 },
    { campo: "texto", rotulo: "Texto", multilinha: true, max: 600 },
    {
      tipo: "lista",
      campo: "itens",
      rotulo: "Itens",
      max: 12,
      novo: { icone: "ok", titulo: "", texto: "" },
      tituloItem: (i) => i.titulo || "Novo item",
      item: [{ tipo: "icone", campo: "icone" }, { campo: "titulo", rotulo: "Título", max: 80 }, { campo: "texto", rotulo: "Texto", multilinha: true, max: 300 }],
    },
    { ...botaoPedido("Botão", { mostrar: true, icone: true }), campo: "botao" },
  ],

  servicos: [
    { campo: "rotulo", rotulo: "Rótulo pequeno acima do título", max: 40 },
    { campo: "titulo", rotulo: "Título" },
    { campo: "texto", rotulo: "Texto", multilinha: true, max: 400 },
    {
      tipo: "lista",
      campo: "planos",
      rotulo: "Serviços",
      max: 6,
      novo: { icone: "ok", nome: "", resumo: "", preco: "", itens: [], botao: { texto: "Pedir orçamento", tipo: "" }, destaque: false },
      tituloItem: (p) => p.nome || "Novo serviço",
      item: [
        { campo: "nome", rotulo: "Nome", max: 80 },
        { tipo: "icone", campo: "icone" },
        { campo: "resumo", rotulo: "Resumo", multilinha: true, max: 300 },
        { campo: "preco", rotulo: "Preço (opcional)", exemplo: "A partir de R$ 900", max: 40 },
        { tipo: "lista", campo: "itens", rotulo: "O que inclui", item: "texto", max: 12 },
        { ...botaoPedido("Botão"), campo: "botao" },
        { tipo: "booleano", campo: "destaque", rotulo: "Destacar este serviço", ajuda: "Ganha borda na cor principal e botão cheio." },
      ],
    },
  ],

  portfolio: [
    { campo: "rotulo", rotulo: "Rótulo pequeno acima do título", max: 40 },
    { campo: "titulo", rotulo: "Título" },
    {
      tipo: "grupo",
      campo: "pessoa",
      rotulo: "Pessoa",
      campos: [
        { tipo: "imagem", campo: "foto", rotulo: "Foto (opcional)", redonda: true, ajuda: "Sem foto, aparecem as iniciais." },
        { campo: "iniciais", rotulo: "Iniciais", max: 3 },
        { campo: "nome", rotulo: "Nome", max: 80 },
        { campo: "cargo", rotulo: "Cargo e cidade", max: 120 },
        { campo: "bio", rotulo: "Apresentação", multilinha: true, max: 900, contador: true },
        { tipo: "lista", campo: "tags", rotulo: "Etiquetas", item: "texto", max: 16, maxTexto: 40 },
        {
          tipo: "lista",
          campo: "links",
          rotulo: "Links",
          max: 6,
          novo: { texto: "", url: "https://", icone: "", principal: false },
          tituloItem: (l) => l.texto || "Novo link",
          item: [
            { campo: "texto", rotulo: "Texto", max: 40 },
            { tipo: "url", campo: "url", rotulo: "Endereço" },
            { tipo: "icone", campo: "icone" },
            { tipo: "booleano", campo: "principal", rotulo: "Botão em destaque" },
          ],
        },
      ],
    },
    {
      tipo: "grupo",
      campo: "projetos",
      rotulo: "Lista de outros projetos",
      ajuda: "Os itens são os projetos da aba Projetos > Outros projetos.",
      campos: [
        { tipo: "booleano", campo: "mostrar", rotulo: "Mostrar a lista" },
        { campo: "titulo", rotulo: "Título", max: 80 },
        { campo: "texto", rotulo: "Texto", max: 200 },
        { tipo: "grupo", campo: "todos", rotulo: "Link no fim da lista", campos: [{ campo: "texto", rotulo: "Texto", max: 80 }, { tipo: "url", campo: "url", rotulo: "Endereço" }] },
      ],
    },
  ],

  localizacao: [
    { campo: "rotulo", rotulo: "Rótulo pequeno acima do título", max: 40 },
    { campo: "titulo", rotulo: "Título" },
    { campo: "texto", rotulo: "Texto (opcional)", multilinha: true, max: 400 },
    { campo: "endereco", rotulo: "Endereço", multilinha: true, max: 300 },
    {
      tipo: "lista",
      campo: "horarios",
      rotulo: "Horários",
      max: 8,
      novo: { dias: "Seg a sex", horas: "8h às 18h" },
      tituloItem: (h) => h.dias || "Horário",
      item: [{ campo: "dias", rotulo: "Dias", max: 40 }, { campo: "horas", rotulo: "Horário", max: 60 }],
    },
    {
      tipo: "mapa",
      campo: "mapa",
      rotulo: "Link do mapa ou do Street View",
      ajuda: "No Google Maps, abra o lugar (ou o Street View da fachada), clique em Compartilhar > Incorporar um mapa > Copiar HTML e cole aqui.",
    },
    { tipo: "url", campo: "linkRota", rotulo: "Link do botão “Como chegar” (opcional)", ajuda: "O link normal do lugar no Google Maps (Compartilhar > Copiar link)." },
  ],

  avaliacoes: [
    { campo: "rotulo", rotulo: "Rótulo pequeno acima do título", max: 40 },
    { campo: "titulo", rotulo: "Título" },
    {
      campo: "placeId",
      rotulo: "Place ID do negócio no Google",
      exemplo: "ChIJ...",
      max: 300,
      ajuda: "Procure o negócio em developers.google.com/maps/documentation/places/web-service/place-id e copie o Place ID.",
    },
    { tipo: "numero", campo: "limiteMensal", rotulo: "Limite de consultas por mês", min: 0, max: 100000, ajuda: "O Google dá 1.000 consultas grátis por mês. Acima do limite, a seção mostra só o link para o Google Maps." },
    { campo: "botaoGoogle", rotulo: "Texto do botão para o Google Maps", max: 60 },
  ],

  contato: [
    { campo: "titulo", rotulo: "Título", multilinha: true, max: 240 },
    { tipo: "booleano", campo: "mostrarEmail", rotulo: "Mostrar o e-mail de contato", ajuda: "O e-mail fica na aba Geral." },
    { ...botaoPedido("Botão", { icone: true }), campo: "botao" },
  ],
};

let seq = 0;
const novoIdPedido = (lista) => {
  let id;
  do id = `pedido-${Date.now().toString(36)}${(seq++).toString(36)}`;
  while (lista.some((t) => t.id === id));
  return id;
};

export const CAMPOS_GERAL = [
  {
    titulo: "Marca",
    campos: [
      { campo: "nome", rotulo: "Nome do negócio", max: 80, chave: "marca" },
      { tipo: "imagem", campo: "logo", largura: "logoLargura", altura: "logoAltura", rotulo: "Logo", conter: true, obrigatoria: true, ajuda: "PNG ou WebP com fundo transparente fica melhor.", chave: "marca" },
      { tipo: "cor", campo: "logoFundoNoEscuro", rotulo: "Fundo do logo no modo escuro", vazio: "Sem fundo", ajuda: "Para logos de letras escuras. Deixe vazio para não usar fundo.", chave: "marca" },
    ],
  },
  {
    titulo: "Google e aba do navegador",
    campos: [
      { campo: "titulo", rotulo: "Título da página", max: 120, contador: true, chave: "seo" },
      { campo: "descricao", rotulo: "Descrição", multilinha: true, max: 300, contador: true, chave: "seo", ajuda: "Aparece embaixo do título nos resultados do Google." },
    ],
  },
  {
    titulo: "Botão do topo",
    campos: [{ ...botaoPedido("", { mostrar: true, icone: true }), campo: "botao", chave: "topo" }],
  },
  {
    titulo: "Formulário de pedido",
    campos: [
      {
        tipo: "lista",
        campo: "tiposDePedido",
        chave: "",
        rotulo: "O que o cliente pode pedir",
        ajuda: "Cada botão de pedido da página abre o formulário com um destes já escolhido.",
        max: 12,
        novo: (lista) => ({ id: novoIdPedido(lista), texto: "" }),
        tituloItem: (t) => t.texto || "Novo tipo",
        item: [{ campo: "texto", rotulo: "Texto", max: 80 }],
      },
      { campo: "titulo", rotulo: "Título do formulário", max: 80, chave: "formulario" },
      { campo: "texto", rotulo: "Texto do formulário", multilinha: true, max: 300, chave: "formulario" },
      { campo: "campoMensagem", rotulo: "Nome do campo de mensagem", max: 60, chave: "formulario" },
      { campo: "ajudaMensagem", rotulo: "Ajuda do campo de mensagem", multilinha: true, max: 300, chave: "formulario" },
      { campo: "sucesso", rotulo: "Mensagem de enviado", multilinha: true, max: 300, chave: "formulario" },
      { campo: "erro", rotulo: "Mensagem de erro", multilinha: true, max: 300, chave: "formulario", ajuda: "O e-mail de contato aparece logo depois." },
    ],
  },
  {
    titulo: "Contato",
    campos: [{ campo: "email", rotulo: "E-mail público", max: 200, chave: "contato", ajuda: "Aparece na seção Contato e no aviso de erro do formulário. Os pedidos chegam no e-mail configurado no servidor." }],
  },
  {
    titulo: "Rodapé",
    campos: [
      { campo: "esquerda", rotulo: "Texto da esquerda", max: 120, chave: "rodape" },
      { campo: "direita", rotulo: "Texto da direita", max: 120, chave: "rodape" },
    ],
  },
];
