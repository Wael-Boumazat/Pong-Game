//this file basically sen dthe socket with the data to the users when they call a party

const express=require('express')
const {Schema_room,sch}=require('../../code/Schema')
const app=express()
const mongoose=require('mongoose')
const {v4:uuidv4}=require('uuid')
const io=require("socket.io")(8080,{
    cors:{
        origin:["http://localhost:3400"]
    }
})

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

const model=mongoose.model("Rooms",Schema_room)
const user_img_database=mongoose.model("usersimgs",sch)

io.on("connection",(socket)=>{
    console.log("user logged in the room with id",socket.id)
    socket.on("joinRoom",async (user,challedgedUser)=>{
        try{
        console.log(user,challedgedUser)
        const newRomm=new model({
            room:uuidv4(),
            users:[
                {
                    user:user,
                    isjoined:false,
                    requested:true,
                },
                {
                    user:challedgedUser,
                    isjoined:false,
                    toWho:true
                }
            ]
        })
        console.log("fruhfr",newRomm.room)
        await newRomm.save()
        socket.emit("room",(newRomm.room))
    }catch(err){
        console.error(err)
    }
})
        socket.on("verifytheroom",async (room,user)=>{
            console.log(user)
            const ROom=await model.findOne({room:room,
                "users.user":user
        })
            console.log(ROom)
            if(!ROom){
                socket.emit("canjointheroom",false)
            }
            const data= {
               user:{userimg: await user_img_database.findOne({username:user}),
               username:user
            },
            user2:{
                userimg:null,
                username:null
            }
            }
            socket.emit("canjointheroom",true) //it send a boolean to verify if the user can join the room
                //it make the user join the room and post to the other users his data so they can see his profile and name etc
                socket.on("JoinRoom",async (user,room,cb)=>{
                    try{
                    cb()
                    //join the room
                    console.log("joining the room")
                    socket.join(room)
                    //update the isJoined attribute in the database
                    ROom.users.find((x)=>x.user===user).isjoined=true
                    await ROom.save()
                    console.log("updated room"+ROom)
                    console.log("hey hey",ROom.users.find((x)=>x.toWho).isjoined)
                    if(ROom.users.find((x)=>x.user===user).isjoined&&ROom.users.find((x)=>x.toWho).isjoined){
                        const data2={
                            user:{
                                userimg:await user_img_database.findOne({username:ROom.users.find((x)=>x.requested).user}),
                                username:ROom.users.find((x)=>x.requested).user
                            },
                            user2:{
                                userimg:await user_img_database.findOne({username:ROom.users.find((x)=>x.toWho).user}),
                                username:ROom.users.find((x)=>x.toWho).user
                            }
                        }
                        io.to(room).emit("bothusersjoined",data2,()=>{
                            console.log("both users are connected lets start")
                        })
                        return ;
                    }
 
                    //broadcast to the other that are on this room
                    io.to(room).emit("userJoined",data)
                    }catch(err){
                        console.error(err)
                    }
            })
        })
        socket.on("timeup",async(room)=>{
            try{
            await model.deleteOne({room:room})
            console.log("room deleted")
            }catch(err){
                console.error(err)
            }
        })
        socket.on("cancelRoom",async (user,room,cb)=>{
        try{
        console.log(room)
        await model.deleteOne({room:room})
        socket.leave(room)
        console.log("leaved the room")
        cb(true)
        io.to(room).emit("userdisconnected",user,()=>{
          console.log("user leaved the room")  
        })
        }catch(err){
            console.error(err)
        }
        })
        socket.on("deleteRoom",async(room)=>{
            await model.deleteOne({room:room})
            console.log("deleted room")
        })
})
