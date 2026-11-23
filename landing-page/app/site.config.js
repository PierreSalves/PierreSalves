// Todo o conteúdo da página fica aqui. Para fazer a landing page de um cliente,
// copie este arquivo, troque textos, cor, imagens e links, e rode `npm run build`.
// Os ícones são nomes da lista em app/icones.jsx.

const site = {
  marca: {
    nome: "TGH Services",
    logo: "/logo-tghservices.png",
    logoLargura: 500,
    logoAltura: 250,
    // O logo tem fundo transparente e letras escuras: no modo escuro ganha um fundo branco.
    logoFundoNoEscuro: "#FFFFFF",
  },

  // Cor principal da página. As outras cores (claro e escuro) saem dela.
  // O azul do logo não precisa ser a cor da página.
  tema: { corPrincipal: "#006A60" },

  seo: {
    titulo: "TGH Services · Apps sob medida de Pierre Alves",
    descricao:
      "Vitrine dos apps da TGH Services e portfólio de Pierre Alves, desenvolvedor full stack. Apps web e mobile e landing pages feitos sob medida.",
  },

  menu: [
    { texto: "Apps", alvo: "#apps" },
    { texto: "Sob medida", alvo: "#sob-medida" },
    { texto: "Serviços", alvo: "#servicos" },
    { texto: "Portfólio", alvo: "#portfolio" },
  ],

  // Tipos de pedido que aparecem no formulário. Cada botão da página abre o formulário
  // já com um deles escolhido.
  tiposDePedido: [
    { id: "app", texto: "App sob medida" },
    { id: "landing", texto: "Landing page" },
    { id: "parecido", texto: "Um app parecido com um da vitrine" },
    { id: "outro", texto: "Outro assunto" },
  ],

  abertura: {
    chips: [
      { icone: "site", texto: "Web" },
      { icone: "celular", texto: "Android e iOS" },
      { icone: "offline", texto: "Funciona offline" },
    ],
    titulo: "Apps que eu criei, e o próximo pode ser",
    destaque: "o seu",
    texto:
      "Sou Pierre Alves, desenvolvedor full stack. Na TGH Services eu publico os apps que já estão no ar e faço apps e landing pages sob medida para o jeito que o seu negócio trabalha.",
    botaoPrincipal: { texto: "Ver os apps", icone: "apps", alvo: "#apps" },
    botaoPedido: { texto: "Quero um app sob medida", tipo: "app" },
    navegador: {
      endereco: "controlepresenca.tghservices.com.br",
      imagem: "/img/presenca-painel.webp",
      largura: 1085,
      altura: 672,
      alt: "Painel do Controle de Presença, com dados fictícios",
    },
    celular: { imagem: "/img/cine-celular.webp", largura: 585, altura: 996, alt: "CineOnline aberto no celular" },
  },

  vitrine: {
    rotulo: "Vitrine",
    titulo: "Apps da TGH",
    // Para incluir um app novo, copie um item desta lista. As telas devem ter dados mascarados.
    apps: [
      {
        nome: "Controle de Presença",
        publico: "Academias de artes marciais",
        icone: "artesMarciais",
        status: { texto: "No ar", icone: "ok" },
        resumo: "A chamada da academia no celular, e os relatórios prontos no fim do mês.",
        telas: [
          { imagem: "/img/presenca-painel.webp", legenda: "Painel do professor" },
          { imagem: "/img/presenca-relatorios.webp", legenda: "Relatórios" },
          { imagem: "/img/presenca-admin.webp", legenda: "Administração" },
          { imagem: "/img/presenca-entrada.webp", legenda: "Entrada", posicao: "left center" },
        ],
        recursos: [
          { icone: "offline", titulo: "Presença no tatame, sem internet", texto: "Lança a chamada offline e envia quando o sinal voltar." },
          { icone: "grafico", titulo: "Relatórios sem somar à mão", texto: "Semanal, mensal, anual e por aluno, para imprimir ou salvar em PDF." },
          { icone: "medalha", titulo: "Frequência para graduação", texto: "Mostra quem está abaixo do mínimo da turma, a qualquer momento." },
          { icone: "admin", titulo: "Várias academias, um sistema", texto: "O administrador cadastra academias e professores e importa alunos por planilha." },
        ],
        tecnologias: ["Flutter", "Cloudflare Workers", "D1"],
        links: [{ texto: "Abrir app", url: "https://controlepresenca.tghservices.com.br/", icone: "abrir" }],
      },
      {
        nome: "CineOnline",
        publico: "Para assistir junto, à distância",
        icone: "filme",
        status: { texto: "No ar", icone: "ok" },
        resumo: "Seus vídeos do Drive, seus amigos, o mesmo minuto. Salas privadas para até 24 pessoas, com chat ao vivo.",
        telas: [
          { imagem: "/img/cine-sala.webp", legenda: "Sala com chat ao vivo", posicao: "center" },
          { imagem: "/img/cine-fila.webp", legenda: "Fila e histórico", posicao: "center top" },
          { imagem: "/img/cine-admin.webp", legenda: "Painel do administrador", posicao: "center top" },
          { imagem: "/img/cine-inicio.webp", legenda: "Página inicial", posicao: "center top" },
        ],
        recursos: [
          { icone: "fila", titulo: "Monte a fila", texto: "Escolha vídeos e legendas direto do seu Google Drive." },
          { icone: "link", titulo: "Mande o link", texto: "Convidados entram pelo link, sem criar conta." },
          { icone: "play", titulo: "Assistam juntos", texto: "Play e pause valem para todos na sala." },
          { icone: "painel", titulo: "Painel do administrador ao vivo", texto: "Salas abertas, pessoas conectadas, denúncias e moderação num só lugar." },
        ],
        tecnologias: ["PWA", "Google Drive", "Cloudflare"],
        links: [{ texto: "Abrir app", url: "https://cineminha.tghservices.com.br/", icone: "abrir" }],
      },
      {
        nome: "Lembretes de Aniversários",
        publico: "Para não esquecer datas importantes",
        icone: "bolo",
        status: { texto: "Código aberto", icone: "codigo" },
        resumo: "Organiza aniversários e outras datas e ajuda a mandar a mensagem certa no dia.",
        telas: [],
        semTelas: "Capturas em breve",
        recursos: [
          { icone: "evento", titulo: "Datas organizadas", texto: "Aniversários e datas importantes num só lugar." },
          { icone: "chat", titulo: "Mensagens prontas no WhatsApp", texto: "Envia o recado com um toque." },
          { icone: "drive", titulo: "Seus dados no seu Drive", texto: "Tudo fica guardado no Google Drive do próprio usuário." },
        ],
        tecnologias: ["Flutter", "Google Drive"],
        // Só marque "Código aberto" e ponha "Ver código" se o repositório for público.
        links: [{ texto: "Ver código", url: "https://github.com/PierreSalves/lembretesaniversarios_v2", icone: "codigo", discreto: true }],
      },
    ],
    // Botão "Quero um parecido" em cada app da vitrine.
    pedidoParecido: { texto: "Quero um parecido", tipo: "parecido" },
    cartaoFinal: {
      titulo: "O próximo app pode ser o seu.",
      texto: "Conte o problema que você quer resolver e eu monto um app sob medida.",
      botao: { texto: "Contar a minha ideia", tipo: "app" },
    },
  },

  sobMedida: {
    rotulo: "Sob medida",
    titulo: "Nenhum desses apps saiu de um modelo pronto. O seu também não vai sair.",
    texto:
      "Cada app começa com o problema de alguém: a chamada no papel do professor, o filme que os amigos queriam ver juntos. Eu construo em cima do jeito que você já trabalha.",
    itens: [
      { icone: "conversa", titulo: "Seu processo", texto: "Telas e regras pensadas para a sua rotina, não o contrário." },
      { icone: "paleta", titulo: "Sua marca", texto: "Nome, cores e domínio seus, instalável no celular." },
      { icone: "offline", titulo: "Sem depender de sinal", texto: "Funciona offline e sincroniza quando a internet volta." },
      { icone: "suporte", titulo: "Depois da entrega", texto: "Hospedagem, correções e novas funções com quem fez o app." },
    ],
    botao: { texto: "Contar a minha ideia", icone: "ideia", tipo: "app" },
  },

  servicos: {
    rotulo: "Serviços",
    titulo: "O que você pode pedir",
    texto: "Escolha um ponto de partida. O pedido chega direto no meu e-mail e eu respondo com as próximas etapas.",
    // `preco` é opcional: sem ele, o cartão mostra só o botão de pedido.
    planos: [
      {
        icone: "celular",
        nome: "App sob medida",
        resumo: "Web, Android e iOS, feito em cima da rotina do seu negócio.",
        itens: ["Levantamento do processo com você", "Funciona offline quando precisa", "Hospedagem e manutenção depois da entrega"],
        botao: { texto: "Pedir orçamento", tipo: "app" },
        destaque: true,
      },
      {
        icone: "web",
        nome: "Landing page",
        resumo: "Uma página como esta, com a sua marca, para mostrar o que você faz e receber pedidos.",
        itens: ["Visual Material Design, claro e escuro", "Formulário de pedido que chega no seu e-mail", "Hospedagem rápida na Cloudflare, com seu domínio"],
        botao: { texto: "Quero uma landing page", tipo: "landing" },
      },
    ],
  },

  portfolio: {
    rotulo: "Portfólio",
    titulo: "Quem está por trás dos apps",
    pessoa: {
      iniciais: "PA",
      nome: "Pierre Alves",
      cargo: "Desenvolvedor full stack · Tupã, SP",
      bio: "Desenvolvedor web pleno na GSA Soluções desde 2023, trabalhando com PHP, Node.js, Oracle e servidores em nuvem. Bacharel em Sistemas de Informação, especialista em UX e ex-professor universitário.",
      tags: ["PHP · Laravel", "Node.js", "Flutter", "React", "Oracle", "Cloudflare"],
      links: [
        { texto: "Currículo completo", url: "/curriculo", icone: "documento", principal: true },
        { texto: "LinkedIn", url: "https://www.linkedin.com/in/pierre-alves/" },
        { texto: "GitHub", url: "https://github.com/PierreSalves" },
      ],
    },
    projetos: {
      titulo: "Outros projetos",
      texto: "Projetos de estudo e competições, com código aberto.",
      itens: [
        { icone: "explorar", nome: "crudSpots", texto: "Cadastro de pontos turísticos com React e API em ASP.NET Core.", url: "https://github.com/PierreSalves/crudSpots" },
        { icone: "trofeu", nome: "MedicMatch", texto: "Sistema em Laravel feito para a gincana de tecnologia da Faccat.", url: "https://github.com/PierreSalves/GincanaFaccat-MedicMatch" },
      ],
      todos: { texto: "Ver todos os projetos no GitHub", url: "https://github.com/PierreSalves?tab=repositories" },
    },
  },

  contato: {
    titulo: "Tem um processo que ainda vive no papel ou na planilha?",
    email: "tghservices.psa@gmail.com",
    botao: { texto: "Fazer um pedido", icone: "enviar", tipo: "app" },
  },

  formulario: {
    titulo: "Fazer um pedido",
    texto: "Conte o que você precisa. O pedido chega direto no meu e-mail.",
    sucesso: "Pedido enviado. Vou responder no e-mail que você informou.",
    erro: "Não consegui enviar agora. Você pode mandar o mesmo pedido por e-mail:",
  },

  rodape: { esquerda: "© 2026 TGH Services · Pierre Alves", direita: "Tupã, SP" },
};

export default site;
