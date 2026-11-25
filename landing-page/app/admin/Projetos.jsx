// Aba "Projetos" do painel: criar, editar, ocultar, reordenar e apagar os cards de projetos.
// Os cards ficam no D1 (ver src/projetos.js) e aparecem no site assim que são salvos.
import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Fab from "@mui/material/Fab";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddRounded from "@mui/icons-material/AddRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";
import { Icone } from "../icones.jsx";
import { Editor, novoVitrine, novoOutro } from "./Editor.jsx";
import { api, mensagemDeErro } from "./api.js";

const SECOES = [
  { id: "vitrine", nome: "Vitrine", texto: "Cartões grandes da seção Vitrine." },
  { id: "outros", nome: "Outros projetos", texto: "Lista de projetos da seção Sobre / portfólio." },
];

function Miniatura({ projeto }) {
  const capa = projeto.secao === "vitrine" ? projeto.dados.telas?.[0] : null;
  return (
    <Box sx={{ width: { xs: 72, sm: 128 }, aspectRatio: "16 / 10", borderRadius: 3, overflow: "hidden", flex: "none", bgcolor: "container.main", color: "container.contrastText", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {capa ? (
        <Box component="img" src={capa.imagem} alt="" loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: capa.posicao || "left top" }} />
      ) : (
        <Icone nome={projeto.dados.icone} sx={{ fontSize: { xs: 28, sm: 36 } }} />
      )}
    </Box>
  );
}

