const express=require('express')
const app=express()
const mongoose=require('mongoose')
const port=8000
const {notification_schema,schema,sc,sch}=require('../code/Schema')
const emmiters=require('events')
const {getNotif,addParty}=require('../code/server functions/server_functions')
const cookieParser = require('cookie-parser')
const myemmiter=new emmiters()

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

//middlewars
app.use(express.json())
app.use(cookieParser())

//define the model
const model=mongoose.model("notification",notification_schema)
const database=mongoose.model("friends",schema)
const database_userinfo=mongoose.model("playersses",sc)
const user_img_database=mongoose.model("usersimgs",sch)

//the emmiter function 
myemmiter.on("btn",async(req,res,data,type)=>{
    try{
let document=await model.findOne({username:data.followeduser.toString()})
if(!document){
    //create a document if the user don't have one
const newdocument=new model({
    username:data.followeduser,
    notif:[]
})
document=newdocument
}

if(type==="follow"){
//define the object
const object={
    type:type,
    from:data.user
}

//verify if there is a repeated notif
const repeatedArray=document.notif.filter((user)=>{
    user.from===data.user
})
console.log(repeatedArray)
if(repeatedArray.length>0){
    console.log("repeated notif")
    return null
}

//add it in the notif object
document.notif.push(object)
console.log(document.notif)
await document.save()
return res.json({"message":"success"})
}else if(type==="unfollow"){
    //if there is no document (impossible but we don't know)
    if(!document){
        return null
    }
    //filter the array and delete the notification
    const newfilteredArray=document.notif.filter((user)=>{
        user.from!==data.user
    })
    //replace the data
    document.notif=newfilteredArray
    await document.save()
    console.log("notification removed")
    return res.json({"message":"notification removed"})
}
    }catch(err){
        console.error(err)
        return res.json({"message":"error"})
    }
})

app.post('/addnotif',(req,res)=>{

const data=req.body
const type=req.body.type
console.log(type)
console.log(data)
if(!data){
    return res.json({"message":"error bad data"})
}
if(type==="Party"){
    addParty(data.Touser,data.FromUser,data.url,model,data.type)
    return ;
}
console.log("the function get runn btw lol ")
myemmiter.emit("btn",req,res,data,type)
})
app.post('/getnotif',(req,res)=>{
const data=req.body
const pseudo=data.username
getNotif(req,res,pseudo,model,database_userinfo,user_img_database,database)
})

app.listen(port,()=>{
    console.log("server listening on port "+port)
})
