const io=require('socket.io')(6060,{
    cors:{
        origin:["http://localhost:3400"]
    }
})
const mongoose=require('mongoose')
const Circle=require('../../code/server functions/circleserver')
const {v4:uuidv4}=require('uuid')
const {findUserdata}=require('../../code/server functions/server_functions')
const {createRoom,navUsers,PostBall,UpdateOnlineStatus,deleteRoom}=require('../../code/server functions/socket_server_functions')
const {sch,Schema_Game}=require('../../code/Schema')


const dbURI = 'mongodb://localhost:27017/pingpong';
// Connect to MongoDB
mongoose.connect(dbURI, {
    useNewUrlParser: true, // Parse MongoDB connection string
})
.then(() => {
    console.log("Successfully connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

//models
const model=mongoose.model("game_rooms",Schema_Game)
const user_img_model=mongoose.model("usersimgs",sch)

const dx=4
const dy=4

const circle=new Circle(20,450,250,dx,dy)

io.on("connect",async(socket)=>{
    //create the game roomm
    socket.on("Game_room",async (user1,user2)=>{
        try{
    const {room,Admin}=await createRoom(model,user1,user2,uuidv4)
    await navUsers(room,model,io)



}catch(err){
    console.error(err)
}
})

    socket.on("isOnline",async (user,room)=>{
        try{
            console.log(user,room)
            console.log("lol online func activated")
        const isOnlineArray=[]
        const isUsersOnline=await UpdateOnlineStatus(model,user,room)
        for(const element of isUsersOnline){
            isOnlineArray.push(element.isOnline)
        }
        const IseveryUserOnline=isOnlineArray.every(Boolean)
        if(!IseveryUserOnline){
            socket.emit("isBothUsersOnline",false)
            return ;
        }
        socket.emit("isBothUsersOnline",true)
        }catch(err){
            console.error(err)
        }
    })

    //get user data
    socket.on("player_data",async (room,user)=>{
    console.log(user,room)
    RoomId=room
    socket.join(room)
    io.to(room).emit("room_verify",(room))
    if(user&&room){
    const data=await findUserdata(room,user,model,user_img_model,socket)
    socket.emit("player_data_Game",data)
    }
    })

    //update paddle position
    socket.on("paddle_update",(paddle_position)=>{
        socket.broadcast.to(RoomId).emit("updatePaddlePosition",paddle_position)
    })
    socket.on('start_loop',(cb)=>{
        cb()
        const ball_position=circle.getCircleCoordinates()
        const ball_velocity=circle.getCircleVelocity()
        let room
        let user
        socket.once("getGameData",(room,user)=>{
        room=room;
        user=user
        PostBall(ball_position,ball_velocity,room,io,user,model)
        })
    })

    socket.on("Player_lost",(player,room)=>{
        socket.broadcast.to(room).emit("player_won",()=>{
            console.log(player,"lost the game")
        })
        deleteRoom(model,room)
    })
})

