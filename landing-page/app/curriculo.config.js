// Conteúdo do currículo (/curriculo). Mesmo tema e componentes da página inicial.

const curriculo = {
  seo: {
    titulo: "Pierre Alves · Desenvolvedor Full Stack",
    descricao: "Currículo de Pierre Alves, desenvolvedor full stack: PHP, Node.js, Oracle, Flutter e Cloudflare.",
  },
  pessoa: {
    iniciais: "PA",
    nome: "Pierre Alves",
    cargo: "Desenvolvedor Full Stack",
    local: "Tupã, São Paulo · Brasil",
    contatos: [
      { texto: "LinkedIn", url: "https://www.linkedin.com/in/pierre-alves/", icone: "linkedin" },
      { texto: "GitHub", url: "https://github.com/PierreSalves", icone: "github" },
      { texto: "040797pierre@gmail.com", url: "mailto:040797pierre@gmail.com", icone: "email" },
      { texto: "tghservices.psa@gmail.com", url: "mailto:tghservices.psa@gmail.com", icone: "email" },
    ],
  },
  sobre:
    "Desenvolvedor full stack há mais de 3 anos no desenvolvimento de um ERP educacional usado por escolas públicas e privadas: do banco de dados Oracle e dos servidores na nuvem até as integrações em Node.js com a Secretaria da Educação do Estado de São Paulo. Bacharel em Sistemas de Informação, especialista em Experiência do Usuário (UX) e ex-professor universitário. Gosto de transformar processos manuais em sistemas simples de usar.",
  tecnologias: [
    { grupo: "Back-end", itens: ["PHP", "Laravel", "CakePHP", "Node.js", "C# · ASP.NET Core", "TypeScript"] },
    { grupo: "Front-end e mobile", itens: ["JavaScript", "React", "Flutter · Dart", "HTML e CSS", "Bootstrap", "UX"] },
    { grupo: "Dados e infraestrutura", itens: ["Oracle 18c", "MySQL", "SQL Server", "Oracle Cloud", "Cloudflare Workers", "Git"] },
  ],
  projetos: {
    itens: [
      {
        nome: "Controle de Presença",
        texto: "App para professores de esporte lançarem presenças no celular, mesmo sem internet, com relatórios calculados automaticamente.",
        tags: ["Flutter", "Cloudflare Workers", "D1"],
        // O repositório é privado: o link vai para o app no ar.
        link: { texto: "Abrir app", url: "https://controlepresenca.tghservices.com.br/" },
      },
      {
        nome: "Lembretes de Aniversários",
        texto: "App que organiza datas importantes e envia mensagens prontas pelo WhatsApp, guardando os dados no Google Drive do próprio usuário.",
        tags: ["Flutter", "Google Drive"],
        link: { texto: "Ver no GitHub", url: "https://github.com/PierreSalves/lembretesaniversarios_v2" },
      },
      {
        nome: "crudSpots",
        texto: "Cadastro de pontos turísticos com front-end em React e API em ASP.NET Core usando stored procedures.",
        tags: ["React", "C#", "SQL Server"],
        link: { texto: "Ver no GitHub", url: "https://github.com/PierreSalves/crudSpots" },
      },
      {
        nome: "MedicMatch",
        texto: "Sistema desenvolvido para a gincana de tecnologia da Faccat.",
        tags: ["Laravel", "PHP"],
        link: { texto: "Ver no GitHub", url: "https://github.com/PierreSalves/GincanaFaccat-MedicMatch" },
      },
    ],
    todos: { texto: "Ver todos os projetos no GitHub", url: "https://github.com/PierreSalves?tab=repositories" },
  },
  experiencia: [
    {
      cargo: "Desenvolvedor Web Pleno · ERP Educacional",
      onde: "GSA Soluções · jul/2023 – atual · Tupã, SP",
      itens: [
        "Análise e desenvolvimento em PHP de novas funcionalidades e correções do ERP educacional.",
        "APIs em Node.js para integrar o sistema com outras empresas, incluindo a Secretaria Escolar Digital (SED) do Estado de São Paulo.",
        "Estruturação e otimização do banco Oracle 18c, com procedures e foco em segurança e integridade dos dados.",
        "Configuração e manutenção de máquinas virtuais e servidores no Oracle Cloud.",
        "Atendimento a professores e gestores para entender necessidades e evoluir a plataforma.",
      ],
    },
    {
      cargo: "Professor de Sistemas de Informação",
      onde: "Faculdades Faccat · fev/2024 – dez/2024 · Tupã, SP",
      itens: [
        "Aulas teóricas e práticas de programação, sistemas e banco de dados.",
        "Orientação de alunos em projetos e propostas de atualização do currículo do curso.",
      ],
    },
    {
      cargo: "Estagiário de Programação",
      onde: "GSA Soluções · fev/2023 – jun/2023 · Tupã, SP",
      itens: ["Desenvolvimento do ERP educacional para instituições públicas e privadas."],
    },
  ],
  formacao: [
    { curso: "Especialização em Experiência do Usuário (UX)", onde: "Anhanguera Educacional · 2024" },
    { curso: "Bacharelado em Sistemas de Informação", onde: "Faculdades Faccat · 2020 – 2023" },
  ],
  contato: {
    titulo: "Vamos conversar?",
    texto: "Aberto a projetos, parcerias e oportunidades. Escreva para 040797pierre@gmail.com ou tghservices.psa@gmail.com, ou me chame no LinkedIn.",
  },
  rodape: "© 2026 Pierre Alves · TGH Services",
};

export default curriculo;
