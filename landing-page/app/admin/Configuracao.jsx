// Edição da configuração da página: guarda o rascunho sozinho (1 s depois da última
// alteração), mostra a prévia ao vivo e publica quando você manda.
// Prévia e site oficial usam o mesmo banco: nada aparece no site antes de "Publicar".
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import PublishRounded from "@mui/icons-material/PublishRounded";
import UndoRounded from "@mui/icons-material/UndoRounded";
import CloudDoneRounded from "@mui/icons-material/CloudDoneRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import { api, mensagemDeErro } from "./api.js";
import { limparConfig } from "../config/esquema.js";
import { EditorPagina } from "./EditorPagina.jsx";
import { EditorAparencia } from "./EditorAparencia.jsx";
import { EditorGeral } from "./EditorGeral.jsx";
import { Previa } from "./Previa.jsx";

const ESPERA_SALVAR = 1000;
const quando = (iso) => (iso ? new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "");

function Historico({ aberto, itens, aoFechar, aoRestaurar }) {
  return (
    <Dialog open={aberto} onClose={aoFechar} maxWidth="xs" fullWidth>
      <DialogTitle>Publicações anteriores</DialogTitle>
      <DialogContent sx={{ px: 1 }}>
        {itens.length === 0 ? (
          <Typography sx={{ color: "text.secondary", px: 2 }}>Ainda não houve nenhuma publicação.</Typography>
        ) : (
          <List dense>
            {itens.map((h, i) => (
              <ListItem key={h.id} secondaryAction={<Button size="small" onClick={() => aoRestaurar(h)}>Voltar a esta</Button>}>
                <ListItemText primary={`${quando(h.publicado_em)}${i === 0 ? " · no site agora" : ""}`} secondary={h.publicado_por} />
              </ListItem>
            ))}
          </List>
        )}
        <Typography variant="body2" sx={{ color: "text.secondary", px: 2, pt: 1 }}>Voltar a uma versão troca o rascunho por ela. O site só muda quando você publicar.</Typography>
      </DialogContent>
      <DialogActions><Button onClick={aoFechar}>Fechar</Button></DialogActions>
    </Dialog>
  );
}

