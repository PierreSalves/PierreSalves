// Carrossel da vitrine (setas rolam os cards) e carrossel de telas dentro de cada card.
(function () {
  "use strict";

  var reduzirMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var INTERVALO_MS = 5000;

  // Vitrine: as setas rolam meia largura da faixa de cards.
  var faixa = document.getElementById("vitrine");
  document.querySelectorAll("[data-track]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      if (!faixa) return;
      var direcao = botao.getAttribute("data-track") === "next" ? 1 : -1;
      faixa.scrollBy({ left: direcao * faixa.clientWidth * 0.5, behavior: reduzirMovimento ? "auto" : "smooth" });
    });
  });

  // Telas de cada card: setas, pontos e troca automática.
  document.querySelectorAll("[data-shots]").forEach(function (caixa) {
    var imagens = Array.prototype.slice.call(caixa.querySelectorAll("img"));
    if (!imagens.length) return;
    var nome = (caixa.closest(".card").querySelector("h3") || {}).textContent || "app";
    var atual = 0;

    var legenda = document.createElement("span");
    legenda.className = "caption";
    caixa.appendChild(legenda);

    var pontos = [];
    if (imagens.length > 1) {
      ["prev", "next"].forEach(function (lado) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "nav-btn " + lado;
        b.setAttribute("aria-label", (lado === "prev" ? "Tela anterior de " : "Próxima tela de ") + nome);
        b.innerHTML = '<span class="ms" aria-hidden="true">' + (lado === "prev" ? "chevron_left" : "chevron_right") + "</span>";
        b.addEventListener("click", function () { mostrar(atual + (lado === "prev" ? -1 : 1)); reiniciar(); });
        caixa.appendChild(b);
      });
      var grupo = document.createElement("div");
      grupo.className = "dots";
      imagens.forEach(function (img, i) {
        var d = document.createElement("button");
        d.type = "button";
        d.setAttribute("aria-label", "Mostrar " + img.getAttribute("data-label"));
        d.innerHTML = "<span></span>";
        d.addEventListener("click", function () { mostrar(i); reiniciar(); });
        grupo.appendChild(d);
        pontos.push(d);
      });
      caixa.appendChild(grupo);
    }

    function mostrar(i) {
      atual = (i % imagens.length + imagens.length) % imagens.length;
      imagens.forEach(function (img, k) { img.classList.toggle("on", k === atual); });
      pontos.forEach(function (d, k) { d.setAttribute("aria-current", k === atual ? "true" : "false"); });
      var rotulo = document.createElement("small");
      rotulo.textContent = imagens.length > 1 ? (atual + 1) + "/" + imagens.length : "";
      legenda.textContent = imagens[atual].getAttribute("data-label") + " ";
      legenda.appendChild(rotulo);
    }

    var timer = null;
    function iniciar() {
      if (reduzirMovimento || imagens.length < 2) return;
      timer = setInterval(function () { if (!document.hidden) mostrar(atual + 1); }, INTERVALO_MS);
    }
    function reiniciar() { clearInterval(timer); iniciar(); }

    // Pausa enquanto o mouse ou o foco do teclado estão no carrossel.
    caixa.addEventListener("mouseenter", function () { clearInterval(timer); });
    caixa.addEventListener("mouseleave", reiniciar);
    caixa.addEventListener("focusin", function () { clearInterval(timer); });
    caixa.addEventListener("focusout", reiniciar);

    mostrar(0);
    iniciar();
  });
})();
