/* ==========================================
   THE JOURNEY TO MY HEART — cleaned up
========================================== */

const pages = document.querySelectorAll(".page");
const journeyDots = document.querySelectorAll(".journey-dot");
const journeySteps = ["welcome", "intro", "name", "quiz", "letter", "climax", "ending"];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let visitorName = "";

function showPage(id) {
  pages.forEach((page) => page.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
  updateJourney(id);
}

function updateJourney(id) {
  const index = journeySteps.indexOf(id);
  if (index === -1) return;
  journeyDots.forEach((dot, i) => {
    dot.classList.remove("done", "current");
    if (i < index) dot.classList.add("done");
    if (i === index) dot.classList.add("current");
  });
}

/* ==============================
   Loading screen
============================== */

window.addEventListener("load", () => {
  const saved = localStorage.getItem("visitor");
  if (saved) visitorName = saved;

  setTimeout(() => showPage("welcome"), 2200);
});

/* ==============================
   Simple "next" buttons
============================== */

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => showPage(btn.dataset.next));
});

/* ==============================
   Save name
============================== */

const nameForm = document.getElementById("nameForm");
const nameInput = document.getElementById("visitorName");
const nameError = document.getElementById("nameError");

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = nameInput.value.trim();

  if (value === "") {
    nameError.hidden = false;
    nameInput.focus();
    return;
  }

  nameError.hidden = true;
  visitorName = value;
  localStorage.setItem("visitor", visitorName);
  startQuiz();
});

/* ==============================
   Ambient heart burst (used sparingly)
============================== */

function spawnHearts(count, originX, originY, spread) {
  if (prefersReducedMotion) return;
  const icons = ["\u2764\uFE0F", "\uD83D\uDC96", "\uD83D\uDC95", "\uD83D\uDC97", "\uD83D\uDC98", "\uD83D\uDC9D"];

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "burst-heart";
      heart.textContent = icons[Math.floor(Math.random() * icons.length)];
      heart.style.left = originX + "px";
      heart.style.top = originY + "px";
      heart.style.fontSize = 16 + Math.random() * 26 + "px";

      const angle = Math.random() * 360;
      const distance = spread * (0.5 + Math.random() * 0.6);

      const animation = heart.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          {
            transform: `translate(${Math.cos((angle * Math.PI) / 180) * distance}px, ${
              Math.sin((angle * Math.PI) / 180) * distance
            }px) scale(.25)`,
            opacity: 0,
          },
        ],
        { duration: 2200, easing: "ease-out" },
      );

      document.body.appendChild(heart);
      animation.onfinish = () => heart.remove();
    }, i * 18);
  }
}

/* ==============================
   Quiz data & engine
============================== */

const quiz = [
  {
    question: "Kalau kamu diberi bunga, apa yang kamu lakukan?",
    answers: ["Menyimpannya", "Memotretnya", "Membiarkannya tumbuh"],
  },
  {
    question: "Menurutmu cinta itu...",
    answers: ["Tulus", "Nyaman", "Saling menghargai"],
  },
  {
    question: "Kalau ada seseorang yang diam-diam menyukaimu...",
    answers: ["Dengarkan dulu", "Hargai keberaniannya", "Lihat ketulusannya"],
  },
  {
    question: "Apa yang paling membuatmu bahagia?",
    answers: ["Bersama keluarga", "Bersama orang spesial", "Melihat orang tersenyum"],
  },
  {
    question: "Kalau kamu bisa mengulang waktu...",
    answers: ["Memperbaiki kesalahan", "Bertemu seseorang lebih cepat", "Menikmati setiap momen"],
  },
];

let currentQuestion = 0;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressBar = document.getElementById("progressBar");

function startQuiz() {
  currentQuestion = 0;
  showPage("quiz");
  loadQuestion();
}

function loadQuestion() {
  const q = quiz[currentQuestion];
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";
  progressBar.style.width = (currentQuestion / quiz.length) * 100 + "%";

  q.answers.forEach((answer) => {
    const div = document.createElement("div");
    div.className = "answer";
    div.textContent = answer;
    div.setAttribute("role", "button");
    div.setAttribute("tabindex", "0");
    div.addEventListener("click", chooseAnswer);
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        chooseAnswer();
      }
    });
    answersEl.appendChild(div);
  });
}

