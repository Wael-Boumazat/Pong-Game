export default function UpdateRectangleYCoordinate(e,rectCanvas,Rectangle1Props){
    if(e.clientY-rectCanvas.top+Rectangle1Props.height>canvas.height){
        Rectangle1Props.y=canvas.height-Rectangle1Props.height
    }else{
    Rectangle1Props.y=e.clientY-rectCanvas.top
    }
}