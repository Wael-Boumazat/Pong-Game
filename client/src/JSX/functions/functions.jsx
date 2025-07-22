import React,{useEffect,useState,useRef} from 'react'
import User from '../user.jsx'
import {io} from "socket.io-client"
import { arrayBufferToBase64, loginwithtokens } from '../../JS/functions.js'
import Countdown from 'react-countdown'
import { useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { socketVerify,CancelParty,timeUp } from './SocketFunctions.jsx'
import { CreateRoom_Game,NavigateUsersToGameRoom,CancelPartyGame } from './GameSocketFunctions.jsx'
export async function Follow(user,unfolloweduser,friends,setfriends,addfriend,setaddfriend){
try{
const res=await fetch("/mkfr/followfriends",{
    method:"POST",
    headers:{
        "content-type":"application/json"
    },
    body:JSON.stringify({"id":user,
        "followeduser_id":unfolloweduser
    })
})
if(!res.ok){
    return console.log("comething went wrong")
}
const status=res.status
if(status!==200){
    console.log("error")
}
const data=await res.json()
if(data.message==="succesfriends"){
setfriends(!friends)
setaddfriend(addfriend+1)
}

}catch(err){
console.error(err)
}
}
export function changeValueofState(state,setstate,follow,setfollow,
){
    setstate(!state)
    setfollow(follow+1)

}
export async function unfollow(user,unfolloweduser){
    try{
    const res=await fetch("/mkfr/unfollowfriends",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({
            "id":user,
            "followeduser_id":unfolloweduser
        })
    })
    if(!res.ok){
        console.log("something went wrong")
        return ;
    }
    const status=res.status
    if(status!==200){
        throw new Error(`bad request ${status}`)
    }
    return await res.json()
    }catch(err){
        console.error(err)
    }
}
export function changeValueofStateUnfollow(state,setstate,unfollow,setunfollow,isfriend,setisfriend,friends,setfriends){
    setstate(!state)
    setunfollow(unfollow-1)
    if(isfriend){
    setisfriend(!isfriend)
    if(friends<=0){
        setfriends(friends)
    }
    setfriends(friends-1)
    }
}
export function changeValueofStateFriend(state,setstate){
    setstate(state+1)
}   
export async function notifPost(user,followeduser,type){
    try{
    const res=await fetch("/notif/addnotif",{
    method:"POST",
    headers:{
        "content-type":"application/json"
    },
    body:JSON.stringify({
        "user":user,
        "followeduser":followeduser,
        "type":type
    })
    })
    if(!res.ok){
        console.error("something went wrong")
        return new Error("error when posting the data")
    }
    const data=await res.json()
    return data.message
    }catch(err){
        console.error(err)
    }
}

export function RenderData({ data, userdata }) {
    if (!data) return <h1 className="no-notif">No notification Yet</h1>;
  
  
    if (data.length === 0)
      return <h1 className="no-notif">No notification Yet</h1>;
  
    return (
      <>
        {data.map((consummer) => {
          if (consummer.type === "follow") {
            const imgValue = consummer.userimg
              ? `data:${consummer.userimg.contentType};base64,${arrayBufferToBase64(consummer.userimg.file.data)}`
              : "/src/assets/nopp.jpg";
  
            const isfollowhim = userdata.userfriends.following.includes(consummer.userdata.pseudo);
            const isheFollowYou = userdata.userfriends.followers.includes(consummer.userdata.pseudo);
            const isFriends = isfollowhim && consummer.userfriends.followers.includes(userdata.userinfo.pseudo);
            const numbers_followers = consummer.userfriends?.followers?.length || 0;
            const number_following = consummer.userfriends?.following?.length || 0;
            const number_friends = consummer.userfriends?.friends?.length || 0;
  
            return (
              <User
                key={consummer.userdata._id}
                id={consummer.userdata._id}
                name={consummer.userdata.pseudo}
                img={imgValue}
                followers={numbers_followers}
                following={number_following}
                friends={number_friends}
                isFollow={isfollowhim}
                func={(friends, setfriends, friend_n, setfriend_n) =>
                  Follow(userdata.userinfo.pseudo, consummer.userdata.pseudo, friends, setfriends, friend_n, setfriend_n)}
                unfollowfunc={() =>
                  unfollow(userdata.userinfo.pseudo, consummer.userdata.pseudo)}
                isheFollowYou={isheFollowYou}
                isfr={isFriends}
                functionnotif={(type) =>
                  notifPost(userdata.userinfo.pseudo, consummer.userdata.pseudo, type)}
                FollowType={true}
              />
            );
          }else if (consummer.type === "Party") {
            const imgValue = consummer.userimg
              ? `data:${consummer.userimg.contentType};base64,${arrayBufferToBase64(consummer.userimg.file.data)}`
              : "/src/assets/nopp.jpg";
  
            return (
              <li className="user-list" key={consummer.userdata._id}>
                <div className="user-div">
                  <div className="div-img">
                    <img className="user-img" src={imgValue} alt="user pfp" />
                    <span className="username">{consummer.userdata?.pseudo}</span>
                  </div>
                  <div className='span-div'>
                    <span>{consummer.userdata.pseudo} invited you for a ping pong party ! join him here 👉 </span>
                  </div>
                  <div className="btn-div">
                    <Link to={`http://localhost:3400/room/${consummer.url}`}>
                      <button className="follow-btn" style={{ backgroundColor: "rgb(77, 184, 255)", color: "white" }}>
                        Join
                      </button>
                    </Link>
                  </div>
                </div>
              </li>
            );
          }
  
          return null;
        })}
      </>
    );
  }
  


