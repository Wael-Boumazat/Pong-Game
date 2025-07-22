import Rectangle from "../function/rectangles.js";
import UpdateRectangleYCoordinate from "../function/UpdateRectangleYCoordinate.js";
import Ball from "../function/AIPongBall.js";
import CalculateAngleCollision from "../function/Angle.js";
import AI from "./AI.js";


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const playerscore=document.getElementById('player1score')
const AIscore=document.getElementById('AIscore')

playerscore.innerHTML=localStorage.getItem("playerScore")||0
AIscore.innerHTML=localStorage.getItem('AIscore')||0

let dragging=false
let vx=5
let vy=5
const radius=15
const rectCanvas=canvas.getBoundingClientRect()
let PongBall=new Ball(ctx,radius,450,250,vx,vy)
PongBall.addVariable(PongBall)
const Rectangle1Props={
    height:170,
    width:20,
    x:20,
    y:500/2-170/2 /*find the middle in the y axis 500 is canvas height and 170 is rectangle height*/ 
}

const Rectangle2Props={
    height:170,
    width:20,
    x:900-40, //900 for canvas width
    y:500/2-170/2
}

const Paddle1=new Rectangle(
ctx,
Rectangle1Props.width,
Rectangle1Props.height,
Rectangle1Props.x,
Rectangle1Props.y
)
const Paddle2=new Rectangle(
    ctx,
    Rectangle2Props.width,
    Rectangle2Props.height,
    Rectangle2Props.x,
    Rectangle2Props.y
)
Paddle1.Draw()
Paddle2.Draw()

canvas.addEventListener('mousedown',(e)=>{
    dragging=true
    UpdateRectangleYCoordinate(e,rectCanvas,Rectangle1Props)
})

canvas.addEventListener('mousemove',(e)=>{
    if(!dragging)return;
    UpdateRectangleYCoordinate(e,rectCanvas,Rectangle1Props)
})

canvas.addEventListener('mouseup',()=>{
    dragging=false
})

function clearCanvas(){
    ctx.clearRect(0,0,900,500)
}

function refreshCanvas(){
    const {width,height,x,y}=Rectangle1Props
    const getCircleCoordinates=PongBall.returnCoordinate()
    clearCanvas()
    ctx.beginPath()
    const paddle=new Rectangle(ctx,width,height,x,y).Draw()
    const paddle2=new Rectangle(ctx,Rectangle2Props.width,Rectangle2Props.height,Rectangle2Props.x,Rectangle2Props.y).Draw()
    PongBall.DrawBall()
    PongBall.updateBallPosition()
    detectCollisions()
    if(getCircleCoordinates.x>450){
    AI(Rectangle2Props,getCircleCoordinates.y,canvas,rectCanvas)
    }
}

function detectCollisions(){
    const RectangleHitBox=Rectangle1Props.y+Rectangle1Props.height
    const RectangleHitBox2=Rectangle2Props.y+Rectangle2Props.height
    const {x,y}=PongBall.returnCoordinate()
    if(x<=Rectangle1Props.x&&y-radius>=Rectangle1Props.y&&y-radius<=RectangleHitBox){
        const {dx,dy}=CalculateAngleCollision(Rectangle1Props.height,Rectangle1Props.y,y,vx,vy)
        PongBall.changeVelocity(dx,dy,false)
    }
    if(x>=Rectangle2Props.x&&y-radius>=Rectangle2Props.y&&y-radius<=RectangleHitBox2){
        const {dx,dy}=CalculateAngleCollision(Rectangle2Props.height,Rectangle2Props.y,y,vx,vy)
        PongBall.changeVelocity(-dx,-dy,true)
    }
}

function GameLoop(){
    refreshCanvas()
    requestAnimationFrame(GameLoop)
}
GameLoop()


