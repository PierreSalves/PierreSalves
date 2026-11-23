// Tema Material a partir de uma única cor (site.config.js > tema.corPrincipal).
// As cores claro e escuro saem do algoritmo oficial do Material 3 (esquema "Tonal Spot"
// da biblioteca material-color-utilities do Google), as mesmas do wireframe.
import { createTheme } from "@mui/material/styles";
import { argbFromHex, hexFromArgb, Hct, SchemeTonalSpot, MaterialDynamicColors as M3 } from "@material/material-color-utilities";

function esquema(cor, escuro) {
  const s = new SchemeTonalSpot(Hct.fromInt(argbFromHex(cor)), escuro, 0);
  const c = (nome) => hexFromArgb(M3[nome].getArgb(s));
  return {
    primary: { main: c("primary"), contrastText: c("onPrimary") },
    secondary: { main: c("secondary"), contrastText: c("onSecondary") },
    // Nomes curtos usados no sx: "container.main", "tonal.main", "superficie.alta" etc.
    container: { main: c("primaryContainer"), contrastText: c("onPrimaryContainer") },
    tonal: { main: c("secondaryContainer"), contrastText: c("onSecondaryContainer") },
    destaque: { main: c("tertiaryContainer"), contrastText: c("onTertiaryContainer") },
    superficie: {
      base: c("surface"),
      baixa: c("surfaceContainerLow"),
      media: c("surfaceContainer"),
      alta: c("surfaceContainerHigh"),
      maxima: c("surfaceContainerHighest"),
    },
    contorno: { main: c("outline"), suave: c("outlineVariant") },
    background: { default: c("surface"), paper: c("surfaceContainerLow") },
    text: { primary: c("onSurface"), secondary: c("onSurfaceVariant") },
    divider: c("outlineVariant"),
  };
}

export function criarTema(cor) {
  const claro = esquema(cor, false);
  const escuro = esquema(cor, true);
  return createTheme({
    cssVariables: { colorSchemeSelector: "media" },
    colorSchemes: { light: { palette: claro }, dark: { palette: escuro } },
    // Com 4, borderRadius: 7 no sx vira 28px (o raio dos cartões do Material 3).
    shape: { borderRadius: 4 },
    breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1600 } },
    typography: {
      fontFamily: '"Roboto Flex Variable", Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
      h1: { fontWeight: 450, letterSpacing: "-0.02em", lineHeight: 1.07, fontVariationSettings: '"opsz" 96' },
      h2: { fontWeight: 450, letterSpacing: "-0.01em", lineHeight: 1.15 },
      h3: { fontWeight: 500 },
      button: { textTransform: "none", fontWeight: 500, letterSpacing: 0.1, fontSize: 15 },
    },
    components: {
      MuiContainer: {
        // Ocupa telas largas até 1600 px, com margem de 32 px (16 px no celular), como no wireframe.
        defaultProps: { maxWidth: "xl" },
        styleOverrides: { root: ({ theme }) => ({ [theme.breakpoints.up("sm")]: { paddingLeft: 32, paddingRight: 32 } }) },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 999, paddingInline: 24, minHeight: 40, fontSize: 14 },
          sizeLarge: { minHeight: 48, paddingInline: 24, fontSize: 15 },
          // Botão com contorno do Material 3: borda cinza (outline), texto na cor principal.
          outlined: ({ theme }) => ({ borderColor: theme.vars.palette.contorno.main, "&:hover": { borderColor: theme.vars.palette.contorno.main } }),
          text: { paddingInline: 12 },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 500 }, outlined: ({ theme }) => ({ borderColor: theme.vars.palette.contorno.suave }) } },
      MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { borderRadius: 28 } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 28 } } },
      MuiTextField: { defaultProps: { fullWidth: true } },
      MuiCssBaseline: {
        styleOverrides: {
          html: { scrollBehavior: "smooth", "@media (prefers-reduced-motion: reduce)": { scrollBehavior: "auto" } },
          "h1, h2, h3": { textWrap: "balance" },
          "[id]": { scrollMarginTop: 80 },
        },
      },
    },
  });
}