export function Overplay(){
    const serverIO=useRef()
    const serverGameio=useRef()
    const nav=useNavigate()
    const [img,setimg]=useState("/src/assets/nopp.jpg")
    const [img2,setimg2]=useState("/src/assets/nopp.jpg")
    const [socket,setsocket]=useState(false)
    const [showVS,setshowVS]=useState(true)
    const [roomcreated,setroomcreated]=useState(false)
    const [complete,setcomplete]=useState(false)
    const [spanClass,setspanClass]=useState("waiting")
    const [data,setdata]=useState(null)
    const [navigatethem,setnavigatethem]=useState(false)
    const [user,Setuser]=useState(undefined)
    const [userdata,setuserdata]=useState(undefined)
    const [otheruserdata,setotheruserdata]=useState(undefined)
    const [userleave,setuserleave]=useState(false)
    const {id}=useParams()
    const date=Date.now()+1000*10*60
   //we get the user with that function
    const run=async()=>{
        try{
     const data_user=await loginwithtokens()
     Setuser(data_user)
    }catch(err){
        console.error(err)
    }}

useEffect(()=>{
        setsocket(true)
    },[])
    useEffect(()=>{
        run()
    },[])
useEffect(()=>{
    if(!user||!socket){
        return ;
    }
    socketVerify(socket,serverIO,id,user,nav,setdata,setuserleave)
    serverGameio.current=io("http://localhost:6060")
    serverGameio.current.on("connect",()=>{
        console.log("coonected with the game socket on port "+serverGameio.current.id)
    })
},[socket,user])
useEffect(()=>{
    console.log(user)
    if(!data){
        return ;
    }
    const data_of_user=data.find((x)=>x.username===user)
    console.log(data_of_user)
    const otheruser_data=data.find((x)=>x.username!==user)
    console.log(otheruser_data)
    setuserdata(data_of_user)
    setotheruserdata(otheruser_data)
},[data])
useEffect(()=>{
    if(!userdata||!otheruserdata){
        return ;
    }
    if(otheruserdata.username){
        setshowVS(false)
        setspanClass("player-2-name")
    }
    if(userdata.userimg){
        const base64String=arrayBufferToBase64(userdata.userimg.file.data)
        setimg(`data:${userdata.userimg.contentType};base64,${base64String}`)
    }
    if(otheruserdata.userimg){
        const base64String=arrayBufferToBase64(otheruserdata.userimg.file.data)
        setimg2(`data:${otheruserdata.userimg.contentType};base64,${base64String}`)
    }
},[userdata,otheruserdata])

useEffect(()=>{
if(!userleave)return
setimg2("/src/assets/nopp.jpg")
setotheruserdata({...otheruserdata,userimg:null})
},[userleave])
useEffect(()=>{
    if(!complete)return;
    console.log("timeup")
    timeUp(serverIO,id)
},[complete])

useEffect(()=>{
    if(!serverGameio.current)return;
    console.log("current okay running i ahgree")
    serverGameio.current.on("navUsers",(i)=>{
        console.log("vjreuhverugre")
        console.log(i)
    })
NavigateUsersToGameRoom(nav,serverGameio.current)
},[serverGameio.current,socket,user])

const renderer=({hours,minutes,seconds,completed})=>{
    let hour
    let minute
    let second
    if(completed){
     return null
    }
    hours<10?hour=`0${hours}` :hour=hours
    minutes<10?minute=`0${minutes}`:minute=minutes
    seconds<10?second=`0${seconds}`:second=seconds
    return <span className='countdown'>
        {hour}:{minute}:{second}
    </span>
}

return (
    <>
    {data&&img&&(
    <div className='overplay'>
        <div className='Container-player' style={{zIndex:"1010px"}}>
            <div className='player1'>
                <div className='player-container'>
                <div className='img-container-player-1'>
                    <img src={img} alt="player-img"></img>
                </div>
                <div className='playername-div'>
                <span className='player-1-name'>{user}</span>
                </div>
                <div className='buttons-player1'>
                    <button className='cancel' onClick={()=>CancelParty(user,serverIO,id,nav)}>Cancel</button>
            </div>
            </div>
            </div>
            <div className='beetween-players'>
                <div className='timer-container'>
                    {complete&&(
                             <div className='time-up-container'>
                                <div style={{
                                    display:"flex",
                                    justifyContent:"center",
                                    alignItems:"center",
                                    width:"350px"
                                }}>
                             <h1 className='countdown'>
                             time's up 
                             </h1>
                             </div>
                             <div style={{
                                 width:"350px",
                                 display:"flex",
                                 justifyContent:"center",
                                 alignItems:"center"
                             }}>
                             <h4 style={{
                                 color:"white",
                                 fontFamily:"roboto",
                     
                             }}>
                                 party finished , your friend didn't came in time
                             </h4>
                             </div>
                         </div>
                    )}
                    {showVS&&!complete&&(
                    <Countdown date={date} renderer={renderer} onComplete={()=>{
                        setcomplete(true)
                        setspanClass("player-2-name")
                    }}/>
                    )}
                    {!userleave&&!showVS&&(
                        <button className='start-game' id='start-game' onClick={()=>{
                            console.log("button clicked lol")
                        CreateRoom_Game(serverGameio.current,userdata.username,otheruserdata.username,nav)
                        CancelPartyGame(serverIO,id)
                        }}>start game</button>
                    )}
                    {userleave||complete&&(
                        <Link to={"/"} >
                        <button className="start-game"> return home </button>
                        </Link>
                    )}
                </div>
                <div className='loader-container'>
                    {showVS&&!complete&&(
                    <img src='/src/assets/versus.svg' alt='loader-spinner'></img>
                    )}
                </div>
            </div>
            <div className='player2'>
                <div className="player-container2">
                <div className='img-container-player-2'>
                    <img src={img2} alt="player-img"></img>
                </div>
                <div className={spanClass}>
                {!userleave && (
                   otheruserdata && otheruserdata.username ? (
                     <span>{otheruserdata.username}</span>
                 ) : (
             <>
            <span>W</span><span>a</span><span>i</span>
            <span>t</span><span>i</span>
            <span>n</span><span>g</span>
             </>
             )
               )}
                    {userleave&&(
                        <span className='user-leave'>{`${otheruserdata.username} leaved :(`}</span>
                    )}
                </div>
                <div className='buttons-player2'>
                    <button className='cancel'>Cancel</button>
                </div>
            </div>
            </div>
            </div>
        </div>
        )}
    </>
)
}

