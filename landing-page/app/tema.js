// Tema Material a partir da configuração (config.tema, editada no painel /admin > Aparência).
// As cores claro e escuro saem do algoritmo oficial do Material 3 (biblioteca
// material-color-utilities do Google): cor principal + estilo + contraste, com secundária
// e terciária opcionais. Depois entram os ajustes feitos à mão, papel por papel.
import { createTheme } from "@mui/material/styles";
import { argbFromHex, hexFromArgb, Hct, DynamicScheme, Variant, TonalPalette, MaterialDynamicColors } from "@material/material-color-utilities";
import { CANTOS, PAPEIS } from "./config/esquema.js";

const VARIANTES = {
  tonalSpot: Variant.TONAL_SPOT,
  fidelity: Variant.FIDELITY,
  vibrant: Variant.VIBRANT,
  expressive: Variant.EXPRESSIVE,
  neutral: Variant.NEUTRAL,
  monochrome: Variant.MONOCHROME,
};
const CORES_M3 = new MaterialDynamicColors();
const TODOS = PAPEIS.flatMap((g) => g.papeis);

// Todos os papéis de cor (hex) de um modo, já com os ajustes manuais.
export function papeisDoTema(t, escuro) {
  const fonte = Hct.fromInt(argbFromHex(t.corPrincipal || "#006A60"));
  const opcoes = { sourceColorHct: fonte, variant: VARIANTES[t.estilo] ?? Variant.TONAL_SPOT, contrastLevel: Number(t.contraste) || 0, isDark: escuro };
  if (t.corSecundaria) opcoes.secondaryPalette = TonalPalette.fromInt(argbFromHex(t.corSecundaria));
  if (t.corTerciaria) opcoes.tertiaryPalette = TonalPalette.fromInt(argbFromHex(t.corTerciaria));
  const esquema = new DynamicScheme(opcoes);
  const saida = {};
  for (const papel of TODOS) saida[papel] = hexFromArgb(CORES_M3[papel]().getArgb(esquema));
  return { ...saida, ...(t.ajustes?.[escuro ? "escuro" : "claro"] || {}) };
}

function paleta(c) {
  return {
    primary: { main: c.primary, contrastText: c.onPrimary },
    secondary: { main: c.secondary, contrastText: c.onSecondary },
    // Nomes curtos usados no sx: "container.main", "tonal.main", "superficie.alta" etc.
    container: { main: c.primaryContainer, contrastText: c.onPrimaryContainer },
    tonal: { main: c.secondaryContainer, contrastText: c.onSecondaryContainer },
    destaque: { main: c.tertiaryContainer, contrastText: c.onTertiaryContainer },
    terciaria: { main: c.tertiary, contrastText: c.onTertiary },
    superficie: {
      base: c.surface,
      baixa: c.surfaceContainerLow,
      media: c.surfaceContainer,
      alta: c.surfaceContainerHigh,
      maxima: c.surfaceContainerHighest,
    },
    contorno: { main: c.outline, suave: c.outlineVariant },
    background: { default: c.surface, paper: c.surfaceContainerLow },
    text: { primary: c.onSurface, secondary: c.onSurfaceVariant },
    divider: c.outlineVariant,
  };
}

// Contraste WCAG entre duas cores hex (1 a 21). Texto normal pede 4,5 ou mais.
export function contraste(a, b) {
  const lum = (hex) => {
    const [r, g, bb] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bb;
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// Aceita a configuração do tema ou, como antes, só a cor principal.
export function criarTema(entrada) {
  const t = typeof entrada === "string" ? { corPrincipal: entrada } : entrada || {};
  const claro = paleta(papeisDoTema(t, false));
  const escuro = paleta(papeisDoTema(t, true));
  const base = (CANTOS.find((c) => c.id === t.cantos) || CANTOS[0]).base;
  const raioCartao = base * 7;
  return createTheme({
    // "class": o botão de tema põe .light ou .dark no <html>; em "sistema" o MUI segue o aparelho.
    cssVariables: { colorSchemeSelector: "class" },
    colorSchemes: { light: { palette: claro }, dark: { palette: escuro } },
    // Com 4, borderRadius: 7 no sx vira 28px (o raio dos cartões do Material 3).
    shape: { borderRadius: base },
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
          root: { borderRadius: base >= 4 ? 999 : base * 4, paddingInline: 24, minHeight: 40, fontSize: 14 },
          sizeLarge: { minHeight: 48, paddingInline: 24, fontSize: 15 },
          // Botão com contorno do Material 3: borda cinza (outline), texto na cor principal.
          outlined: ({ theme }) => ({ borderColor: theme.vars.palette.contorno.main, "&:hover": { borderColor: theme.vars.palette.contorno.main } }),
          text: { paddingInline: 12 },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: base * 2, fontWeight: 500 }, outlined: ({ theme }) => ({ borderColor: theme.vars.palette.contorno.suave }) } },
      MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { borderRadius: raioCartao } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: raioCartao } } },
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
