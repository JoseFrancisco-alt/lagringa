/* =========================================================
   CONTATO — link do WhatsApp da bio do Instagram
   ========================================================= */
const WHATSAPP_LINK = "https://wa.me/558293987108"; // +55 82 9398-7108

const $ = (s, el = document) => el.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

document.querySelectorAll(".js-wa").forEach((a) => { a.href = WHATSAPP_LINK; a.target = "_blank"; a.rel = "noopener"; });

/* raios do sol (desenhados uma vez) */
{
  const g = document.querySelector(".sun2 .rays, .sun .rays");
  let d = "";
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2, a1 = a - .07, a2 = a + .07;
    const p = (r, t) => `${(300 + Math.cos(t) * r).toFixed(1)},${(300 + Math.sin(t) * r).toFixed(1)}`;
    d += `<path d="M${p(165, a1)} L${p(i % 2 ? 250 : 290, a)} L${p(165, a2)}Z"/>`;
  }
  if (g) g.innerHTML = d;
}

/* scroll suave no computador */
if (window.Lenis && fine && !reduce) {
  const lenis = new Lenis({ duration: 1.15 });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href").length < 2) return;
    const t = document.querySelector(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault(); lenis.scrollTo(t, { offset: -70 });
  });
}

/* nav e menu do celular, botão flutuante */
{
  const nav = $("#nav"), burger = $("#burger"), links = $("#links"), fl = $(".wa-float");
  const sync = () => { nav.classList.toggle("solid", scrollY > 40); fl.classList.toggle("show", scrollY > innerHeight * .8); };
  addEventListener("scroll", sync, { passive: true }); sync();
  burger.addEventListener("click", () => { const o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  links.addEventListener("click", (e) => { if (e.target.tagName === "A") { links.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });
}

/* entrada dos blocos */
{
  const els = document.querySelectorAll(".sec-head > *, .card, .g, .mf, .pills, .manifesto .kicker, .esp-text > *, .esp-photo, .vs-text > *, .vs-map");
  els.forEach((el) => el.classList.add("rv"));
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
}

/* cor por seção: laranja, marrom e creme sobem como cortina */
{
  const COLORS = { sun: "#1c1410", earth: "#8a3b26", cream: "#fff6e6" };
  const base = $("#bgBase"), wipe = $("#bgWipe");
  let current = "sun", prevY = scrollY, down = true, timer = null;
  addEventListener("scroll", () => { if (scrollY !== prevY) down = scrollY > prevY; prevY = scrollY; }, { passive: true });
  const set = (t) => {
    if (!COLORS[t] || t === current) return;
    current = t;
    document.body.dataset.theme = t;
    clearTimeout(timer);
    wipe.className = "bg-wipe" + (down ? "" : " from-top");
    wipe.style.background = COLORS[t];
    void wipe.offsetWidth;
    wipe.classList.add("go");
    timer = setTimeout(() => { base.style.background = COLORS[t]; wipe.className = "bg-wipe"; }, reduce ? 0 : 860);
  };
  document.body.dataset.theme = "sun";
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) set(en.target.dataset.theme); }), { rootMargin: "-50% 0px -50% 0px" });
  document.querySelectorAll("[data-theme]").forEach((el) => io.observe(el));
}

/* topo: fotos espalhadas entram uma a uma e andam em velocidades diferentes ao rolar */
{
  const figs = [...document.querySelectorAll(".hp")];
  figs.forEach((f, i) => setTimeout(() => f.classList.add("in"), 250 + i * 110));
  if (!reduce) {
    const move = () => figs.forEach((f) => { f.style.translate = `0 ${(scrollY * +f.dataset.depth).toFixed(1)}px`; });
    addEventListener("scroll", () => requestAnimationFrame(move), { passive: true });
  }
}

/* foto que cresce: começa pequena no meio e abre até ocupar a tela */
{
  const sec = $("#grow"), card = $("#growCard"), img = card.querySelector("img"), title = sec.querySelector(".grow-title");
  const frame = () => {
    const r = sec.getBoundingClientRect(), span = r.height - innerHeight;
    const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
    const e = 1 - Math.pow(1 - p, 3);
    const mobile = innerWidth < 700;
    const sx = (mobile ? 22 : 36) * (1 - e), sy = (mobile ? 24 : 30) * (1 - e);
    card.style.clipPath = `inset(${sy}% ${sx}% ${sy}% ${sx}% round ${28 - e * 8}px)`;
    img.style.transform = `scale(${1.25 - e * .25})`;
    title.style.opacity = Math.max(0, 1 - e * 1.6);
    title.style.transform = `translateY(${-e * 60}px)`;
  };
  if (reduce) { card.style.clipPath = "none"; }
  else { addEventListener("scroll", () => requestAnimationFrame(frame), { passive: true }); addEventListener("resize", frame); frame(); }
}


/* =========================================================
   CAMADA CRIATIVA (a mesma do site do Manoel, adaptada)
   ========================================================= */
