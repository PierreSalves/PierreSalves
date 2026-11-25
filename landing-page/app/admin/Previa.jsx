// Prévia ao vivo: a própria página (/?previa=1) num iframe. Cada alteração do painel é
// mandada por postMessage e a página se redesenha sem salvar. No modo computador a página
// é desenhada com 1280 px de largura e reduzida para caber na coluna.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DesktopWindowsRounded from "@mui/icons-material/DesktopWindowsRounded";
import SmartphoneRounded from "@mui/icons-material/SmartphoneRounded";
import LightModeRounded from "@mui/icons-material/LightModeRounded";
import DarkModeRounded from "@mui/icons-material/DarkModeRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";

const LARGURA = { computador: 1280, celular: 390 };

export function Previa({ config, ancora, sx }) {
  const quadro = useRef(null);
  const caixa = useRef(null);
  const pronto = useRef(false);
  const [aparelho, setAparelho] = useState("computador");
  const [modo, setModo] = useState("light");
  const [tamanho, setTamanho] = useState({ w: 800, h: 600 });
  const [versao, setVersao] = useState(0);

  const enviar = useCallback((msg) => {
    const w = quadro.current?.contentWindow;
    if (w && pronto.current) w.postMessage(msg, location.origin);
  }, []);

  // A página avisa quando está pronta para receber.
  useEffect(() => {
    const receber = (ev) => {
      if (ev.origin !== location.origin || ev.source !== quadro.current?.contentWindow) return;
      if (ev.data?.tipo === "tgh-pronto") {
        pronto.current = true;
        enviar({ tipo: "tgh-config", config: configRef.current });
        enviar({ tipo: "tgh-modo", modo: modoRef.current });
      }
    };
    window.addEventListener("message", receber);
    return () => window.removeEventListener("message", receber);
  }, [enviar]);

  const configRef = useRef(config);
  const modoRef = useRef(modo);
  useEffect(() => {
    configRef.current = config;
    const id = setTimeout(() => enviar({ tipo: "tgh-config", config }), 120);
    return () => clearTimeout(id);
  }, [config, enviar]);
  useEffect(() => {
    modoRef.current = modo;
    enviar({ tipo: "tgh-modo", modo });
  }, [modo, enviar]);
  useEffect(() => {
    if (ancora) enviar({ tipo: "tgh-ir", ancora });
  }, [ancora, enviar]);

  useLayoutEffect(() => {
    const el = caixa.current;
    if (!el) return undefined;
    const obs = new ResizeObserver(([e]) => setTamanho({ w: e.contentRect.width, h: e.contentRect.height }));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const largura = LARGURA[aparelho];
  const escala = aparelho === "computador" ? Math.min(1, tamanho.w / largura) : Math.min(1, (tamanho.h - 24) / 800, tamanho.w / (largura + 24));
  const alturaQuadro = aparelho === "computador" ? tamanho.h / escala : 800;

  return (
    <Stack sx={{ minHeight: 0, ...sx }}>
      <Stack direction="row" useFlexGap sx={{ alignItems: "center", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mr: "auto" }}>Prévia do rascunho</Typography>
        <ToggleButtonGroup size="small" exclusive value={aparelho} onChange={(_, v) => v && setAparelho(v)} aria-label="Aparelho">
          <ToggleButton value="computador" aria-label="Computador"><Tooltip title="Computador"><DesktopWindowsRounded fontSize="small" /></Tooltip></ToggleButton>
          <ToggleButton value="celular" aria-label="Celular"><Tooltip title="Celular"><SmartphoneRounded fontSize="small" /></Tooltip></ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup size="small" exclusive value={modo} onChange={(_, v) => v && setModo(v)} aria-label="Tema">
          <ToggleButton value="light" aria-label="Claro"><Tooltip title="Claro"><LightModeRounded fontSize="small" /></Tooltip></ToggleButton>
          <ToggleButton value="dark" aria-label="Escuro"><Tooltip title="Escuro"><DarkModeRounded fontSize="small" /></Tooltip></ToggleButton>
        </ToggleButtonGroup>
        <Tooltip title="Recarregar a prévia">
          <IconButton size="small" onClick={() => { pronto.current = false; setVersao((v) => v + 1); }} aria-label="Recarregar a prévia"><RefreshRounded fontSize="small" /></IconButton>
        </Tooltip>
      </Stack>
      <Box
        ref={caixa}
        sx={{ flex: 1, minHeight: 0, position: "relative", overflow: "hidden", borderRadius: 5, bgcolor: aparelho === "computador" ? "transparent" : "superficie.media", border: aparelho === "computador" ? 1 : 0, borderColor: "divider" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: aparelho === "computador" ? 0 : 12,
            left: aparelho === "computador" ? 0 : "50%",
            width: aparelho === "celular" ? largura + 16 : largura,
            height: aparelho === "celular" ? alturaQuadro + 16 : alturaQuadro,
            transform: aparelho === "computador" ? `scale(${escala})` : `translateX(-50%) scale(${escala})`,
            transformOrigin: aparelho === "computador" ? "top left" : "top center",
            borderRadius: aparelho === "celular" ? "28px" : 0,
            overflow: "hidden",
            boxShadow: aparelho === "celular" ? 6 : 0,
            border: aparelho === "celular" ? "8px solid" : 0,
            borderColor: "superficie.maxima",
          }}
        >
          <Box component="iframe" key={versao} ref={quadro} src="/?previa=1" title="Prévia da página" sx={{ border: 0, width: "100%", height: "100%", display: "block", bgcolor: "background.default" }} />
        </Box>
      </Box>
    </Stack>
  );
}