function LinhaProjeto({ projeto, i, total, aoEditar, aoApagar, aoMover, aoPublicar }) {
  const d = projeto.dados;
  const sub = projeto.secao === "vitrine" ? d.publico : d.texto;
  return (
    <Stack
      direction="row"
      spacing={{ xs: 1.5, sm: 2 }}
      sx={{ alignItems: "center", p: { xs: 1.5, sm: 2 }, bgcolor: "superficie.baixa", borderRadius: 5, opacity: projeto.publicado ? 1 : 0.72, transition: "opacity .2s" }}
    >
      <Miniatura projeto={projeto} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" useFlexGap sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography component="h3" sx={{ fontSize: 17, fontWeight: 500 }}>{d.nome}</Typography>
          {projeto.secao === "vitrine" && d.status?.texto && (
            <Chip size="small" icon={<Icone nome={d.status.icone} />} label={d.status.texto} sx={{ bgcolor: "destaque.main", color: "destaque.contrastText", "& .MuiChip-icon": { color: "inherit" } }} />
          )}
          {!projeto.publicado && <Chip size="small" variant="outlined" icon={<VisibilityOffRounded />} label="Oculto" />}
        </Stack>
        {sub && <Typography variant="body2" sx={{ color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</Typography>}
        {projeto.secao === "vitrine" && (
          <Typography variant="caption" sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }}>
            {d.telas.length} {d.telas.length === 1 ? "tela" : "telas"} · {d.recursos.length} {d.recursos.length === 1 ? "recurso" : "recursos"}
          </Typography>
        )}
      </Box>
      <Stack direction={{ xs: "column", md: "row" }} sx={{ alignItems: "center", flex: "none" }}>
        <Tooltip title={projeto.publicado ? "Visível no site. Clique para ocultar." : "Oculto. Clique para mostrar no site."}>
          <Switch checked={projeto.publicado} onChange={(e) => aoPublicar(projeto, e.target.checked)} slotProps={{ input: { "aria-label": `Mostrar ${d.nome} no site` } }} />
        </Tooltip>
        <Stack direction="row">
          <Stack direction={{ xs: "column", sm: "row" }}>
            <IconButton aria-label={`Subir ${d.nome}`} disabled={i === 0} onClick={() => aoMover(i, -1)}><ArrowUpwardRounded /></IconButton>
            <IconButton aria-label={`Descer ${d.nome}`} disabled={i === total - 1} onClick={() => aoMover(i, 1)}><ArrowDownwardRounded /></IconButton>
          </Stack>
          <IconButton aria-label={`Editar ${d.nome}`} onClick={() => aoEditar(projeto)}><EditRounded /></IconButton>
          <IconButton aria-label={`Apagar ${d.nome}`} onClick={() => aoApagar(projeto)} sx={{ display: { xs: "none", sm: "inline-flex" } }}><DeleteOutlineRounded /></IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function Projetos({ avisar, erro, aoSair }) {
  const [projetos, setProjetos] = useState(null);
  const [falhaInicial, setFalhaInicial] = useState("");
  const [secao, setSecao] = useState("vitrine");
  const [editando, setEditando] = useState(null); // { projeto, chave }
  const [apagando, setApagando] = useState(null);
  const celular = useMediaQuery((t) => t.breakpoints.down("sm"));
  // Erro de sessão (venceu, ou o acesso foi tirado): volta para a tela de entrada.
  const tratar = useCallback((e) => (e?.codigo === "sem-acesso" ? aoSair(mensagemDeErro(e)) : erro(mensagemDeErro(e))), [aoSair, erro]);
  const recarregar = useCallback(async () => {
    try {
      setProjetos(await api.listar());
      setFalhaInicial("");
    } catch (e) {
      if (e.codigo === "sem-acesso") return aoSair(mensagemDeErro(e));
      if (projetos === null) setFalhaInicial(mensagemDeErro(e));
      else tratar(e);
    }
  }, [erro, projetos, aoSair]);

  useEffect(() => {
    recarregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const daSecao = (projetos || []).filter((p) => p.secao === secao).sort((a, b) => a.ordem - b.ordem);
  const infoSecao = SECOES.find((s) => s.id === secao);

  async function mover(i, lado) {
    const lista = [...daSecao];
    const j = i + lado;
    [lista[i], lista[j]] = [lista[j], lista[i]];
    const ids = lista.map((p) => p.id);
    setProjetos((todos) => todos.map((p) => (p.secao === secao ? { ...p, ordem: ids.indexOf(p.id) } : p)));
    try {
      await api.ordenar(secao, ids);
    } catch (e) {
      tratar(e);
      recarregar();
    }
  }

  async function publicar(projeto, publicado) {
    setProjetos((todos) => todos.map((p) => (p.id === projeto.id ? { ...p, publicado } : p)));
    try {
      await api.salvar(projeto.id, { publicado });
      avisar(publicado ? `“${projeto.dados.nome}” aparece no site.` : `“${projeto.dados.nome}” foi ocultado do site.`);
    } catch (e) {
      tratar(e);
      recarregar();
    }
  }

  async function salvar({ dados, publicado }) {
    const p = editando.projeto;
    if (p.id) await api.salvar(p.id, { dados, publicado });
    else await api.criar(secao, dados, publicado);
    setEditando(null);
    avisar(p.id ? "Projeto salvo. Já está no site." : publicado ? "Projeto criado. Já está no site." : "Projeto criado, oculto do site.");
    recarregar();
  }

  async function confirmarApagar() {
    const p = apagando;
    setApagando(null);
    try {
      await api.apagar(p.id);
      avisar(`“${p.dados.nome}” foi apagado.`);
    } catch (e) {
      tratar(e);
    }
    recarregar();
  }

  const novo = () => setEditando({ chave: Date.now(), projeto: { publicado: true, dados: secao === "vitrine" ? novoVitrine() : novoOutro() } });

  return (
    <>
      <Box sx={{ maxWidth: 1100 }}>
        <Stack direction="row" sx={{ alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 1 }}>
          <Typography sx={{ color: "text.secondary" }}>O que você salvar aqui aparece no site na hora.</Typography>
          {!celular && (
            <Button variant="contained" size="large" startIcon={<AddRounded />} onClick={novo} disabled={!projetos}>Novo projeto</Button>
          )}
        </Stack>

        <Tabs value={secao} onChange={(_, v) => setSecao(v)} sx={{ mt: 2, mb: 1, borderBottom: 1, borderColor: "divider" }}>
          {SECOES.map((s) => (
            <Tab key={s.id} value={s.id} label={projetos ? `${s.nome} (${projetos.filter((p) => p.secao === s.id).length})` : s.nome} />
          ))}
        </Tabs>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>{infoSecao.texto} A ordem aqui é a ordem no site.</Typography>

        {falhaInicial && (
          <Alert severity="error" action={<Button color="inherit" onClick={() => location.reload()}>Recarregar</Button>}>{falhaInicial}</Alert>
        )}
        {!projetos && !falhaInicial && (
          <Stack spacing={1.5}>{[0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={96} sx={{ borderRadius: 5 }} />)}</Stack>
        )}
        {projetos && (
          <Stack spacing={1.5} sx={{ pb: 10 }}>
            {daSecao.length === 0 && (
              <Box sx={{ border: "2px dashed", borderColor: "contorno.suave", borderRadius: 5, p: 4, textAlign: "center" }}>
                <Typography sx={{ color: "text.secondary", mb: 2 }}>Nenhum projeto nesta seção.</Typography>
                <Button variant="outlined" startIcon={<AddRounded />} onClick={novo}>Criar o primeiro</Button>
              </Box>
            )}
            {daSecao.map((p, i) => (
              <LinhaProjeto
                key={p.id}
                projeto={p}
                i={i}
                total={daSecao.length}
                aoEditar={(projeto) => setEditando({ chave: projeto.id + Date.now(), projeto })}
                aoApagar={setApagando}
                aoMover={mover}
                aoPublicar={publicar}
              />
            ))}
          </Stack>
        )}
      </Box>

      {celular && projetos && (
        <Fab variant="extended" color="primary" onClick={novo} sx={{ position: "fixed", right: 16, bottom: 16, borderRadius: 4, boxShadow: 3 }}>
          <AddRounded sx={{ mr: 1 }} /> Novo projeto
        </Fab>
      )}

      {editando && (
        <Editor
          key={editando.chave}
          aberto
          projeto={editando.projeto}
          secao={editando.projeto.secao || secao}
          aoFechar={() => setEditando(null)}
          aoSalvar={salvar}
          aoErro={erro}
          aoApagar={editando.projeto.id ? () => { setApagando(editando.projeto); setEditando(null); } : null}
        />
      )}

      <Dialog open={!!apagando} onClose={() => setApagando(null)}>
        <DialogTitle>Apagar “{apagando?.dados.nome}”?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "text.secondary" }}>O card sai do site e as telas enviadas para ele são apagadas. Não dá para desfazer. Se quiser só tirar do site por um tempo, use o botão de visível.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApagando(null)}>Cancelar</Button>
          <Button onClick={confirmarApagar} color="error">Apagar</Button>
        </DialogActions>
      </Dialog>


    </>
  );
}