const fino = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* abertura: a navalha passa e o nome vai ficando dourado */
(() => {
  const loader = $("#loader");
  if (!loader) return;
  let visto = null; try { visto = sessionStorage.getItem("zeroLoader"); } catch {}
  if (reduce || visto) { loader.remove(); return; }
  document.body.classList.add("loading");
  let n = 0;
  const tick = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 8));
    $("#loaderNum").textContent = n;
    $("#loaderFill").style.clipPath = "inset(0 " + (100 - n) + "% 0 0)";
    $("#loaderRazor").style.left = n + "%";
    if (n >= 100) {
      clearInterval(tick);
      setTimeout(() => { loader.classList.add("done"); document.body.classList.remove("loading"); }, 250);
      setTimeout(() => loader.remove(), 1200);
      try { sessionStorage.setItem("zeroLoader", "1"); } catch {}
    }
  }, 40);
})();

/* texto que aparece palavra por palavra, saindo do desfoque */
{
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .3 });
  document.querySelectorAll("[data-blur]").forEach((el) => {
    const walk = (node) => [...node.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.append(s);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) walk(c);
    });
    walk(el);
    el.querySelectorAll(".w").forEach((w, i) => (w.style.transitionDelay = (i * 30) + "ms"));
    io.observe(el);
  });
}

/* cursor personalizado: bolinha dourada que vira etiqueta ("Marcar", "Arraste") */
if (fino && !reduce) {
  document.body.classList.add("has-cursor");
  const c = $("#cursor"), dot = $("#cursorDot"), label = $("#cursorLabel");
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; dot.style.transform = "translate(" + x + "px," + y + "px)"; });
  (function loop() { cx += (x - cx) * .18; cy += (y - cy) * .18; c.style.transform = "translate(" + cx + "px," + cy + "px)"; requestAnimationFrame(loop); })();
  document.addEventListener("mouseover", (e) => {
    const lab = e.target.closest("[data-cursor]");
    const hov = e.target.closest("a, button, label");
    c.classList.toggle("label", !!lab && !hov);
    c.classList.toggle("hover", !!hov);
    label.textContent = lab && !hov ? lab.dataset.cursor : "";
  });
}
/* cartão de serviço leva pra marcação */
document.querySelectorAll(".card.txt").forEach((card) => card.addEventListener("click", () => (location.href = "agendar.html")));

/* botões magnéticos: o botão puxa um pouco na direção do mouse */
if (fino && !reduce) {
  document.querySelectorAll("[data-magnetic]").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * .3 + "px, " + (e.clientY - r.top - r.height / 2) * .4 + "px)";
    });
    b.addEventListener("mouseleave", () => (b.style.transform = ""));
  });
}

/* faixa entorta com a velocidade da rolagem */
if (!reduce) {
  const st = document.querySelector(".strip");
  let lastY = scrollY, t;
  addEventListener("scroll", () => {
    const v = Math.max(-6, Math.min(6, (scrollY - lastY) * .15));
    lastY = scrollY;
    st.style.setProperty("--skew", (-v) + "deg");
    clearTimeout(t); t = setTimeout(() => st.style.setProperty("--skew", "0deg"), 140);
  }, { passive: true });
}

/* contadores */
{
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now();
    const step = (t) => {
      const p = reduce ? 1 : Math.min(1, (t - t0) / 1300);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
}

/* avaliações: faixa arrastável com setas */
{
  const strip = $("#revStrip"), prev = $("#revPrev"), next = $("#revNext");
  if (strip) {
    let down = false, sx = 0, ss = 0, moved = false;
    strip.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; ss = strip.scrollLeft; strip.classList.add("dragging"); });
    addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; strip.scrollLeft = ss - dx; });
    addEventListener("pointerup", () => { down = false; strip.classList.remove("dragging"); });
    strip.addEventListener("click", (e) => { if (moved) e.preventDefault(); }, true);
    const passo = () => { const c = strip.querySelector(".rev"); return c ? c.offsetWidth + 16 : 320; };
    prev.addEventListener("click", () => strip.scrollBy({ left: -passo(), behavior: "smooth" }));
    next.addEventListener("click", () => strip.scrollBy({ left: passo(), behavior: "smooth" }));
    const upd = () => { const max = strip.scrollWidth - strip.clientWidth; prev.hidden = strip.scrollLeft <= 4; next.hidden = strip.scrollLeft >= max - 4; };
    strip.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  }
}

/* letreiro do rodapé: cada letra sobe quando o rodapé aparece */
{
  const big = $("#ftBig");
  if (big) {
    big.innerHTML = [...big.textContent].map((ch, i) => '<span class="ch" style="transition-delay:' + i * 45 + 'ms">' + ch + "</span>").join("");
    new IntersectionObserver(([en], o) => { if (en.isIntersecting) { big.classList.add("in"); o.disconnect(); } }, { threshold: .3 }).observe(big);
  }
}

/* loja: copia o pedido e abre o WhatsApp da barbearia */
document.querySelectorAll(".js-pedir").forEach((a) => {
  a.href = WHATSAPP_LINK + "?text=" + encodeURIComponent("Oi, La'Gringa! Quero pedir: " + a.dataset.produto + ". Tem disponível?");
  a.target = "_blank"; a.rel = "noopener";
});
