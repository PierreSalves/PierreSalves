// Página /curriculo em React + Material UI. Conteúdo em app/curriculo.config.js.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import PrintRounded from "@mui/icons-material/PrintRounded";
import MailRounded from "@mui/icons-material/MailRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import GitHub from "@mui/icons-material/GitHub";
import LinkedIn from "@mui/icons-material/LinkedIn";
import "@fontsource-variable/roboto-flex/opsz.css";
import site from "./site.config.js";
import cv from "./curriculo.config.js";
import { criarTema } from "./tema.js";

const tema = criarTema(site.tema.corPrincipal);
const ICONES = { email: MailRounded, github: GitHub, linkedin: LinkedIn };

const impressao = {
  "@media print": {
    body: { background: "#fff !important" },
    ".nao-imprimir": { display: "none !important" },
    ".cartao-cv": { boxShadow: "none !important", breakInside: "avoid", border: "1px solid #ccc" },
  },
};

function Secao({ titulo, children, sx }) {
  return (
    <Box component="section" className="cartao-cv" sx={{ bgcolor: "superficie.baixa", borderRadius: 7, p: { xs: 2.5, sm: 3.5 }, ...sx }}>
      <Typography component="h2" sx={{ fontSize: 14, fontWeight: 500, color: "primary.main", mb: 2 }}>{titulo}</Typography>
      {children}
    </Box>
  );
}

