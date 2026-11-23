// Links para outros sites (http/https) abrem em nova guia; links internos e mailto, na mesma.
export const novaGuia = (url) => (/^https?:\/\//.test(url) ? { target: "_blank", rel: "noopener" } : {});
