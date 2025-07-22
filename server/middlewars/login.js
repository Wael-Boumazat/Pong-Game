const jwt=require('jsonwebtoken')
const path=require('path')
const mongoose=require('mongoose')
require('dotenv').config()

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

const sch=new mongoose.Schema({
    name:String,
    email:String,
    pseudo:String,
    password:String
})
const model=mongoose.model('playerss',sch)

const login=async (req,res,next)=>{
    const cookies=req.cookies
    let username
    if(!cookies?.token){
        console.log("no cookie", cookies)
        return res.status(401).json({"nothing":"nothing"})
    }
        const token=cookies.token
    jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err,decoded)=>{
                if(err){
                    console.log("aunotherized")
                    console.log(err)
                    return res.status(401).json({"error":`the error is :${err}`})
                }
                req.user = decoded.username;
                username=decoded.username
            }
        )
        try{
        const database=await model.findOne({pseudo:username})
        if(!database){
            console.log("no database found")
            return res.status(401).json({"database":"no found"})
        }
        res.status(200).json({
            "userdata":database
        })
    
    }catch(err){
            console.error(err)
        }
    next()
}
module.exports=login