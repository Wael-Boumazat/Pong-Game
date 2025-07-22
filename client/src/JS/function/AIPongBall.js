import refreshHTMLPage from "./refreshHTMLpage.js"
import { refreshHTMLPageifAIloose } from "./refreshHTMLpage.js"

let variablePong
export default class Ball{
    constructor(canvasContext,radius,x,y,velocityX,velocityY,pongBall){
        this.ctx=canvasContext
        this.radius=radius
        this.x=x
        this.y=y
        this.vx=velocityX
        this.vy=velocityY
        this.pongBall=pongBall
    }

    DrawBall(){
    this.ctx.beginPath()
    this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
    this.ctx.fillStyle="black"
    this.ctx.fill()
    this.ctx.lineWidth=2
    this.ctx.strokeStyle="black"
    this.ctx.stroke()
    }
    
    updateBallPosition(){
        if(this.y+this.radius>=500&&this.vy>0){ //canvas height is 500
        this.vy=-Math.abs(this.vy)
        }
        if(this.y-this.radius<=0&&this.vy<0){
            this.vy=Math.abs(this.vy)
        }
        if(this.x+this.radius>=900&&this.vx>0){ //canvas width is 900
        this.vx=-Math.abs(this.vx)
        refreshHTMLPageifAIloose()
        }
        if(this.x-this.radius<=0&&this.vx<0){
            this.vx=Math.abs(this.vx)
            refreshHTMLPage()
        }
        this.x+=this.vx
        this.y+=this.vy
    }

    returnCoordinate(){
        return {
            x:this.x,
            y:this.y
        }
    }

    changeVelocity(dx,dy,isNegative){
        if(!isNegative){
        if(dx<3){
            this.vx=dx+3
        }if(dy<3){
            this.vy=dy+3
        }else{
        this.vx=dx
        this.vy=dy
        }
    }else{
    if(dx<-3){
        this.vx=dx-3
    }
    if(dy<-3){
        this.vy=dy-3
    }else{
        this.vx=dx
        this.vy=dy
    }
    }
    }

    ChangeBallXvalue(values){
        this.x=this.x-values
    }

    addVariable(variable){
        variablePong= variable
    }
}