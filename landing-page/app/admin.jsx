// Painel /admin: configuração da página (Página, Aparência, Geral) e cards de projetos.
// Sem sessão, mostra a tela de entrada (código por e-mail, ver src/login.js).
// A configuração fica no D1 como rascunho até ser publicada (ver src/config.js);
// os cards também ficam no D1 (ver src/projetos.js).
import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MoreVertRounded from "@mui/icons-material/MoreVertRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import UploadFileRounded from "@mui/icons-material/UploadFileRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import ManageAccountsRounded from "@mui/icons-material/ManageAccountsRounded";
import "@fontsource-variable/roboto-flex/opsz.css";
import { criarTema } from "./tema.js";
import { configInicial, SiteProvider } from "./config/contexto.jsx";
import { FORMATO_BACKUP } from "./config/esquema.js";
import { ModoTema } from "./components/ModoTema.jsx";
import { api, mensagemDeErro } from "./admin/api.js";
import { Login } from "./admin/Login.jsx";
import { Acessos } from "./admin/Acessos.jsx";
import { Projetos } from "./admin/Projetos.jsx";
import { Configuracao } from "./admin/Configuracao.jsx";

// O painel usa as cores e o logo publicados (o Worker põe a configuração no HTML).
const site = configInicial();
const tema = criarTema(site.tema);

const ABAS = [
  { id: "pagina", nome: "Página" },
  { id: "aparencia", nome: "Aparência" },
  { id: "geral", nome: "Geral" },
  { id: "projetos", nome: "Projetos" },
];

function lerAbaDoEndereco() {
  const a = location.hash.replace("#", "");
  return ABAS.some((x) => x.id === a) ? a : "pagina";
}

