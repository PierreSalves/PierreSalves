import { useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import site from "../site.config.js";
import { Icone } from "../icones.jsx";
import { useAbrirPedido } from "./Pedido.jsx";
import Telas from "./Telas.jsx";
import { novaGuia } from "../links.js";
import { projetos } from "../projetos.js";

export function CabecalhoSecao({ rotulo, titulo, children }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 3.5 }}>
      <Stack spacing={1}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: "primary.main" }}>{rotulo}</Typography>
        <Typography variant="h2" sx={{ fontSize: "clamp(28px, 4vw, 40px)" }}>{titulo}</Typography>
      </Stack>
      {children}
    </Box>
  );
}

// Quase 1 cartão inteiro no celular (com a pontinha do próximo), 2 no tablet/notebook e 3 em telas largas.
const larguraCartao = { flex: { xs: "0 0 88%", md: "0 0 calc((100% - 24px) / 2)", lg: "0 0 calc((100% - 48px) / 3)" }, minWidth: 0, scrollSnapAlign: "start" };

function Status({ app, sx }) {
  if (!app.status?.texto) return null;
  return (
    <Chip
      size="small"
      icon={<Icone nome={app.status.icone} />}
      label={app.status.texto}
      sx={{ bgcolor: "destaque.main", color: "destaque.contrastText", fontWeight: 500, flex: "none", "& .MuiChip-icon": { color: "inherit" }, ...sx }}
    />
  );
}

// Também usado no /admin, para mostrar como o card vai ficar enquanto ele é editado.
export function CartaoApp({ app, sx }) {
  const abrirPedido = useAbrirPedido();
  const { pedidoParecido } = site.vitrine;
  return (
    <Card component="article" sx={{ ...larguraCartao, ...sx, bgcolor: "superficie.baixa", display: "flex", flexDirection: "column", boxShadow: 1 }}>
      <Telas telas={app.telas || []} nome={app.nome} iconeVazio={app.icone} textoVazio={app.semTelas} />
      <Stack spacing={2} useFlexGap sx={{ p: { xs: 2.5, sm: 3 }, flex: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: { xs: "flex-start", sm: "center" } }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 3.5, bgcolor: "container.main", color: "container.contrastText", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Icone nome={app.icone} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h3" sx={{ fontSize: 22 }}>{app.nome}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>{app.publico}</Typography>
            {/* No celular o status desce para baixo do nome, para o nome não quebrar palavra por palavra. */}
            <Status app={app} sx={{ display: { xs: "inline-flex", sm: "none" }, mt: 1 }} />
          </Box>
          <Status app={app} sx={{ display: { xs: "none", sm: "inline-flex" } }} />
        </Stack>
        <Typography sx={{ color: "text.secondary", lineHeight: 1.55 }}>{app.resumo}</Typography>
        <Stack component="ul" spacing={1.5} sx={{ m: 0, p: 0, listStyle: "none" }}>
          {(app.recursos || []).map((r, i) => (
            <Stack component="li" key={i} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
              <Icone nome={r.icone} sx={{ fontSize: 20, color: "primary.main", flex: "none", mt: 0.25 }} />
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 500 }}>{r.titulo}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.45 }}>{r.texto}</Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1, mt: "auto !important" }}>
          {(app.tecnologias || []).map((t, i) => (
            <Chip key={i} size="small" variant="outlined" label={t} sx={{ color: "text.secondary" }} />
          ))}
        </Stack>
        <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1, justifyContent: "flex-end" }}>
          <Button onClick={() => abrirPedido(pedidoParecido.tipo, app.nome)}>{pedidoParecido.texto}</Button>
          {(app.links || []).map((l, i) => (
            <Button key={i} href={l.url} {...novaGuia(l.url)} variant={l.discreto ? "outlined" : "contained"} startIcon={l.icone ? <Icone nome={l.icone} /> : null}>
              {l.texto}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

export function Vitrine() {
  const faixa = useRef(null);
  const abrirPedido = useAbrirPedido();
  const menosMovimento = useMediaQuery("(prefers-reduced-motion: reduce)");
  const v = site.vitrine;
  const rolar = (direcao) => {
    const el = faixa.current;
    if (el) el.scrollBy({ left: direcao * el.clientWidth * 0.5, behavior: menosMovimento ? "auto" : "smooth" });
  };
  return (
    <Box component="section" id="apps" sx={{ pb: 9 }}>
      <Container>
        <CabecalhoSecao rotulo={v.rotulo} titulo={v.titulo}>
          <Stack direction="row" spacing={1}>
            <IconButton aria-label="Apps anteriores" onClick={() => rolar(-1)} sx={{ border: 1, borderColor: "contorno.main", color: "text.primary", width: 48, height: 48 }}>
              <ArrowBackRounded />
            </IconButton>
            <IconButton aria-label="Próximos apps" onClick={() => rolar(1)} sx={{ width: 48, height: 48, bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.main", filter: "brightness(1.08)" } }}>
              <ArrowForwardRounded />
            </IconButton>
          </Stack>
        </CabecalhoSecao>
        <Box
          ref={faixa}
          sx={{ display: "flex", gap: 3, overflowX: "auto", scrollSnapType: "x mandatory", p: "4px 4px 12px", mx: "-4px", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
        >
          {projetos.vitrine.map((app) => (
            <CartaoApp key={app.id || app.nome} app={app} />
          ))}
          <Box
            component="button"
            type="button"
            onClick={() => abrirPedido(v.cartaoFinal.botao.tipo)}
            sx={{
              ...larguraCartao,
              font: "inherit",
              textAlign: "left",
              cursor: "pointer",
              bgcolor: "transparent",
              color: "text.primary",
              borderRadius: 7,
              border: "2px dashed",
              borderColor: "contorno.main",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              // Centralizado: o cartão estica até a altura dos outros e o texto não some lá embaixo.
              justifyContent: "center",
              gap: 1.5,
              p: 4,
              minHeight: 360,
              "&:hover": { bgcolor: "superficie.baixa" },
            }}
          >
            <Box sx={{ width: 56, height: 56, borderRadius: 4, bgcolor: "container.main", color: "container.contrastText", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <AddRounded />
            </Box>
            <Typography component="strong" sx={{ fontSize: 28, lineHeight: 1.2 }}>{v.cartaoFinal.titulo}</Typography>
            <Typography sx={{ fontSize: 15, color: "text.secondary" }}>{v.cartaoFinal.texto}</Typography>
            <Typography sx={{ color: "primary.main", fontSize: 14, fontWeight: 500 }}>{v.cartaoFinal.botao.texto}</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
