// Seção "Avaliações do Google": nota e até 5 avaliações reais, pela API de Places.
// O Worker busca no Google (GET /api/avaliacoes) só quando a seção aparece na tela,
// respeita um limite mensal e, sem chave ou acima do limite, a seção mostra só o link
// para as avaliações no Google Maps. As regras de exibição do Google pedem: nome e foto
// de quem avaliou, link para a avaliação e a marca Google Maps.
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import Link from "@mui/material/Link";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import { CabecalhoSecao } from "./Vitrine.jsx";
import { emPrevia } from "../config/contexto.jsx";

const linkDoLugar = (placeId) => (placeId ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}` : "");

function useAvaliacoes(placeId) {
  const alvo = useRef(null);
  const [visivel, setVisivel] = useState(false);
  const [estado, setEstado] = useState({ carregando: false, dados: null });

  useEffect(() => {
    const el = alvo.current;
    if (!el || visivel) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setVisivel(true);
      return undefined;
    }
    const obs = new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && setVisivel(true), { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [visivel]);

  useEffect(() => {
    if (!visivel || !/^[A-Za-z0-9_-]{10,300}$/.test(placeId || "")) return undefined;
    let ativo = true;
    setEstado({ carregando: true, dados: null });
    const previa = emPrevia() ? `?rascunho=1&placeId=${encodeURIComponent(placeId)}` : "";
    // Na prévia, espera parar de digitar o Place ID para não gastar consultas à toa.
    const id = setTimeout(
      () =>
        fetch(`/api/avaliacoes${previa}`, { credentials: "same-origin" })
          .then((r) => r.json())
          .catch(() => ({ ok: false }))
          .then((dados) => ativo && setEstado({ carregando: false, dados })),
      previa ? 900 : 0,
    );
    return () => {
      ativo = false;
      clearTimeout(id);
    };
  }, [visivel, placeId]);

  return { alvo, ...estado };
}

function MarcaGoogle() {
  return (
    <Typography component="span" sx={{ fontSize: 13, color: "text.secondary" }}>
      Avaliações do <Box component="span" sx={{ fontWeight: 600 }}>Google Maps</Box>
    </Typography>
  );
}

function Resumo({ nota, total, grande }) {
  if (!nota) return null;
  return (
    <Stack direction={grande ? "column" : "row"} spacing={grande ? 0.5 : 1.25} sx={{ alignItems: grande ? "flex-start" : "center" }}>
      <Typography sx={{ fontSize: grande ? 64 : 28, fontWeight: 500, lineHeight: 1 }}>{nota.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</Typography>
      <Box>
        <Rating value={nota} precision={0.1} readOnly size={grande ? "large" : "medium"} sx={{ color: "primary.main" }} />
        {total > 0 && <Typography variant="body2" sx={{ color: "text.secondary" }}>{total.toLocaleString("pt-BR")} {total === 1 ? "avaliação" : "avaliações"}</Typography>}
      </Box>
    </Stack>
  );
}

function CartaoAvaliacao({ a }) {
  return (
    <Stack component="article" spacing={1.5} sx={{ bgcolor: "superficie.baixa", borderRadius: 6, p: 3, height: "100%" }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Avatar src={a.foto || undefined} alt="" slotProps={{ img: { referrerPolicy: "no-referrer" } }} sx={{ width: 40, height: 40 }}>{a.autor?.[0]}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          {a.linkAutor ? (
            <Link href={a.linkAutor} target="_blank" rel="noopener" underline="hover" sx={{ color: "text.primary", fontWeight: 500 }}>{a.autor}</Link>
          ) : (
            <Typography sx={{ fontWeight: 500 }}>{a.autor}</Typography>
          )}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>{a.quando}</Typography>
        </Box>
      </Stack>
      <Rating value={a.nota} readOnly size="small" sx={{ color: "primary.main" }} />
      {a.texto && <Typography variant="body2" sx={{ lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 8, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.texto}</Typography>}
      {a.link && (
        <Box sx={{ mt: "auto !important", pt: 0.5 }}>
          <Link href={a.link} target="_blank" rel="noopener" underline="hover" variant="body2">Ver no Google Maps</Link>
        </Box>
      )}
    </Stack>
  );
}

export function Avaliacoes({ secao }) {
  const d = secao.dados;
  const { alvo, carregando, dados } = useAvaliacoes(d.placeId);
  const avaliacoes = dados?.ok ? dados.avaliacoes : [];
  const link = (dados?.ok && dados.link) || linkDoLugar(d.placeId);
  const lista = secao.variante === "lista";

  // Na página publicada, sem Place ID não há o que mostrar.
  if (!d.placeId && !emPrevia()) return null;

  const botao = link && d.botaoGoogle && (
    <Button variant="outlined" href={link} target="_blank" rel="noopener" endIcon={<OpenInNewRounded />}>{d.botaoGoogle}</Button>
  );

  let conteudo;
  if (!d.placeId) {
    conteudo = <Typography sx={{ color: "text.secondary" }}>Coloque no painel o Place ID do negócio para mostrar as avaliações.</Typography>;
  } else if (carregando || !dados) {
    conteudo = (
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", md: "repeat(3, minmax(0,1fr))" }, gap: 2 }}>
        {[0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={180} sx={{ borderRadius: 6 }} />)}
      </Box>
    );
  } else if (avaliacoes.length === 0) {
    conteudo = (
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        {dados?.ok && <Resumo nota={dados.nota} total={dados.total} />}
        <Typography sx={{ color: "text.secondary" }}>Veja o que os clientes dizem direto no Google Maps.</Typography>
      </Stack>
    );
  } else if (lista) {
    conteudo = (
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,280px) minmax(0,1fr)" }, gap: 3, alignItems: "start" }}>
        <Stack spacing={2} sx={{ bgcolor: "superficie.media", borderRadius: 7, p: 3, position: { md: "sticky" }, top: 96 }}>
          <Resumo nota={dados.nota} total={dados.total} grande />
          <MarcaGoogle />
        </Stack>
        <Stack spacing={2}>{avaliacoes.map((a, i) => <CartaoAvaliacao key={i} a={a} />)}</Stack>
      </Box>
    );
  } else {
    conteudo = (
      <Stack spacing={3}>
        <Stack direction="row" useFlexGap sx={{ alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Resumo nota={dados.nota} total={dados.total} />
          <MarcaGoogle />
        </Stack>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", md: "repeat(2, minmax(0,1fr))", lg: "repeat(3, minmax(0,1fr))" }, gap: 2 }}>
          {avaliacoes.map((a, i) => <CartaoAvaliacao key={i} a={a} />)}
        </Box>
      </Stack>
    );
  }

  return (
    <Box component="section" id={secao.ancora} ref={alvo} sx={{ pb: 9 }}>
      <Container>
        <CabecalhoSecao rotulo={d.rotulo} titulo={d.titulo}>{botao}</CabecalhoSecao>
        {conteudo}
      </Container>
    </Box>
  );
}
