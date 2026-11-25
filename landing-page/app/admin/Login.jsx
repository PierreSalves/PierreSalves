// Tela de entrada do painel: e-mail -> código de 6 dígitos enviado por e-mail.
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import MarkEmailReadRounded from "@mui/icons-material/MarkEmailReadRounded";
import { configInicial } from "../config/contexto.jsx";

const site = configInicial();
import { ModoTema } from "../components/ModoTema.jsx";
import { api, mensagemDeErro } from "./api.js";

const CHAVE_EMAIL = "painel-email";

export function Login({ aoEntrar, aviso }) {
  const [etapa, setEtapa] = useState("email"); // email | codigo
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem(CHAVE_EMAIL) || "";
    } catch {
      return "";
    }
  });
  const [codigo, setCodigo] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState(aviso || "");
  const [espera, setEspera] = useState(0);
  const campoCodigo = useRef(null);

  useEffect(() => {
    if (espera <= 0) return undefined;
    const id = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [espera]);

  async function pedir(ev) {
    ev?.preventDefault();
    setOcupado(true);
    setErro("");
    try {
      await api.pedirCodigo(email.trim());
      try {
        localStorage.setItem(CHAVE_EMAIL, email.trim());
      } catch {
        /* sem armazenamento */
      }
      setEtapa("codigo");
      setCodigo("");
      setEspera(60);
      setTimeout(() => campoCodigo.current?.focus(), 50);
    } catch (e) {
      if (e.codigo === "aguarde") {
        setEtapa("codigo");
        setEspera(e.dados?.segundos || 60);
      }
      setErro(mensagemDeErro(e));
    }
    setOcupado(false);
  }

  async function entrar(ev) {
    ev?.preventDefault();
    setOcupado(true);
    setErro("");
    try {
      const r = await api.entrar(email.trim(), codigo);
      aoEntrar(r.email);
    } catch (e) {
      const resto = e.dados?.restantes;
      setErro(mensagemDeErro(e) + (e.codigo === "codigo-errado" && resto > 0 ? ` Restam ${resto} ${resto === 1 ? "tentativa" : "tentativas"}.` : ""));
      setOcupado(false);
    }
  }

  const mudaCodigo = (v) => {
    const so = v.replace(/\D/g, "").slice(0, 6);
    setCodigo(so);
  };

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "superficie.base" }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", px: { xs: 2, sm: 4 }, py: 2 }}>
        <Button href="/" startIcon={<ArrowBackRounded />} sx={{ color: "text.secondary" }}>Voltar para o site</Button>
        <ModoTema />
      </Stack>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2, pb: 8 }}>
        <Stack spacing={3} sx={{ width: "100%", maxWidth: 420, bgcolor: "superficie.baixa", borderRadius: 7, p: { xs: 3, sm: 4.5 }, boxShadow: 1 }}>
          <Box sx={[{ alignSelf: "flex-start", display: "inline-flex", borderRadius: 3, px: 0.75, py: 0.25 }, (t) => t.applyStyles("dark", { bgcolor: site.marca.logoFundoNoEscuro })]}>
            <Box component="img" src={site.marca.logo} width={site.marca.logoLargura} height={site.marca.logoAltura} alt={site.marca.nome} sx={{ height: 56, width: "auto", display: "block" }} />
          </Box>

          {etapa === "email" ? (
            <Stack component="form" spacing={2.5} onSubmit={pedir} noValidate>
              <Box>
                <Typography variant="h1" sx={{ fontSize: 30 }}>Entrar no painel</Typography>
                <Typography sx={{ color: "text.secondary", mt: 1 }}>Digite o seu e-mail. Vamos mandar um código de 6 números para você entrar, sem senha.</Typography>
              </Box>
              <TextField
                label="E-mail"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {erro && <Alert severity="error" sx={{ borderRadius: 3 }}>{erro}</Alert>}
              <Button type="submit" variant="contained" size="large" disabled={ocupado || !email.includes("@")}>
                {ocupado ? "Enviando…" : "Receber código"}
              </Button>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                <LockRounded sx={{ fontSize: 18 }} />
                <Typography variant="body2">Só entram os e-mails liberados pelo dono do site.</Typography>
              </Stack>
            </Stack>
          ) : (
            <Stack component="form" spacing={2.5} onSubmit={entrar} noValidate>
              <Box>
                <Box sx={{ width: 48, height: 48, borderRadius: 3.5, bgcolor: "container.main", color: "container.contrastText", display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  <MarkEmailReadRounded />
                </Box>
                <Typography variant="h1" sx={{ fontSize: 30 }}>Confira o seu e-mail</Typography>
                <Typography sx={{ color: "text.secondary", mt: 1 }}>
                  Se <Box component="strong" sx={{ color: "text.primary", fontWeight: 500 }}>{email.trim()}</Box> tiver acesso, o código chega em instantes. Ele vale por 10 minutos.
                </Typography>
              </Box>
              <TextField
                inputRef={campoCodigo}
                label="Código"
                value={codigo}
                onChange={(e) => mudaCodigo(e.target.value)}
                autoComplete="one-time-code"
                slotProps={{ htmlInput: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 6, style: { fontSize: 28, letterSpacing: "0.5em", textAlign: "center", fontWeight: 500 } } }}
              />
              {erro && <Alert severity="error" sx={{ borderRadius: 3 }}>{erro}</Alert>}
              <Button type="submit" variant="contained" size="large" disabled={ocupado || codigo.length !== 6}>
                {ocupado ? "Entrando…" : "Entrar"}
              </Button>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Link component="button" type="button" underline="hover" onClick={() => { setEtapa("email"); setErro(""); }} sx={{ fontSize: 14 }}>
                  Usar outro e-mail
                </Link>
                <Button size="small" onClick={() => pedir()} disabled={ocupado || espera > 0}>
                  {espera > 0 ? `Reenviar em ${espera} s` : "Reenviar código"}
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
