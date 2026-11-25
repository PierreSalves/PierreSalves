import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { Icone } from "../icones.jsx";
import { useAbrirPedido } from "./Pedido.jsx";
import { ModoTema } from "./ModoTema.jsx";
import { useSite } from "../config/contexto.jsx";

export const botaoTonal = {
  bgcolor: "tonal.main",
  color: "tonal.contrastText",
  "&:hover": { bgcolor: "tonal.main", filter: "brightness(1.05)" },
};

// Logo da marca. No modo escuro ganha o fundo configurado (logo de letras escuras).
export function Logo({ altura = 48, href = "/", rotulo }) {
  const { marca } = useSite();
  return (
    <Box
      component="a"
      href={href}
      aria-label={rotulo || `${marca.nome}, início`}
      sx={[{ display: "inline-flex", borderRadius: 3, px: 0.75, py: 0.25 }, (t) => (marca.logoFundoNoEscuro ? t.applyStyles("dark", { bgcolor: marca.logoFundoNoEscuro }) : {})]}
    >
      <Box component="img" src={marca.logo} width={marca.logoLargura} height={marca.logoAltura} alt={marca.nome} sx={{ height: altura, width: "auto", display: "block" }} />
    </Box>
  );
}

export function Topo() {
  const abrirPedido = useAbrirPedido();
  const config = useSite();
  const menu = config.secoes.filter((s) => s.visivel && s.menu.mostrar);
  const botao = config.topo.botao;
  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "superficie.base", color: "text.primary" }}>
      <Container>
        <Toolbar disableGutters sx={{ minHeight: { xs: 72 }, gap: 2 }}>
          <Logo />
          <Box component="nav" aria-label="Seções" sx={{ ml: "auto", display: { xs: "none", md: "flex" }, gap: 0.5 }}>
            {menu.map((s) => (
              <Button key={s.tipo} href={`#${s.ancora}`} sx={{ color: "text.secondary" }}>{s.menu.texto}</Button>
            ))}
          </Box>
          {config.tema.botaoModo && <ModoTema sx={{ ml: { xs: "auto", md: 0 } }} />}
          {botao.mostrar && (
            <Button onClick={() => abrirPedido(botao.tipo)} startIcon={botao.icone ? <Icone nome={botao.icone} /> : null} sx={{ ...botaoTonal, ml: config.tema.botaoModo ? 0 : { xs: "auto", md: 0 } }}>
              {botao.texto}
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function Chips({ chips, centro }) {
  if (!chips.length) return null;
  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1, justifyContent: centro ? "center" : "flex-start" }}>
      {chips.map((c, i) => (
        <Chip key={i} variant="outlined" icon={c.icone ? <Icone nome={c.icone} /> : undefined} label={c.texto} sx={{ color: "text.secondary", "& .MuiChip-icon": { color: "inherit" } }} />
      ))}
    </Stack>
  );
}

function Titulo({ a, centro }) {
  return (
    <Typography variant="h1" sx={{ fontSize: centro ? "clamp(40px, 5.4vw, 80px)" : "clamp(38px, 4.6vw, 72px)" }}>
      {a.titulo}
      {a.destaque && (
        <>
          {" "}
          <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>{a.destaque}</Box>.
        </>
      )}
    </Typography>
  );
}

function Botoes({ a, centro }) {
  const abrirPedido = useAbrirPedido();
  const { botaoPrincipal: bp, botaoPedido: pedido } = a;
  if (!bp.mostrar && !pedido.mostrar) return null;
  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1.5, justifyContent: centro ? "center" : "flex-start" }}>
      {bp.mostrar && bp.texto && (
        <Button size="large" variant="contained" href={bp.alvo || "#"} startIcon={bp.icone ? <Icone nome={bp.icone} /> : null}>
          {bp.texto}
        </Button>
      )}
      {pedido.mostrar && pedido.texto && (
        <Button size="large" variant={bp.mostrar ? "outlined" : "contained"} onClick={() => abrirPedido(pedido.tipo)}>
          {pedido.texto}
        </Button>
      )}
    </Stack>
  );
}

function Dispositivos({ a }) {
  return (
    <Box sx={{ position: "relative", pb: a.celular.imagem ? 5 : 0 }}>
      {a.navegador.imagem && (
        <Box sx={{ bgcolor: "superficie.alta", borderRadius: 7, p: 1.5, boxShadow: 1 }}>
          <Box aria-hidden="true" sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1, pt: 0.5, pb: 1.25, fontSize: 12, color: "text.secondary", minWidth: 0 }}>
            {[0, 1, 2].map((i) => (
              <Box key={i} component="i" sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "divider", flex: "none" }} />
            ))}
            <Box component="span" sx={{ ml: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.navegador.endereco}</Box>
          </Box>
          <Box component="img" src={a.navegador.imagem} width={a.navegador.largura} height={a.navegador.altura} alt={a.navegador.alt} sx={{ display: "block", width: "100%", height: "auto", borderRadius: 4 }} />
        </Box>
      )}
      {a.celular.imagem && (
        <Box sx={{ position: "absolute", right: { xs: 0, md: -8 }, bottom: 0, width: "34%", maxWidth: 200, bgcolor: "superficie.maxima", borderRadius: 7, p: "7px", boxShadow: 6 }}>
          <Box component="img" src={a.celular.imagem} width={a.celular.largura} height={a.celular.altura} alt={a.celular.alt} loading="lazy" sx={{ display: "block", width: "100%", height: "auto", aspectRatio: "9 / 17", objectFit: "cover", objectPosition: "top", borderRadius: 5.5 }} />
        </Box>
      )}
    </Box>
  );
}

export function Abertura({ secao }) {
  const a = secao.dados;
  const variante = secao.variante;

  if (variante === "centralizada") {
    return (
      <Box component="section" id={secao.ancora} sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 11 } }}>
        <Container>
          <Stack spacing={3.5} sx={{ alignItems: "center", textAlign: "center", maxWidth: 980, mx: "auto" }}>
            <Chips chips={a.chips} centro />
            <Titulo a={a} centro />
            {a.texto && <Typography sx={{ fontSize: 19, lineHeight: 1.6, color: "text.secondary", maxWidth: 680 }}>{a.texto}</Typography>}
            <Botoes a={a} centro />
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="section" id={secao.ancora} sx={{ pt: 5, pb: 9 }}>
      <Container sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,1fr) minmax(0,1.05fr)" }, gap: 6, alignItems: "center" }}>
        <Stack spacing={3}>
          <Chips chips={a.chips} />
          <Titulo a={a} />
          {a.texto && <Typography sx={{ fontSize: 18, lineHeight: 1.6, color: "text.secondary", maxWidth: 600 }}>{a.texto}</Typography>}
          <Botoes a={a} />
        </Stack>
        {variante === "imagem" ? (
          a.imagem.imagem ? (
            <Box component="img" src={a.imagem.imagem} width={a.imagem.largura} height={a.imagem.altura} alt={a.imagem.alt} sx={{ display: "block", width: "100%", height: "auto", borderRadius: 7, boxShadow: 1 }} />
          ) : (
            <Box aria-hidden="true" sx={{ aspectRatio: "4 / 3", borderRadius: 7, bgcolor: "container.main" }} />
          )
        ) : (
          <Dispositivos a={a} />
        )}
      </Container>
    </Box>
  );
}
