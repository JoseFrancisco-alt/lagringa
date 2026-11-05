/* =========================================================
   AGENDAMENTO (exemplo) — edite os serviços e horários aqui
   ========================================================= */
const WHATSAPP = "558293987108"; // WhatsApp Business da La'Gringa: +55 82 9398-7108
const LOJAS = [{ id: "jatiuca", nome: "La'Gringa · Jatiúca", end: "Av. Dr. Antônio Gomes de Barros, 172" }];
const SERVICOS = [
  { id: "corte",   nome: "Corte degradê / social",      min: 40, preco: "R$ 50" },
  { id: "barba",   nome: "Barba padrão Gringo",         min: 30, preco: "R$ 40" },
  { id: "combo",   nome: "Corte + barba",               min: 60, preco: "R$ 80" },
  { id: "terapia", nome: "Barboterapia premium",        min: 40, preco: "R$ 50" },
  { id: "kids",    nome: "Gringo Kids (infantil)",      min: 40, preco: "R$ 50" },
  { id: "full",    nome: "Corte + barba + sobrancelha", min: 70, preco: "R$ 90" },
];
// nomes tirados das avaliações do Google (confirmar quem atende em cada loja)
// barbeiros que aparecem no Booksy deles
const BARBEIROS = [
  { id: "qualquer", nome: "Sem preferência", sub: "o primeiro livre" },
  { id: "aldson",   nome: "Aldson Menezes",  sub: "barbeiro" },
  { id: "wender",   nome: "Wender Brito",    sub: "barbeiro" },
  { id: "eliton",   nome: "Eliton",          sub: "barbeiro" },
  { id: "igorc",    nome: "Igor C.",         sub: "barbeiro" },
  { id: "igord",    nome: "Igor D.",         sub: "barbeiro" },
];
// seg–sex 9h30–19h30 · sáb 9h–18h · domingo fechado (horário do site deles)
const ABRE_DIA = () => 9;
const FECHA_DIA = (d) => (d.getDay() === 0 ? 13 : 19); // seg–sáb 9h–19h · domingo 9h–13h
const FECHADO = [];
const DIAS = 14;                // quantos dias mostrar

