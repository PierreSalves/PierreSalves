// Tema Material a partir de uma única cor (site.config.js > tema.corPrincipal).
// Gera as cores de superfície e de "container" do Material 3 para o modo claro e o escuro.
import { createTheme, lighten, darken, alpha } from "@mui/material/styles";

function mistura(base, cor, quanto) {
  // Mistura `cor` sobre `base` (as duas em #RRGGBB).
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [p(base), p(cor)];
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * quanto).toString(16).padStart(2, "0")).join("");
}

function paletas(cor) {
  const claro = {
    primary: { main: cor, contrastText: "#FFFFFF" },
    secondary: { main: darken(cor, 0.25) },
    container: { main: lighten(cor, 0.8), contrastText: darken(cor, 0.75) },
    tonal: { main: mistura("#FFFFFF", cor, 0.18), contrastText: darken(cor, 0.7) },
    destaque: { main: "#CFE5FF", contrastText: "#001D34" },
    superficie: {
      base: mistura("#FFFFFF", cor, 0.04),
      baixa: mistura("#FFFFFF", cor, 0.07),
      media: mistura("#FFFFFF", cor, 0.09),
      alta: mistura("#FFFFFF", cor, 0.12),
      maxima: mistura("#FFFFFF", cor, 0.15),
    },
    background: { default: mistura("#FFFFFF", cor, 0.04), paper: mistura("#FFFFFF", cor, 0.07) },
    text: { primary: "#161D1C", secondary: "#3F4947" },
    divider: alpha("#3F4947", 0.24),
  };
  const fundoEscuro = mistura("#0B0F0E", cor, 0.04);
  const escuro = {
    primary: { main: lighten(cor, 0.5), contrastText: darken(cor, 0.5) },
    secondary: { main: lighten(cor, 0.65) },
    container: { main: darken(cor, 0.25), contrastText: lighten(cor, 0.8) },
    tonal: { main: mistura("#0B0F0E", cor, 0.3), contrastText: lighten(cor, 0.85) },
    destaque: { main: "#244A6A", contrastText: "#CFE5FF" },
    superficie: {
      base: fundoEscuro,
      baixa: mistura("#0B0F0E", cor, 0.08),
      media: mistura("#0B0F0E", cor, 0.11),
      alta: mistura("#0B0F0E", cor, 0.15),
      maxima: mistura("#0B0F0E", cor, 0.2),
    },
    background: { default: fundoEscuro, paper: mistura("#0B0F0E", cor, 0.08) },
    text: { primary: "#DDE4E1", secondary: "#BEC9C6" },
    divider: alpha("#BEC9C6", 0.2),
  };
  return { claro, escuro };
}

export function criarTema(cor) {
  const { claro, escuro } = paletas(cor);
  return createTheme({
    cssVariables: { colorSchemeSelector: "media" },
    colorSchemes: { light: { palette: claro }, dark: { palette: escuro } },
    // Com 4, borderRadius: 7 no sx vira 28px (o raio dos cartões do Material 3).
    shape: { borderRadius: 4 },
    typography: {
      fontFamily: 'Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
      h1: { fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.07 },
      h2: { fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.15 },
      h3: { fontWeight: 500 },
      button: { textTransform: "none", fontWeight: 500, letterSpacing: 0.1 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 999, paddingInline: 20, minHeight: 40 }, sizeLarge: { minHeight: 48, paddingInline: 24, fontSize: 15 } },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 8 } } },
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
