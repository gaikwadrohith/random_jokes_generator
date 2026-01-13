let currentType = "general";

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

function fetchJoke() {
    const { api, label } = config[currentType];

    Promise.all([
        fetch(`https://official-joke-api.appspot.com/jokes/${api}/random`)
            .then(r => r.json()),
        fetch("https://emojihub.yurace.pro/api/random")
            .then(r => r.json())
    ])
    .then(([jokeArr, emoji]) => {
        const joke = jokeArr[0];

        headinggg.textContent = label;
        setup.textContent = joke.setup;
        punchline.textContent = joke.punchline;
        emoji && (document.getElementById("emoji").innerHTML = emoji.htmlCode[0]);
    })
    .catch(console.error);
}

document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        currentType = buttonMap[btn.dataset.cat] || "general";
        fetchJoke();
    });
});

newJoke.addEventListener("click", fetchJoke);

fetchJoke();
