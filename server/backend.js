const express=require('express')
const app=express()
const cors=require('cors')
const PORT=3500
const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
const emmiters=require('events')
const {verifypseudo}=require('./code/server functions/server_functions')
const {tokensschema,loginusers}=require('./controller/loginaftercreate')
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

const database=mongoose.model("players tokens",tokensschema)

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
const schema=mongoose.Schema({
name:String,
email:String,
pseudo:String,
password:String
})
const model=mongoose.model("playerss",schema)
app.get('/users',async(req,res)=>{
    try{
     const data= await model.find()
     if(!data){
        console.log("no data ")
        res.status(202).json({"data":"nothing"})
     }
     console.log("there is data")
     res.status(202).json(data)
    }catch(err){
        console.error(err)
        res.status(404).json({"error":err})
    }
})
app.use(cors(corsorigins))
app.use(express.json())
myemmiter.on('button',async (req,res,data)=>{
    try{
        console.log("emitter on")
    if(!data){
        console.error('bad data')
    }
    const hashedpassword=await bcrypt.hash(data.password,10)
    data.password=hashedpassword 
    const d= await model.insertMany(data)
    res.status(202).json({"succes":"the data were stored in the database"})
    console.log("data stored in the database")
    }catch(err){
        console.error(err)
    }
    console.log(data.pseudo)
    loginusers(req,res,data.pseudo)
})

app.post('/users',(req,res)=>{
const data=req.body
if(data.username){
    verifypseudo(req,res,data.username.toString(),model,null,"pseudo")
    return ;
}else if(data.email){
    verifypseudo(req,res,null,model,data.email.toString(),"email")
    return ;
}else if(data.data){
myemmiter.emit("button",req,res,data.data)
}
})
app.post('/log',async(req,res)=>{
    const username=req.body.username?.toString()
    console.log("le user est :",username)
    if(!username)return res.json({"no user name found":username})
        const base= await database.findOne({username:username})
    if(!base)return res.json({"incorrect username":username})
        const refreshtoken=await base.RefreshToken
        const accestoken=await base.AccessToken
        res.clearCookie("jwt", refreshtoken, {
            httpOnly: true, // Prevents JavaScript from accessing the cookie (security against XSS attacks)
            sameSite: "Lax", // Prevents CSRF attacks by restricting cookie sending to same-site requests
            secure:false,
            maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 1 day (same as refresh token lifespan)
        })
        res.clearCookie("token",accestoken,{
            httpOnly: true, // Prevents JavaScript from accessing the cookie (security against XSS attacks)
            sameSite: "Lax", // Prevents CSRF attacks by restricting cookie sending to same-site requests
            secure:false,
            maxAge: 15*60*1000 // Cookie expires in 1 day (same as refresh token lifespan)
          })
        res.cookie("jwt", refreshtoken, {
            httpOnly: true, // Prevents JavaScript from accessing the cookie (security against XSS attacks)
            sameSite: "Lax", // Prevents CSRF attacks by restricting cookie sending to same-site requests
            secure:false,
            maxAge: 1000 * 60 * 60 * 24 * 7 // Cookie expires in 1 day (same as refresh token lifespan)
        });
        res.cookie("token",accestoken,{
            httpOnly: true, // Prevents JavaScript from accessing the cookie (security against XSS attacks)
            sameSite: "Lax", // Prevents CSRF attacks by restricting cookie sending to same-site requests
            secure:false,
            maxAge: 15*60*1000 // Cookie expires in 1 day (same as refresh token lifespan)
          })
        res.json({"refresh":refreshtoken,"acces":accestoken,"username":username})
        console.log(" we posted the tokens to the frontend")
})
app.listen(PORT,()=>{
    console.log("server listening to PORT",PORT)
})