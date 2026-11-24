// HTML do e-mail que chega quando alguém envia o formulário de pedido.
// Feito para clientes de e-mail (Gmail, Outlook, celular): só tabelas e estilos inline,
// sem CSS externo, e o logo é o PNG publicado no site (endereço absoluto, nunca SVG).
// Cores: esquema claro do tema Material 3 do site (app/tema.js, cor principal #006A60).

export const SITE_URL = "https://tghservices.com.br";
export const LOGO_URL = `${SITE_URL}/logo-tghservices.png`;

export const COR = {
  primaria: "#006a60",
  naPrimaria: "#ffffff",
  tonal: "#cce8e2",
  naTonal: "#334b47",
  fundo: "#e9efed",
  cartao: "#ffffff",
  superficie: "#eff5f2",
  texto: "#161d1c",
  textoSuave: "#3f4947",
  contorno: "#bec9c6",
};

export const FONTE = "Roboto,'Segoe UI',Helvetica,Arial,sans-serif";

export const escaparHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Número do WhatsApp em formato de link (wa.me). Sem DDI, assume Brasil (55).
export function linkWhatsapp(numero) {
  const digitos = String(numero || "").replace(/\D/g, "");
  if (digitos.length < 10 || digitos.length > 13) return "";
  return `https://wa.me/${digitos.length <= 11 ? "55" + digitos : digitos}`;
}

function botao(texto, href, preenchido) {
  const fundo = preenchido ? COR.primaria : COR.cartao;
  const cor = preenchido ? COR.naPrimaria : COR.primaria;
  const borda = preenchido ? COR.primaria : COR.contorno;
  return (
    `<a href="${escaparHtml(href)}" target="_blank" style="display:inline-block;margin:0 8px 8px 0;white-space:nowrap;background:${fundo};color:${cor};border:1px solid ${borda};border-radius:999px;padding:10px 24px;font-family:${FONTE};font-size:14px;font-weight:500;line-height:20px;text-decoration:none">${escaparHtml(texto)}</a>`
  );
}

function linhaDado(rotulo, valorHtml) {
  return (
    `<tr>` +
    `<td style="padding:6px 16px 6px 0;font-family:${FONTE};font-size:13px;line-height:20px;color:${COR.textoSuave};white-space:nowrap;vertical-align:top">${rotulo}</td>` +
    `<td style="padding:6px 0;font-family:${FONTE};font-size:15px;line-height:20px;color:${COR.texto};vertical-align:top;word-break:break-word">${valorHtml}</td>` +
    `</tr>`
  );
}

export function htmlPedido(pedido, assunto) {
  const nome = escaparHtml(pedido.nome);
  const email = escaparHtml(pedido.email);
  const zap = linkWhatsapp(pedido.whatsapp);
  const link = (href, texto) => `<a href="${escaparHtml(href)}" target="_blank" style="color:${COR.primaria};text-decoration:underline">${texto}</a>`;
  const mailto = `mailto:${pedido.email}?subject=${encodeURIComponent("Re: " + assunto)}`;
  const previa = escaparHtml(pedido.mensagem.replace(/\s+/g, " ").slice(0, 120));

  const whatsappHtml = pedido.whatsapp
    ? zap
      ? link(zap, escaparHtml(pedido.whatsapp))
      : escaparHtml(pedido.whatsapp)
    : `<span style="color:${COR.textoSuave}">não informado</span>`;

  const botoes = botao("Responder por e-mail", mailto, true) + (zap ? botao("Chamar no WhatsApp", zap, false) : "");

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escaparHtml(assunto)}</title>
</head>
<body style="margin:0;padding:0;background:${COR.fundo}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${COR.fundo}">${nome}: ${previa}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COR.fundo}">
<tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">

<tr><td align="center" style="padding:8px 0 20px">
<a href="${SITE_URL}" target="_blank" style="text-decoration:none"><img src="${LOGO_URL}" width="180" height="90" alt="TGH Services" style="display:block;width:180px;height:90px;border:0;outline:none"></a>
</td></tr>

<tr><td style="background:${COR.cartao};border-radius:28px;padding:32px 28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="padding-bottom:12px">
<span style="display:inline-block;background:${COR.tonal};color:${COR.naTonal};border-radius:8px;padding:4px 12px;font-family:${FONTE};font-size:13px;font-weight:500;line-height:20px">Novo pedido pelo site</span>
</td></tr>
<tr><td style="padding-bottom:20px;font-family:${FONTE};font-size:26px;line-height:32px;font-weight:500;color:${COR.texto}">${escaparHtml(pedido.tipo)}</td></tr>
<tr><td style="padding-bottom:20px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
${linhaDado("Nome", nome)}
${linhaDado("E-mail", link(mailto, email))}
${linhaDado("WhatsApp", whatsappHtml)}
</table>
</td></tr>
<tr><td style="padding-bottom:24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:${COR.superficie};border-radius:16px;padding:16px 20px;font-family:${FONTE};font-size:15px;line-height:24px;color:${COR.texto};white-space:pre-wrap;word-break:break-word">${escaparHtml(pedido.mensagem)}</td>
</tr></table>
</td></tr>
<tr><td>
${botoes}
</td></tr>
</table>
</td></tr>

<tr><td align="center" style="padding:20px 16px 8px;font-family:${FONTE};font-size:12px;line-height:18px;color:${COR.textoSuave}">
Enviado pelo formulário de pedido de <a href="${SITE_URL}" target="_blank" style="color:${COR.primaria};text-decoration:none;font-weight:500">tghservices.com.br</a><br>
Ao responder este e-mail, a resposta vai direto para ${nome}.
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
