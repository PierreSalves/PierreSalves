import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import site from "./app/site.config.js";
import cv from "./app/curriculo.config.js";

const escapar = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Título, descrição e ícone da aba saem do site.config.js e do curriculo.config.js.
const seo = {
  name: "seo-do-site",
  transformIndexHtml: (html) =>
    html
      .replace("%SITE_TITULO%", escapar(site.seo.titulo))
      .replace("%SITE_DESCRICAO%", escapar(site.seo.descricao))
      .replace("%CV_TITULO%", escapar(cv.seo.titulo))
      .replace("%CV_DESCRICAO%", escapar(cv.seo.descricao))
      .replace("%SITE_LOGO%", escapar(site.marca.logo)),
};

export default defineConfig({
  plugins: [react(), seo],
  // React + MUI dá ~165 kB com gzip; o aviso padrão de 500 kB (sem gzip) não ajuda aqui.
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    // Duas páginas: a inicial e o currículo (vira dist/curriculo.html, servido em /curriculo).
    rolldownOptions: { input: { inicio: "index.html", curriculo: "curriculo.html" } },
  },
});
