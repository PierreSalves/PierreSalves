// Chamadas do painel para o Worker (src/projetos.js).

export class ErroApi extends Error {
  constructor(codigo, status) {
    super(codigo);
    this.codigo = codigo;
    this.status = status;
  }
}

const MENSAGENS = {
  "sem-acesso": "Sua sessão terminou. Entre de novo.",
  rede: "Sem conexão com o site. Confira a internet e tente de novo.",
  nome: "Preencha o nome do projeto.",
  url: "Coloque um link válido (começando com https://).",
  "tipo-de-imagem": "Use uma imagem PNG, JPG, WebP ou AVIF.",
  "grande-demais": "A imagem passou de 4 MB, mesmo depois de reduzida.",
  "arquivo-invalido": "Esse arquivo não é um backup do site.",
  "nada-para-publicar": "Não há alterações para publicar.",
  dados: "Os dados enviados estão incompletos.",
  "nao-encontrado": "Não encontrei esse item. Recarregue a página.",
  email: "Confira o e-mail digitado.",
  codigo: "O código tem 6 números.",
  "codigo-errado": "Código errado. Confira o último e-mail que chegou.",
  "codigo-expirado": "Esse código venceu ou já foi usado. Peça um novo.",
  "muitas-tentativas": "Muitas tentativas erradas. Peça um código novo.",
  aguarde: "Espere um pouco antes de pedir outro código.",
  "muitos-envios": "Muitos códigos pedidos na última hora. Tente mais tarde.",
  "envio-indisponivel": "O envio do código ainda não está configurado no site.",
  "falha-no-envio": "Não consegui enviar o e-mail agora. Tente de novo.",
  "ja-dono": "Esse e-mail é de um dono e já tem acesso.",
  limite: "Chegou ao limite de 50 e-mails liberados.",
  "so-dono": "Só o dono do site pode mudar os acessos.",
};
export const mensagemDeErro = (e) =>
  MENSAGENS[e?.codigo] ||
  (e?.codigo?.startsWith("item-invalido") ? "O backup tem um projeto com dados inválidos." : e?.codigo?.startsWith("config-invalida") ? "O backup tem uma configuração inválida." : "Algo deu errado. Tente de novo.");

async function chamar(caminho, { metodo = "GET", corpo, tipo } = {}) {
  let resp;
  try {
    resp = await fetch(caminho, {
      method: metodo,
      credentials: "same-origin",
      // Sem seguir redirecionamentos: a API nunca redireciona, então um redirect é tratado como sessão perdida.
      redirect: "manual",
      headers: corpo === undefined ? {} : { "Content-Type": tipo || "application/json" },
      body: corpo === undefined ? undefined : tipo ? corpo : JSON.stringify(corpo),
    });
  } catch {
    throw new ErroApi("rede", 0);
  }
  if (resp.type === "opaqueredirect" || resp.status === 0) throw new ErroApi("sem-acesso", 401);
  let dados = null;
  try {
    dados = await resp.json();
  } catch {
    /* corpo vazio */
  }
  if (!resp.ok || dados?.ok === false) {
    const e = new ErroApi(dados?.erro || "erro", resp.status);
    e.dados = dados;
    throw e;
  }
  return dados;
}

export const api = {
  eu: () => chamar("/api/admin/eu"),
  pedirCodigo: (email) => chamar("/api/admin/entrar/codigo", { metodo: "POST", corpo: { email } }),
  entrar: (email, codigo) => chamar("/api/admin/entrar", { metodo: "POST", corpo: { email, codigo } }),
  sair: () => chamar("/api/admin/sair", { metodo: "POST", corpo: {} }),
  acessos: () => chamar("/api/admin/acessos"),
  liberar: (email) => chamar("/api/admin/acessos", { metodo: "POST", corpo: { email } }),
  tirarAcesso: (email) => chamar(`/api/admin/acessos/${encodeURIComponent(email)}`, { metodo: "DELETE" }),
  listar: () => chamar("/api/admin/projetos").then((d) => d.projetos),
  criar: (secao, dados, publicado) => chamar("/api/admin/projetos", { metodo: "POST", corpo: { secao, dados, publicado } }),
  salvar: (id, campos) => chamar(`/api/admin/projetos/${encodeURIComponent(id)}`, { metodo: "PUT", corpo: campos }),
  apagar: (id) => chamar(`/api/admin/projetos/${encodeURIComponent(id)}`, { metodo: "DELETE" }),
  ordenar: (secao, ids) => chamar("/api/admin/ordem", { metodo: "PUT", corpo: { secao, ids } }),
  importar: (backup) => chamar("/api/admin/importar", { metodo: "POST", corpo: backup }),
  enviarImagem: (blob, pasta) => chamar(`/api/admin/imagens${pasta ? `?pasta=${pasta}` : ""}`, { metodo: "POST", corpo: blob, tipo: blob.type }).then((d) => d.url),
  config: () => chamar("/api/admin/config"),
  salvarConfig: (config) => chamar("/api/admin/config", { metodo: "PUT", corpo: { config } }),
  publicarConfig: () => chamar("/api/admin/config/publicar", { metodo: "POST", corpo: {} }),
  descartarConfig: () => chamar("/api/admin/config/descartar", { metodo: "POST", corpo: {} }),
  restaurarConfig: (id) => chamar("/api/admin/config/restaurar", { metodo: "POST", corpo: { id } }),
};

// Reduz a imagem para no máximo 1920 px de largura e converte para WebP (ou JPG no
// navegador que não gera WebP), para o site carregar rápido.
export async function prepararImagem(arquivo) {
  const LARGURA_MAX = 1920;
  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, LARGURA_MAX / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  const gerar = (tipo) => new Promise((ok) => canvas.toBlob(ok, tipo, 0.85));
  let blob = await gerar("image/webp");
  if (!blob || blob.type !== "image/webp") blob = await gerar("image/jpeg");
  return blob;
}
