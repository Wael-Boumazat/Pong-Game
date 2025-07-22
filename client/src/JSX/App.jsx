import Friend from "./friends.jsx"
import React,{createContext, useEffect, useRef, useState} from "react"
import { memo } from "react"
import {HeartIcon} from "@heroicons/react/24/solid"
import Notification from "./notification.jsx"
import { Overplay } from "./functions/functions.jsx"
import { Route,Routes, useLocation } from "react-router-dom"
import Game from "./Game.jsx"

export const OverplayContext=createContext()
export const server=createContext()
export const OverplayProps=createContext()

function App() {
        const [show,setshow]=useState(false)
        const [notification_show,setnotification_show]=useState(false)
        const s=useRef()
        const [user,setuser]=useState(undefined)
        const [userimg,setuserimg]=useState(null)
        const location =useLocation()
        const [showOverPlay,setshowOverPlay]=useState(false)
        const [overplayp,setoverplayp]=useState({
            //overplayp stands for overplay props :)
            player1_img:undefined,
            player1_name:undefined,
            player2_img:undefined,
            plater2_name:undefined,
            joined:false
        })
        const isGame=location.pathname.startsWith("/game/")
        function Shownotif({notification_show}){
            if(notification_show){
                return (
                    <Notification
                    close={notification_show}
                    setclose={setnotification_show}/>
                )
            }else{
                return null
            }
        }
        function ShowOverplayy({arg,player1,playerimg,player2name,player2img,joined,server}){
            console.log("we return and this time it will work")
            return(
            <Overplay
            s={server}
            player1_name={player1}
            player1_img={playerimg}
            player2_name={player2name}
            player2_img={player2img}
            isjoined={joined}></Overplay>
            )
        }
        const Show=memo(function Show({showw}){
            if(showw){
                return (<>
                <OverplayContext.Provider value={{showOverPlay,setshowOverPlay}}>
                 <server.Provider value={s}>
                    <OverplayProps.Provider value={{overplayp,setoverplayp}}>
                <Friend
                close={show}
                setclose={setshow}
                Userr={user}
                setUser={setuser}
                userimg={userimg}
                setuserimg={setuserimg}
                />
                </OverplayProps.Provider>
                </server.Provider>
                </OverplayContext.Provider>
                </>)
            }else{
                return null
            }
        })
    return(
        <>
        {!isGame&&(
            <>
        <div className="container">
        <div className="name"> <h1><big>Welcome in 
            Ping Pong Game !</big></h1>
            <button className="create" id="create"><span>create an account</span></button>
        <button className="log" id="loginbtn"><span>login</span></button>
      </div>
        <div className="playwithfriends" >
            <button id="playwithfriends" onClick={()=>setshow(!show)}><span> play with friends !!</span></button>
            <a href="/canva.html" title="play with AI" target="_self">
            <button className="ia"><span> play with AI !!</span></button>
        </a>
        </div>
    
    </div>
    <div className="notification-div">
        <HeartIcon className="w-8 h-8 text-red-500" onClick={()=>setnotification_show(!notification_show)}/>
        <span className="number-of-notif"></span>
    </div>
    </>
     )}
    <Routes>
    <Route path="/room/:id"  element={<ShowOverplayy
    player1={user}
    playerimg={userimg}
    />}/>
    <Route path="/game/:id" element={<Game/>}/>
    <Route path="/" element={<></>}></Route>
    </Routes>
   <Show showw={show}></Show>
   <Shownotif notification_show={notification_show}></Shownotif>
    </>
    )
}

export default App
