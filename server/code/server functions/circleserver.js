module.exports= class Circle{
    constructor(radius,x,y,dx,dy){
        this.radius=radius
        this.x=x
        this.y=y
        this.dx=dx
        this.dy=dy
    }
   //circle mouvement
   updateCircleMovement=()=>{
    if(this.y+this.radius>=500){
        this.dy=-this.dy
       }
       if(this.y-this.radius<=0){
        this.dy=-this.dy

       }
       if(this.x+this.radius>=900){
        this.dx=-this.dx
       }
       if(this.x-this.radius<=0){
          this.dx=-this.dx
       }
       if(this.x+this.dx*10>900){
        this.x=900
       }else{
        this.x+=this.dx*10
    }
       if(this.y+this.dy*10>500){
        this.y=500
       }else{
        this.y+=this.dy*10
       }
       console.log(this.x,this.y)
       this.getCircleCoordinates=()=>{
        return {
            X:this.x,
            Y:this.y
        }
       }
       return this.getCircleCoordinates()
   }

   getCircleVelocity=()=>{
    return {
        dx:this.dx,
        dy:this.dy
    }
   }
   getCircleCoordinates=()=>{
    return {
        X:this.x,
        Y:this.y
    }
   }


   
}