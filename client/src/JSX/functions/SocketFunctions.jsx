import React,{useState,useEffect,useContext,useRef} from 'react'
import {io} from "socket.io-client"

export function socketVerify(socket,serverIO,id,user,nav,setdata,setuserleave){
    if(!socket){
        return ;
    }
    serverIO.current=io("http://localhost:8080")
    console.log(serverIO.current)
    serverIO.current.on("connect",()=>{
        console.log("connected with "+serverIO.current.id)
    })
    console.log(id)
    serverIO.current.emit("verifytheroom",id,user)
    serverIO.current.on("canjointheroom",(boolean)=>{
    if(!boolean){
     nav("/")
     return ;   
    }
    console.log("we can acces to this page")
    socketJoinRoom(serverIO,id,user,setdata)
    serverIO.current.on("userdisconnected",(user,cb)=>{
        console.log(user+"disconnected")
        setuserleave(true)
        cb()
    })
})
}
function socketJoinRoom(server,id,user,setdata){
server.current.emit("JoinRoom",user,id,()=>{
    console.log("user joined the room")
    server.current.on("userJoined",(data)=>{
        console.log(Object.values(data))
        setdata(Object.values(data))
    })
    server.current.on("bothusersjoined",(data,cb)=>{
        cb()
        setdata(Object.values(data))
    })
})
}
export function CancelParty(user,serverIO,room,nav){
    console.log(room)
    serverIO.current.emit("cancelRoom",user,room,(navigate)=>{
        console.log("room deleted")
        if(navigate){
            nav("/")
        }
    })
}
export function timeUp(serverIO,room){
serverIO.current.emit("timeup",room)
}