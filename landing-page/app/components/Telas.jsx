// Carrossel de telas dentro de um cartão: troca sozinho a cada 5 s, pausa com o
// mouse ou o foco em cima, e não anima para quem pediu menos movimento.
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Icone } from "../icones.jsx";

const INTERVALO_MS = 5000;

export default function Telas({ telas, nome, iconeVazio, textoVazio }) {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const menosMovimento = useMediaQuery("(prefers-reduced-motion: reduce)");
  const total = telas.length;

  useEffect(() => {
    if (pausado || menosMovimento || total < 2) return undefined;
    const id = setInterval(() => {
      if (!document.hidden) setAtual((a) => (a + 1) % total);
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [pausado, menosMovimento, total, atual]);

  const ir = (i) => setAtual(((i % total) + total) % total);

  return (
    <Box
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      sx={{ position: "relative", aspectRatio: "16 / 9", bgcolor: "superficie.maxima", overflow: "hidden" }}
    >
      {total === 0 && (
        <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, bgcolor: "tonal.main", color: "tonal.contrastText", fontSize: 13 }}>
          <Icone nome={iconeVazio} sx={{ fontSize: 64 }} />
          {textoVazio}
        </Box>
      )}
      {telas.map((t, i) => (
        <Box
          key={t.imagem}
          component="img"
          src={t.imagem}
          alt={t.legenda}
          loading={i === 0 ? "eager" : "lazy"}
          aria-hidden={i !== atual}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: t.posicao || "left top",
            opacity: i === atual ? 1 : 0,
            transition: menosMovimento ? "none" : "opacity .5s ease",
          }}
        />
      ))}
      {total > 0 && (
        <Box
          aria-live="polite"
          sx={{ position: "absolute", left: 12, bottom: 12, height: 28, px: 1.25, borderRadius: 2, bgcolor: "rgba(18,20,22,.74)", color: "#fff", fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 0.75 }}
        >
          {telas[atual].legenda}
          {total > 1 && <Box component="small" sx={{ opacity: 0.7, fontSize: 12 }}>{atual + 1}/{total}</Box>}
        </Box>
      )}
      {total > 1 && (
        <>
          {[-1, 1].map((lado) => (
            <IconButton
              key={lado}
              onClick={() => ir(atual + lado)}
              aria-label={(lado < 0 ? "Tela anterior de " : "Próxima tela de ") + nome}
              sx={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                [lado < 0 ? "left" : "right"]: 10,
                bgcolor: "superficie.maxima",
                color: "text.primary",
                boxShadow: "0 1px 3px rgba(0,0,0,.3)",
                "&:hover": { bgcolor: "superficie.alta" },
              }}
            >
              {lado < 0 ? <ChevronLeftRounded /> : <ChevronRightRounded />}
            </IconButton>
          ))}
          <Box sx={{ position: "absolute", right: 8, bottom: 6, display: "flex" }}>
            {telas.map((t, i) => (
              <Box
                key={t.imagem}
                component="button"
                type="button"
                onClick={() => ir(i)}
                aria-label={"Mostrar " + t.legenda}
                aria-current={i === atual}
                sx={{ width: 28, height: 28, border: 0, bgcolor: "transparent", cursor: "pointer", p: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                <Box
                  component="span"
                  sx={{ display: "block", width: i === atual ? 20 : 8, height: 8, borderRadius: 1, bgcolor: i === atual ? "#fff" : "rgba(255,255,255,.55)", boxShadow: "0 0 0 1px rgba(0,0,0,.25)", transition: "width .2s" }}
                />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
