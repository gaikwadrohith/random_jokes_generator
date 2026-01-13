function updateJokeAndEmoji() {
    Promise.all([
        fetch("https://official-joke-api.appspot.com/random_joke").then(res => res.json()),
        fetch("https://emojihub.yurace.pro/api/random").then(res => res.json())
    ])
    .then(([joke, emoji]) => {
        document.getElementById("heading").textContent = `${joke.type} Humor`;
        document.getElementById("setup").textContent = joke.setup;
        document.getElementById("punchline").textContent = joke.punchline;
        document.getElementById("emoji").innerHTML = emoji.htmlCode[0];
    })
    .catch(err => console.log(err));
}

updateJokeAndEmoji();
setInterval(updateJokeAndEmoji, 10000);