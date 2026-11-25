// Formulário montado a partir de uma descrição de campos (ver app/admin/camposSecoes.js).
// Cada campo edita uma chave do objeto `valor`; grupos e listas editam objetos e listas dentro dele.
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@mui/material/Autocomplete";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import AddRounded from "@mui/icons-material/AddRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import AddPhotoAlternateRounded from "@mui/icons-material/AddPhotoAlternateRounded";
import RestartAltRounded from "@mui/icons-material/RestartAltRounded";
import { Icone, nomesIcones } from "../icones.jsx";
import { api, prepararImagem, mensagemDeErro } from "./api.js";
import { urlMapa, corHex } from "../config/esquema.js";

export function CampoIcone({ valor, aoMudar, rotulo = "Ícone", sx, size }) {
  return (
    <Autocomplete
      options={nomesIcones}
      value={valor || null}
      onChange={(_, v) => aoMudar(v || "")}
      size={size}
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

// Cor: quadradinho que abre o seletor do sistema + campo hex.
export function CampoCor({ valor, aoMudar, rotulo, vazio, ajuda, sx }) {
  const [digitado, setDigitado] = useState(valor || "");
  const ultimo = useRef(valor);
  if (ultimo.current !== valor) {
    ultimo.current = valor;
    if (corHex(digitado) !== valor) setDigitado(valor || "");
  }
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start", ...sx }}>
      <Box
        component="label"
        sx={{ position: "relative", width: 56, height: 56, borderRadius: 3, flex: "none", cursor: "pointer", border: 1, borderColor: "contorno.main", overflow: "hidden", background: valor || "repeating-conic-gradient(#ccc 0 25%, #fff 0 50%) 50% / 12px 12px" }}
      >
        <Box
          component="input"
          type="color"
          value={valor || "#888888"}
          onChange={(e) => aoMudar(e.target.value.toUpperCase())}
          aria-label={rotulo}
          sx={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
        />
      </Box>
      <TextField
        label={rotulo}
        value={digitado}
        onChange={(e) => {
          const t = e.target.value.trim();
          setDigitado(t);
          const c = corHex(t.startsWith("#") ? t : `#${t}`);
          if (c) aoMudar(c);
          else if (!t && vazio) aoMudar("");
        }}
        helperText={ajuda}
        placeholder={vazio || "#006A60"}
        slotProps={{ htmlInput: { maxLength: 7, spellCheck: false } }}
      />
    </Stack>
  );
}

function CampoImagem({ campo, valor, aoMudar, aoErro }) {
  const entrada = useRef(null);
  const [enviando, setEnviando] = useState(false);
  const chaves = { imagem: campo.campo, largura: campo.largura, altura: campo.altura };
  const url = valor[chaves.imagem];

  async function escolher(ev) {
    const arquivo = ev.target.files[0];
    ev.target.value = "";
    if (!arquivo) return;
    setEnviando(true);
    try {
      const blob = await prepararImagem(arquivo);
      const bmp = await createImageBitmap(blob);
      const novaUrl = await api.enviarImagem(blob, "site");
      const novo = { ...valor, [chaves.imagem]: novaUrl };
      if (chaves.largura) novo[chaves.largura] = bmp.width;
      if (chaves.altura) novo[chaves.altura] = bmp.height;
      bmp.close?.();
      aoMudar(novo);
    } catch (e) {
      aoErro?.(mensagemDeErro(e));
    }
    setEnviando(false);
  }

  return (
    <Stack spacing={1}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>{campo.rotulo}</Typography>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box sx={{ width: 120, aspectRatio: campo.redonda ? "1" : "16 / 10", borderRadius: campo.redonda ? "50%" : 3, overflow: "hidden", bgcolor: "superficie.maxima", flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {url ? (
            <Box component="img" src={url} alt="" sx={{ width: "100%", height: "100%", objectFit: campo.conter ? "contain" : "cover", display: "block" }} />
          ) : (
            <AddPhotoAlternateRounded sx={{ color: "text.secondary" }} />
          )}
        </Box>
        <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
          <Button size="small" variant="outlined" startIcon={<AddPhotoAlternateRounded />} onClick={() => entrada.current?.click()} disabled={enviando}>
            {url ? "Trocar" : "Escolher imagem"}
          </Button>
          {url && !campo.obrigatoria && (
            <Button size="small" color="error" onClick={() => aoMudar({ ...valor, [chaves.imagem]: "" })}>Remover</Button>
          )}
        </Stack>
      </Stack>
      {enviando && <LinearProgress aria-label="Enviando imagem" />}
      {campo.ajuda && <Typography variant="caption" sx={{ color: "text.secondary" }}>{campo.ajuda}</Typography>}
      <input ref={entrada} type="file" accept="image/png,image/jpeg,image/webp,image/avif" hidden onChange={escolher} />
    </Stack>
  );
}

function BotoesItem({ i, total, aoMover, aoRemover }) {
  return (
    <Stack direction="row" sx={{ flex: "none" }}>
      <IconButton size="small" aria-label="Subir" disabled={i === 0} onClick={() => aoMover(i, -1)}><ArrowUpwardRounded fontSize="small" /></IconButton>
      <IconButton size="small" aria-label="Descer" disabled={i === total - 1} onClick={() => aoMover(i, 1)}><ArrowDownwardRounded fontSize="small" /></IconButton>
      <IconButton size="small" aria-label="Remover" onClick={() => aoRemover(i)}><DeleteOutlineRounded fontSize="small" /></IconButton>
    </Stack>
  );
}

const mover = (lista, i, lado) => {
  const j = i + lado;
  if (j < 0 || j >= lista.length) return lista;
  const nova = [...lista];
  [nova[i], nova[j]] = [nova[j], nova[i]];
  return nova;
};

function CampoLista({ campo, lista, aoMudar, contexto }) {
  const max = campo.max || 12;
  const deTexto = campo.item === "texto";
  const add = () => aoMudar([...lista, deTexto ? "" : typeof campo.novo === "function" ? campo.novo(lista) : structuredClone(campo.novo || {})]);
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Box>
          <Typography sx={{ fontWeight: 500 }}>{campo.rotulo}</Typography>
          {campo.ajuda && <Typography variant="body2" sx={{ color: "text.secondary" }}>{campo.ajuda}</Typography>}
        </Box>
        <Button size="small" startIcon={<AddRounded />} onClick={add} disabled={lista.length >= max}>Adicionar</Button>
      </Stack>
      {lista.length === 0 && <Typography variant="body2" sx={{ color: "text.secondary" }}>Nenhum item.</Typography>}
      {lista.map((item, i) =>
        deTexto ? (
          <Stack key={i} direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <TextField size="small" value={item} onChange={(e) => aoMudar(lista.map((x, j) => (j === i ? e.target.value : x)))} slotProps={{ htmlInput: { maxLength: campo.maxTexto || 200 } }} />
            <BotoesItem i={i} total={lista.length} aoMover={(i, l) => aoMudar(mover(lista, i, l))} aoRemover={(i) => aoMudar(lista.filter((_, j) => j !== i))} />
          </Stack>
        ) : (
          <Stack key={i} spacing={1.5} sx={{ bgcolor: "superficie.media", borderRadius: 4, p: 2 }}>
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary" }}>{campo.tituloItem ? campo.tituloItem(item, i) : `Item ${i + 1}`}</Typography>
              <BotoesItem i={i} total={lista.length} aoMover={(i, l) => aoMudar(mover(lista, i, l))} aoRemover={(i) => aoMudar(lista.filter((_, j) => j !== i))} />
            </Stack>
            <Campos campos={campo.item} valor={item} aoMudar={(novo) => aoMudar(lista.map((x, j) => (j === i ? novo : x)))} contexto={contexto} />
          </Stack>
        ),
      )}
    </Stack>
  );
}

function Campo({ campo, valor, aoMudar, contexto }) {
  const v = valor?.[campo.campo];
  const mudar = (novo) => aoMudar({ ...valor, [campo.campo]: novo });
  const max = campo.max || (campo.multilinha ? 1200 : 200);

  switch (campo.tipo) {
    case "titulo":
      return (
        <Box sx={{ pt: 1 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{campo.rotulo}</Typography>
          {campo.ajuda && <Typography variant="body2" sx={{ color: "text.secondary" }}>{campo.ajuda}</Typography>}
        </Box>
      );
    case "aviso":
      return <Box sx={{ bgcolor: "tonal.main", color: "tonal.contrastText", borderRadius: 3, px: 2, py: 1.5, fontSize: 14, lineHeight: 1.5 }}>{campo.texto}</Box>;
    case "booleano":
      return (
        <FormControlLabel
          control={<Switch checked={!!v} onChange={(e) => mudar(e.target.checked)} />}
          label={
            <Box>
              <Typography>{campo.rotulo}</Typography>
              {campo.ajuda && <Typography variant="body2" sx={{ color: "text.secondary" }}>{campo.ajuda}</Typography>}
            </Box>
          }
          sx={{ alignItems: "flex-start", ml: 0, gap: 1, "& .MuiSwitch-root": { mt: -0.75 } }}
        />
      );
    case "icone":
      return <CampoIcone valor={v} aoMudar={mudar} rotulo={campo.rotulo || "Ícone"} />;
    case "cor":
      return <CampoCor valor={v} aoMudar={mudar} rotulo={campo.rotulo} vazio={campo.vazio} ajuda={campo.ajuda} />;
    case "imagem":
      return <CampoImagem campo={campo} valor={valor} aoMudar={aoMudar} aoErro={contexto.aoErro} />;
    case "numero":
      return (
        <TextField
          type="number"
          label={campo.rotulo}
          value={v ?? ""}
          onChange={(e) => mudar(e.target.value === "" ? "" : Number(e.target.value))}
          helperText={campo.ajuda}
          slotProps={{ htmlInput: { min: campo.min, max: campo.max, step: campo.passo || 1 } }}
        />
      );
    case "pedido":
      return (
        <TextField select label={campo.rotulo || "Abre o formulário com"} value={contexto.tiposDePedido.some((t) => t.id === v) ? v : ""} onChange={(e) => mudar(e.target.value)} helperText={campo.ajuda}>
          {contexto.tiposDePedido.map((t) => <MenuItem key={t.id} value={t.id}>{t.texto}</MenuItem>)}
        </TextField>
      );
    case "alvo":
      return (
        <Autocomplete
          freeSolo
          options={contexto.ancoras}
          value={v || ""}
          onInputChange={(_, t) => mudar(t)}
          renderInput={(params) => <TextField {...params} label={campo.rotulo || "Para onde vai"} helperText={campo.ajuda || "Uma seção da página (#...) ou um link começando com https://"} />}
        />
      );
    case "mapa": {
      const ok = !v || !!urlMapa(v);
      return (
        <TextField
          label={campo.rotulo}
          value={v || ""}
          onChange={(e) => mudar(urlMapa(e.target.value) || e.target.value)}
          multiline
          minRows={2}
          error={!ok}
          helperText={ok ? campo.ajuda : "Esse não é um link de incorporação do Google Maps. Use Compartilhar > Incorporar um mapa."}
          slotProps={{ htmlInput: { spellCheck: false } }}
        />
      );
    }
    case "grupo":
      return (
        <Stack spacing={2} sx={{ border: 1, borderColor: "contorno.suave", borderRadius: 4, p: 2 }}>
          {campo.rotulo && <Typography sx={{ fontWeight: 500 }}>{campo.rotulo}</Typography>}
          {campo.ajuda && <Typography variant="body2" sx={{ color: "text.secondary", mt: "-8px !important" }}>{campo.ajuda}</Typography>}
          <Campos campos={campo.campos} valor={v || {}} aoMudar={mudar} contexto={contexto} />
        </Stack>
      );
    case "lista":
      return <CampoLista campo={campo} lista={Array.isArray(v) ? v : []} aoMudar={mudar} contexto={contexto} />;
    case "url":
    case "texto":
    default: {
      const urlRuim = campo.tipo === "url" && v && !/^(https?:\/\/\S+|\/\S*|#[\w-]+|mailto:\S+@\S+|tel:[+\d ()-]+)$/i.test(v);
      return (
        <TextField
          label={campo.rotulo}
          value={v ?? ""}
          onChange={(e) => mudar(e.target.value)}
          multiline={!!campo.multilinha}
          minRows={campo.multilinha ? 2 : undefined}
          error={!!urlRuim}
          helperText={urlRuim ? "Comece com https://" : campo.contador ? `${(v || "").length}/${max}` : campo.ajuda}
          placeholder={campo.exemplo}
          slotProps={{ htmlInput: { maxLength: max } }}
        />
      );
    }
  }
}

// campos: lista de descrições; valor: objeto editado; contexto: { tiposDePedido, ancoras, aoErro, variante }.
export function Campos({ campos, valor, aoMudar, contexto }) {
  const visiveis = campos.filter((c) => !c.variantes || c.variantes.includes(contexto.variante));
  return (
    <Stack spacing={2}>
      {visiveis.map((c, i) => (
        <Campo key={c.campo || `${c.tipo}-${i}`} campo={c} valor={valor} aoMudar={aoMudar} contexto={contexto} />
      ))}
    </Stack>
  );
}

// Botão pequeno "voltar ao padrão".
export function BotaoRestaurar({ aoClicar, titulo = "Voltar ao automático" }) {
  return (
    <Tooltip title={titulo}>
      <IconButton size="small" onClick={aoClicar} aria-label={titulo}><RestartAltRounded fontSize="small" /></IconButton>
    </Tooltip>
  );
}
