const mongoose=require('mongoose')
async function CreateGameRoom(model,user1,user2,uuidv4){
    try{
        const document=new model({
            room:uuidv4(),
            users:[
                {
                user:user1,
                isjoined:true,
                requested:true,
                toWho:false,
                isOnline:false
                },
                {
                    user:user2,
                    isjoined:true,
                    requested:false,
                    toWho:true,
                    isOnline:false
                }
        ]})
        await document.save()
        const admin=document.users.find((x)=>x.user===user1)
        return {
            room:document.room,
            Admin:admin
        }
    }catch(err){
        console.error(err)
    }
}
const Navusersfunction=async(RoomId,model,io)=>{
    try{
        const Array_of_isJoinedFields=[]
        const document=await model.findOne({room:RoomId})
        console.log(document)
        for(const user of document.users){
            Array_of_isJoinedFields.push(user.isjoined)
        }
        if(!Array_of_isJoinedFields.every((field)=>field))return console.log("hufrfrfr");
        io.emit("navUsers",RoomId)

    }catch(err){
        console.error(err)
    }
}

async function PostBallPositionToClient(ball_position,ball_velocity,room,io,user,model){
 try{
if(!io)return ;
let admin
const document=await model.findOne({room:room})
if(document.users.find((x)=>x.user===user).requested){
    admin=user
}else{
    admin=document.users.find((x)=>x.user!==user).user
}
io.to(room).emit("Ball_position",ball_position,ball_velocity,admin) //admin is here to set who will get the ball to strike first (like in chess with white and blacks)
 }catch(err){
    console.error(err)
 }
}

async function UpdateOnlineUserStatus(model,user,room){
    try{
    if(!user||!room)throw new Error(`no room or user`)
    const document=await model.findOne({room:room})
    if(!document)throw new Error("no document found")
    document.users.find((x)=>x.user===user).isOnline=true
    await document.save()
    return document.users
    }catch(err){
        console.error(err)
    }
}

async function DeleteGameRoom(model,room){
    try{
    await model.deleteOne({room:room})
    }catch(err){
        console.error(err)
    }
}

module.exports={
   createRoom:CreateGameRoom,
   navUsers:Navusersfunction,
   PostBall:PostBallPositionToClient,
   UpdateOnlineStatus:UpdateOnlineUserStatus,
   deleteRoom:DeleteGameRoom
}