// Configuração da página para os componentes React.
// O Worker põe a configuração publicada (ou o rascunho, na prévia do painel) dentro do HTML,
// em <script id="site-config">. Sem ela, vale o padrão do app/site.config.js.
// Na prévia do painel (/?previa=1 dentro de um iframe do /admin) o painel manda cada
// alteração por postMessage e a página se redesenha na hora, sem salvar nada.
import { createContext, useContext, useEffect, useState } from "react";
import { limparConfig } from "./esquema.js";

function lerScript(id) {
  try {
    const el = typeof document !== "undefined" && document.getElementById(id);
    return el ? JSON.parse(el.textContent) : null;
  } catch {
    return null;
  }
}

export const configInicial = () => limparConfig(lerScript("site-config") || undefined);

export const emPrevia = () =>
  typeof window !== "undefined" && window.parent !== window && new URLSearchParams(location.search).has("previa");

const Contexto = createContext(null);
export const useSite = () => useContext(Contexto);

export function SiteProvider({ inicial, children, aoMudar }) {
  const [config, setConfig] = useState(inicial);

  useEffect(() => {
    if (!emPrevia()) return undefined;
    const receber = (ev) => {
      if (ev.origin !== location.origin || ev.source !== window.parent) return;
      if (ev.data?.tipo === "tgh-config" && ev.data.config) {
        const nova = limparConfig(ev.data.config);
        setConfig(nova);
        aoMudar?.(nova);
      }
      if (ev.data?.tipo === "tgh-ir" && typeof ev.data.ancora === "string") {
        // scrollTo em vez de scrollIntoView: este rola só o iframe, não a página do painel.
        const el = document.getElementById(ev.data.ancora);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      }
    };
    window.addEventListener("message", receber);
    window.parent.postMessage({ tipo: "tgh-pronto" }, location.origin);
    return () => window.removeEventListener("message", receber);
  }, [aoMudar]);

  return <Contexto.Provider value={config}>{children}</Contexto.Provider>;
}
