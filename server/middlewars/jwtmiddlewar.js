const jwt=require('jsonwebtoken')
const path=require('path')
require('dotenv').config()

const verify=(req,res,next)=>{
const cookie=req.cookies
if(!cookie?.token)return res.status(401).json({"cookie":cookie,"message":"cookie not found"})
const token=cookie.token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err){
                console.log(err)
                return res.status(401).json({"error":`the error is :${err}`})
            }
            req.user = decoded.username;
        console.log("user can acces to the page")
        res.status(202).json({"user":decoded.username})
        next()
        }
    )
} 


module.exports = verify