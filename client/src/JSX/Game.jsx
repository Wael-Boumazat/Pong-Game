import React,{ useState,useRef,useEffect,useContext, useMemo } from "react";
import Paddle from "./functions/shapes/Paddle";
import circleShape from "./functions/shapes/CIrcle";
import useMouse from "@react-hook/mouse-position"
import paddleimage from "../assets/ping-pong-paddle.svg"
import {io} from "socket.io-client"
import { run,ConnectToServerGame,SetUsersImages,UpdatePaddlePosition,SetOnlineUserStatus } from "./functions/GameSocketFunctions.jsx";
import { useParams,useNavigate } from "react-router-dom";
import { ConnectToioServer,SetPaddle2Limit,SetPaddle1Limit,CalculateAngleAfterCollision,getUser,uselistenToServerBallPositon, StartGameLoop } from "./functions/hooks/hook.jsx";
import Circle from "./functions/shapes/CIrcle";
import Loader from "./loader.jsx";
import audio from "../assets/audio/GoSound.mp3"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export default function Game(){
    //hooks
    const canvas=useRef(null)
    const server=useRef()
    const AnimationRef=useRef()
    const nav=useNavigate()
    const {id}=useParams()
    const mouse=useMouse(canvas,{
        enterDelay:100,
        leaveDelay:100
    })

    //users data hooks
    const [user,setUser]=useState(null)
    const [isAdmin,setisAdmin]=useState(true)
    const [isServerStarted,setisServerStarted]=useState(false)
    const [Load,setLoad]=useState(true)
    const [audio_go_play,setAudio_go_play]=useState(false)
    const [CountDown,setCountDown]=useState(false)
    const [UserData,setUserData]=useState(null)
    const [WorkingBallCoordinate,setworkingBallCoordinate]=useState({
        x:undefined,
        y:undefined
    })
    const [OtherUserData,setOtherUserData]=useState(null)
    const [Img1,setImg1]=useState("/src/assets/nopp.jpg")
    const [Img2,setImg2]=useState("/src/assets/nopp.jpg")
    const [isGameWon,setisGameWon]=useState(false)
    const [isGameLost,setisGameLost]=useState(true)
    


    const [IsPaddleDragged,setIsPaddleDragged]=useState(false)
    const [startServer,setStartServer]=useState(false)
    const [paddleimg,setpaddleimg]=useState(null)
    const [ball,setball]=useState()
    const [collision,setcollision]=useState(false)
    const PaddleLimit=useRef(false)
    const Paddle2Limit=useRef(false)

    const [circlePosition,setcirclePosition]=useState({
        x:undefined,
        y:undefined
    })
    const [Paddle_1_position,setPaddle_1_position]=useState({
        x:70,
        y:500/2-50
    })
    const [Paddle_2_position,setPaddle_2_position]=useState({
        x:900-100,
        y:500/2-50
    })
    const [BallVelocity,setBallVelocity]=useState({
        vx:undefined,
        vy:undefined
    })

    //functions

    //detect if paddles are clicked
    

    const DragMouse=(x,y,mouseClientX,mouseClientY)=>{
    const rectangleHitbox={
        rectangleX:Math.abs(x)+50, //50 refers to the width
        rectangleY:Math.abs(y)+50 //50 refers to the height
        }
    if(x<=mouseClientX&&mouseClientX<=rectangleHitbox.rectangleX&&y<=mouseClientY&&mouseClientY<=rectangleHitbox.rectangleY){
        setPaddle_1_position({x:mouse.x,y:mouse.y})
        setIsPaddleDragged(true)}
    }
    //move the paddles when dragged

    const onMouseMoveHandler=()=>{
        if(!IsPaddleDragged||!mouse.x||!mouse.y)return ;
        setPaddle_1_position({x:mouse.x,y:mouse.y})
    }

    //useEFfects

    ConnectToioServer(user,server)
    getUser(run,setUser)
    SetOnlineUserStatus(server,user,id,setLoad,setCountDown)
    useEffect(()=>{
    console.log(server.current)
    },[server.current])

    //getuserdata (img)

    useEffect(()=>{
        if(!server.current||!user||Load)return ;
        ConnectToServerGame(server.current,user,id,nav,setUserData,setOtherUserData)
        setStartServer(true)
        },[server.current,user,Load])

    useEffect(()=>{
        const isInvalid = (
            !UserData ||
            !OtherUserData ||
            Object.keys(UserData).length === 0 ||
            Object.keys(OtherUserData).length === 0
          )
    if(isInvalid)return;
    SetUsersImages(setImg1,setImg2,UserData.userimg,OtherUserData.userimg)
    },[UserData,OtherUserData])

    useEffect(()=>{
   if(!server.current||Load)return;
   //post paddle position to backend
   const CalculatedPaddlePosition={    //calculted position cause the paddle of the plyaer should be rendered in the second part of the canvas cause player 2 has to see it like this 
    x:900-(Math.abs(Paddle_1_position.x)+50),
    y:Paddle_1_position.y
   }
   server.current.emit("paddle_update",CalculatedPaddlePosition)
    },[Paddle_1_position,server.current,Load])

    //paddle limits

    useEffect(()=>{
    if(!server.current)return;
    UpdatePaddlePosition(server.current,setPaddle_2_position)
    
    },[server.current,Paddle_1_position])

    useEffect(()=>{
    if(Paddle_2_position.x<600){
        Paddle2Limit.current=true
    }
    },[Paddle_2_position])

    SetPaddle2Limit(Paddle2Limit,setPaddle_2_position)

    useEffect(()=>{
        if(Paddle_1_position.x>300){
            PaddleLimit.current=true
        }
    },[Paddle_1_position])
 
    SetPaddle1Limit(PaddleLimit,setPaddle_1_position,setIsPaddleDragged)

    useEffect(()=>{
        const img=new Image()
        img.src=paddleimage
        img.onload=()=>{
            setpaddleimg(img)
        }
    },[])


    useEffect(()=>{
    if(!paddleimg||Load||isGameWon)return;
    const ctx=canvas.current.getContext('2d')
    ctx.clearRect(0,0,900,500)

    ctx.beginPath()
    ctx.moveTo(0,500)
    ctx.lineTo(0,100)
    ctx.stroke()

    //paddles

    const paddle1=new Paddle(ctx,Paddle_1_position.x,Paddle_1_position.y,paddleimg)
    const paddle2=new Paddle(ctx,Paddle_2_position.x,Paddle_2_position.y,paddleimg)
    paddle1.drawRectangle()
    paddle2.drawRectangle() 
    },[Paddle_1_position,paddleimg,circlePosition,Load,isGameWon])

    useEffect(()=>{
    if(!BallVelocity.vx||!BallVelocity.vy||!circlePosition.x||!circlePosition.y)return ;
    const ctx=canvas.current.getContext('2d')
    const circle =new Circle(ctx,20,circlePosition.x,circlePosition.y,BallVelocity.vx,BallVelocity.vy,setcirclePosition,setBallVelocity,isAdmin,WorkingBallCoordinate,setworkingBallCoordinate,server.current,id,user,setisGameLost,isGameLost,setisGameWon,isGameWon,circlePosition)
    circle.drawCircle()
    setball(circle)
    },[isGameWon,circlePosition,isGameLost])


    useEffect(()=>{
    if(!server.current||!startServer)return ;
    server.current.emit("start_loop",()=>{
        console.log("game loop started on server")
    })
    setisServerStarted(true)
    },[server.current,startServer])


    //detecting collisions 
    useEffect(()=>{
    const distanceX=Math.abs(circlePosition.x-Paddle_1_position.x+50/2)//50 is paddle width
    const distanceY=Math.abs((circlePosition.y)-Paddle_1_position.y+50/2)//50 is paddle height
    const distanceX_2=Math.abs(circlePosition.x-Paddle_2_position.x+50/2)
    const distanceY_2=Math.abs(circlePosition.y-Paddle_2_position.y+50/2)
    if(distanceX<=50&&distanceY<=50||distanceX_2<=50&&distanceY_2<=50){
        console.log("collided")
        setBallVelocity({
            vx:-BallVelocity.vx,
            vy:-BallVelocity.vy
        })
    }
    },[JSON.stringify(circlePosition)])

    useEffect(()=>{
    if(!CountDown)return;
    console.log(audio_go_play)
    let audio_go
    if(audio_go_play){
    audio_go=new Audio(audio)
    console.log(audio_go.volume)
    audio_go.play().catch((e)=>{console.error(e)})
    }
    setTimeout(() => {
        setCountDown(false)
        if(audio_go_play){
        audio_go.pause()
        }
    }, 5000);
    },[CountDown,audio_go_play])


    //listen to server ball position
 
    CalculateAngleAfterCollision(collision,Paddle_1_position,circlePosition,BallVelocity,setBallVelocity) 
    uselistenToServerBallPositon(server.current,setBallVelocity,setcirclePosition,user,id,setisAdmin,setworkingBallCoordinate,Load,CountDown,isServerStarted)
    StartGameLoop(AnimationRef,ball,isGameWon,isGameLost)

    //lost Game useEffect
    useEffect(()=>{
    if(!server.current)return;
    server.current.on("player_won",(cb)=>{
        cb()
        setisGameWon(true)
    })
    },[server.current,circlePosition])
    return (
        <>
        <div className="Canvas-container" onClick={()=>setAudio_go_play(true)}>
        <canvas ref={canvas} width="900px" height="500px" className="canvas"   onMouseDown={()=>{
                DragMouse(Paddle_1_position.x,Paddle_1_position.y,mouse.x,mouse.y)}}
                onMouseMove={()=>onMouseMoveHandler()}
             onMouseUp={()=>setIsPaddleDragged(false)}></canvas>
        {Load&&(
            <div className="overplay" >
            <Loader
            loading={Load}
            />
            </div>
        )}
        {CountDown&&(
        <div className="container_spans">
            <span>3</span>
            <span>2</span>
            <span>1</span>
            <span>GO</span>
        </div>
        )}
        {isGameWon&&(
            <div className="overplay">
                <div className="Game-Won-Container">
                    <div className="Second-Container">
                <div className="Won-Container">
                    <span className="Won-message">YOU WON !!</span>
                </div>
                <div className="Stars-container">
                    <div className="star1">
                <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} fontSize={30} />
                </div>
                <div className="star2">
                <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} fontSize={30} />
                </div>
                <div className="star3">
                <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} fontSize={30} />
                </div>
                </div>
                <div className="winner-photo">
                    <div className="crown-container">
                    <FontAwesomeIcon icon={faCrown} style={{color:'gold'}} fontSize={50}/>
                    </div>
                    <img src={Img1} alt="winner image"></img>
                </div>
                    <div className="Return-home Container">
                        <Link to={"/"} >
                        <button className="return-home-button">
                            <span className="return-home-span">
                                return
                            </span>
                        </button>
                        </Link>
                    </div>
                    </div>
                    </div>
            </div>
        )}
        {isGameLost&&(
           
            <div className="overplay">
                <div className="lost-container">
            <div className="Lost-container">
                <div className="Lost-message">
                    <span className="lost-message-span">{"YOU LOST :("}</span>
                </div>
                <div className="cross-container">
                    <div className="cross1">
                <FontAwesomeIcon icon={faXmark} fontSize={40} style={{color:"red"}}/>
                </div>
                <div className="cross2">
                <FontAwesomeIcon icon={faXmark} fontSize={40} style={{color:"red"}}/>
                </div>
                <div className="cross3">
                <FontAwesomeIcon icon={faXmark} fontSize={40} style={{color:"red"}}/>
                </div>
                </div>
            <div className="winner-photo">
            <div className="crown-container">
                    <FontAwesomeIcon icon={faCrown} style={{color:'gold'}} fontSize={50}/>
                    </div>
                <img src={Img2} alt="winner image" />
            </div>
            <div className="Return-home Container">
                <Link to={"/"}>
                        <button className="return-home-button">
                            <span className="return-home-span">
                                return
                            </span>
                        </button>
                </Link>
            </div>
            </div>
            </div>
            </div>
        )}
        {!Load&&!CountDown&&!isGameWon&&!isGameLost&&(
            <>
             <div className="users-container">
                <div className="img1-container">
                    <img src={Img1} alt="user1-img"></img>
                    <span className="User1name">{user}</span>
                </div>
                <div className="beetween-imgs-game">
                    <img src="/src/assets/versus.svg" alt="versus image"></img>
                </div>
                <div className="img2-container">
                <img src={Img2} alt="user2-img"></img>
                <span className="User2name">{OtherUserData?.username}</span>
                </div>
             </div>
             </>
            )}
        </div>
    </>
    )
}