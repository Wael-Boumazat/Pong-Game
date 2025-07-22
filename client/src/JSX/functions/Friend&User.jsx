import { useEffect,useState,useRef } from "react";

export default function FriendandUserShow({show,setshow,showfr,setshowfr}){
const [isHovered,setisHovered]=useState(false)
const [ishovered2,setisHovered2]=useState(false)
const [iscliked,setisclicked]=useState(true)
const [iscliked2,setisclicked2]=useState(false)

const style_btn1={
color: iscliked
?"white"
:(isHovered?"white":"gray"),
textShadow:iscliked
?"1px 1px 2px pink"
:"none",
}
const linestyle1={
backgroundColor:iscliked
?"#1DA1F2"
:"transparent"
}
const style_btn2={
    color: iscliked2
?"white"
:(ishovered2?"white":"gray"),
textShadow:iscliked2
?"1px 1px 2px pink"
:"none",
}
const linestyle2={
    backgroundColor:iscliked2
?"#1DA1F2"
:"transparent"
}
return(
    <>
    <div className="option_container">
        <div className="InputContainer">
            <div className="Option-div-container">
            <div className="option-div">
                <button className="option-mkfr-button" onMouseEnter={()=>setisHovered(true)} onMouseLeave={()=>setisHovered(false)} onClick={()=>{
                    setisclicked2(!iscliked2)
                    setisclicked(!iscliked)
                    setshowfr(false)
                    setshow(true)
                }}>
                    <span className="mkfr-span" style={style_btn1}>make friends !</span>
                <div className="line" style={linestyle1}></div>
                </button>
            </div>
            </div>
            <div className="Option-div-container">
            <div className="option-div">
                <button className="option-friends-button" onMouseEnter={()=>setisHovered2(true)} onMouseLeave={()=>setisHovered2(false)} onClick={()=>{
                    setisclicked2(!iscliked2) 
                    setisclicked(!iscliked)
                    setshowfr(true)
                    setshow(false)
                }}>
                    <span className="friends-span" style={style_btn2}>friends</span>
                    <div className="line" style={linestyle2}></div>
                </button>
                </div>
                
            </div>
        </div>
    </div>
    </>
)
}