function Painel({ eu, aoSair }) {
  const email = eu.email;
  const [aba, setAba] = useState(lerAbaDoEndereco);
  const [acessos, setAcessos] = useState(false);
  const [importando, setImportando] = useState(null);
  const [aviso, setAviso] = useState(null); // { tipo, texto }
  const [menu, setMenu] = useState(null);
  const [versaoDados, setVersaoDados] = useState(0);
  const arquivoBackup = useRef(null);

  const avisar = useCallback((texto, tipo = "success") => setAviso({ texto, tipo, chave: Date.now() }), []);
  const erro = useCallback((texto) => avisar(texto, "error"), [avisar]);

  const trocarAba = (v) => {
    setAba(v);
    history.replaceState(null, "", `#${v}`);
  };

  async function lerBackup(ev) {
    const arquivo = ev.target.files[0];
    ev.target.value = "";
    if (!arquivo) return;
    try {
      const backup = JSON.parse(await arquivo.text());
      const valido = (backup?.formato === FORMATO_BACKUP || backup?.formato === "tghservices-projetos") && Array.isArray(backup.projetos);
      if (!valido) throw new Error();
      setImportando(backup);
    } catch {
      erro("Esse arquivo não é um backup do site.");
    }
  }

  async function confirmarImportar() {
    const backup = importando;
    setImportando(null);
    try {
      const r = await api.importar(backup);
      avisar(r.config ? `Backup restaurado: configuração da página e ${r.total} projetos.` : `Backup restaurado: ${r.total} projetos.`);
    } catch (e) {
      if (e?.codigo === "sem-acesso") return aoSair(mensagemDeErro(e));
      erro(mensagemDeErro(e));
    }
    setVersaoDados((v) => v + 1);
  }

  const comConfig = importando?.formato === FORMATO_BACKUP && (importando.config?.publicado || importando.config?.rascunho);

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "superficie.base", color: "text.primary", borderBottom: 1, borderColor: "divider" }}>
        <Container>
          <Toolbar disableGutters sx={{ minHeight: { xs: 64 }, gap: 1.5 }}>
            <Box component="a" href="/" aria-label="Ir para o site" sx={[{ display: "inline-flex", borderRadius: 2, px: 0.5 }, (t) => (site.marca.logoFundoNoEscuro ? t.applyStyles("dark", { bgcolor: site.marca.logoFundoNoEscuro }) : {})]}>
              <Box component="img" src={site.marca.logo} width={site.marca.logoLargura} height={site.marca.logoAltura} alt={site.marca.nome} sx={{ height: 40, width: "auto", display: "block" }} />
            </Box>
            <Typography sx={{ fontWeight: 500, color: "text.secondary", display: { xs: "none", sm: "block" } }}>Painel</Typography>
            <Box sx={{ flex: 1 }} />
            {email && <Chip label={email} variant="outlined" sx={{ display: { xs: "none", md: "inline-flex" } }} />}
            <ModoTema />
            <Button href="/" target="_blank" rel="noopener" startIcon={<OpenInNewRounded />} sx={{ display: { xs: "none", sm: "inline-flex" } }}>Ver site</Button>
            <IconButton aria-label="Mais opções" onClick={(e) => setMenu(e.currentTarget)}><MoreVertRounded /></IconButton>
            <Menu anchorEl={menu} open={!!menu} onClose={() => setMenu(null)} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} transformOrigin={{ horizontal: "right", vertical: "top" }}>
              {email && <MenuItem disabled sx={{ display: { md: "none" } }}><ListItemText primary={email} /></MenuItem>}
              <MenuItem component="a" href="/api/admin/exportar" download onClick={() => setMenu(null)}>
                <ListItemIcon><DownloadRounded /></ListItemIcon>
                <ListItemText primary="Baixar backup" secondary="Configuração e projetos em JSON" />
              </MenuItem>
              <MenuItem onClick={() => { setMenu(null); arquivoBackup.current?.click(); }}>
                <ListItemIcon><UploadFileRounded /></ListItemIcon>
                <ListItemText primary="Restaurar backup" secondary="Troca tudo pelo arquivo" />
              </MenuItem>
              {eu.dono && <Divider />}
              {eu.dono && (
                <MenuItem onClick={() => { setMenu(null); setAcessos(true); }}>
                  <ListItemIcon><ManageAccountsRounded /></ListItemIcon>
                  <ListItemText primary="Quem pode entrar" secondary="Liberar ou tirar e-mails" />
                </MenuItem>
              )}
              <Divider />
              <MenuItem component="a" href="/" target="_blank" rel="noopener" sx={{ display: { sm: "none" } }}>
                <ListItemIcon><OpenInNewRounded /></ListItemIcon>
                <ListItemText primary="Ver site" />
              </MenuItem>
              <MenuItem onClick={async () => { setMenu(null); try { await api.sair(); } catch { /* já saiu */ } aoSair(""); }}>
                <ListItemIcon><LogoutRounded /></ListItemIcon>
                <ListItemText primary="Sair" />
              </MenuItem>
            </Menu>
            <input ref={arquivoBackup} type="file" accept="application/json,.json" hidden onChange={lerBackup} />
          </Toolbar>
          <Tabs value={aba} onChange={(_, v) => trocarAba(v)} variant="scrollable" allowScrollButtonsMobile sx={{ minHeight: 48, mt: -0.5 }}>
            {ABAS.map((a) => <Tab key={a.id} value={a.id} label={a.nome} sx={{ minHeight: 48 }} />)}
          </Tabs>
        </Container>
      </AppBar>

      <Container component="main" sx={{ py: { xs: 2.5, sm: 3.5 } }}>
        {/* A configuração continua montada na aba Projetos para não perder o que ainda está sendo salvo. */}
        <Box sx={{ display: aba === "projetos" ? "none" : "block" }}>
          <Configuracao key={versaoDados} aba={aba} aoAvisar={avisar} aoErro={erro} aoSair={aoSair} />
        </Box>
        {aba === "projetos" && <Projetos key={versaoDados} avisar={avisar} erro={erro} aoSair={aoSair} />}
      </Container>

      <Dialog open={!!importando} onClose={() => setImportando(null)}>
        <DialogTitle>Restaurar este backup?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "text.secondary" }}>
            {comConfig ? "A configuração da página (rascunho e publicada) e t" : "T"}odos os projetos de agora serão trocados pelos {importando?.projetos.length} do arquivo
            {importando?.exportado_em ? ` (salvo em ${new Date(importando.exportado_em).toLocaleString("pt-BR")})` : ""}. Baixe um backup antes, se quiser guardar o que está aí.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportando(null)}>Cancelar</Button>
          <Button onClick={confirmarImportar} variant="contained">Restaurar</Button>
        </DialogActions>
      </Dialog>

      <Acessos aberto={acessos} aoFechar={() => setAcessos(false)} aoAvisar={avisar} aoErro={erro} aoSairDaSessao={() => aoSair("Sua sessão terminou. Entre de novo.")} />

      <Snackbar key={aviso?.chave} open={!!aviso} autoHideDuration={aviso?.tipo === "error" ? 8000 : 4000} onClose={(_, motivo) => motivo !== "clickaway" && setAviso(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} sx={{ bottom: { xs: 88, sm: 24 } }}>
        <Alert severity={aviso?.tipo || "success"} variant="filled" onClose={() => setAviso(null)} sx={{ borderRadius: 2 }}>{aviso?.texto}</Alert>
      </Snackbar>
    </>
  );
}

// Decide entre a tela de entrada e o painel, conforme a sessão.
function Raiz() {
  const [eu, setEu] = useState(undefined); // undefined = conferindo, null = sem sessão
  const [aviso, setAviso] = useState("");
  const conferir = useCallback(() => api.eu().then((r) => setEu({ email: r.email, dono: r.dono }), () => setEu(null)), []);
  useEffect(() => {
    conferir();
  }, [conferir]);
  const sair = useCallback((texto) => {
    setAviso(texto || "");
    setEu(null);
  }, []);
  if (eu === undefined) return null;
  if (eu === null) return <Login aviso={aviso} aoEntrar={() => { setAviso(""); conferir(); }} />;
  return <Painel eu={eu} aoSair={sair} />;
}

createRoot(document.getElementById("raiz")).render(
  <StrictMode>
    <ThemeProvider theme={tema}>
      <CssBaseline enableColorScheme />
      {/* O cartão de prévia do editor de projetos lê a configuração publicada. */}
      <SiteProvider inicial={site}>
        <Raiz />
      </SiteProvider>
    </ThemeProvider>
  </StrictMode>,
);
