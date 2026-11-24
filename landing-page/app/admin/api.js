// Chamadas do painel para o Worker (src/projetos.js).

export class ErroApi extends Error {
  constructor(codigo, status) {
    super(codigo);
    this.codigo = codigo;
    this.status = status;
  }
}

const MENSAGENS = {
  "sem-acesso": "Sua sessão expirou. Recarregue a página para entrar de novo.",
  rede: "Sem conexão com o site. Se a sessão expirou, recarregue a página.",
  nome: "Preencha o nome do projeto.",
  url: "Coloque um link válido (começando com https://).",
  "tipo-de-imagem": "Use uma imagem PNG, JPG, WebP ou AVIF.",
  "grande-demais": "A imagem passou de 4 MB, mesmo depois de reduzida.",
  "arquivo-invalido": "Esse arquivo não é um backup dos projetos.",
};
export const mensagemDeErro = (e) => MENSAGENS[e?.codigo] || (e?.codigo?.startsWith("item-invalido") ? "O backup tem um projeto com dados inválidos." : "Algo deu errado. Tente de novo.");

async function chamar(caminho, { metodo = "GET", corpo, tipo } = {}) {
  let resp;
  try {
    resp = await fetch(caminho, {
      method: metodo,
      credentials: "same-origin",
      // Sem "redirect: follow": com a sessão expirada o Access redireciona para o login.
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
  if (!resp.ok || dados?.ok === false) throw new ErroApi(dados?.erro || "erro", resp.status);
  return dados;
}

export const api = {
  eu: () => chamar("/api/admin/eu"),
  listar: () => chamar("/api/admin/projetos").then((d) => d.projetos),
  criar: (secao, dados, publicado) => chamar("/api/admin/projetos", { metodo: "POST", corpo: { secao, dados, publicado } }),
  salvar: (id, campos) => chamar(`/api/admin/projetos/${encodeURIComponent(id)}`, { metodo: "PUT", corpo: campos }),
  apagar: (id) => chamar(`/api/admin/projetos/${encodeURIComponent(id)}`, { metodo: "DELETE" }),
  ordenar: (secao, ids) => chamar("/api/admin/ordem", { metodo: "PUT", corpo: { secao, ids } }),
  importar: (backup) => chamar("/api/admin/importar", { metodo: "POST", corpo: backup }),
  enviarImagem: (blob) => chamar("/api/admin/imagens", { metodo: "POST", corpo: blob, tipo: blob.type }).then((d) => d.url),
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
