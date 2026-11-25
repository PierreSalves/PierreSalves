import { StrictMode, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, useColorScheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// Roboto Flex com eixo de tamanho óptico (opsz), como no wireframe.
import "@fontsource-variable/roboto-flex/opsz.css";
import { criarTema } from "./tema.js";
import { SiteProvider, useSite, configInicial, emPrevia } from "./config/contexto.jsx";
import { PedidoProvider } from "./components/Pedido.jsx";
import { Topo, Abertura } from "./components/Topo.jsx";
import { Vitrine } from "./components/Vitrine.jsx";
import { Diferenciais, Servicos, Portfolio, Contato, Rodape } from "./components/Secoes.jsx";
import { Localizacao } from "./components/Localizacao.jsx";
import { Avaliacoes } from "./components/Avaliacoes.jsx";

// Um componente por tipo de seção (ver app/config/esquema.js > TIPOS_SECAO).
const SECOES = {
  abertura: Abertura,
  vitrine: Vitrine,
  diferenciais: Diferenciais,
  servicos: Servicos,
  portfolio: Portfolio,
  localizacao: Localizacao,
  avaliacoes: Avaliacoes,
  contato: Contato,
};

// Sem o botão de tema na página, vale sempre o modo escolhido no painel.
function ModoFixo() {
  const { tema } = useSite();
  const { setMode } = useColorScheme();
  useEffect(() => {
    if (!tema.botaoModo && !emPrevia()) setMode(tema.modoPadrao);
  }, [tema.botaoModo, tema.modoPadrao, setMode]);
  // Na prévia do painel, o painel escolhe claro ou escuro.
  useEffect(() => {
    if (!emPrevia()) return undefined;
    const receber = (ev) => {
      if (ev.origin === location.origin && ev.source === window.parent && ev.data?.tipo === "tgh-modo") setMode(ev.data.modo);
    };
    window.addEventListener("message", receber);
    return () => window.removeEventListener("message", receber);
  }, [setMode]);
  return null;
}

function Pagina() {
  const config = useSite();
  return (
    <PedidoProvider>
      <Topo />
      <main>
        {config.secoes
          .filter((s) => s.visivel && SECOES[s.tipo])
          .map((s) => {
            const Secao = SECOES[s.tipo];
            return <Secao key={s.tipo} secao={s} />;
          })}
      </main>
      <Rodape />
    </PedidoProvider>
  );
}

function ComTema() {
  const config = useSite();
  const tema = useMemo(() => criarTema(config.tema), [config.tema]);
  return (
    // Na prévia o modo fica guardado em outra chave, para não mudar o do site nem o do painel.
    <ThemeProvider theme={tema} defaultMode={config.tema.modoPadrao} {...(emPrevia() ? { modeStorageKey: "previa-mode", colorSchemeStorageKey: "previa-color-scheme" } : {})}>
      <CssBaseline enableColorScheme />
      <ModoFixo />
      <Pagina />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("raiz")).render(
  <StrictMode>
    <SiteProvider inicial={configInicial()}>
      <ComTema />
    </SiteProvider>
  </StrictMode>,
);
