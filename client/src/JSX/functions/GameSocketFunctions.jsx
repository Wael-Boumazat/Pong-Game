import {io} from "socket.io-client"
import { loginwithtokens } from "../../JS/functions.js"
import StartGameAudio from "../../assets/Audio/startAudio.wav"
import { arrayBufferToBase64 } from "../../JS/functions.js"
import { useEffect } from "react"
import { sleep } from "./functions.jsx"
export function NavigateUsersToGameRoom(nav,server){
    server.on("connect",()=>{

        console.log(server.id)
    })
    console.log(server)
server.on("navUsers",(roomId)=>{
    console.log(roomId)
    nav(`/game/${roomId}`)
})
}

export function CreateRoom_Game(server,user1,user2,nav){
    server.on("connect",()=>{

        console.log(server.id)
    })
console.log(user1,user2)
server.emit("Game_room",user1,user2)
const audio=new Audio(StartGameAudio)
audio.play()
server.on("navUsers",(i)=>{
    console.log(i)
    NavigateUsersToGameRoom(nav,server)
})
}

export function ConnectToServerGame(server,user,room,nav,setUserData,setotheruserdata){
    let userdata
    let otheruserdata
server.emit("player_data",room,user)
server.on("player_data_Game",(data)=>{
    if(!data)nav("/")
    
    for(const element of data){
        if(element.username===user){
            userdata=element
        }else{
            otheruserdata=element
        } 
    }

    
    setUserData(userdata)
    setotheruserdata(otheruserdata)
})
}

export const run=async(setuser)=>{
    try{
 const data_user=await loginwithtokens()
 setuser( data_user)

}catch(err){
    console.error(err)
}
}
export function CancelPartyGame(serverIO,room){
    setTimeout(()=>{
    console.log(room)
    serverIO.current.emit("deleteRoom",room)
    },500)
}

export function SetUsersImages(setImg1,setImg2,userdata1,userdata2){
if(userdata1){
    const base64String=arrayBufferToBase64(userdata1.file.data)
    setImg1(`data:${userdata1.contentType};base64,${base64String}`)
}
if(userdata2){
    const base64String=arrayBufferToBase64(userdata2.file.data)
    setImg2(`data:${userdata2.contentType};base64,${base64String}`)
}
}

export function UpdatePaddlePosition(server,setPaddlePosition){
server.on("updatePaddlePosition",(paddleposition)=>{
setPaddlePosition(paddleposition)
})
}

export function GameLoop(ref,ball,gamewon,isGameLost){
    if(!ball||gamewon||isGameLost){
        cancelAnimationFrame(ref.current)
        console.log("oii")
        return;
    }else{
    ball.updateCircleMovement()
    ref.current=requestAnimationFrame(()=>GameLoop(ref,ball,gamewon,isGameLost))
    }
}

export function SetOnlineUserStatus(socket,user,room,setLoad,setCountDown){
    useEffect(()=>{
    if(!socket.current||!user||!room)return;
    socket.current.emit("isOnline",user,room)
    socket.current.on("isBothUsersOnline",(booleans)=>{
        if(!booleans)return ;
        setLoad(false)
        setCountDown(true)
    })
},[socket.current,user])
}

export function loose(socket,player,room,setGameLost,GameLost){
if(!socket||GameLost)return ;
console.log(setGameLost)
socket.emit("Player_lost",player,room)
setGameLost(true)
}

export function Won(socket,player,room,setGameWon,GameWon){
    if(!socket||GameWon)return ;
    socket.emit("Player_Won",player,room)
    setGameWon(true)
}