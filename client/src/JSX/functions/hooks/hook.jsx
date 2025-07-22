import React,{useEffect} from 'react'
import {io} from 'socket.io-client'
import { GameLoop } from '../GameSocketFunctions.jsx';

export function ConnectToioServer(user,server){
    useEffect(()=>{
        if(!user)return;
    server.current=io("http://localhost:6060")
    server.current.on("connect",()=>{
        console.log("connected on port "+server.current.id)
    })
    },[user])
}

export function SetPaddle2Limit(Paddle2Limit,setPaddle_2_position){
        useEffect(()=>{
        if(!Paddle2Limit.current)return ;
        setPaddle_2_position((prev)=>{
            return {...prev,x:600}
        })
        Paddle2Limit.current=false
        },[Paddle2Limit.current])
}

export function SetPaddle1Limit(PaddleLimit,setPaddle_1_position,setIsPaddleDragged){
        useEffect(()=>{
            //set a limit if x:300
            if(!PaddleLimit.current)return ;
                setPaddle_1_position(prev=>{
                    return {...prev,x:300}
                })
                PaddleLimit.current=false
                setIsPaddleDragged(true)
        },[PaddleLimit.current])
}

export function getUser(run,setuser){
    useEffect(()=>{
            run(setuser)
    },[])
}

export function CalculateAngleAfterCollision(collision,Paddle_1_position,circlePosition,BallVelocity,setBallVelocity){
    useEffect(()=>{
            if(!collision)return ;
        const MAXANGLE=5*(Math.PI/12)
        const relativeIntersectY=(Paddle_1_position.y+(50/2))-circlePosition.y
        const normalizedRelativeIntersectionY=(relativeIntersectY/(50/2/*50 is paddle height*/))
        const bounceAngle=normalizedRelativeIntersectionY*MAXANGLE
        const ballSpeed=Math.sqrt(BallVelocity.vx**2+BallVelocity.vy**2)
        setBallVelocity({
            vx:ballSpeed*Math.cos(bounceAngle),
            vy:ballSpeed*Math.sin(bounceAngle)
        })
    },[collision])
}

function postGameData(server,user,room){
if(!server||!user||!room)return;
server.emit("getGameData",room,user)
}

export function uselistenToServerBallPositon(server,setBallvelocity,setBallposition,user,room,setIsAdmin,setworkingBallCoordinate,load,countdown,isServerStarted){
    useEffect(()=>{
        if(!server||!user||load||!isServerStarted||countdown)return ;
        postGameData(server,user,room)
    server.on("Ball_position",(ballposition,BallVelocity,admin)=>{
        if(!admin)return ;
        const MiddleOfCanvas=450
        setBallvelocity({
            vx:BallVelocity.dx,
            vy:BallVelocity.dy
        })
        setworkingBallCoordinate({
            x:ballposition.X,
            y:ballposition.Y
        })
        if(user!==admin){
            setBallposition({
                x:MiddleOfCanvas+(MiddleOfCanvas-ballposition.X),
                y:ballposition.Y
            })
            setIsAdmin(false)
            return ;
        }
        setBallposition({
            x:ballposition.X,
            y:ballposition.Y
    })
    })
},[server,user,load,countdown,isServerStarted])
}

export function StartGameLoop(ref,ball,isGameWon,isGameLost){
useEffect(()=>{
if(!ball)return ;
ref.current=requestAnimationFrame(()=>GameLoop(ref,ball,isGameWon,isGameLost))
},[ball,isGameWon,isGameLost])
}
