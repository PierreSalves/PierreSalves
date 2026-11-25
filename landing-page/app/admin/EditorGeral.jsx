// Aba "Geral": marca, Google, botão do topo, formulário de pedido, contato e rodapé.
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Campos } from "./Campos.jsx";
import { CAMPOS_GERAL } from "./camposSecoes.js";

// Junta campos seguidos que editam a mesma parte da configuração (marca, seo...).
function porChave(campos) {
  const grupos = [];
  for (const c of campos) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.chave === c.chave) ultimo.campos.push(c);
    else grupos.push({ chave: c.chave, campos: [c] });
  }
  return grupos;
}

export function EditorGeral({ config, aoMudar, aoErro }) {
  const contexto = { tiposDePedido: config.tiposDePedido, ancoras: config.secoes.filter((s) => s.visivel).map((s) => `#${s.ancora}`), aoErro };
  return (
    <Stack spacing={4} divider={<Divider flexItem />}>
      {CAMPOS_GERAL.map((bloco) => (
        <Stack key={bloco.titulo} spacing={2} component="section">
          <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{bloco.titulo}</Typography>
          {porChave(bloco.campos).map((g, i) => (
            <Campos
              key={i}
              campos={g.campos}
              valor={g.chave ? config[g.chave] : config}
              aoMudar={(novo) => aoMudar(g.chave ? { ...config, [g.chave]: novo } : novo)}
              contexto={contexto}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
