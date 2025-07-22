import User from "./user.jsx";
import { loginwithtokens } from "../JS/functions.js";
import { useEffect,useState,memo} from "react";
import Loader from "./loader.jsx";
import { RenderData } from "./functions/functions.jsx";
export default function Notif({close,setclose}){

const [data,setdata]=useState(null)
const [user,setuser]=useState(undefined)
const [loading,setloading]=useState(true)
const [userdata,setuserData]=useState(null)
const run=async()=>{
    try{
 const data_user=await loginwithtokens()
 setuser(data_user)
}catch(err){
    console.error(err)
}}
const getdata=async()=>{
    try{
    const res=await fetch("/notif/getnotif",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({"username":user})
    })
    if(!res.ok){
        throw new Error(`error:problem in the response`)
    }
    const json_data=await res.json()
    switch(true){
        case json_data.message==="no notification":
            console.log("there is no notification for this user")
            setdata(null)
            return json_data;
        default:
        const JSON=Object.values(json_data.data).flat()
        const JSON_user=json_data.userdata
        setdata(JSON)
        console.log(JSON_user)
        setuserData(JSON_user)

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
    if(user){
    setloading(false)
    getdata()
    }
},[user])
useEffect(()=>{
if(data){
    console.log(Array.isArray(data))
    console.log(data)
    console.log(userdata)
    console.log(data.filter((e)=>typeof e!=="object").type)
}
},[data])
return(
    <div className="user-img-container">
        <Loader
        loading={loading}/>
        <div className="close-btn-container">
        <button className='close-btn-react' onClick={()=>{setclose(!close)}}></button>
        </div>
        <ul className="user-ul">
            {data&&(
                <RenderData
                data={data}
                userdata={userdata}

/>
)}
        </ul>
    </div>
)
}
