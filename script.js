let currentType = "general";
let savedJoke = JSON.parse(localStorage.getItem("favoriteJoke"));
let autoJoke;

const buttonMap = {
  Programming: "programming",
  Science: "knock-knock",
  Misc: "dad"
};

const config = {
  general: { api: "general", label: "General Humor" },
  programming: { api: "programming", label: "Programming Humor" },
  "knock-knock": { api: "knock-knock", label: "Knock-Knock Humor" },
  dad: { api: "general", label: "Dad Humor" }
};

const emojiWall = document.getElementById("emoji-wall");
const jokesBox = document.getElementById("jokes");
const savedIcon = document.getElementById("savedIcon");

const isCurrentSaved = () =>
  savedJoke &&
  savedJoke.setup === setup.textContent &&
  savedJoke.punchline === punchline.textContent;

const updateHeart = () => {
  heartIcon.className = isCurrentSaved()
    ? "bi bi-heart-fill saved"
    : "bi bi-heart";
  saveTxt.textContent = isCurrentSaved() ? "Saved" : "Save";
};

const resetSavedIcon = () => {
  savedIcon.classList.remove("bi-folder2-open");
  savedIcon.classList.add("bi-collection");
};

const generateEmojis = (count = 20) => {
  const char = emoji.innerHTML;
  if (!emojiWall.children.length) {
    emojiWall.innerHTML = Array(count)
      .fill(`<span class="emoji-item"></span>`)
      .join("");
  }
  [...emojiWall.children].forEach(e => {
    e.innerHTML = char;
    e.style.cssText = `
      top:${Math.random() * 100}vh;
      left:${Math.random() * 100}vw;
      font-size:${Math.random() * 2 + 0.8}rem;
      transform:rotate(${Math.random() * 360}deg)
    `;
  });
};

const fetchJoke = () => {
  const { api, label } = config[currentType];
  [setup, punchline, headinggg, emoji].forEach(e => e.classList.add("fade"));

  Promise.all([
    fetch(`https://official-joke-api.appspot.com/jokes/${api}/random`).then(r => r.json()),
    fetch("https://emojihub.yurace.pro/api/random").then(r => r.json())
  ]).then(([j, e]) => {
    const joke = j[0];
    setTimeout(() => {
      headinggg.textContent = label;
      setup.textContent = joke.setup;
      punchline.textContent = joke.punchline;
      emoji.innerHTML = e.htmlCode[0];
      generateEmojis();
      updateHeart();
      resetSavedIcon();
      [setup, punchline, headinggg, emoji].forEach(e => e.classList.remove("fade"));
    }, 220);
  });
};

const restartAuto = () => {
  clearInterval(autoJoke);
  autoJoke = setInterval(fetchJoke, 90000);
};

document.querySelectorAll(".category-btn").forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentType = buttonMap[btn.dataset.cat] || "general";
    restartAuto();
    fetchJoke();
  })
);

newJoke.onclick = () => {
  restartAuto();
  fetchJoke();
};

jokesBox.onmouseenter = () => clearInterval(autoJoke);
jokesBox.onmouseleave = restartAuto;

document.querySelector(".bi-copy").parentElement.onclick = () => {
  navigator.clipboard.writeText(`${setup.textContent}\n\n${punchline.textContent}`);
  const i = document.querySelector(".bi-copy");
  i.classList.replace("bi-copy", "bi-check2-all");
  cpytxt.textContent = "Copied!";
  setTimeout(() => {
    i.classList.replace("bi-check2-all", "bi-copy");
    cpytxt.textContent = "Copy";
  }, 2000);
};

document.querySelector(".bi-share").parentElement.onclick = () =>
  navigator.share?.({ text: `${setup.textContent}\n\n${punchline.textContent}` });

document.querySelector(".bi-twitter").parentElement.onclick = () => {
  const t = encodeURIComponent(`${setup.textContent} — ${punchline.textContent}`);
  window.open(`https://twitter.com/intent/tweet?text=${t}`, "_blank");
};

saveJoke.onclick = () => {
  savedJoke = isCurrentSaved()
    ? (localStorage.removeItem("favoriteJoke"), null)
    : {
        setup: setup.textContent,
        punchline: punchline.textContent
      };
  savedJoke
    ? localStorage.setItem("favoriteJoke", JSON.stringify(savedJoke))
    : null;
  updateHeart();
};

viewSaved.onclick = () => {
  if (!savedJoke) return;

  savedIcon.classList.replace("bi-collection", "bi-folder2-open");

  setup.classList.add("fade");
  punchline.classList.add("fade");

  setTimeout(() => {
    setup.textContent = savedJoke.setup;
    punchline.textContent = savedJoke.punchline;
    updateHeart();
    setup.classList.remove("fade");
    punchline.classList.remove("fade");
  }, 220);
};

document.addEventListener("keydown", e => {
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
  const k = e.key.toLowerCase();
  if (k === "n") newJoke.click();
  if (k === "1") document.querySelector('[data-cat="Programming"]').click();
  if (k === "2") document.querySelector('[data-cat="Science"]').click();
  if (k === "3") document.querySelector('[data-cat="Misc"]').click();
  if (k === "s") saveJoke.click();
  if (k === "v") viewSaved.click();
});

fetchJoke();
restartAuto();