export function Configuracao({ aba, aoAvisar, aoErro, aoSair }) {
  const [carregado, setCarregado] = useState(null); // { publicadoTexto, historico, chaveGoogle }
  const [config, setConfig] = useState(null);
  const [falha, setFalha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [salvoEm, setSalvoEm] = useState("");
  const [publicando, setPublicando] = useState(false);
  const [confirmar, setConfirmar] = useState(null); // "publicar" | "descartar" | { restaurar }
  const [historico, setHistorico] = useState(false);
  const [secaoAberta, setSecaoAberta] = useState(null);
  const [vista, setVista] = useState(0); // celular/tablet: 0 editar, 1 prévia
  const largo = useMediaQuery((t) => t.breakpoints.up("lg"));
  const pendente = useRef(null); // config ainda não salva
  const timer = useRef(null);

  const tratar = useCallback((e) => (e?.codigo === "sem-acesso" ? aoSair(mensagemDeErro(e)) : aoErro(mensagemDeErro(e))), [aoSair, aoErro]);

  useEffect(() => {
    api.config().then(
      (r) => {
        const base = r.rascunho?.config || r.publicado?.config || limparConfig(undefined);
        setConfig(base);
        setSalvoEm(r.rascunho?.atualizado_em || "");
        setCarregado({ publicadoTexto: r.publicado ? JSON.stringify(r.publicado.config) : null, historico: r.historico, chaveGoogle: r.chaveGoogle });
      },
      (e) => (e.codigo === "sem-acesso" ? aoSair(mensagemDeErro(e)) : setFalha(mensagemDeErro(e))),
    );
  }, [aoSair]);

  const salvarAgora = useCallback(async () => {
    clearTimeout(timer.current);
    const cfg = pendente.current;
    if (!cfg) return true;
    pendente.current = null;
    setSalvando(true);
    try {
      const r = await api.salvarConfig(cfg);
      setSalvoEm(r.atualizado_em);
      return true;
    } catch (e) {
      if (!pendente.current) pendente.current = cfg;
      tratar(e);
      return false;
    } finally {
      setSalvando(false);
    }
  }, [tratar]);

  const mudar = useCallback(
    (nova) => {
      setConfig(nova);
      pendente.current = nova;
      clearTimeout(timer.current);
      timer.current = setTimeout(salvarAgora, ESPERA_SALVAR);
    },
    [salvarAgora],
  );

  // Não deixa fechar a aba com alteração não salva.
  useEffect(() => {
    const antes = (e) => {
      if (pendente.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", antes);
    return () => {
      window.removeEventListener("beforeunload", antes);
      clearTimeout(timer.current);
    };
  }, []);

  const limpo = useMemo(() => (config ? JSON.stringify(limparConfig(config)) : ""), [config]);
  const alterado = carregado && limpo !== carregado.publicadoTexto;

  async function publicar() {
    setConfirmar(null);
    setPublicando(true);
    try {
      if (!(await salvarAgora())) return;
      const r = await api.publicarConfig();
      setCarregado((c) => ({ ...c, publicadoTexto: limpo, historico: r.historico }));
      aoAvisar("Publicado. O site já mostra a nova versão.");
    } catch (e) {
      tratar(e);
    } finally {
      setPublicando(false);
    }
  }

  async function descartar() {
    setConfirmar(null);
    clearTimeout(timer.current);
    pendente.current = null;
    try {
      const r = await api.descartarConfig();
      setConfig(r.rascunho || limparConfig(undefined));
      aoAvisar("Alterações descartadas. O rascunho voltou a ser igual ao site.");
    } catch (e) {
      tratar(e);
    }
  }

  async function restaurar(h) {
    setConfirmar(null);
    setHistorico(false);
    clearTimeout(timer.current);
    pendente.current = null;
    try {
      const r = await api.restaurarConfig(h.id);
      setConfig(r.config);
      aoAvisar(`Versão de ${quando(h.publicado_em)} no rascunho. Publique para ela voltar ao site.`);
    } catch (e) {
      tratar(e);
    }
  }

  if (falha) return <Alert severity="error" action={<Button color="inherit" onClick={() => location.reload()}>Recarregar</Button>}>{falha}</Alert>;
  if (!config || !carregado) return <Stack spacing={1.5}>{[0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={72} sx={{ borderRadius: 4 }} />)}</Stack>;

  const status = salvando ? "Salvando o rascunho…" : alterado ? (salvoEm ? `Rascunho salvo às ${new Date(salvoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}. Ainda não está no site.` : "Alterações ainda não publicadas.") : "O site está igual ao rascunho.";
  const ancora = aba === "pagina" && secaoAberta ? config.secoes.find((s) => s.tipo === secaoAberta)?.ancora : null;

  const editor =
    aba === "aparencia" ? (
      <EditorAparencia config={config} aoMudar={mudar} />
    ) : aba === "geral" ? (
      <EditorGeral config={config} aoMudar={mudar} aoErro={aoErro} />
    ) : (
      <EditorPagina config={config} aoMudar={mudar} aoErro={aoErro} chaveGoogle={carregado.chaveGoogle} aberta={secaoAberta} aoAbrir={(t) => { setSecaoAberta(t); window.scrollTo({ top: 0 }); }} />
    );

  return (
    <>
      <Stack
        direction="row"
        useFlexGap
        sx={[
          { alignItems: "center", gap: 1, flexWrap: "wrap", bgcolor: alterado ? "tonal.main" : "superficie.media", color: alterado ? "tonal.contrastText" : "text.primary", borderRadius: 5, px: 2, py: 1.25, mb: 2.5 },
          // No computador a barra fica presa embaixo do topo; a sombra da cor do fundo esconde o que passa por baixo.
          (t) => ({ [t.breakpoints.up("lg")]: { position: "sticky", top: 124, zIndex: 2, boxShadow: `0 0 0 12px ${t.vars.palette.background.default}` } }),
        ]}
      >
        {salvando ? <CircularProgress size={18} color="inherit" /> : !alterado && <CloudDoneRounded fontSize="small" />}
        <Typography variant="body2" sx={{ flex: 1, minWidth: 180 }}>{status}</Typography>
        <Tooltip title="Abrir o rascunho em outra aba">
          <IconButton size="small" color="inherit" href="/?previa=1" target="_blank" rel="noopener" aria-label="Abrir o rascunho em outra aba"><OpenInNewRounded fontSize="small" /></IconButton>
        </Tooltip>
        <Tooltip title="Publicações anteriores">
          <IconButton size="small" color="inherit" onClick={() => setHistorico(true)} aria-label="Publicações anteriores"><HistoryRounded fontSize="small" /></IconButton>
        </Tooltip>
        {alterado && carregado.publicadoTexto && (
          <Button size="small" color="inherit" startIcon={<UndoRounded />} onClick={() => setConfirmar("descartar")}>Descartar</Button>
        )}
        <Button variant="contained" startIcon={<PublishRounded />} disabled={!alterado || publicando} onClick={() => setConfirmar("publicar")}>
          {publicando ? "Publicando…" : "Publicar"}
        </Button>
      </Stack>

      {!largo && (
        <Tabs value={vista} onChange={(_, v) => setVista(v)} variant="fullWidth" sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
          <Tab label="Editar" />
          <Tab label="Prévia" />
        </Tabs>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", lg: "minmax(380px, 520px) minmax(0,1fr)" }, gap: 4, alignItems: "start" }}>
        <Box sx={{ display: largo || vista === 0 ? "block" : "none", pb: 8 }}>{editor}</Box>
        {(largo || vista === 1) && (
          <Previa config={config} ancora={ancora} sx={{ position: { lg: "sticky" }, top: { lg: 208 }, height: { xs: "calc(100vh - 220px)", lg: "calc(100vh - 228px)" }, minHeight: 480 }} />
        )}
      </Box>

      <Historico aberto={historico} itens={carregado.historico} aoFechar={() => setHistorico(false)} aoRestaurar={(h) => setConfirmar({ restaurar: h })} />

      <Dialog open={!!confirmar} onClose={() => setConfirmar(null)} maxWidth="xs" fullWidth>
        {confirmar === "publicar" && (
          <>
            <DialogTitle>Publicar no site?</DialogTitle>
            <DialogContent><Typography sx={{ color: "text.secondary" }}>O site passa a mostrar o rascunho agora. A versão atual fica guardada em “Publicações anteriores”.</Typography></DialogContent>
            <DialogActions><Button onClick={() => setConfirmar(null)}>Cancelar</Button><Button variant="contained" onClick={publicar}>Publicar</Button></DialogActions>
          </>
        )}
        {confirmar === "descartar" && (
          <>
            <DialogTitle>Descartar as alterações?</DialogTitle>
            <DialogContent><Typography sx={{ color: "text.secondary" }}>O rascunho volta a ser igual ao que está no site. Não dá para desfazer.</Typography></DialogContent>
            <DialogActions><Button onClick={() => setConfirmar(null)}>Cancelar</Button><Button color="error" onClick={descartar}>Descartar</Button></DialogActions>
          </>
        )}
        {confirmar?.restaurar && (
          <>
            <DialogTitle>Voltar à versão de {quando(confirmar.restaurar.publicado_em)}?</DialogTitle>
            <DialogContent><Typography sx={{ color: "text.secondary" }}>O rascunho de agora é trocado por essa versão. O site só muda quando você publicar.</Typography></DialogContent>
            <DialogActions><Button onClick={() => setConfirmar(null)}>Cancelar</Button><Button variant="contained" onClick={() => restaurar(confirmar.restaurar)}>Voltar a esta</Button></DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
