export default function AI(Rectangle2Props,circleY,canvas,rectCanvas){
if(circleY-rectCanvas.top+Rectangle2Props.height>canvas.height){
    Rectangle2Props.y=canvas.height-Rectangle2Props.height
}else{
    Rectangle2Props.y=circleY-Rectangle2Props.height/2
}
}