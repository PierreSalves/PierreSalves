// Seção "Localização": mapa ou Street View do Google (link de "Incorporar um mapa"),
// com endereço, horários e botão "Como chegar". A incorporação do Google é gratuita.
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import DirectionsRounded from "@mui/icons-material/DirectionsRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import ScheduleRounded from "@mui/icons-material/ScheduleRounded";
import { CabecalhoSecao } from "./Vitrine.jsx";
import { emPrevia } from "../config/contexto.jsx";

function Mapa({ src, titulo, sx }) {
  if (!src) {
    if (!emPrevia()) return null;
    return (
      <Box sx={{ ...sx, border: "2px dashed", borderColor: "contorno.main", display: "flex", alignItems: "center", justifyContent: "center", p: 3, textAlign: "center", color: "text.secondary" }}>
        Cole no painel o link de “Incorporar um mapa” do Google Maps.
      </Box>
    );
  }
  return (
    <Box
      component="iframe"
      src={src}
      title={titulo || "Mapa"}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      sx={{ border: 0, display: "block", width: "100%", bgcolor: "superficie.media", ...sx }}
    />
  );
}

function Informacoes({ d }) {
  return (
    <Stack spacing={2}>
      {d.endereco && (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
          <PlaceRounded sx={{ color: "primary.main", mt: 0.25 }} aria-hidden="true" />
          <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.55 }}>{d.endereco}</Typography>
        </Stack>
      )}
      {d.horarios.length > 0 && (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
          <ScheduleRounded sx={{ color: "primary.main", mt: 0.25 }} aria-hidden="true" />
          <Box component="dl" sx={{ m: 0, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 2, rowGap: 0.5 }}>
            {d.horarios.map((h, i) => (
              <Box key={i} sx={{ display: "contents" }}>
                <Typography component="dt" sx={{ color: "text.secondary" }}>{h.dias}</Typography>
                <Typography component="dd" sx={{ m: 0, fontWeight: 500 }}>{h.horas}</Typography>
              </Box>
            ))}
          </Box>
        </Stack>
      )}
      {d.linkRota && (
        <Box>
          <Button variant="contained" href={d.linkRota} target="_blank" rel="noopener" startIcon={<DirectionsRounded />}>Como chegar</Button>
        </Box>
      )}
    </Stack>
  );
}

export function Localizacao({ secao }) {
  const d = secao.dados;
  if (secao.variante === "mapaLargo") {
    return (
      <Box component="section" id={secao.ancora} sx={{ pb: 9 }}>
        <Container>
          <CabecalhoSecao rotulo={d.rotulo} titulo={d.titulo} />
          <Box sx={{ position: "relative", borderRadius: 7, overflow: "hidden", bgcolor: "superficie.media" }}>
            <Mapa src={d.mapa} titulo={d.titulo} sx={{ height: { xs: 320, md: 480 }, borderRadius: 0 }} />
            <Box sx={{ position: { md: "absolute" }, left: 24, bottom: 24, maxWidth: { md: 420 }, bgcolor: "superficie.base", borderRadius: { xs: 0, md: 6 }, p: 3, boxShadow: { md: 6 } }}>
              {d.texto && <Typography sx={{ color: "text.secondary", mb: 2 }}>{d.texto}</Typography>}
              <Informacoes d={d} />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }
  return (
    <Box component="section" id={secao.ancora} sx={{ pb: 9 }}>
      <Container>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,0.8fr) minmax(0,1.2fr)" }, gap: 3, alignItems: "stretch" }}>
          <Stack spacing={2.5} sx={{ bgcolor: "superficie.baixa", borderRadius: 7, p: { xs: 3, sm: 4 } }}>
            <Stack spacing={1}>
              {d.rotulo && <Typography sx={{ fontSize: 14, fontWeight: 500, color: "primary.main" }}>{d.rotulo}</Typography>}
              <Typography variant="h2" sx={{ fontSize: "clamp(28px, 3.4vw, 36px)" }}>{d.titulo}</Typography>
            </Stack>
            {d.texto && <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>{d.texto}</Typography>}
            {(d.endereco || d.horarios.length > 0) && <Divider />}
            <Informacoes d={d} />
          </Stack>
          <Mapa src={d.mapa} titulo={d.titulo} sx={{ minHeight: { xs: 300, md: 420 }, height: "100%", borderRadius: 7 }} />
        </Box>
      </Container>
    </Box>
  );
}
