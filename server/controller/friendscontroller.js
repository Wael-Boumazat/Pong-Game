const express=require('express')
const app=express()
const mongoose=require('mongoose')
const cors=require('cors')
const event=require('events')
const cookkieparser=require('cookie-parser')
const { use } = require('react')
const {schema,sch,sc}=require('../code/Schema')
const followFunctions=require('../code/friendfollow')
const port=4100

const myemmiter=new event()

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

const whiteList=["http://localhost:3000","http://localhost:3000/welcome","http://localhost:3500","http://localhost:3500/log","http://localhost:3400"]
const corsorigins={
    origin:(origin,callback)=>{
        if(whiteList.indexOf(origin)!==-1||!origin){
            callback(null,true)
        }else{
             const err=new Error('cors dont allow it')
             callback(err)
             
        }
        
    },
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cors(corsorigins))
app.use(express.json())
app.use(cookkieparser())


const database=mongoose.model("playerss",sc)
const model=mongoose.model("friends",schema)
const user_img_database=mongoose.model("usersimgs",sch)

myemmiter.on('btn',async(req,res,user)=>{
try{
    let document=await model.findOne({user:user})
    if(!document){
        console.log("user don't have a database")
        const documento=new model({
            user:user,
        friends:[],
    following:[],
followers:[]})
        await documento.save()
        console.log("database create for "+user)
        document=documento
    }
    const users=await database.find()

    const data= await Promise.all(
        users.map(async (user)=>{
        try{
    return{
        ...user.toObject(),
        userimg: await user_img_database.findOne({username:user.pseudo}),
        userfriends:await model.findOne({user:user.pseudo})
    }
    }catch(err){
        console.error(err)
        return null
    }}))
    console.log("success")
    return res.json({"data":data})
}catch(err){
    console.error(err)
    res.json({"error":err})
}
})

app.post('/friends',(req,res)=>{
const user=req.body.username?.toString()
console.log(user)
if(!user){
    res.json({"nouser":user})
    return console.log("no user provided")
}
myemmiter.emit('btn',req,res,user)
})
app.post('/followfriends',(req,res)=>{
    const user_id=req.body.id
    const followeduser_id=req.body.followeduser_id
    followFunctions.follow(req,res,user_id,followeduser_id,model,user_img_database,database)
})

app.post('/unfollowfriends',(req,res)=>{
    const user_id=req.body.id
    const followeduser_id=req.body.followeduser_id
    followFunctions.unfollow(req,res,user_id,followeduser_id,model,user_img_database,database)
})

app.listen(port,()=>{
    console.log("server listening to port "+port)
})

