// Cards de projetos da página. Vêm do banco (o Worker põe o JSON no HTML, em
// <script id="projetos-dados">) e são editados em /admin. Sem banco, ou se ele falhar,
// a página usa os cartões de app/projetosIniciais.js (útil também para usar como modelo sem banco).
import projetosIniciais from "./projetosIniciais.js";

function lerDoHtml() {
  try {
    const el = typeof document !== "undefined" && document.getElementById("projetos-dados");
    return el ? JSON.parse(el.textContent) : null;
  } catch {
    return null;
  }
}

const doBanco = lerDoHtml();

export const projetos = {
  vitrine: Array.isArray(doBanco?.vitrine) ? doBanco.vitrine : projetosIniciais.vitrine,
  outros: Array.isArray(doBanco?.outros) ? doBanco.outros : projetosIniciais.outros,
};
