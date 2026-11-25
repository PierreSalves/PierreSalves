// Cartões de projetos usados só quando não há banco (ou ele falha). Os do site ficam na
// aba "Projetos" do painel /admin. Separado do site.config.js para não pesar no Worker.
const projetosIniciais = {
  vitrine: [
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
      publico: "App mobile · para não esquecer datas importantes",
      icone: "bolo",
      status: { texto: "Código aberto", icone: "codigo" },
      resumo: "App mobile que organiza aniversários e outras datas e ajuda a mandar a mensagem certa no dia.",
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
  outros: [
    { icone: "explorar", nome: "crudSpots", texto: "Cadastro de pontos turísticos com React e API em ASP.NET Core.", url: "https://github.com/PierreSalves/crudSpots" },
    { icone: "trofeu", nome: "MedicMatch", texto: "Sistema em Laravel feito para a gincana de tecnologia da Faccat.", url: "https://github.com/PierreSalves/GincanaFaccat-MedicMatch" },
  ],
};

export default projetosIniciais;
