function getData ()
{
    fetch(`https://official-joke-api.appspot.com/random_joke`)
        .then((res) => res.json())
        .then((data) =>
        {
            document.getElementById('setup').textContent = data.setup;
            document.getElementById('punchline').textContent = data.punchline;
        })
        .catch((err)=>console.log(err))
}
getData()
setInterval(getData,10000)

function getEmoji() {
    fetch("https://emojihub.yurace.pro/api/random")
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('emoji').innerHTML = data.htmlCode[0];
        })
        .catch((err) => console.log(err));
}

getEmoji();
setInterval(getEmoji, 10000);