const $ = (s) => document.querySelector(s);
const state = { loja: null, svc: null, barb: BARBEIROS[0], day: null, time: null };
const fmtDur = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}` : `${m} min`);
const fmtHora = (h) => `${String(Math.floor(h)).padStart(2, "0")}:${h % 1 ? "30" : "00"}`;
const semana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/* 1. barbearia (vem marcada se o link trouxer ?loja=) */
const lojaUrl = new URLSearchParams(location.search).get("loja");
$("#lojaList").innerHTML = LOJAS.map((l) => `
  <label class="svc-item">
    <input type="radio" name="loja" value="${l.id}"${l.id === lojaUrl ? " checked" : ""}>
    <span class="svc-ph"><img src="img/logo.png" alt="" loading="lazy"></span>
    <span class="svc-txt"><b>${l.nome}</b><small>${l.end}</small></span>
  </label>`).join("");
state.loja = LOJAS.find((l) => l.id === lojaUrl) || (LOJAS.length === 1 ? LOJAS[0] : null);
if (LOJAS.length === 1) document.querySelector("#lojaList").closest(".step").hidden = true; // uma barbearia só: pula o passo

/* 2. serviços */
$("#svcList").innerHTML = SERVICOS.map((s) => `
  <label class="svc-item">
    <input type="radio" name="svc" value="${s.id}">
    <span class="svc-ph svc-n">${s.min}'</span>
    <span class="svc-txt"><b>${s.nome}</b><small>${s.preco} · ~ ${fmtDur(s.min)}</small></span>
  </label>`).join("");

/* 3. barbeiro */
$("#barbList").innerHTML = BARBEIROS.map((b, i) => `
  <label class="svc-item">
    <input type="radio" name="barb" value="${b.id}"${i === 0 ? " checked" : ""}>
    <span class="svc-ph svc-n">${b.nome[0]}</span>
    <span class="svc-txt"><b>${b.nome}</b><small>${b.sub}</small></span>
  </label>`).join("");

/* 2. dias */
const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
const dias = [...Array(DIAS)].map((_, i) => { const d = new Date(hoje); d.setDate(d.getDate() + i); return d; });
$("#dayList").innerHTML = dias.map((d, i) => {
  const off = FECHADO.includes(d.getDay());
  return `<label class="day${off ? " off" : ""}">
    <input type="radio" name="day" value="${i}" ${off ? "disabled" : ""}>
    <span><small>${i === 0 ? "hoje" : i === 1 ? "amanhã" : semana[d.getDay()]}</small><b>${d.getDate()}</b><small>${meses[d.getMonth()]}</small></span>
  </label>`;
}).join("");

/* 3. horários: alguns aparecem ocupados (fixos por dia, só pra demonstrar) */
function ocupado(dayIdx, h) { return ((dayIdx * 7 + h * 13) % 5) === 0; }
function renderSlots() {
  const list = $("#slotList"), hint = $("#slotHint");
  if (state.day === null) { list.innerHTML = ""; hint.hidden = false; return; }
  hint.hidden = true;
  const dur = state.svc ? state.svc.min / 60 : 1;
  const agora = new Date(), isHoje = state.day === 0, dia = dias[state.day];
  const slots = [];
  for (let h = ABRE_DIA(dia); h + dur <= FECHA_DIA(dia); h += 0.5) {
    const passou = isHoje && (h <= agora.getHours() + agora.getMinutes() / 60 + 0.5);
    slots.push({ h, off: passou || ocupado(state.day, h) });
  }
  list.innerHTML = slots.length ? slots.map((s) => `
    <label class="slot${s.off ? " off" : ""}"><input type="radio" name="time" value="${s.h}" ${s.off ? "disabled" : ""}${state.time === s.h ? " checked" : ""}><span>${fmtHora(s.h)}</span></label>`).join("")
    : `<p class="hint">Sem horários neste dia. Experimente outro.</p>`;
  if (state.time !== null && !slots.some((s) => s.h === state.time && !s.off)) state.time = null;
}

/* resumo */
function update() {
  const d = state.day !== null ? dias[state.day] : null;
  if ($("#sumLoja")) $("#sumLoja").textContent = state.loja ? state.loja.nome : "—";
  $("#sumBarb").textContent = state.barb ? state.barb.nome : "—";
  $("#sumSvc").textContent = state.svc ? state.svc.nome : "—";
  $("#sumDay").textContent = d ? `${semana[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}` : "—";
  $("#sumTime").textContent = state.time !== null ? fmtHora(state.time) : "—";
  $("#sumDur").textContent = state.svc ? state.svc.preco : "—";
  const falta = [!state.loja && "barbearia", !state.svc && "serviço", state.day === null && "dia", state.time === null && "hora",
    !$("#fName").value.trim() && "nome", $("#fPhone").value.replace(/\D/g, "").length < 10 && "WhatsApp"].filter(Boolean);
  $("#agSend").disabled = falta.length > 0;
  $("#sumNote").textContent = falta.length ? `Falta: ${falta.join(", ")}.` : "Tudo pronto! É só confirmar.";
}

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.name === "loja") state.loja = LOJAS.find((l) => l.id === t.value);
  if (t.name === "barb") state.barb = BARBEIROS.find((b) => b.id === t.value);
  if (t.name === "svc") { state.svc = SERVICOS.find((s) => s.id === t.value); renderSlots(); }
  if (t.name === "day") { state.day = +t.value; state.time = null; renderSlots(); }
  if (t.name === "time") state.time = +t.value;
  update();
});
["#fName", "#fPhone"].forEach((s) => $(s).addEventListener("input", update));
$("#fPhone").addEventListener("input", (e) => {
  const n = e.target.value.replace(/\D/g, "").slice(0, 11);
  e.target.value = n.length > 6 ? "(" + n.slice(0, 2) + ") " + n.slice(2, 7) + "-" + n.slice(7) : n.length > 2 ? "(" + n.slice(0, 2) + ") " + n.slice(2) : n;
});

/* confirmar: monta a mensagem e abre o WhatsApp */
$("#agForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("#agSend").disabled) return;
  const d = dias[state.day];
  const obs = $("#fNote").value.trim();
  const msg = [
    "Oi, La'Gringa! Quero agendar um horário:",
    `• Barbearia: ${state.loja.nome}`,
$1
    `• Barbeiro: ${state.barb.nome}`,
    `• Dia: ${semana[d.getDay()]}, ${d.getDate()}/${String(d.getMonth() + 1).padStart(2, "0")}`,
    `• Horário: ${fmtHora(state.time)}`,
    `• Nome: ${$("#fName").value.trim()}`,
    `• WhatsApp: ${$("#fPhone").value.trim()}`,
    obs && `• Obs.: ${obs}`,
  ].filter(Boolean).join("\n");
  window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  $("#agForm").hidden = true;
  $(".ag-head").hidden = true;
  $("#agDone").hidden = false;
  scrollTo({ top: 0, behavior: "smooth" });
});

renderSlots(); update();
