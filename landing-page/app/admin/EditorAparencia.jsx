// Aba "Aparência": cores do tema claro e escuro, estilo do Material 3, contraste,
// ajustes manuais papel por papel, modo padrão e cantos.
import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Radio from "@mui/material/Radio";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import ButtonBase from "@mui/material/ButtonBase";
import { CampoCor } from "./Campos.jsx";
import { papeisDoTema, contraste } from "../tema.js";
import { ESTILOS, CANTOS, MODOS, PAPEIS, NOMES_PAPEIS } from "../config/esquema.js";

// Pares de cor e texto que precisam de contraste para leitura.
const PARES = [
  ["primary", "onPrimary"],
  ["primaryContainer", "onPrimaryContainer"],
  ["secondaryContainer", "onSecondaryContainer"],
  ["tertiaryContainer", "onTertiaryContainer"],
  ["surface", "onSurface"],
  ["surface", "onSurfaceVariant"],
  ["surfaceContainerLow", "onSurface"],
  ["surfaceContainerHigh", "onSurface"],
];

function Bloco({ titulo, texto, children }) {
  return (
    <Stack spacing={2} component="section">
      <Box>
        <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{titulo}</Typography>
        {texto && <Typography variant="body2" sx={{ color: "text.secondary" }}>{texto}</Typography>}
      </Box>
      {children}
    </Stack>
  );
}

function Amostras({ cores }) {
  return (
    <Stack direction="row" sx={{ borderRadius: 2, overflow: "hidden", width: 120, height: 28, flex: "none" }}>
      {["primary", "primaryContainer", "secondaryContainer", "tertiaryContainer", "surfaceContainerHigh"].map((p) => (
        <Box key={p} sx={{ flex: 1, bgcolor: cores[p] }} />
      ))}
    </Stack>
  );
}

function Paleta({ tema, escuro, aoAjustar }) {
  const cores = useMemo(() => papeisDoTema(tema, escuro), [tema, escuro]);
  const ajustes = tema.ajustes[escuro ? "escuro" : "claro"];
  const [aberto, setAberto] = useState(null); // { el, papel }
  const ruins = PARES.filter(([f, t]) => contraste(cores[f], cores[t]) < 4.5);

  return (
    <Stack spacing={2}>
      {ruins.length > 0 && (
        <Alert severity="warning" sx={{ borderRadius: 3 }}>
          Pouco contraste para ler: {ruins.map(([f, t]) => `${NOMES_PAPEIS[t].toLowerCase()} (${contraste(cores[f], cores[t]).toFixed(1)}:1)`).join(", ")}. O ideal é 4,5:1 ou mais.
        </Alert>
      )}
      {PAPEIS.map((g) => (
        <Box key={g.grupo}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>{g.grupo}</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 1 }}>
            {g.papeis.map((p) => (
              <ButtonBase
                key={p}
                onClick={(e) => setAberto({ el: e.currentTarget, papel: p })}
                sx={{ display: "block", textAlign: "left", borderRadius: 3, overflow: "hidden", border: 1, borderColor: "divider", "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" } }}
              >
                <Box sx={{ height: 40, bgcolor: cores[p], position: "relative" }}>
                  {ajustes[p] && <Box title="Ajustada à mão" sx={{ position: "absolute", top: 6, right: 6, width: 10, height: 10, borderRadius: "50%", bgcolor: "#fff", border: "2px solid #000" }} />}
                </Box>
                <Box sx={{ px: 1, py: 0.75 }}>
                  <Typography sx={{ fontSize: 12, lineHeight: 1.3 }}>{NOMES_PAPEIS[p]}</Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", fontFamily: "monospace" }}>{cores[p].toUpperCase()}</Typography>
                </Box>
              </ButtonBase>
            ))}
          </Box>
        </Box>
      ))}
      <Popover open={!!aberto} anchorEl={aberto?.el} onClose={() => setAberto(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} slotProps={{ paper: { sx: { p: 2, borderRadius: 4, width: 300 } } }}>
        {aberto && (
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 500 }}>{NOMES_PAPEIS[aberto.papel]} · {escuro ? "escuro" : "claro"}</Typography>
            <CampoCor valor={(ajustes[aberto.papel] || cores[aberto.papel]).toUpperCase()} aoMudar={(c) => aoAjustar(aberto.papel, c)} rotulo="Cor" />
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Button disabled={!ajustes[aberto.papel]} onClick={() => aoAjustar(aberto.papel, "")}>Voltar ao automático</Button>
              <Button variant="contained" onClick={() => setAberto(null)}>Pronto</Button>
            </Stack>
          </Stack>
        )}
      </Popover>
    </Stack>
  );
}

