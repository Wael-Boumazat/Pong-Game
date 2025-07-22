import { useState,useEffect } from "react"
import { changeValueofState,changeValueofStateUnfollow,changeValueofStateFriend } from "./functions/functions.jsx"

function User({id,name,img,followers,following,friends,func,unfollowfunc,isFollow,isheFollowYou,isfr,functionnotif,FollowType}){
    const [isfollow,setisfollow]=useState(isFollow)
    const [isHovered,setisHovered]=useState(false)
    const [run,setrun]=useState(false)
    const [follow,setfollow]=useState(followers)
    const [followingg,setfollowing]=useState(following)
    const [friendss,setfriends]=useState(friends)
    const [unfollowrun,setunfollowrun]=useState(false)
    const [isheFollowyou,setisheFolloyou]=useState(isheFollowYou)
    const [isFriend,setisFriend]=useState(isfr)
    const [friendsrun,setfriendsrun]=useState(false)
    
    function runeverythingbtn(){
        func(isFriend,setisFriend,friendss,setfriends)
        functionnotif("follow")
        changeValueofState(isfollow,setisfollow,follow,setfollow)
    }
    function rununfollowfunction(){
        unfollowfunc()
        functionnotif("unfollow")
        changeValueofStateUnfollow(isfollow,setisfollow,follow,setfollow,isFriend,setisFriend,friendss,setfriends)
    }
    useEffect(()=>{
        if(friendsrun){
            func()
            changeValueofStateFriend(friendss,setfriends)
        }
    },[friendsrun])
    useEffect(()=>{
        if(run){
            runeverythingbtn()
        }
    },[run])
    useEffect(()=>{
    if(unfollowrun){
        rununfollowfunction()
    }
    },[unfollowrun])
    const btnstyle={
        backgroundColor: isfollow
        ?isFriend
        ?(isHovered?"white" :"#4db8ff")
        :(isHovered ? 'white' : '#4db8ff')
        : (isHovered ? '#4db8ff' : 'white'),
        color:isfollow
        ? (isHovered ? 'black' : 'white')
        : (isHovered ? 'white' : 'black'),
    }
    const paragraphStyle={
       display: FollowType ?"block":"none"
    }
return(
    <>
    <li className="user-list" key={id}>
        <p className="Follow-paragraph" style={paragraphStyle}>{name} follow you</p>
        <div className="user-div" key={id}>
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
                <button className="follow-btn" onClick={()=>{
                      if (isfollow) {
                        if (isFriend) {
                        setunfollowrun(!unfollowrun)
                        }if(isheFollowyou){
                            setfriendsrun(!friendsrun);
                          }
                         else{
                          setunfollowrun(!unfollowrun);
                        }
                      } else {
                        setrun(!run);
                      }
                    }
                } onMouseEnter={()=>{setisHovered(!isHovered)
                    }
                }
                onMouseLeave={()=>{setisHovered(!isHovered)}}
                style={btnstyle}>
                {isfollow&&!isFriend ? "unfollow"
                :isFriend?"friend"
                :(isheFollowyou ?"follow back" : "follow")}
                </button>
            </div>
        </div>
    </li>
    </>
)
}
export default User