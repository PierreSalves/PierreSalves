// Botão do cabeçalho que alterna o tema: sistema -> claro -> escuro -> sistema.
// A escolha fica salva no navegador (localStorage, chave "mui-mode") e vale para todas as páginas.
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";
import BrightnessAutoRounded from "@mui/icons-material/BrightnessAutoRounded";
import LightModeRounded from "@mui/icons-material/LightModeRounded";
import DarkModeRounded from "@mui/icons-material/DarkModeRounded";

const MODOS = {
  system: { proximo: "light", Icone: BrightnessAutoRounded, texto: "Tema: igual ao sistema" },
  light: { proximo: "dark", Icone: LightModeRounded, texto: "Tema: claro" },
  dark: { proximo: "system", Icone: DarkModeRounded, texto: "Tema: escuro" },
};

export function ModoTema({ sx }) {
  const { mode, setMode } = useColorScheme();
  const atual = MODOS[mode] || MODOS.system;
  const proximo = MODOS[atual.proximo];
  const { Icone } = atual;
  return (
    <Tooltip title={`${atual.texto}. Clique para mudar.`}>
      <IconButton
        onClick={() => setMode(atual.proximo)}
        aria-label={`${atual.texto}. Mudar para ${proximo.texto.replace("Tema: ", "")}`}
        sx={{ color: "text.secondary", ...sx }}
      >
        <Icone />
      </IconButton>
    </Tooltip>
  );
}