function chooseAnswer() {
  currentQuestion++;
  progressBar.style.width = (currentQuestion / quiz.length) * 100 + "%";

  if (currentQuestion < quiz.length) {
    setTimeout(loadQuestion, 250);
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  showPage("analyze");
  setTimeout(() => {
    showPage("letter");
    startLetter();
  }, 2600);
}

/* ==============================
   Letter typing effect
============================== */

const typingEl = document.getElementById("typingText");
let typingTimer = null;

function letterMessage() {
  return `Halo ${visitorName || "Kamu"}

Terima kasih karena sudah bersedia mengikuti perjalanan kecil ini.

Awalnya mungkin kamu mengira ini hanyalah sebuah halaman biasa.

Padahal, setiap bagian yang kamu lewati adalah langkah menuju sesuatu yang ingin kusampaikan.`;
}

function startLetter() {
  const message = letterMessage();
  typingEl.textContent = "";
  clearTimeout(typingTimer);

  if (prefersReducedMotion) {
    typingEl.textContent = message;
    return;
  }

  let i = 0;
  function type() {
    if (i < message.length) {
      typingEl.textContent += message.charAt(i);
      i++;
      typingTimer = setTimeout(type, 22);
    }
  }
  type();
}

/* ==============================
   Climax sequence
============================== */

const helloUserEl = document.getElementById("helloUser");
const climaxLinesEl = document.getElementById("climaxLines");
const loveTextEl = document.getElementById("loveText");
const endingBtn = document.getElementById("endingBtn");

const climaxSentences = [
  "Apa perlu aku kembali...",
  "...ke masa lalu...",
  "...untuk mengubah naskah Sumpah Pemuda...",
  "...menjadi...",
];

document.getElementById("openSecret").addEventListener("click", () => {
  helloUserEl.innerHTML = `Untuk <strong>${escapeHtml(visitorName)}</strong>`;
  loveTextEl.hidden = true;
  endingBtn.hidden = true;
  climaxLinesEl.innerHTML = "";

  showPage("climax");
  runCountdown(() => playClimaxLines());
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function runCountdown(callback) {
  if (prefersReducedMotion) {
    callback();
    return;
  }

  const counter = document.createElement("p");
  counter.className = "climax-count";
  counter.style.fontFamily = "var(--font-display)";
  counter.style.fontSize = "40px";
  counter.style.color = "var(--gold-300)";
  climaxLinesEl.appendChild(counter);

  let number = 3;
  function tick() {
    counter.textContent = number;
    counter.animate(
      [
        { transform: "scale(.4)", opacity: 0 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 500 },
    );

    if (number === 0) {
      counter.remove();
      callback();
      return;
    }
    number--;
    setTimeout(tick, 800);
  }
  tick();
}

function playClimaxLines() {
  let line = 0;

  function nextLine() {
    if (line >= climaxSentences.length) {
      revealConfession();
      return;
    }

    const p = document.createElement("p");
    climaxLinesEl.appendChild(p);

    if (prefersReducedMotion) {
      p.textContent = climaxSentences[line];
      line++;
      setTimeout(nextLine, 400);
      return;
    }

    let i = 0;
    function type() {
      if (i < climaxSentences[line].length) {
        p.textContent += climaxSentences[line].charAt(i);
        i++;
        setTimeout(type, 35);
      } else {
        line++;
        setTimeout(nextLine, 550);
      }
    }
    type();
  }

  nextLine();
}

function revealConfession() {
  loveTextEl.hidden = false;
  endingBtn.hidden = false;

  const rect = loveTextEl.getBoundingClientRect();
  spawnHearts(45, rect.left + rect.width / 2, rect.top + rect.height / 2, 320);
}

/* ==============================
   Ending & restart
============================== */

document.getElementById("endingBtn").addEventListener("click", () => {
  showPage("ending");
});

document.getElementById("restart").addEventListener("click", () => {
  location.reload();
});

/* ==============================
   Music toggle (placeholder source)
============================== */

const audio = new Audio();
audio.loop = true;
// Ganti dengan musik pilihanmu:
// audio.src = "assets/audio/music.mp3";

const muteBtn = document.getElementById("muteBtn");
muteBtn.addEventListener("click", () => {
  if (!audio.src) {
    muteBtn.style.opacity = "0.5";
    return;
  }
  if (audio.paused) {
    audio.play();
    muteBtn.textContent = "\u266B";
  } else {
    audio.pause();
    muteBtn.textContent = "\u266A";
  }
});
