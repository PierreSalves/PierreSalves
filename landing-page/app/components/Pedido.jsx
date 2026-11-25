// Formulário de pedido. Qualquer botão da página chama abrirPedido(tipo) e o
// formulário abre com aquele tipo escolhido. O envio vai para POST /api/pedido,
// e o Worker manda o pedido para o e-mail configurado.
import { createContext, useCallback, useContext, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SendRounded from "@mui/icons-material/SendRounded";
import { useSite } from "../config/contexto.jsx";

const PedidoContexto = createContext(() => {});
export const useAbrirPedido = () => useContext(PedidoContexto);

const VAZIO = { nome: "", email: "", whatsapp: "", tipo: "", mensagem: "", empresa_site: "" };

export function PedidoProvider({ children }) {
  const site = useSite();
  const [aberto, setAberto] = useState(false);
  const [dados, setDados] = useState(VAZIO);
  const [estado, setEstado] = useState("editando"); // editando | enviando | enviado | erro
  const telaCheia = useMediaQuery((t) => t.breakpoints.down("sm"));

  const abrir = useCallback((tipo, referencia) => {
    setDados((d) => ({
      ...d,
      tipo: site.tiposDePedido.some((t) => t.id === tipo) ? tipo : site.tiposDePedido[0]?.id || "",
      mensagem: referencia && !d.mensagem ? `Quero algo parecido com o ${referencia}. ` : d.mensagem,
    }));
    setEstado((e) => (e === "enviado" ? "editando" : e));
    setAberto(true);
  }, [site.tiposDePedido]);

  const muda = (campo) => (ev) => setDados((d) => ({ ...d, [campo]: ev.target.value }));

  async function enviar(ev) {
    ev.preventDefault();
    setEstado("enviando");
    try {
      const resp = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dados, tipoTexto }),
      });
      if (!resp.ok) throw new Error(String(resp.status));
      setEstado("enviado");
      setDados(VAZIO);
    } catch {
      setEstado("erro");
    }
  }

  const tipoTexto = site.tiposDePedido.find((t) => t.id === dados.tipo)?.texto || "Pedido";
  const mailto =
    `mailto:${site.contato.email}?subject=${encodeURIComponent(tipoTexto + " pelo site")}` +
    `&body=${encodeURIComponent(dados.mensagem)}`;

  return (
    <PedidoContexto.Provider value={abrir}>
      {children}
      <Dialog
        open={aberto}
        onClose={() => setAberto(false)}
        fullScreen={telaCheia}
        maxWidth="sm"
        fullWidth
        aria-labelledby="pedido-titulo"
        slotProps={{ paper: { component: "form", onSubmit: enviar, noValidate: false } }}
      >
        <DialogTitle id="pedido-titulo" sx={{ pr: 7 }}>
          {site.formulario.titulo}
          <IconButton aria-label="Fechar" onClick={() => setAberto(false)} sx={{ position: "absolute", right: 12, top: 12 }}>
            <CloseRounded />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {estado === "enviado" ? (
            <Alert severity="success" sx={{ mt: 1 }}>{site.formulario.sucesso}</Alert>
          ) : (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>{site.formulario.texto}</Typography>
              <TextField select label="O que você precisa" value={dados.tipo} onChange={muda("tipo")} required>
                {site.tiposDePedido.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.texto}</MenuItem>
                ))}
              </TextField>
              <TextField label="Seu nome" value={dados.nome} onChange={muda("nome")} required autoComplete="name" slotProps={{ htmlInput: { maxLength: 120 } }} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="E-mail" type="email" value={dados.email} onChange={muda("email")} required autoComplete="email" slotProps={{ htmlInput: { maxLength: 200 } }} />
                <TextField label="WhatsApp (opcional)" type="tel" value={dados.whatsapp} onChange={muda("whatsapp")} autoComplete="tel" slotProps={{ htmlInput: { maxLength: 40 } }} />
              </Stack>
              <TextField
                label={site.formulario.campoMensagem || "Mensagem"}
                value={dados.mensagem}
                onChange={muda("mensagem")}
                required
                multiline
                minRows={4}
                helperText={site.formulario.ajudaMensagem}
                slotProps={{ htmlInput: { maxLength: 4000 } }}
              />
              {/* Campo escondido contra robôs: pessoas não veem nem preenchem. */}
              <input
                type="text"
                name="empresa_site"
                value={dados.empresa_site}
                onChange={muda("empresa_site")}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }}
              />
              {estado === "erro" && (
                <Alert severity="warning">
                  {site.formulario.erro} {site.contato.email && <Link href={mailto}>{site.contato.email}</Link>}
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {estado === "enviado" ? (
            <Button variant="contained" onClick={() => setAberto(false)}>Fechar</Button>
          ) : (
            <>
              <Button onClick={() => setAberto(false)}>Cancelar</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={estado === "enviando"}
                startIcon={estado === "enviando" ? <CircularProgress size={18} color="inherit" /> : <SendRounded />}
              >
                {estado === "enviando" ? "Enviando" : "Enviar pedido"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </PedidoContexto.Provider>
  );
}
