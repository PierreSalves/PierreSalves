// Janela "Quem pode entrar": o dono libera e tira e-mails do painel.
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import useMediaQuery from "@mui/material/useMediaQuery";
import PersonRemoveRounded from "@mui/icons-material/PersonRemoveRounded";
import PersonAddRounded from "@mui/icons-material/PersonAddRounded";
import { api, mensagemDeErro } from "./api.js";

function Linha({ email, detalhe, acao }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", py: 1.25 }}>
      <Avatar sx={{ width: 36, height: 36, bgcolor: "container.main", color: "container.contrastText", fontSize: 15 }}>{email[0].toUpperCase()}</Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>{email}</Typography>
        {detalhe && <Typography variant="body2" sx={{ color: "text.secondary" }}>{detalhe}</Typography>}
      </Box>
      {acao}
    </Stack>
  );
}

export function Acessos({ aberto, aoFechar, aoAvisar, aoErro, aoSairDaSessao }) {
  const [dados, setDados] = useState(null);
  const [novo, setNovo] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const telaCheia = useMediaQuery((t) => t.breakpoints.down("sm"));

  const carregar = () =>
    api.acessos().then(setDados, (e) => {
      if (e.codigo === "sem-acesso") aoSairDaSessao();
      else aoErro(mensagemDeErro(e));
    });

  useEffect(() => {
    if (aberto) carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  async function liberar(ev) {
    ev.preventDefault();
    setOcupado(true);
    try {
      await api.liberar(novo.trim());
      aoAvisar(`${novo.trim()} já pode entrar no painel.`);
      setNovo("");
      await carregar();
    } catch (e) {
      aoErro(mensagemDeErro(e));
    }
    setOcupado(false);
  }

  async function tirar(email) {
    try {
      await api.tirarAcesso(email);
      aoAvisar(`${email} não entra mais no painel.`);
      carregar();
    } catch (e) {
      aoErro(mensagemDeErro(e));
    }
  }

  const data = (s) => new Date(s * 1000).toLocaleDateString("pt-BR");

  return (
    <Dialog open={aberto} onClose={aoFechar} fullWidth maxWidth="sm" fullScreen={telaCheia}>
      <DialogTitle>
        Quem pode entrar
        <Typography variant="body2" sx={{ color: "text.secondary" }}>Cada pessoa entra com um código enviado para o próprio e-mail.</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack component="form" direction="row" spacing={1} onSubmit={liberar} sx={{ alignItems: "flex-start", pt: 1, mb: 2 }}>
          <TextField label="E-mail para liberar" type="email" size="small" value={novo} onChange={(e) => setNovo(e.target.value)} />
          <Button type="submit" variant="contained" startIcon={<PersonAddRounded />} disabled={ocupado || !novo.includes("@")} sx={{ flex: "none", minHeight: 40 }}>
            Liberar
          </Button>
        </Stack>
        {!dados ? (
          <Stack spacing={1}>{[0, 1].map((i) => <Skeleton key={i} variant="rounded" height={48} />)}</Stack>
        ) : (
          <Box>
            {dados.donos.map((e) => (
              <Linha key={e} email={e} detalhe="Dono do site" acao={<Chip size="small" label="Dono" sx={{ bgcolor: "destaque.main", color: "destaque.contrastText" }} />} />
            ))}
            {dados.emails.map((u) => (
              <Linha
                key={u.email}
                email={u.email}
                detalhe={`Liberado em ${data(u.criado_em)}`}
                acao={
                  <IconButton aria-label={`Tirar o acesso de ${u.email}`} onClick={() => tirar(u.email)}>
                    <PersonRemoveRounded />
                  </IconButton>
                }
              />
            ))}
            {dados.emails.length === 0 && (
              <Typography variant="body2" sx={{ color: "text.secondary", py: 1.5 }}>Nenhum outro e-mail liberado ainda.</Typography>
            )}
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
              Os donos ficam na configuração do site e não podem ser tirados por aqui. Ao tirar um e-mail, a sessão dele termina na hora.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={aoFechar}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
