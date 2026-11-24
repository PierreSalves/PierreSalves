import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckRounded from "@mui/icons-material/CheckRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import site from "../site.config.js";
import { Icone } from "../icones.jsx";
import { useAbrirPedido } from "./Pedido.jsx";
import { CabecalhoSecao } from "./Vitrine.jsx";
import { botaoTonal } from "./Topo.jsx";
import { novaGuia } from "../links.js";
import { projetos as cards } from "../projetos.js";

export function SobMedida() {
  const abrirPedido = useAbrirPedido();
  const s = site.sobMedida;
  return (
    <Box component="section" id="sob-medida" sx={{ pb: 9 }}>
      <Container>
        <Box sx={{ bgcolor: "container.main", color: "container.contrastText", borderRadius: 7, px: "clamp(20px, 4vw, 40px)", py: "clamp(28px, 5vw, 48px)", display: "flex", flexDirection: "column", gap: 4 }}>
          <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{s.rotulo}</Typography>
            <Typography variant="h2" sx={{ fontSize: "clamp(28px, 4vw, 40px)" }}>{s.titulo}</Typography>
            <Typography sx={{ fontSize: 17, lineHeight: 1.6, opacity: 0.85 }}>{s.texto}</Typography>
          </Stack>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", sm: "repeat(2, minmax(0,1fr))", md: "repeat(4, minmax(0,1fr))" }, gap: 2 }}>
            {s.itens.map((i) => (
              <Stack key={i.titulo} spacing={1.25} sx={{ bgcolor: "superficie.base", color: "text.primary", borderRadius: 4, p: 2.5 }}>
                <Icone nome={i.icone} sx={{ color: "primary.main" }} />
                <Typography sx={{ fontWeight: 500 }}>{i.titulo}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5 }}>{i.texto}</Typography>
              </Stack>
            ))}
          </Box>
          <Box>
            <Button size="large" variant="contained" startIcon={<Icone nome={s.botao.icone} />} onClick={() => abrirPedido(s.botao.tipo)}>
              {s.botao.texto}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export function Servicos() {
  const abrirPedido = useAbrirPedido();
  const s = site.servicos;
  return (
    <Box component="section" id="servicos" sx={{ pb: 9 }}>
      <Container>
        <CabecalhoSecao rotulo={s.rotulo} titulo={s.titulo} />
        <Typography sx={{ color: "text.secondary", mt: -1.5, mb: 3.5, maxWidth: 640 }}>{s.texto}</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", md: `repeat(${s.planos.length}, minmax(0,1fr))` }, gap: 3 }}>
          {s.planos.map((p) => (
            <Card
              key={p.nome}
              sx={{ p: 3.5, display: "flex", flexDirection: "column", gap: 2, bgcolor: p.destaque ? "superficie.alta" : "superficie.baixa", border: p.destaque ? 2 : 0, borderColor: "primary.main" }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 3.5, bgcolor: "container.main", color: "container.contrastText", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icone nome={p.icone} />
                </Box>
                <Typography variant="h3" sx={{ fontSize: 22, flex: 1 }}>{p.nome}</Typography>
                {p.preco && <Chip label={p.preco} sx={{ fontWeight: 600 }} />}
              </Stack>
              <Typography sx={{ color: "text.secondary" }}>{p.resumo}</Typography>
              <Stack component="ul" spacing={1} sx={{ m: 0, p: 0, listStyle: "none" }}>
                {p.itens.map((i) => (
                  <Stack component="li" key={i} direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
                    <CheckRounded aria-hidden="true" sx={{ fontSize: 20, color: "primary.main", mt: 0.25 }} />
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{i}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Box sx={{ mt: "auto", pt: 1 }}>
                <Button size="large" variant={p.destaque ? "contained" : "outlined"} onClick={() => abrirPedido(p.botao.tipo)}>
                  {p.botao.texto}
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export function Portfolio() {
  const { rotulo, titulo, pessoa, projetos } = site.portfolio;
  return (
    <Box component="section" id="portfolio" sx={{ pb: 9 }}>
      <Container>
        <CabecalhoSecao rotulo={rotulo} titulo={titulo} />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,1fr) minmax(0,1.3fr)" }, gap: 3 }}>
          <Stack spacing={2} sx={{ bgcolor: "superficie.media", borderRadius: 7, p: 3.5 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Avatar aria-hidden="true" sx={{ width: 64, height: 64, bgcolor: "primary.main", color: "primary.contrastText", fontSize: 24, fontWeight: 600 }}>
                {pessoa.iniciais}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 22, fontWeight: 500 }}>{pessoa.nome}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>{pessoa.cargo}</Typography>
              </Box>
            </Stack>
            <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>{pessoa.bio}</Typography>
            <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
              {pessoa.tags.map((t) => (
                <Chip key={t} size="small" label={t} sx={{ bgcolor: "superficie.maxima" }} />
              ))}
            </Stack>
            <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
              {pessoa.links.map((l) => (
                <Button key={l.url} href={l.url} {...novaGuia(l.url)} startIcon={l.icone ? <Icone nome={l.icone} /> : null} sx={l.principal ? botaoTonal : undefined}>
                  {l.texto}
                </Button>
              ))}
            </Stack>
          </Stack>
          <Box sx={{ bgcolor: "superficie.baixa", borderRadius: 7, py: 1 }}>
            <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 500 }}>{projetos.titulo}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>{projetos.texto}</Typography>
            </Box>
            <List disablePadding>
              {cards.outros.map((p) => (
                <Box key={p.id || p.url}>
                  <ListItemButton component="a" href={p.url} {...novaGuia(p.url)} sx={{ px: 3, py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><Icone nome={p.icone} /></ListItemIcon>
                    <ListItemText primary={p.nome} secondary={p.texto} slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
                    <ChevronRightRounded aria-hidden="true" sx={{ color: "text.secondary" }} />
                  </ListItemButton>
                  <Divider sx={{ mx: 3 }} />
                </Box>
              ))}
              <ListItemButton component="a" href={projetos.todos.url} {...novaGuia(projetos.todos.url)} sx={{ px: 3, py: 2, color: "primary.main" }}>
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}><CodeRounded aria-hidden="true" /></ListItemIcon>
                <ListItemText primary={projetos.todos.texto} slotProps={{ primary: { sx: { fontWeight: 500, fontSize: 14 } } }} />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export function Contato() {
  const abrirPedido = useAbrirPedido();
  const c = site.contato;
  return (
    <Box component="section" id="contato" sx={{ pb: 7 }}>
      <Container>
        <Box sx={{ bgcolor: "superficie.alta", borderRadius: 7, p: "clamp(24px, 4vw, 40px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 3 }}>
          <Stack spacing={1} sx={{ maxWidth: 620 }}>
            <Typography variant="h2" sx={{ fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.2 }}>{c.titulo}</Typography>
            <Typography component="a" href={`mailto:${c.email}`} sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>{c.email}</Typography>
          </Stack>
          <Button
            onClick={() => abrirPedido(c.botao.tipo)}
            startIcon={<Icone nome={c.botao.icone} />}
            sx={{ height: 56, px: 3, borderRadius: 4, bgcolor: "container.main", color: "container.contrastText", fontSize: 16, boxShadow: 6, "&:hover": { bgcolor: "container.main", filter: "brightness(1.04)" } }}
          >
            {c.botao.texto}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export function Rodape() {
  return (
    <Box component="footer">
      <Container sx={{ pt: 1, pb: 4, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 1.5, fontSize: 14, color: "text.secondary" }}>
        <span>{site.rodape.esquerda}</span>
        <span>{site.rodape.direita}</span>
      </Container>
    </Box>
  );
}