//sendEmails function
async function getUserEmail(touser){
try{
const res=await fetch("/login/users")
if(!res.ok){
    throw new Error("something went wrong ")
}
const data=Object.values(await res.json()).flat()
const findUsersEmail=data.find((user)=>user.pseudo===touser)
console.log(findUsersEmail)
return{
    toUserEmail:findUsersEmail.email
}
}catch(err){
    console.error(err)
}
}
//sendEmails function
export async function SendMail(toUser,FromUser,url){
    try{
        const {toUserEmail}=await getUserEmail(toUser)
        console.log(toUserEmail)
        const JSON_mail={
            "toUser":toUser,
            "toEmail":toUserEmail,
            "FromUser":FromUser,
            "url":`http://localhost:3400/room/${url}`
        }
    const res=await fetch("/mail/sendEmail",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(JSON_mail)
    })
    if(!res.ok){
      throw new Error("something went wrong")
    }
    console.log(await res.json())

    }catch(err){
        console.error(err)
    }
}

export async function SendNotificationParty(toUser,Fromuser,url,type){
try{
console.log("send notification function lol")
const res=await fetch("/notif/addnotif",{
    method:"POST",
    headers:{
        "content-type":"application/json",
    },
    body:JSON.stringify({
        "Touser":toUser,
        "FromUser":Fromuser,
        "url":url,
        "type":type
    })
})
if(!res.ok)throw new Error("something went wrong")
}catch(err){
    console.error(err)
}
}

export function sleep(ms) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      // Busy wait
    }
  }