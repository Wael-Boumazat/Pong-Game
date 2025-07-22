import React,{useState,useEffect} from 'react'
import { loginwithtokens } from '../JS/functions.js'
import { arrayBufferToBase64 } from '../JS/functions.js'
import User from './user.jsx'
import Loader from './loader.jsx'
import { Follow,unfollow,notifPost } from './functions/functions.jsx'
import FriendandUserShow from './functions/Friend&User.jsx'
import RenderFriends from './Party.jsx'

export default React.memo(function Friend({close,setclose,Userr,setUser,userimg,setuserimg}){
const [user,Setuser]=useState(null)
const [data,Setdata]=useState(undefined)
const [userdata,setuserdata]=useState(null)
const [loading,setloading]=useState(true)
const [showUsers,setshowUsers]=useState(true)
const [showFriends,setshowFriends]=useState(false)
const run=async()=>{
    try{
 const data_user=await loginwithtokens()
 Setuser(data_user)
 setUser(data_user)

}catch(err){
    console.error(err)
}
}
const getdata=async()=>{
    try{
    const res=await fetch("/mkfr/friends",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({"username":user})
    })
    if(!res.ok){
        console.log("something went wrong")
        throw new Error({"error":"problem in the response"})
    }
    const json_data=await res.json()
    switch(true){
        case json_data.error:
            console.error(json_data.error)
            break;
            case json_data.nouser:
                console.log("no user provided")
                break
                default:
                    const array_data=Object.values(json_data)
                    Setdata(array_data.flat())

    }
    }catch(err){
        console.error(err)
    }finally{
        setloading(false)
    }
}
useEffect(()=>{
run()
},[])
 useEffect(()=>{
    setloading(true)
    getdata()
 },[user])

useEffect(()=>{
if(data&&data.length>0&&user){
const data2=data.find((e)=>e.pseudo===user)
    const data3=Object.values(data2).flat()
    setuserdata(data3)
    let img
    if(data2.userimg){
        const base64String=arrayBufferToBase64(data2.userimg.file.data)
        img=`data:${data2.userimg.contentType};base64,${base64String}`
    }else{
        img="/src/assets/nopp.jpg"
    }
    setuserimg(img)
}
},[data])
return(            
    <>
    <div className='user-img-container'>
        <Loader
        loading={loading}/>
        <div className='close-btn-container'>
        <button className='close-btn-react' onClick={()=>{setclose(!close)}}></button>       
         </div>
         {userdata&&userdata.find(item=>typeof item ==="object" &&item?.friends)?.friends.length>0 &&(
            <FriendandUserShow
            show={showUsers}
            setshow={setshowUsers}
            setshowfr={setshowFriends}
            showfr={showFriends}
            />
         )}
        <ul className='user-ul'>
            {showFriends&&userdata&&userdata.find(item=>typeof item ==="object" &&item?.friends).friends.map((element)=>{
                const consumerdata=data.find((e)=>e.pseudo===element)
                let imgValue
                let friends=0
                let followers=0
                let following=0
                if(!consumerdata.userimg){
                    imgValue="/src/assets/nopp.jpg"
                }else{
                    const base64String=arrayBufferToBase64(consumerdata.userimg.file.data)
                    imgValue=`data:${consumerdata.userimg.contentType};base64,${base64String}`
                }
                if(consumerdata.userfriends){
                    friends=consumerdata.userfriends.friends.length
                    followers=consumerdata.userfriends.followers.length
                    following=consumerdata.userfriends.following.length
                }
                return(
                    <RenderFriends
                    key={consumerdata._id}
                    userr={user}
                    followingg={following}
                    follow={followers}
                    friendss={friends}
                    id={consumerdata._id}
                    name={element}
                    img={imgValue}
                    theUser={user}
                    setShow={setclose}
                    />
                )
            })
            }
        {
            showUsers&&data&&!data.userfriends&&data.filter((person)=>person.pseudo!==user).map((consummer)=>{
                const userdataa=data.find((element)=>element.pseudo===user)
                let imgvalue
                let isfollowhim=false
                let isheFollowYou=false
                let isFriends=false
                let numbers_followers
                let number_following
                let number_friends

                if(!consummer.userimg){
                    imgvalue="/src/assets/nopp.jpg"
                }else{
                const base64String=arrayBufferToBase64(consummer.userimg.file.data)
                imgvalue=`data:${consummer.userimg.contentType};base64,${base64String}`
                }
                if(userdataa.userfriends.following.includes(consummer.pseudo)){
                    isfollowhim=true
                }
                if(userdataa.userfriends.followers.includes(consummer.pseudo))isheFollowYou=true
                if(userdataa.userfriends.followers.includes(consummer.pseudo)&&consummer.userfriends.followers.includes(userdataa.pseudo))isFriends=true
                if(consummer.userfriends){
                    numbers_followers=consummer.userfriends.followers.length
                    number_following=consummer.userfriends.following.length
                    number_friends=consummer.userfriends.friends.length
                }else{
                    numbers_followers=0
                    number_following=0
                    number_friends=0
                }
                
                return(
                    <User
                    key={consummer._id}
                    id={consummer._id}
                    name={consummer.pseudo}
                    img={imgvalue}
                    followers={numbers_followers}
                    following={number_following}
                    friends={number_friends}
                    isFollow={isfollowhim}
                    func={(friends,setfriends,friend_n,setfriend_n)=>Follow(userdataa.pseudo,consummer.pseudo,friends,setfriends,friend_n,setfriend_n)}
                    setfollow={numbers_followers}
                    setfollowing={number_following}
                    setfriends={number_friends}
                    unfollowfunc={()=>unfollow(userdataa.pseudo,consummer.pseudo)}
                    isheFollowYou={isheFollowYou}
                    isfr={isFriends}
                    functionnotif={(type)=>notifPost(userdataa.pseudo,consummer.pseudo,type)}
                    FollowType={false}
                    />
                    
                )
            })
        }
        </ul>
            </div></>
)
})