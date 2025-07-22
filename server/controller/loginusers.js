const jwt=require('jsonwebtoken')
require('dotenv').config()
const bcrypt=require('bcrypt')
const express=require('express')
const app=express()
const event=require('events')
const cors=require('cors')
const {loginuserss,tokensschema}=require('./loginaftercreate')
const myemmiter=new event()
const mongoose=require('mongoose')
const dbURI = 'mongodb://localhost:27017/pingpong';
const port=4000

//setting the cors 

const whiteList=[
    "http://localhost:3500",
    "http://localhost:3000",
    "http://localhost:3700",
    "http://localhost:4000",
    "http://localhost:3000/welcome",
    "http://localhost:3400"
]
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


//mongodb schema
const schema=mongoose.Schema({
name:String,
email:String,
pseudo:String,
password:String
})
const model=mongoose.model("playerss",schema)
const database=mongoose.model("players tokens",tokensschema)


//middlewars
app.use(express.json())
app.use(cors(corsorigins))

//define emitter to login users

myemmiter.on("btn",async (req,res,data)=>{
    try{
    //search for the document matching the email
    const document=await model.findOne({email:data.email})
    if(!document){
        console.error("invalid email")
        return res.json({"message":"invalid email"})
    }

    //verify if the password is valid

    const match=await bcrypt.compare(data.password,document.password)
    if(!match){
        console.log("password incorrect")
        return res.json({"message":"password incorrect"})
    }
    loginuserss(req,res,document.pseudo)
    res.json({"pseudo":document.pseudo})
}catch(err){
        console.error(err)
        return res.json({"error":err})
    }
})
//setting the backend server
app.post('/sign',(req,res)=>{
const data=req.body
console.log(data)
if(!data){
    console.error("no data")
    return res.json({"message":"fuck you!!!!!"})
}
myemmiter.emit('btn',req,res,data)

})
app.listen(port,()=>{
    console.log("server listening to port : "+port)
})

