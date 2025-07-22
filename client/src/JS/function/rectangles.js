export default class Rectangle{
    constructor(canvasContext,width,height,x,y){
        this.ctx=canvasContext
        this.width=width
        this.height=height
        this.x=x
        this.y=y
    }

    Draw=()=>{
    this.ctx.beginPath()
    this.ctx.fillRect(this.x,this.y,this.width,this.height)
    this.ctx.fillStyle="black"
    }
}