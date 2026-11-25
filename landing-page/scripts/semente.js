// Gera o SQL que coloca no banco os cards iniciais de app/projetosIniciais.js.
// Uso: node scripts/semente.js > semente.sql
//      npx wrangler d1 execute tghservices-site --remote --file semente.sql
// "INSERT OR IGNORE": rodar de novo não duplica nem desfaz o que foi editado no /admin.
import projetosIniciais from "../app/projetosIniciais.js";
import { limparProjeto } from "../src/projetos.js";

const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sql = (s) => "'" + String(s).replace(/'/g, "''") + "'";

const linhas = [];
const adicionar = (secao, lista) =>
  lista.forEach((item, ordem) => {
    const { dados, erro } = limparProjeto(secao, item);
    if (erro) throw new Error(`${secao}/${item.nome}: ${erro}`);
    linhas.push(`INSERT OR IGNORE INTO projetos (id, secao, ordem, publicado, dados) VALUES (${sql(slug(item.nome))}, ${sql(secao)}, ${ordem}, 1, ${sql(JSON.stringify(dados))});`);
  });

adicionar("vitrine", projetosIniciais.vitrine);
adicionar("outros", projetosIniciais.outros);
console.log(linhas.join("\n"));
