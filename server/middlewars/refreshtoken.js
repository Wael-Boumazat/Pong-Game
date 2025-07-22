
const jwt=require('jsonwebtoken')
require('dotenv').config();
const mongoose=require('mongoose')
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

const database=mongoose.model("players tokens",tokensschema)
 const handlerefreshtoken =async(req,res)=>{
    try{
      console.log("ok ok ")
    const cookies=req.cookies
    console.log("hurff",cookies)
    if(!cookies?.jwt)return res.status(401).json({"message":"bad cookie"})
        console.log("cookie",cookies.jwt)
    const refreskToken=cookies.jwt
    jwt.verify(
refreskToken,
process.env.REFRESH_TOKEN_SECRET,
async (err,decoded)=>{
  try{
    if(err){
      console.error(err)
      return ;
    }
    console.log("frgt",decoded)
  const foundCookie=await database.findOne({username:decoded.username})
  console.log(foundCookie)
    if(!foundCookie)return res.json({"message":"no cookie found"})
    if(err|| foundCookie.username !==decoded.username)return res.status(401).json({"message":err,
      "username":foundCookie.username,
      "decoded":decoded.username
    })
        const accesCookie=jwt.sign(
    {"username":decoded.username},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:"900s"}
)
console.log(req.cookies)
res.clearCookie("token",{ httpOnly: true, sameSite:"Lax",secure:false })
console.log(req.cookies)
res.cookie('token',accesCookie,{
  httpOnly: true, // Prevents JavaScript from accessing the cookie (security against XSS attacks)
  sameSite: "Strict", // Prevents CSRF attacks by restricting cookie sending to same-site requests
  secure:false,
  maxAge: 15*60*1000 
  })
  console.log("cookie sent")
return res.json({"cookie":accesCookie})
}catch(err){
  console.error(err)
  return res.status(404).json(err)
}}
)
  }catch(err){
        console.error(err)
    }
}

module.exports=handlerefreshtoken