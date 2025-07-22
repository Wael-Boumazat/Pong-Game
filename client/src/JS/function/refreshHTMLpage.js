export default function refreshHTMLPageifPlayer1loose(){
let score=Number(localStorage.getItem("AIscore"))
if(!score)score=0
localStorage.setItem("AIscore",score+1)
location.reload()
}

export function refreshHTMLPageifAIloose(){
    let score=Number(localStorage.getItem("playerScore"))
    if(!score)score=0
    localStorage.setItem("playerScore",score+1)
}