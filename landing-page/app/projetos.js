// Cards de projetos da página. Vêm do banco (o Worker põe o JSON no HTML, em
// <script id="projetos-dados">) e são editados em /admin. Sem banco, ou se ele falhar,
// a página usa as listas do site.config.js (útil também para usar como modelo sem banco).
import site from "./site.config.js";

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
  vitrine: Array.isArray(doBanco?.vitrine) ? doBanco.vitrine : site.vitrine.apps,
  outros: Array.isArray(doBanco?.outros) ? doBanco.outros : site.portfolio.projetos.itens,
};
