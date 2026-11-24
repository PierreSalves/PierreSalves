// Formulário de um card (criar ou editar), com a prévia do cartão ao lado.
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseRounded from "@mui/icons-material/CloseRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import AddPhotoAlternateRounded from "@mui/icons-material/AddPhotoAlternateRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import { Icone, nomesIcones } from "../icones.jsx";
import { CartaoApp } from "../components/Vitrine.jsx";
import { api, prepararImagem, mensagemDeErro } from "./api.js";

export const STATUS = [
  { texto: "No ar", icone: "ok" },
  { texto: "Código aberto", icone: "codigo" },
  { texto: "Em desenvolvimento", icone: "andamento" },
  { texto: "Arquivado", icone: "arquivado" },
];

const POSICOES = [
  { valor: "", texto: "Canto superior esquerdo" },
  { valor: "center top", texto: "Topo, centralizado" },
  { valor: "center", texto: "Centro" },
  { valor: "left center", texto: "Meio, à esquerda" },
];

export const novoVitrine = () => ({
  nome: "",
  publico: "",
  icone: "apps",
  status: { ...STATUS[0] },
  resumo: "",
  telas: [],
  semTelas: "Capturas em breve",
  recursos: [],
  tecnologias: [],
  links: [],
});
export const novoOutro = () => ({ icone: "codigo", nome: "", texto: "", url: "" });

// Troca dois itens de lugar numa lista.
const mover = (lista, i, lado) => {
  const j = i + lado;
  if (j < 0 || j >= lista.length) return lista;
  const nova = [...lista];
  [nova[i], nova[j]] = [nova[j], nova[i]];
  return nova;
};

function CampoIcone({ valor, aoMudar, rotulo = "Ícone", sx }) {
  return (
    <Autocomplete
      options={nomesIcones}
      value={valor || null}
      onChange={(_, v) => aoMudar(v || "")}
      disableClearable={false}
      sx={sx}
      renderOption={({ key, ...props }, nome) => (
        <Box component="li" key={key} {...props} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Icone nome={nome} sx={{ color: "primary.main" }} />
          {nome}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={rotulo}
          slotProps={{
            ...params.slotProps,
            input: { ...params.slotProps.input, startAdornment: valor ? <Icone nome={valor} sx={{ color: "primary.main", ml: 0.5, mr: 0.5 }} /> : null },
          }}
        />
      )}
    />
  );
}

