import { loose } from "../GameSocketFunctions"
import { useEffect } from "react";
  
export default function Circle(ctx,radius,xi,yi,vx,vy,setCirclePosition,setBallvelocity,isAdmin,workingballcoordinate,setworkingballcoordinate,socket,room,player,setGameLost,isGameLost,setGameWon,isGameWon,circleposition){
    this.ctx=ctx
    this.server=socket
    this.player=player
    this.room=room
    this.radius=radius
    this.isAdmin=isAdmin
    this.circleX=xi
    this.circleY=yi
    this.x=workingballcoordinate.x
    this.y=workingballcoordinate.y
    this.setCirclePosition=setCirclePosition
    this.setBallvelocity=setBallvelocity
    this.setworkingballcoordinate=setworkingballcoordinate
    this.setisGameLost=setGameLost
    this.setisGameWon=setGameWon
    this.isGameLost=isGameLost
    this.isGameWon=isGameWon
    let dx=vx
    let dy=vy
    let x=xi
    let y=yi
    let count=0
    this.CanvasMiddleX=450
    this.drawCircle=()=>{
    if(isGameLost)return;
    this.ctx.beginPath()
    this.ctx.arc(this.circleX,this.circleY,this.radius,0,Math.PI*2)
    this.ctx.fillStyle="white"
    this.ctx.fill()
    this.ctx.lineWidth=2
    this.ctx.strokeStyle="black"
    this.ctx.stroke()
}
    
   //circle mouvement
   this.updateCircleMovement=async()=>{
    if(isGameLost)return;
    let count

    if(y+this.radius>=500&&dy>0){//500 is canvas height
         dy=-Math.abs(dy)
         y = 500 - (this.radius+90);

        this.setBallvelocity({vx:dx,vy:dy})
       }
       if(y-this.radius<=0){
        dy=Math.abs(dy)
        this.setBallvelocity({vx:dx,vy:dy})
       }
       if(circleposition.x+this.radius>=900&&dx<0){ //900 is canvas width
        dx=-dx
        this.setBallvelocity({vx:dx,vy:dy})
        // loose(this.server,this.player,this.room,this.setisGameWon,this.isGameLost)
        
        }
        if(circleposition.x-this.radius<=0&&dx>0){
            dx=-dx
            this.setBallvelocity({vx:dx,vy:dy})
            loose(this.server,this.player,this.room,this.setisGameLost,this.isGameLost)
        }
        x+=dx
        y+=dy
        this.x+=dx
        this.y+=dy
        workingballcoordinate.x+=dx
        workingballcoordinate.y+=dy
        this.setBallvelocity({vx:dx,vy:dy})
        this.setworkingballcoordinate({x:workingballcoordinate.x,y:workingballcoordinate.y})
       if(!this.isAdmin){
       this.setCirclePosition({x:this.CanvasMiddleX+(this.CanvasMiddleX-this.x),y:this.y})
       }else{
       this.setCirclePosition({x:x,y:y})
       }
   }
   
}