import { useState,useEffect } from "react"
import Notif from "./notif"
export default function Notification({close,setclose}){
    return(
        <Notif
        close={close}
        setclose={setclose}/>
    )
}