function LinhaDoTempo({ itens }) {
  return (
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
      {itens.map((it, i) => (
        <Box
          component="li"
          key={it.titulo}
          sx={{
            position: "relative",
            pl: 3.5,
            pb: i === itens.length - 1 ? 0 : 3,
            "&::before": { content: '""', position: "absolute", left: 0, top: 6, width: 12, height: 12, borderRadius: "50%", bgcolor: "primary.main" },
            "&::after": i === itens.length - 1 ? {} : { content: '""', position: "absolute", left: 5, top: 22, bottom: 2, width: 2, bgcolor: "divider" },
          }}
        >
          <Typography component="h3" sx={{ fontSize: 17, fontWeight: 500 }}>{it.titulo}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>{it.onde}</Typography>
          {it.itens && (
            <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.25, color: "text.secondary", fontSize: 15, "& li": { my: 0.5 } }}>
              {it.itens.map((t) => <li key={t}>{t}</li>)}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

function Curriculo() {
  const { pessoa } = cv;
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "superficie.base" }}>
      <Container sx={{ py: 2 }}>
        <Stack direction="row" className="nao-imprimir" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2, gap: 1 }}>
          <Button href="/" startIcon={<ArrowBackRounded />}>{site.marca.nome}</Button>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button onClick={() => window.print()} startIcon={<PrintRounded />} sx={{ display: { xs: "none", sm: "inline-flex" } }}>Imprimir ou salvar PDF</Button>
            <Box component="a" href="/" aria-label={`Página inicial da ${site.marca.nome}`} sx={{ display: "inline-flex", borderRadius: 3, px: 0.75, py: 0.25, "@media (prefers-color-scheme: dark)": { bgcolor: site.marca.logoFundoNoEscuro } }}>
              <Box component="img" src={site.marca.logo} width={site.marca.logoLargura} height={site.marca.logoAltura} alt={site.marca.nome} sx={{ height: 40, width: "auto", display: "block" }} />
            </Box>
          </Stack>
        </Stack>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "minmax(0,1fr)", lg: "minmax(0,1fr) minmax(0,1.6fr)" }, alignItems: "start" }}>
          {/* Coluna da esquerda: quem é, contatos, tecnologias e formação. */}
          <Stack spacing={2} sx={{ position: { lg: "sticky" }, top: { lg: 16 } }}>
            <Box component="header" className="cartao-cv" sx={{ bgcolor: "container.main", color: "container.contrastText", borderRadius: 7, p: { xs: 2.5, sm: 3.5 } }}>
              <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
                <Avatar aria-hidden="true" sx={{ width: 88, height: 88, bgcolor: "primary.main", color: "primary.contrastText", fontSize: 30, fontWeight: 600 }}>{pessoa.iniciais}</Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h1" sx={{ fontSize: "clamp(28px, 3.2vw, 40px)" }}>{pessoa.nome}</Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 500, mt: 0.5 }}>{pessoa.cargo}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>{pessoa.local}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1, mt: 2.5 }}>
                {pessoa.contatos.map((c) => {
                  const I = ICONES[c.icone];
                  return (
                    <Chip
                      key={c.url}
                      component="a"
                      href={c.url}
                      clickable
                      icon={I ? <I aria-hidden="true" /> : undefined}
                      label={c.texto}
                      target={c.url.startsWith("http") ? "_blank" : undefined}
                      rel="noopener"
                      sx={{ bgcolor: "superficie.base", color: "text.primary", "& .MuiChip-icon": { color: "primary.main" } }}
                    />
                  );
                })}
              </Stack>
            </Box>

            <Secao titulo="Tecnologias">
              <Stack spacing={2}>
                {cv.tecnologias.map((g) => (
                  <Box key={g.grupo}>
                    <Typography component="h3" sx={{ fontSize: 15, fontWeight: 500, mb: 1 }}>{g.grupo}</Typography>
                    <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
                      {g.itens.map((t) => <Chip key={t} label={t} sx={{ bgcolor: "tonal.main", color: "tonal.contrastText" }} />)}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Secao>

            <Secao titulo="Formação">
              <LinhaDoTempo itens={cv.formacao.map((f) => ({ titulo: f.curso, onde: f.onde }))} />
            </Secao>
          </Stack>

          {/* Coluna da direita: sobre, experiência, projetos e contato. */}
          <Stack spacing={2}>
            <Secao titulo="Sobre">
              <Typography sx={{ fontSize: 17, lineHeight: 1.65, color: "text.secondary" }}>{cv.sobre}</Typography>
            </Secao>

            <Secao titulo="Experiência">
              <LinhaDoTempo itens={cv.experiencia.map((e) => ({ titulo: e.cargo, onde: e.onde, itens: e.itens }))} />
            </Secao>

            <Secao titulo="Projetos em destaque">
              <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "minmax(0,1fr)", sm: "repeat(2, minmax(0,1fr))" } }}>
                {cv.projetos.itens.map((p) => (
                  <Stack key={p.nome} spacing={1} sx={{ bgcolor: "superficie.base", borderRadius: 4, p: 2.25 }}>
                    <Typography component="h3" sx={{ fontSize: 16, fontWeight: 500 }}>{p.nome}</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", flex: 1, lineHeight: 1.55 }}>{p.texto}</Typography>
                    <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 0.75 }}>
                      {p.tags.map((t) => <Chip key={t} size="small" variant="outlined" label={t} sx={{ color: "text.secondary" }} />)}
                    </Stack>
                    <Box>
                      <Button href={p.link.url} target="_blank" rel="noopener" endIcon={<OpenInNewRounded />} sx={{ ml: -1.5 }}>{p.link.texto}</Button>
                    </Box>
                  </Stack>
                ))}
              </Box>
              <Button href={cv.projetos.todos.url} target="_blank" rel="noopener" className="nao-imprimir" sx={{ mt: 1.5, ml: -1.5 }}>{cv.projetos.todos.texto}</Button>
            </Secao>

            <Secao titulo={cv.contato.titulo}>
              <Typography sx={{ color: "text.secondary" }}>
                {cv.contato.texto.split(/(\S+@\S+?\.com)/).map((parte, i) =>
                  /@/.test(parte) ? <Link key={i} href={`mailto:${parte}`}>{parte}</Link> : parte,
                )}
              </Typography>
            </Secao>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary", mt: 3, mb: 2 }}>{cv.rodape}</Typography>
      </Container>
    </Box>
  );
}

createRoot(document.getElementById("raiz")).render(
  <StrictMode>
    <ThemeProvider theme={tema}>
      <CssBaseline enableColorScheme />
      <GlobalStyles styles={impressao} />
      <Curriculo />
    </ThemeProvider>
  </StrictMode>,
);
