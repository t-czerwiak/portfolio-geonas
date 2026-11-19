const $ = (s) => document.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

/* reloj */
function clock() {
  const d = new Date(),
    D = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    M = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  $("#clock").textContent =
    `${D[d.getDay()]} ${d.getDate()} ${M[d.getMonth()]}  ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
clock();
setInterval(clock, 15000);

/* dock */
const DOCK = [
  ["inicio", "Inicio", "#46A9F8", "F"],
  ["universo", "Universo", "#6D5BEA", "✦"],
  ["frontend", "Frontend", "#187CC1", "&lt;&gt;"],
  ["proyectos", "Proyectos", "#FFFFFF", "✿"],
  ["sistemas", "Sistemas", "#FF6C37", "{ }"],
  ["metodo", "Método", "#17191F", "&gt;_"],
  ["contacto", "Contacto", "#238BE6", "✉"],
  ["|"],
  ["top", "Volver arriba", "#7A7E87", "↑"],
];
const dock = $("#dock");
DOCK.forEach((d) => {
  if (d[0] === "|") {
    dock.insertAdjacentHTML("beforeend", '<div class="dsep"></div>');
    return;
  }
  const col = d[0] === "proyectos" ? "#E64A9A" : "#fff";
  dock.insertAdjacentHTML(
    "beforeend",
    `<a class="di" href="#${d[0] === "top" ? "inicio" : d[0]}" data-s="${d[0]}" aria-label="${d[1]}"><span class="ico" style="--c:${d[2]};color:${col}">${d[3]}</span><span class="dot"></span><span class="lab">${d[1]}</span></a>`,
  );
});
const icons = [...dock.querySelectorAll(".di")];
const fine = matchMedia("(pointer: fine)").matches;
if (fine) {
  dock.addEventListener("mousemove", (e) =>
    icons.forEach((i) => {
      const r = i.getBoundingClientRect(),
        d = Math.abs(e.clientX - (r.left + r.width / 2)),
        k = Math.max(0, 1 - d / 140),
        sz = 52 * (1 + 0.55 * k * k * (3 - 2 * k));
      i.classList.add("mag");
      i.style.width = i.style.height = sz + "px";
      i.style.setProperty("--sz", sz + "px");
    }),
  );
  dock.addEventListener("mouseleave", () =>
    icons.forEach((i) => {
      i.classList.remove("mag");
      i.style.width = i.style.height = "";
      i.style.removeProperty("--sz");
    }),
  );
}
icons.forEach((i) =>
  i.addEventListener("click", () => {
    i.classList.remove("bounce");
    void i.offsetWidth;
    i.classList.add("bounce");
  }),
);

/* aparición */
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
        onShow(e.target);
      }
    }),
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
);
document.querySelectorAll(".open,.st").forEach((el) => io.observe(el));
setTimeout(() => {
  $("#h1").classList.add("in");
  $("#sub").classList.add("in");
}, 150);

/* fondo que acompaña el scroll */
const glows = ["gA", "gB", "gC", "gD", "gE"].map((id) => document.getElementById(id));
const drift = [
  [40, -30],
  [-50, 40],
  [-30, -40],
  [60, 20],
  [-40, 30],
];
let ticking = false;
addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const p = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
      glows.forEach(
        (g, i) => (g.style.transform = `translate(${drift[i][0] * p * 3}px,${drift[i][1] * p * 3}px)`),
      );
      ticking = false;
    });
  },
  { passive: true },
);

/* sección activa */
const ids = ["inicio", "universo", "frontend", "proyectos", "sistemas", "metodo", "contacto"];
const secs = ids.map((id) => document.getElementById(id));
const navA = [...document.querySelectorAll(".menubar nav a")];
const APP = {
  inicio: "Finder",
  universo: "Finder",
  frontend: "Code",
  proyectos: "Fotos",
  sistemas: "Postman",
  metodo: "Terminal",
  contacto: "Mail",
};
addEventListener(
  "scroll",
  () => {
    let a = 0;
    secs.forEach((s, i) => {
      if (s.getBoundingClientRect().top < innerHeight * 0.45) a = i;
    });
    icons.forEach((i) => i.classList.toggle("on", i.dataset.s === ids[a]));
    navA.forEach((n, i) => n.classList.toggle("on", i === a));
    document.querySelector(".menubar b:nth-child(2)").textContent = APP[ids[a]];
  },
  { passive: true },
);

/* fotos */
const T = [
  ["portal", "Portal", "a1", "Página web que hice con 16 años.", "grid-column:span 3;grid-row:span 2"],
  ["unity", "Escena en Unity", "a2", "Escena en Unity, con 17 años.", "grid-column:span 2;grid-row:span 2"],
  ["soldier", "Soldado 3D", "a3", "Personaje 3D.", "grid-column:span 1"],
  ["oor", "Out of Reach", "a2", "Juego 3D que hice con 17 años.", "grid-column:span 1"],
  ["malvinas", "Proyecto Malvinas", "a3", "Juego 3D que hice con 18 años.", "grid-column:span 2;grid-row:span 2"],
  ["perceptron", "Perceptrón", "ia", "Experimento con un perceptrón.", "grid-column:span 2;grid-row:span 2"],
  [
    "airesult",
    "Resultados del entrenamiento",
    "ia",
    "Precisión de los modelos a lo largo del entrenamiento.",
    "grid-column:span 2;grid-row:span 2",
  ],
  ["database", "Base de datos", "", "Tablas de una base de datos.", "grid-column:span 3"],
  ["nevergiveup", "Código", "", "", "grid-column:span 2"],
  ["exceso", "Exceso de ChatGPT", "ia", "", "grid-column:span 1"],
];
const tiles = $("#tiles");
T.forEach(([k, n, al, d, st]) =>
  tiles.insertAdjacentHTML(
    "beforeend",
    `<button type="button" class="tile${["soldier", "oor", "exceso", "airesult"].includes(k) ? " contain" : ""}" data-k="${k}" data-al="${al}" style="${st}" aria-label="${n}"><img src="img/tile_${k}.png" alt="${n}" loading="lazy"><span class="cap">${n}</span></button>`,
  ),
);
const ALB = { all: "Mis proyectos", a1: "Portal", a2: "Out of Reach", a3: "Proyecto Malvinas", ia: "IA" };
document.querySelectorAll("#albums button").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll("#albums button").forEach((x) => x.classList.toggle("on", x === b));
    const al = b.dataset.al;
    let n = 0;
    tiles.querySelectorAll(".tile").forEach((t) => {
      const on = al === "all" || t.dataset.al === al;
      t.classList.toggle("off", !on);
      if (on) n++;
    });
    $("#galt").textContent = ALB[al];
    $("#galc").textContent = al === "all" ? "10 fotos" : `${n} foto${n === 1 ? "" : "s"}`;
  }),
);
const ql = $("#ql");
tiles.addEventListener("click", (e) => {
  const t = e.target.closest(".tile");
  if (!t) return;
  const it = T.find((x) => x[0] === t.dataset.k);
  $("#qlt").textContent = it[1];
  $("#qli").src = `img/tile_${it[0]}.png`;
  $("#qli").alt = it[1];
  $("#qlp").textContent = it[3];
  $("#qlp").style.display = it[3] ? "" : "none";
  ql.classList.add("open");
});
const closeQL = () => ql.classList.remove("open");
$("#qlx").onclick = closeQL;
ql.addEventListener("click", (e) => {
  if (e.target === ql) closeQL();
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeQL();
});

/* sistemas: consulta */
const RES = [
  ["c", "// Ejemplo de respuesta"],
  ["k", "{"],
  ["k", '  "data": ['],
  ["s", '    { "name": "Receta" }'],
  ["k", "  ]"],
  ["k", "}"],
];
let busy = false;
async function send() {
  if (busy) return;
  busy = true;
  const res = $("#res");
  res.innerHTML = '<span class="c">Enviando…</span>';
  await sleep(550);
  res.innerHTML = '<span class="status">200 OK · 48 ms</span>\n';
  for (let i = 0; i < RES.length; i++) {
    await sleep(110);
    res.insertAdjacentHTML(
      "beforeend",
      `<span class="ln">0${i + 1}</span><span class="${RES[i][0]}">${RES[i][1].replace(/</g, "&lt;")}</span>\n`,
    );
  }
  busy = false;
}
$("#send").onclick = send;

/* método: terminal y loop */
const TERM = [
  "Last login: Sun Oct 11 21:32:08 on ttys001",
  ["~ % ", "cd Proyectos/Moodboard"],
  ["Moodboard % ", "ls"],
  "assets   frontend   unity   ai-models   README.md",
  ["Moodboard % ", "mkdir entrega-final"],
  ["Moodboard % ", 'git add . && git commit -m "keep building"'],
  "[main 7a2f9d1] keep building",
  ["Moodboard % ", 'echo "Never give up"'],
  "Never give up",
];
async function typeTerm() {
  const pre = $("#tpre");
  pre.innerHTML = "";
  for (const l of TERM) {
    if (typeof l === "string") {
      pre.insertAdjacentText("beforeend", l + "\n");
      await sleep(120);
      continue;
    }
    pre.insertAdjacentHTML("beforeend", `<span class="p">matias@macbook ${l[0]}</span>`);
    for (const c of l[1]) {
      pre.insertAdjacentText("beforeend", c);
      await sleep(30);
    }
    pre.insertAdjacentText("beforeend", "\n");
    await sleep(220);
  }
  pre.insertAdjacentHTML(
    "beforeend",
    '<span class="p">matias@macbook Moodboard % </span><span class="cur"></span>',
  );
}
let loopT = null;
function runLoop() {
  const f = [...document.querySelectorAll("#fn div")];
  let i = 0;
  f[0].classList.add("on");
  loopT = setInterval(() => {
    f.forEach((x) => x.classList.remove("on"));
    i = (i + 1) % 3;
    f[i].classList.add("on");
  }, 1100);
}
function onShow(el) {
  if (el.id === "wterm") typeTerm();
  if (el.id === "loop" && !loopT) runLoop();
  if (el.id === "wsys") setTimeout(send, 900);
}