function Bloco({ titulo, texto, children, acao }) {
  return (
    <Stack spacing={2} component="section">
      <Stack direction="row" sx={{ alignItems: "flex-end", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{titulo}</Typography>
          {texto && <Typography variant="body2" sx={{ color: "text.secondary" }}>{texto}</Typography>}
        </Box>
        {acao}
      </Stack>
      {children}
    </Stack>
  );
}

function BotoesLinha({ i, total, aoMover, aoRemover, nome }) {
  return (
    <Stack direction="row" sx={{ flex: "none" }}>
      <IconButton size="small" aria-label={`Subir ${nome}`} disabled={i === 0} onClick={() => aoMover(i, -1)}><ArrowUpwardRounded fontSize="small" /></IconButton>
      <IconButton size="small" aria-label={`Descer ${nome}`} disabled={i === total - 1} onClick={() => aoMover(i, 1)}><ArrowDownwardRounded fontSize="small" /></IconButton>
      <IconButton size="small" aria-label={`Remover ${nome}`} onClick={() => aoRemover(i)}><DeleteOutlineRounded fontSize="small" /></IconButton>
    </Stack>
  );
}

function CamposTelas({ telas, semTelas, aoMudar, aoMudarSemTelas, aoErro }) {
  const entrada = useRef(null);
  const [enviando, setEnviando] = useState(0);

  async function escolher(ev) {
    const arquivos = [...ev.target.files].slice(0, 8 - telas.length);
    ev.target.value = "";
    setEnviando(arquivos.length);
    const novas = [];
    for (const arquivo of arquivos) {
      try {
        const url = await api.enviarImagem(await prepararImagem(arquivo));
        novas.push({ imagem: url, legenda: arquivo.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").slice(0, 60) });
      } catch (e) {
        aoErro(mensagemDeErro(e));
      }
      setEnviando((n) => n - 1);
    }
    if (novas.length) aoMudar((atuais) => [...atuais, ...novas]);
  }

  const muda = (i, campo, valor) => aoMudar((atuais) => atuais.map((t, j) => (j === i ? { ...t, [campo]: valor } : t)));

  return (
    <Bloco
      titulo="Telas"
      texto="Até 8 imagens, trocam sozinhas no cartão. Proporção 16:9 fica melhor."
      acao={
        <Button startIcon={<AddPhotoAlternateRounded />} onClick={() => entrada.current?.click()} disabled={telas.length >= 8 || enviando > 0}>
          Adicionar
        </Button>
      }
    >
      <input ref={entrada} type="file" accept="image/png,image/jpeg,image/webp,image/avif" multiple hidden onChange={escolher} />
      <Alert severity="warning" variant="outlined" sx={{ borderRadius: 3 }}>
        Antes de enviar, esconda nomes, e-mails, telefones e outros dados pessoais, e borre vídeos com direitos autorais.
      </Alert>
      {enviando > 0 && <LinearProgress aria-label="Enviando imagens" />}
      {telas.length === 0 ? (
        <TextField label="Texto quando não há telas" value={semTelas} onChange={(e) => aoMudarSemTelas(e.target.value)} slotProps={{ htmlInput: { maxLength: 60 } }} />
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", sm: "repeat(2, minmax(0,1fr))" }, gap: 2 }}>
          {telas.map((t, i) => (
            <Stack key={t.imagem + i} spacing={1.5} sx={{ bgcolor: "superficie.media", borderRadius: 4, p: 1.5 }}>
              <Box sx={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 3, overflow: "hidden", bgcolor: "superficie.maxima" }}>
                <Box component="img" src={t.imagem} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: t.posicao || "left top", display: "block" }} />
                <Chip size="small" label={i === 0 ? "1ª · capa" : `${i + 1}ª`} sx={{ position: "absolute", top: 8, left: 8, bgcolor: "rgba(18,20,22,.74)", color: "#fff" }} />
              </Box>
              <TextField size="small" label="Legenda" value={t.legenda} onChange={(e) => muda(i, "legenda", e.target.value)} slotProps={{ htmlInput: { maxLength: 60 } }} />
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <TextField select size="small" label="Enquadrar por" value={t.posicao || ""} onChange={(e) => muda(i, "posicao", e.target.value)}>
                  {POSICOES.map((p) => <MenuItem key={p.valor} value={p.valor}>{p.texto}</MenuItem>)}
                </TextField>
                <IconButton size="small" aria-label="Mover para antes" disabled={i === 0} onClick={() => aoMudar((a) => mover(a, i, -1))}><ArrowBackRounded fontSize="small" /></IconButton>
                <IconButton size="small" aria-label="Mover para depois" disabled={i === telas.length - 1} onClick={() => aoMudar((a) => mover(a, i, 1))}><ArrowForwardRounded fontSize="small" /></IconButton>
                <IconButton size="small" aria-label="Remover tela" onClick={() => aoMudar((a) => a.filter((_, j) => j !== i))}><DeleteOutlineRounded fontSize="small" /></IconButton>
              </Stack>
            </Stack>
          ))}
        </Box>
      )}
    </Bloco>
  );
}

function FormVitrine({ dados, setDados, aoErro }) {
  const campo = (nome) => (e) => setDados((d) => ({ ...d, [nome]: e.target.value }));
  const lista = (nome) => (f) => setDados((d) => ({ ...d, [nome]: typeof f === "function" ? f(d[nome]) : f }));
  const statusPronto = STATUS.findIndex((s) => s.texto === dados.status?.texto && s.icone === dados.status?.icone);
  const [personalizado, setPersonalizado] = useState(statusPronto < 0);

  const mudaItem = (nome, i, chave, valor) => lista(nome)((a) => a.map((x, j) => (j === i ? { ...x, [chave]: valor } : x)));

  return (
    <Stack spacing={4} divider={<Divider flexItem />}>
      <Bloco titulo="Identificação">
        <TextField label="Nome do projeto" required value={dados.nome} onChange={campo("nome")} slotProps={{ htmlInput: { maxLength: 80 } }} />
        <TextField label="Para quem é" helperText="Aparece embaixo do nome. Ex.: Academias de artes marciais" value={dados.publico} onChange={campo("publico")} slotProps={{ htmlInput: { maxLength: 120 } }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <CampoIcone valor={dados.icone} aoMudar={(v) => setDados((d) => ({ ...d, icone: v }))} sx={{ flex: 1 }} />
          <TextField
            select
            label="Situação"
            sx={{ flex: 1 }}
            value={personalizado ? "outro" : String(statusPronto)}
            onChange={(e) => {
              if (e.target.value === "outro") return setPersonalizado(true);
              setPersonalizado(false);
              setDados((d) => ({ ...d, status: { ...STATUS[Number(e.target.value)] } }));
            }}
          >
            {STATUS.map((s, i) => (
              <MenuItem key={s.texto} value={String(i)}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}><Icone nome={s.icone} fontSize="small" /><span>{s.texto}</span></Stack>
              </MenuItem>
            ))}
            <MenuItem value="outro">Outra…</MenuItem>
          </TextField>
        </Stack>
        {personalizado && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Texto da situação" value={dados.status.texto} onChange={(e) => setDados((d) => ({ ...d, status: { ...d.status, texto: e.target.value } }))} slotProps={{ htmlInput: { maxLength: 40 } }} sx={{ flex: 1 }} />
            <CampoIcone rotulo="Ícone da situação" valor={dados.status.icone} aoMudar={(v) => setDados((d) => ({ ...d, status: { ...d.status, icone: v } }))} sx={{ flex: 1 }} />
          </Stack>
        )}
        {/código aberto/i.test(dados.status?.texto || "") && (
          <Alert severity="info" sx={{ borderRadius: 3 }}>Só marque “Código aberto” se o repositório estiver público no GitHub.</Alert>
        )}
        <TextField label="Resumo" multiline minRows={2} value={dados.resumo} onChange={campo("resumo")} helperText={`${dados.resumo.length}/400`} slotProps={{ htmlInput: { maxLength: 400 } }} />
      </Bloco>

      <CamposTelas telas={dados.telas} semTelas={dados.semTelas} aoMudar={lista("telas")} aoMudarSemTelas={(v) => setDados((d) => ({ ...d, semTelas: v }))} aoErro={aoErro} />

      <Bloco
        titulo="Recursos"
        texto="Os pontos fortes, com ícone, título e uma frase."
        acao={<Button startIcon={<AddRounded />} disabled={dados.recursos.length >= 8} onClick={() => lista("recursos")((a) => [...a, { icone: "ok", titulo: "", texto: "" }])}>Adicionar</Button>}
      >
        {dados.recursos.length === 0 && <Typography variant="body2" sx={{ color: "text.secondary" }}>Nenhum recurso ainda.</Typography>}
        {dados.recursos.map((r, i) => (
          <Stack key={i} spacing={1.5} sx={{ bgcolor: "superficie.media", borderRadius: 4, p: 2 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
              <CampoIcone valor={r.icone} aoMudar={(v) => mudaItem("recursos", i, "icone", v)} sx={{ width: { xs: 150, sm: 200 }, flex: "none" }} />
              <TextField label="Título" value={r.titulo} onChange={(e) => mudaItem("recursos", i, "titulo", e.target.value)} slotProps={{ htmlInput: { maxLength: 80 } }} />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
              <TextField label="Frase" multiline value={r.texto} onChange={(e) => mudaItem("recursos", i, "texto", e.target.value)} slotProps={{ htmlInput: { maxLength: 240 } }} />
              <BotoesLinha i={i} total={dados.recursos.length} nome="recurso" aoMover={(i, l) => lista("recursos")((a) => mover(a, i, l))} aoRemover={(i) => lista("recursos")((a) => a.filter((_, j) => j !== i))} />
            </Stack>
          </Stack>
        ))}
      </Bloco>

      <Bloco titulo="Tecnologias" texto="Digite e aperte Enter para adicionar.">
        <Autocomplete
          multiple
          freeSolo
          options={["Flutter", "React", "PWA", "Node.js", "PHP", "Laravel", "Cloudflare", "Cloudflare Workers", "D1", "Google Drive", "Firebase", "Oracle", "MySQL"]}
          value={dados.tecnologias}
          onChange={(_, v) => setDados((d) => ({ ...d, tecnologias: v.map((t) => t.trim().slice(0, 30)).filter(Boolean).slice(0, 12) }))}
          renderValue={(valor, getItemProps) => valor.map((t, index) => { const { key, ...p } = getItemProps({ index }); return <Chip key={key} size="small" variant="outlined" label={t} {...p} />; })}
          renderInput={(params) => <TextField {...params} label="Tecnologias" />}
        />
      </Bloco>

      <Bloco
        titulo="Botões"
        texto="Links do cartão, como “Abrir app” ou “Ver código”. O botão “Quero um parecido” aparece sempre."
        acao={<Button startIcon={<AddRounded />} disabled={dados.links.length >= 4} onClick={() => lista("links")((a) => [...a, { texto: "Abrir app", url: "https://", icone: "abrir" }])}>Adicionar</Button>}
      >
        {dados.links.map((l, i) => (
          <Stack key={i} spacing={1.5} sx={{ bgcolor: "superficie.media", borderRadius: 4, p: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField label="Texto do botão" value={l.texto} onChange={(e) => mudaItem("links", i, "texto", e.target.value)} slotProps={{ htmlInput: { maxLength: 40 } }} />
              <CampoIcone valor={l.icone} aoMudar={(v) => mudaItem("links", i, "icone", v)} sx={{ width: { sm: 220 }, flex: "none" }} />
            </Stack>
            <TextField label="Endereço" type="url" value={l.url} onChange={(e) => mudaItem("links", i, "url", e.target.value)} error={!!l.url && !/^(https?:\/\/\S+\.\S+|\/\S*)$/.test(l.url)} helperText="Começa com https://" />
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <FormControlLabel control={<Checkbox checked={!!l.discreto} onChange={(e) => mudaItem("links", i, "discreto", e.target.checked)} />} label="Botão discreto (só contorno)" />
              <BotoesLinha i={i} total={dados.links.length} nome="botão" aoMover={(i, lado) => lista("links")((a) => mover(a, i, lado))} aoRemover={(i) => lista("links")((a) => a.filter((_, j) => j !== i))} />
            </Stack>
          </Stack>
        ))}
      </Bloco>
    </Stack>
  );
}

function FormOutro({ dados, setDados }) {
  const campo = (nome) => (e) => setDados((d) => ({ ...d, [nome]: e.target.value }));
  return (
    <Stack spacing={2.5}>
      <TextField label="Nome do projeto" required value={dados.nome} onChange={campo("nome")} slotProps={{ htmlInput: { maxLength: 80 } }} />
      <CampoIcone valor={dados.icone} aoMudar={(v) => setDados((d) => ({ ...d, icone: v }))} />
      <TextField label="Descrição" multiline minRows={2} value={dados.texto} onChange={campo("texto")} slotProps={{ htmlInput: { maxLength: 240 } }} />
      <TextField label="Link" required type="url" value={dados.url} onChange={campo("url")} error={!!dados.url && !/^https?:\/\/\S+\.\S+$/.test(dados.url)} helperText="Geralmente o repositório no GitHub. Começa com https://" />
    </Stack>
  );
}

// Prévia de um item de "Outros projetos", igual à lista do portfólio.
function PreviaOutro({ dados }) {
  return (
    <Box sx={{ bgcolor: "superficie.baixa", borderRadius: 7, py: 1 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", px: 3, py: 2 }}>
        <Icone nome={dados.icone} sx={{ color: "text.secondary" }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 500 }}>{dados.nome || "Nome do projeto"}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>{dados.texto}</Typography>
        </Box>
        <ChevronRightRounded sx={{ color: "text.secondary" }} />
      </Stack>
    </Box>
  );
}

export function Editor({ aberto, projeto, secao, aoFechar, aoSalvar, aoErro, aoApagar }) {
  // projeto: { id?, publicado, dados } ; sem id = novo
  const [dados, setDados] = useState(projeto.dados);
  const [publicado, setPublicado] = useState(projeto.publicado);
  const [salvando, setSalvando] = useState(false);
  const [aba, setAba] = useState(0);
  const [descartar, setDescartar] = useState(false);
  const telaCheia = useMediaQuery((t) => t.breakpoints.down("md"));
  const lado = useMediaQuery((t) => t.breakpoints.up("lg"));
  const alterado = JSON.stringify(dados) !== JSON.stringify(projeto.dados) || publicado !== projeto.publicado;
  const novo = !projeto.id;

  const fechar = () => (alterado ? setDescartar(true) : aoFechar());

  async function salvar(ev) {
    ev.preventDefault();
    setSalvando(true);
    try {
      await aoSalvar({ dados, publicado });
    } catch (e) {
      aoErro(mensagemDeErro(e));
      setSalvando(false);
    }
  }

  const previa = (
    <Box sx={{ position: { lg: "sticky" }, top: 0 }}>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>Prévia de como aparece no site</Typography>
      {secao === "vitrine" ? (
        <CartaoApp app={{ ...dados, nome: dados.nome || "Nome do projeto" }} sx={{ flex: "none", width: "100%", maxWidth: 520 }} />
      ) : (
        <PreviaOutro dados={dados} />
      )}
    </Box>
  );

  return (
    <Dialog open={aberto} onClose={fechar} fullScreen={telaCheia} maxWidth="lg" fullWidth slotProps={{ paper: { component: "form", onSubmit: salvar, sx: { bgcolor: "superficie.base" } } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pr: 1.5 }}>
        <IconButton aria-label="Fechar" onClick={fechar} edge="start"><CloseRounded /></IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {novo ? "Novo projeto" : "Editar projeto"}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>{secao === "vitrine" ? "Vitrine · Apps da TGH" : "Portfólio · Outros projetos"}</Typography>
        </Box>
        <Tooltip title={publicado ? "Aparece no site" : "Fica salvo, mas não aparece no site"}>
          <FormControlLabel control={<Switch checked={publicado} onChange={(e) => setPublicado(e.target.checked)} />} label="Visível" labelPlacement="start" sx={{ mr: 0 }} />
        </Tooltip>
      </DialogTitle>
      {!lado && (
        <Tabs value={aba} onChange={(_, v) => setAba(v)} variant="fullWidth" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tab label="Dados" />
          <Tab label="Prévia" />
        </Tabs>
      )}
      <DialogContent sx={{ pt: "20px !important" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", lg: "minmax(0,1.15fr) minmax(0,1fr)" }, gap: 4, alignItems: "start" }}>
          <Box sx={{ display: lado || aba === 0 ? "block" : "none" }}>
            {secao === "vitrine" ? <FormVitrine dados={dados} setDados={setDados} aoErro={aoErro} /> : <FormOutro dados={dados} setDados={setDados} />}
          </Box>
          {(lado || aba === 1) && previa}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
        {aoApagar && <Button color="error" startIcon={<DeleteOutlineRounded />} onClick={aoApagar} sx={{ mr: "auto" }}>Apagar</Button>}
        <Button onClick={fechar}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={salvando || !dados.nome.trim() || (secao === "outros" && !dados.url.trim())}>
          {salvando ? "Salvando…" : novo ? "Criar projeto" : "Salvar"}
        </Button>
      </DialogActions>

      <Dialog open={descartar} onClose={() => setDescartar(false)}>
        <DialogTitle>Descartar as alterações?</DialogTitle>
        <DialogContent><Typography sx={{ color: "text.secondary" }}>O que você mudou neste projeto ainda não foi salvo.</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDescartar(false)}>Continuar editando</Button>
          <Button onClick={() => { setDescartar(false); aoFechar(); }}>Descartar</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
