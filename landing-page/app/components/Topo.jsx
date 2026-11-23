import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import site from "../site.config.js";
import { Icone } from "../icones.jsx";
import { useAbrirPedido } from "./Pedido.jsx";

export const botaoTonal = {
  bgcolor: "tonal.main",
  color: "tonal.contrastText",
  "&:hover": { bgcolor: "tonal.main", filter: "brightness(1.05)" },
};

export function Topo() {
  const abrirPedido = useAbrirPedido();
  const { marca } = site;
  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "superficie.base", color: "text.primary" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 72 }, gap: 2 }}>
          <Box
            component="a"
            href="/"
            aria-label={`${marca.nome}, início`}
            sx={{ display: "inline-flex", borderRadius: 3, px: 0.75, py: 0.25, "@media (prefers-color-scheme: dark)": { bgcolor: marca.logoFundoNoEscuro } }}
          >
            <Box component="img" src={marca.logo} width={marca.logoLargura} height={marca.logoAltura} alt={marca.nome} sx={{ height: 48, width: "auto", display: "block" }} />
          </Box>
          <Box component="nav" aria-label="Seções" sx={{ ml: "auto", display: { xs: "none", md: "flex" }, gap: 0.5 }}>
            {site.menu.map((m) => (
              <Button key={m.alvo} href={m.alvo} sx={{ color: "text.secondary" }}>{m.texto}</Button>
            ))}
          </Box>
          <Button
            onClick={() => abrirPedido(site.contato.botao.tipo)}
            startIcon={<Icone nome="email" />}
            sx={{ ...botaoTonal, ml: { xs: "auto", md: 0 } }}
          >
            Fale comigo
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export function Abertura() {
  const abrirPedido = useAbrirPedido();
  const a = site.abertura;
  return (
    <Box component="section" sx={{ pt: 5, pb: 9 }}>
      <Container maxWidth="lg" sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,1fr) minmax(0,1.05fr)" }, gap: 6, alignItems: "center" }}>
        <Stack spacing={3}>
          <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
            {a.chips.map((c) => (
              <Chip key={c.texto} variant="outlined" icon={<Icone nome={c.icone} />} label={c.texto} sx={{ color: "text.secondary", fontWeight: 500 }} />
            ))}
          </Stack>
          <Typography variant="h1" sx={{ fontSize: "clamp(38px, 5.4vw, 60px)" }}>
            {a.titulo}{" "}
            <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>{a.destaque}</Box>.
          </Typography>
          <Typography sx={{ fontSize: 18, lineHeight: 1.6, color: "text.secondary", maxWidth: 520 }}>{a.texto}</Typography>
          <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1.5 }}>
            <Button size="large" variant="contained" href={a.botaoPrincipal.alvo} startIcon={<Icone nome={a.botaoPrincipal.icone} />}>
              {a.botaoPrincipal.texto}
            </Button>
            <Button size="large" variant="outlined" onClick={() => abrirPedido(a.botaoPedido.tipo)}>
              {a.botaoPedido.texto}
            </Button>
          </Stack>
        </Stack>
        <Box sx={{ position: "relative", pb: 5 }}>
          <Box sx={{ bgcolor: "superficie.alta", borderRadius: 7, p: 1.5, boxShadow: 1 }}>
            <Box aria-hidden="true" sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1, pt: 0.5, pb: 1.25, fontSize: 12, color: "text.secondary", minWidth: 0 }}>
              {[0, 1, 2].map((i) => (
                <Box key={i} component="i" sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "divider", flex: "none" }} />
              ))}
              <Box component="span" sx={{ ml: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.navegador.endereco}</Box>
            </Box>
            <Box component="img" src={a.navegador.imagem} width={a.navegador.largura} height={a.navegador.altura} alt={a.navegador.alt} sx={{ display: "block", width: "100%", height: "auto", borderRadius: 4 }} />
          </Box>
          <Box sx={{ position: "absolute", right: { xs: 0, md: -8 }, bottom: 0, width: "34%", maxWidth: 200, bgcolor: "superficie.maxima", borderRadius: 7, p: "7px", boxShadow: 6 }}>
            <Box component="img" src={a.celular.imagem} width={a.celular.largura} height={a.celular.altura} alt={a.celular.alt} loading="lazy" sx={{ display: "block", width: "100%", height: "auto", aspectRatio: "9 / 17", objectFit: "cover", objectPosition: "top", borderRadius: 5.5 }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
