// Aba "Página": layout pronto, ordem das seções, quais aparecem, variação de cada uma
// e o conteúdo (textos, botões, imagens) de cada seção.
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ButtonBase from "@mui/material/ButtonBase";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import DashboardCustomizeRounded from "@mui/icons-material/DashboardCustomizeRounded";
import { Icone } from "../icones.jsx";
import { Campos } from "./Campos.jsx";
import { CAMPOS_SECAO } from "./camposSecoes.js";
import { TIPOS_SECAO, LAYOUTS, aplicarLayout, slug } from "../config/esquema.js";

function EscolherLayout({ aberto, atual, aoFechar, aoAplicar }) {
  const [escolhido, setEscolhido] = useState(atual || LAYOUTS[0].id);
  return (
    <Dialog open={aberto} onClose={aoFechar} maxWidth="sm" fullWidth>
      <DialogTitle>Trocar o layout da página</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          O layout muda a ordem, quais seções aparecem e o desenho de cada uma. Os textos e imagens continuam os mesmos. Nada vai para o site antes de você publicar.
        </Typography>
        <Stack spacing={1.25}>
          {LAYOUTS.map((l) => (
            <ButtonBase
              key={l.id}
              onClick={() => setEscolhido(l.id)}
              sx={{ justifyContent: "flex-start", textAlign: "left", alignItems: "flex-start", gap: 1.5, p: 1.5, borderRadius: 4, border: 1, borderColor: escolhido === l.id ? "primary.main" : "divider", bgcolor: escolhido === l.id ? "superficie.media" : "transparent" }}
            >
              <Radio checked={escolhido === l.id} tabIndex={-1} size="small" sx={{ p: 0.5 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 500 }}>{l.nome}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>{l.descricao}</Typography>
                <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 0.5 }}>
                  {l.secoes.map(([tipo], i) => (
                    <Chip key={tipo} size="small" variant="outlined" label={`${i + 1}. ${TIPOS_SECAO[tipo].nome}`} />
                  ))}
                </Stack>
              </Box>
            </ButtonBase>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={aoFechar}>Cancelar</Button>
        <Button variant="contained" onClick={() => aoAplicar(escolhido)}>Aplicar layout</Button>
      </DialogActions>
    </Dialog>
  );
}

function LinhaSecao({ secao, i, total, aoMover, aoVisivel, aoAbrir }) {
  const tipo = TIPOS_SECAO[secao.tipo];
  const variante = tipo.variantes.find((v) => v.id === secao.variante);
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", bgcolor: "superficie.baixa", borderRadius: 4, pl: 1, pr: 0.5, py: 0.5, opacity: secao.visivel ? 1 : 0.65 }}>
      <Stack sx={{ flex: "none" }}>
        <IconButton size="small" aria-label={`Subir ${tipo.nome}`} disabled={i === 0} onClick={() => aoMover(i, -1)}><ArrowUpwardRounded fontSize="small" /></IconButton>
        <IconButton size="small" aria-label={`Descer ${tipo.nome}`} disabled={i === total - 1} onClick={() => aoMover(i, 1)}><ArrowDownwardRounded fontSize="small" /></IconButton>
      </Stack>
      <ButtonBase onClick={aoAbrir} sx={{ flex: 1, minWidth: 0, justifyContent: "flex-start", textAlign: "left", gap: 1.5, borderRadius: 3, p: 1 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 3, bgcolor: "container.main", color: "container.contrastText", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <Icone nome={tipo.icone} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 500 }}>{tipo.nome}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {secao.visivel ? variante?.nome : "Escondida"}
          </Typography>
        </Box>
        <ChevronRightRounded sx={{ color: "text.secondary" }} />
      </ButtonBase>
      <Tooltip title={secao.visivel ? "Aparece na página" : "Escondida"}>
        <Switch checked={secao.visivel} onChange={(e) => aoVisivel(e.target.checked)} slotProps={{ input: { "aria-label": `Mostrar ${tipo.nome}` } }} />
      </Tooltip>
    </Stack>
  );
}

