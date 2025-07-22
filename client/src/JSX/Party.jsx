import React,{useContext, useEffect,useState,useRef} from 'react'
import { SendMail,SendNotificationParty} from './functions/functions.jsx'
import { OverplayContext,server,OverplayProps } from './App.jsx'
import { useNavigate } from 'react-router-dom'
import {io} from "socket.io-client"

export default React.memo(function RenderFriends({userr,followingg,follow,friendss,name,img,id,theUser,setShow}){//theUser is the user who is logged in 
    const overplay=useContext(OverplayContext)
    const navigate=useNavigate()
    const [Room,setRoom]=useState(null)
    const Server=useContext(server)
    const [socket,setsocket]=useState(false)
    const serverio=useRef()
    useEffect(()=>{
        if(socket){
        serverio.current=io("http://localhost:8080")
        console.log(serverio.current)
        serverio.current.on("connection",()=>{
        })
        Server.current=serverio.current
        console.log(userr,name)
        serverio.current.emit("joinRoom",userr,name)
        serverio.current.on("room",(room)=>{
            console.log(room)
            setRoom(room)
            navigate(`/room/${room}`)
        })
    }
    },[socket])
    useEffect(()=>{
    if(!Room)return console.log("jtug");
    console.log(Room)
    console.log("send Mail function executed")
    SendMail(name,theUser,Room)
    SendNotificationParty(name,theUser,Room,"Party")
    },[Room])
    return(
        <>
        <li className="user-list" key={id}>
        <div className="user-div">
            <div className="div-img">
            <img className="user-img" src={img} alt="user pfp" key={img}></img>
            <span className="username" >{name}</span>
            </div>
            <div>
                <div className="span-div">
                <span id="following" className="span-follow">following: {followingg}</span>
                <span id="followers" className="span-follow">followers: {follow}</span>
                <span id="friends" className="span-follow">friends: {friendss}</span>
                </div>
            </div>
            <div className="btn-div">
                <button className='Friend-btn' onClick={()=>{
                setsocket(true)
                }}
                >party !</button>
            </div>
        </div>
    </li>
    </>
    )
})