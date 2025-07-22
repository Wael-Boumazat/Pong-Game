const jwt=require('jsonwebtoken')
require('dotenv').config()
const mongoose=require('mongoose')
const {Schema}=require('mongoose')

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

const tokensschema= new mongoose.Schema({
    username:String,
    RefreshToken:String,
    AccessToken:String
})

const model=mongoose.model("players tokens",tokensschema)

async function loginusers (req,res,user){
    try{
        if(!user){
            console.log("no user")
            return res.json({"error":"no user provided"})
        }
        const accestoken=jwt.sign(
        { "username": user},
        process.env.ACCESS_TOKEN_SECRET,
         {expiresIn:"900s"}
    )
    const refreshtoken=jwt.sign(
        { 'username':user},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"30d"}
    )
    await model.create({username:user,RefreshToken:refreshtoken,AccessToken:accestoken})
    console.log("user tokens created")
}catch(err){
        throw new Error(err)
    }
}
async function loginuserss(req,res,pseudo){
try{
const document=await model.findOne({username:pseudo})
const refreshtoken=jwt.sign(
    { 'username':pseudo},
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:"30d"}
)
document.RefreshToken=refreshtoken
await document.save()
if(!document){
   loginusers(req,res,pseudo)
}
console.log("user logged")
}catch(err){
    console.error(err)
    throw new Error(err)
}
}

module.exports={loginusers,tokensschema,loginuserss}