function DetalheSecao({ secao, config, aoMudar, aoVoltar, aoErro, chaveGoogle }) {
  const tipo = TIPOS_SECAO[secao.tipo];
  const mudar = (campos) => aoMudar({ ...secao, ...campos });
  const contexto = {
    tiposDePedido: config.tiposDePedido,
    ancoras: config.secoes.filter((s) => s.visivel).map((s) => `#${s.ancora}`),
    aoErro,
    variante: secao.variante,
  };
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <IconButton onClick={aoVoltar} aria-label="Voltar para as seções" edge="start"><ArrowBackRounded /></IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 20 }}>{tipo.nome}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>{tipo.descricao}</Typography>
        </Box>
        <FormControlLabel control={<Switch checked={secao.visivel} onChange={(e) => mudar({ visivel: e.target.checked })} />} label="Visível" labelPlacement="start" sx={{ mr: 0 }} />
      </Stack>

      {secao.tipo === "avaliacoes" && !chaveGoogle && (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Este site ainda não tem a chave do Google (segredo GOOGLE_PLACES_KEY no Worker). Sem ela, a seção mostra só o botão para as avaliações no Google Maps. O passo a passo está no README, em “Avaliações do Google”.
        </Alert>
      )}

      <Stack spacing={1.25}>
        <Typography sx={{ fontWeight: 500 }}>Desenho</Typography>
        {tipo.variantes.map((v) => (
          <ButtonBase
            key={v.id}
            onClick={() => mudar({ variante: v.id })}
            sx={{ justifyContent: "flex-start", textAlign: "left", gap: 1.25, p: 1.25, borderRadius: 4, border: 1, borderColor: secao.variante === v.id ? "primary.main" : "divider", bgcolor: secao.variante === v.id ? "superficie.media" : "transparent" }}
          >
            <Radio checked={secao.variante === v.id} tabIndex={-1} size="small" sx={{ p: 0.5 }} />
            <Box>
              <Typography sx={{ fontWeight: 500 }}>{v.nome}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>{v.descricao}</Typography>
            </Box>
          </ButtonBase>
        ))}
      </Stack>

      <Divider />
      <Stack spacing={2}>
        <Typography sx={{ fontWeight: 500 }}>Menu e endereço</Typography>
        <FormControlLabel control={<Switch checked={secao.menu.mostrar} onChange={(e) => mudar({ menu: { ...secao.menu, mostrar: e.target.checked } })} />} label="Aparece no menu do topo" sx={{ ml: 0, gap: 1 }} />
        {secao.menu.mostrar && <TextField label="Texto no menu" value={secao.menu.texto} onChange={(e) => mudar({ menu: { ...secao.menu, texto: e.target.value } })} slotProps={{ htmlInput: { maxLength: 30 } }} />}
        <TextField
          label="Endereço da seção"
          value={secao.ancora}
          onChange={(e) => mudar({ ancora: e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]+/g, "-").slice(0, 40) })}
          error={!slug(secao.ancora)}
          helperText={`Links para esta seção usam #${secao.ancora}`}
          slotProps={{ input: { startAdornment: <Typography sx={{ color: "text.secondary", mr: 0.25 }}>#</Typography> }, htmlInput: { maxLength: 40 } }}
        />
      </Stack>

      <Divider />
      <Stack spacing={2}>
        <Typography sx={{ fontWeight: 500 }}>Conteúdo</Typography>
        <Campos campos={CAMPOS_SECAO[secao.tipo] || []} valor={secao.dados} aoMudar={(dados) => mudar({ dados })} contexto={contexto} />
      </Stack>
    </Stack>
  );
}

export function EditorPagina({ config, aoMudar, aoErro, chaveGoogle, aberta, aoAbrir }) {
  const [trocarLayout, setTrocarLayout] = useState(false);
  const layout = LAYOUTS.find((l) => l.id === config.layout);
  const secaoAberta = config.secoes.find((s) => s.tipo === aberta);

  const mudarSecao = (nova) => aoMudar({ ...config, secoes: config.secoes.map((s) => (s.tipo === nova.tipo ? nova : s)) });
  const mover = (i, lado) => {
    const j = i + lado;
    const secoes = [...config.secoes];
    [secoes[i], secoes[j]] = [secoes[j], secoes[i]];
    aoMudar({ ...config, secoes });
  };

  if (secaoAberta) {
    return <DetalheSecao key={secaoAberta.tipo} secao={secaoAberta} config={config} aoMudar={mudarSecao} aoVoltar={() => aoAbrir(null)} aoErro={aoErro} chaveGoogle={chaveGoogle} />;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", bgcolor: "superficie.media", borderRadius: 5, p: 2 }}>
        <DashboardCustomizeRounded sx={{ color: "primary.main" }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>Layout de partida</Typography>
          <Typography sx={{ fontWeight: 500 }}>{layout ? layout.nome : "Personalizado"}</Typography>
        </Box>
        <Button variant="outlined" onClick={() => setTrocarLayout(true)}>Trocar</Button>
      </Stack>

      <Box>
        <Typography sx={{ fontWeight: 500 }}>Seções</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>A ordem aqui é a ordem na página. Toque numa seção para mudar o desenho e o conteúdo.</Typography>
        <Stack spacing={1}>
          {config.secoes.map((s, i) => (
            <LinhaSecao
              key={s.tipo}
              secao={s}
              i={i}
              total={config.secoes.length}
              aoMover={mover}
              aoVisivel={(visivel) => mudarSecao({ ...s, visivel })}
              aoAbrir={() => aoAbrir(s.tipo)}
            />
          ))}
        </Stack>
      </Box>

      {trocarLayout && (
        <EscolherLayout
          aberto
          atual={config.layout}
          aoFechar={() => setTrocarLayout(false)}
          aoAplicar={(id) => {
            aoMudar(aplicarLayout(config, id));
            setTrocarLayout(false);
          }}
        />
      )}
    </Stack>
  );
}