export function EditorAparencia({ config, aoMudar }) {
  const t = config.tema;
  const mudar = (campos) => aoMudar({ ...config, tema: { ...t, ...campos } });
  const [modoPaleta, setModoPaleta] = useState(0);
  const previas = useMemo(() => Object.fromEntries(ESTILOS.map((e) => [e.id, papeisDoTema({ ...t, estilo: e.id, ajustes: {} }, false)])), [t.corPrincipal, t.corSecundaria, t.corTerciaria, t.contraste]);
  const totalAjustes = Object.keys(t.ajustes.claro).length + Object.keys(t.ajustes.escuro).length;

  const ajustar = (escuro) => (papel, cor) => {
    const modo = escuro ? "escuro" : "claro";
    const novo = { ...t.ajustes[modo] };
    if (cor) novo[papel] = cor;
    else delete novo[papel];
    mudar({ ajustes: { ...t.ajustes, [modo]: novo } });
  };

  return (
    <Stack spacing={4} divider={<Divider flexItem />}>
      <Bloco titulo="Cores" texto="As paletas do tema claro e do escuro saem destas cores, pelo algoritmo do Material 3.">
        <CampoCor valor={t.corPrincipal} aoMudar={(c) => mudar({ corPrincipal: c || t.corPrincipal })} rotulo="Cor principal" />
        <FormControlLabel control={<Switch checked={!!t.corSecundaria} onChange={(e) => mudar({ corSecundaria: e.target.checked ? "#5C6BC0" : "" })} />} label="Escolher a cor secundária" />
        {t.corSecundaria && <CampoCor valor={t.corSecundaria} aoMudar={(c) => mudar({ corSecundaria: c })} rotulo="Cor secundária" ajuda="Usada nos botões tonais e detalhes." />}
        <FormControlLabel control={<Switch checked={!!t.corTerciaria} onChange={(e) => mudar({ corTerciaria: e.target.checked ? "#C2185B" : "" })} />} label="Escolher a cor terciária" />
        {t.corTerciaria && <CampoCor valor={t.corTerciaria} aoMudar={(c) => mudar({ corTerciaria: c })} rotulo="Cor terciária" ajuda="Usada em selos e destaques, como “No ar”." />}
      </Bloco>

      <Bloco titulo="Estilo das cores">
        <Stack spacing={1}>
          {ESTILOS.map((e) => (
            <ButtonBase
              key={e.id}
              onClick={() => mudar({ estilo: e.id })}
              sx={{ justifyContent: "flex-start", textAlign: "left", gap: 1.5, p: 1.25, pr: 2, borderRadius: 4, border: 1, borderColor: t.estilo === e.id ? "primary.main" : "divider", bgcolor: t.estilo === e.id ? "superficie.media" : "transparent" }}
            >
              <Radio checked={t.estilo === e.id} tabIndex={-1} size="small" sx={{ p: 0.5 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 500 }}>{e.nome}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>{e.descricao}</Typography>
              </Box>
              <Amostras cores={previas[e.id]} />
            </ButtonBase>
          ))}
        </Stack>
      </Bloco>

      <Bloco titulo="Contraste" texto="Mais contraste deixa textos e bordas mais fortes.">
        <ToggleButtonGroup exclusive value={t.contraste} onChange={(_, v) => v !== null && mudar({ contraste: v })} size="small">
          <ToggleButton value={0}>Padrão</ToggleButton>
          <ToggleButton value={0.5}>Médio</ToggleButton>
          <ToggleButton value={1}>Alto</ToggleButton>
        </ToggleButtonGroup>
      </Bloco>

      <Bloco titulo="Paletas" texto="Toque numa cor para ajustar à mão. Cada modo tem seus próprios ajustes.">
        <Tabs value={modoPaleta} onChange={(_, v) => setModoPaleta(v)} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tab label={`Claro${Object.keys(t.ajustes.claro).length ? ` (${Object.keys(t.ajustes.claro).length})` : ""}`} />
          <Tab label={`Escuro${Object.keys(t.ajustes.escuro).length ? ` (${Object.keys(t.ajustes.escuro).length})` : ""}`} />
        </Tabs>
        <Paleta tema={t} escuro={modoPaleta === 1} aoAjustar={ajustar(modoPaleta === 1)} />
        {totalAjustes > 0 && (
          <Box>
            <Button onClick={() => mudar({ ajustes: { claro: {}, escuro: {} } })}>Desfazer todos os ajustes manuais</Button>
          </Box>
        )}
      </Bloco>

      <Bloco titulo="Claro ou escuro">
        <ToggleButtonGroup exclusive value={t.modoPadrao} onChange={(_, v) => v && mudar({ modoPadrao: v })} size="small">
          {MODOS.map((m) => <ToggleButton key={m.id} value={m.id}>{m.nome}</ToggleButton>)}
        </ToggleButtonGroup>
        <FormControlLabel
          control={<Switch checked={t.botaoModo} onChange={(e) => mudar({ botaoModo: e.target.checked })} />}
          label={
            <Box>
              <Typography>Botão de claro/escuro no topo</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>{t.botaoModo ? "O visitante pode trocar. O modo acima vale na primeira visita." : "A página fica sempre no modo escolhido acima."}</Typography>
            </Box>
          }
          sx={{ alignItems: "flex-start", ml: 0, gap: 1, "& .MuiSwitch-root": { mt: -0.75 } }}
        />
      </Bloco>

      <Bloco titulo="Cantos" texto="Arredondamento de cartões, botões e imagens.">
        <ToggleButtonGroup exclusive value={t.cantos} onChange={(_, v) => v && mudar({ cantos: v })} size="small">
          {CANTOS.map((c) => <ToggleButton key={c.id} value={c.id}>{c.nome}</ToggleButton>)}
        </ToggleButtonGroup>
      </Bloco>
    </Stack>
  );
}
