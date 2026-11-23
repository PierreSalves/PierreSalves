import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import site from "./site.config.js";
import { criarTema } from "./tema.js";
import { PedidoProvider } from "./components/Pedido.jsx";
import { Topo, Abertura } from "./components/Topo.jsx";
import { Vitrine } from "./components/Vitrine.jsx";
import { SobMedida, Servicos, Portfolio, Contato, Rodape } from "./components/Secoes.jsx";

const tema = criarTema(site.tema.corPrincipal);

function App() {
  return (
    <PedidoProvider>
      <Topo />
      <main>
        <Abertura />
        <Vitrine />
        <SobMedida />
        <Servicos />
        <Portfolio />
        <Contato />
      </main>
      <Rodape />
    </PedidoProvider>
  );
}

createRoot(document.getElementById("raiz")).render(
  <StrictMode>
    <ThemeProvider theme={tema}>
      <CssBaseline enableColorScheme />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
