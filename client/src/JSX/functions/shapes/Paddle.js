export default class Paddle{
    constructor(ctx,x,y,img){
        this.ctx=ctx
        this.x=x
        this.y=y
        this.img=img
    }
    drawRectangle=()=>{
    this.ctx.beginPath()
    void this.ctx.drawImage(this.img, this.x,this.y,50,50)


    }
}