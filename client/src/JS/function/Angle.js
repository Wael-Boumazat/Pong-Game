export default function CalculateAngleCollision(height,y,CircleY,vx,vy){
    const MAXANGLE=5*(Math.PI/2)
    const relativeIntersectY=y+height/2-CircleY
    const normarliwedRelativeIntersectionY=relativeIntersectY/(height/2)
    const bounceAngle=normarliwedRelativeIntersectionY*MAXANGLE
    const ballSpeed=Math.sqrt(vx**2+vy**2)

    return {
        dx:Math.abs(ballSpeed*Math.cos(bounceAngle)),
        dy:Math.abs(ballSpeed*Math.sin(bounceAngle))
    }

}