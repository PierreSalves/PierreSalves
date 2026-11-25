// Configuração de fábrica da página. O que vale no site é a configuração publicada no
// painel /admin (guardada no D1). Este arquivo é usado quando o banco ainda está vazio,
// quando ele falha e como ponto de partida para a landing page de um cliente novo.
// A forma completa (campos, limites, variações e layouts) está em app/config/esquema.js.
// Os ícones são nomes da lista em app/icones.jsx.

const site = {
  versao: 1,

  marca: {
    nome: "TGH Services",
    logo: "/logo-tghservices.png",
    logoLargura: 500,
    logoAltura: 250,
    // O logo tem fundo transparente e letras escuras: no modo escuro ganha um fundo branco.
    logoFundoNoEscuro: "#FFFFFF",
  },

  // Cores: no modo "auto" as paletas claro e escuro saem da cor principal pelo algoritmo
  // oficial do Material 3. Secundária e terciária são opcionais (vazias = o algoritmo escolhe).
  // Em "ajustes" dá para trocar qualquer papel de cor do claro ou do escuro à mão.
  tema: {
    corPrincipal: "#006A60",
    corSecundaria: "",
    corTerciaria: "",
    estilo: "tonalSpot",
    contraste: 0,
    ajustes: { claro: {}, escuro: {} },
    modoPadrao: "system",
    botaoModo: true,
    cantos: "arredondado",
  },

  seo: {
    titulo: "TGH Services · Apps sob medida de Pierre Alves",
    descricao:
      "Vitrine dos apps da TGH Services e portfólio de Pierre Alves, desenvolvedor full stack. Apps web e mobile e landing pages feitos sob medida.",
  },

  // Botão do canto do cabeçalho.
  topo: { botao: { mostrar: true, texto: "Fale comigo", icone: "email", tipo: "app" } },

  // Tipos de pedido que aparecem no formulário. Cada botão da página abre o formulário
  // já com um deles escolhido.
  tiposDePedido: [
    { id: "app", texto: "App sob medida" },
    { id: "landing", texto: "Landing page" },
    { id: "parecido", texto: "Um app parecido com um da vitrine" },
    { id: "outro", texto: "Outro assunto" },
  ],

  formulario: {
    titulo: "Fazer um pedido",
    texto: "Conte o que você precisa. O pedido chega direto no meu e-mail.",
    campoMensagem: "Conte sua ideia",
    ajudaMensagem: "Qual problema o app ou a página deve resolver, quem vai usar e se já existe algo hoje.",
    sucesso: "Pedido enviado. Vou responder no e-mail que você informou.",
    erro: "Não consegui enviar agora. Você pode mandar o mesmo pedido por e-mail:",
  },

  // E-mail público (aparece no contato e no aviso de erro do formulário).
  contato: { email: "tghservices.psa@gmail.com" },

  rodape: { esquerda: "© 2026 TGH Services · Pierre Alves", direita: "Tupã, SP" },

  // Layout de partida (só informativo: depois de aplicado, vale o que está em `secoes`).
  layout: "vitrine",

  // Seções na ordem em que aparecem. `tipo` diz qual componente desenha a seção,
  // `variante` qual desenho dele, `ancora` o #endereço e `menu` se entra no cabeçalho.
  secoes: [
    {
      tipo: "abertura",
      visivel: true,
      variante: "dispositivos",
      ancora: "inicio",
      menu: { mostrar: false, texto: "Início" },
      dados: {
        chips: [
          { icone: "site", texto: "Web" },
          { icone: "celular", texto: "Android e iOS" },
          { icone: "offline", texto: "Funciona offline" },
        ],
        titulo: "Apps que eu criei, e o próximo pode ser",
        destaque: "o seu",
        texto:
          "Sou Pierre Alves, desenvolvedor full stack. Na TGH Services eu publico os apps que já estão no ar e faço apps e landing pages sob medida para o jeito que o seu negócio trabalha.",
        botaoPrincipal: { mostrar: true, texto: "Ver os apps", icone: "apps", alvo: "#apps" },
        botaoPedido: { mostrar: true, texto: "Quero um app sob medida", tipo: "app" },
        navegador: {
          endereco: "controlepresenca.tghservices.com.br",
          imagem: "/img/presenca-painel.webp",
          largura: 1085,
          altura: 672,
          alt: "Painel do Controle de Presença, com dados fictícios",
        },
        celular: { imagem: "/img/cine-celular.webp", largura: 585, altura: 996, alt: "CineOnline aberto no celular" },
        // Usada na variação "Com uma imagem".
        imagem: { imagem: "/img/cine-sala.webp", largura: 1568, altura: 741, alt: "Sala do CineOnline com chat ao vivo" },
      },
    },
    {
      tipo: "vitrine",
      visivel: true,
      variante: "carrossel",
      ancora: "apps",
      menu: { mostrar: true, texto: "Apps" },
      // Os cartões em si são os projetos da aba "Projetos > Vitrine" do painel.
      dados: {
        rotulo: "Vitrine",
        titulo: "Apps da TGH",
        pedidoParecido: { mostrar: true, texto: "Quero um parecido", tipo: "parecido" },
        cartaoFinal: {
          mostrar: true,
          titulo: "O próximo app pode ser o seu.",
          texto: "Conte o problema que você quer resolver e eu monto um app sob medida.",
          botao: { texto: "Contar a minha ideia", tipo: "app" },
        },
      },
    },
    {
      tipo: "diferenciais",
      visivel: true,
      variante: "destaque",
      ancora: "sob-medida",
      menu: { mostrar: true, texto: "Sob medida" },
      dados: {
        rotulo: "Sob medida",
        titulo: "Nenhum desses apps saiu de um modelo pronto. O seu também não vai sair.",
        texto:
          "Cada app começa com o problema de alguém: a chamada no papel do professor, o filme que os amigos queriam ver juntos. Eu construo em cima do jeito que você já trabalha.",
        itens: [
          { icone: "conversa", titulo: "Seu processo", texto: "Telas e regras pensadas para a sua rotina, não o contrário." },
          { icone: "paleta", titulo: "Sua marca", texto: "Nome, cores e domínio seus, instalável no celular." },
          { icone: "offline", titulo: "Sem depender de sinal", texto: "Funciona offline e sincroniza quando a internet volta." },
          { icone: "suporte", titulo: "O app é seu", texto: "Você recebe o app pronto, com a hospedagem configurada na sua conta. Suporte e novas funções depois da entrega só se você contratar." },
        ],
        botao: { mostrar: true, texto: "Contar a minha ideia", icone: "ideia", tipo: "app" },
      },
    },
    {
      tipo: "servicos",
      visivel: true,
      variante: "cartoes",
      ancora: "servicos",
      menu: { mostrar: true, texto: "Serviços" },
      dados: {
        rotulo: "Serviços",
        titulo: "O que você pode pedir",
        texto: "Escolha um ponto de partida. O pedido chega direto no meu e-mail e eu respondo com as próximas etapas.",
        // `preco` é opcional: sem ele, o cartão mostra só o botão de pedido.
        planos: [
          {
            icone: "celular",
            nome: "App sob medida",
            resumo: "Web, Android e iOS, feito em cima da rotina do seu negócio.",
            preco: "",
            itens: ["Levantamento do processo com você", "Funciona offline quando precisa", "Entregue pronto, com a hospedagem configurada na sua conta"],
            botao: { texto: "Pedir orçamento", tipo: "app" },
            destaque: true,
          },
          {
            icone: "web",
            nome: "Landing page",
            resumo: "Uma página como esta, com a sua marca, para mostrar o que você faz e receber pedidos.",
            preco: "",
            itens: ["Visual Material Design, claro e escuro", "Formulário de pedido que chega no seu e-mail", "Publicada na sua conta da Cloudflare, com seu domínio"],
            botao: { texto: "Quero uma landing page", tipo: "landing" },
            destaque: false,
          },
        ],
      },
    },
    {
      tipo: "portfolio",
      visivel: true,
      variante: "duasColunas",
      ancora: "portfolio",
      menu: { mostrar: true, texto: "Portfólio" },
      dados: {
        rotulo: "Portfólio",
        titulo: "Quem está por trás dos apps",
        pessoa: {
          iniciais: "PA",
          foto: "",
          nome: "Pierre Alves",
          cargo: "Desenvolvedor full stack · Tupã, SP",
          bio: "Desenvolvedor web pleno na GSA Soluções desde 2023, trabalhando com PHP, Node.js, Oracle e servidores em nuvem. Bacharel em Sistemas de Informação, especialista em UX e ex-professor universitário.",
          tags: ["PHP · Laravel", "Node.js", "Flutter", "React", "Oracle", "Cloudflare"],
          links: [
            { texto: "Currículo completo", url: "/curriculo", icone: "documento", principal: true },
            { texto: "LinkedIn", url: "https://www.linkedin.com/in/pierre-alves/", icone: "", principal: false },
            { texto: "GitHub", url: "https://github.com/PierreSalves", icone: "", principal: false },
          ],
        },
        // Os itens da lista são os projetos da aba "Projetos > Outros projetos" do painel.
        projetos: {
          mostrar: true,
          titulo: "Outros projetos",
          texto: "Projetos de estudo e competições, com código aberto.",
          todos: { texto: "Ver todos os projetos no GitHub", url: "https://github.com/PierreSalves?tab=repositories" },
        },
      },
    },
    {
      tipo: "localizacao",
      visivel: false,
      variante: "mapaETexto",
      ancora: "onde-estamos",
      menu: { mostrar: true, texto: "Onde estamos" },
      dados: {
        rotulo: "Onde estamos",
        titulo: "Venha nos visitar",
        texto: "",
        endereco: "",
        horarios: [],
        // Link de "Compartilhar > Incorporar um mapa" do Google Maps (mapa ou Street View).
        mapa: "",
        // Link normal do Google Maps, para o botão "Como chegar".
        linkRota: "",
      },
    },
    {
      tipo: "avaliacoes",
      visivel: false,
      variante: "cartoes",
      ancora: "avaliacoes",
      menu: { mostrar: true, texto: "Avaliações" },
      dados: {
        rotulo: "Avaliações",
        titulo: "O que dizem no Google",
        // Place ID do negócio no Google (ver README, "Avaliações do Google").
        placeId: "",
        limiteMensal: 900,
        botaoGoogle: "Ver todas no Google Maps",
      },
    },
    {
      tipo: "contato",
      visivel: true,
      variante: "faixa",
      ancora: "contato",
      menu: { mostrar: false, texto: "Contato" },
      dados: {
        titulo: "Tem um processo que ainda vive no papel ou na planilha?",
        mostrarEmail: true,
        botao: { texto: "Fazer um pedido", icone: "enviar", tipo: "app" },
      },
    },
  ],
};

export default site;
