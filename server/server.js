const express=require('express')
const verify=require('./middlewars/jwtmiddlewar.js')
const app=express()
const cors=require('cors')
const path=require('path')
const cookieParser=require('cookie-parser')
const PORT=2000

const whiteList=["http://localhost:3400","http://localhost:2000"]
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
app.use(cookieParser())
app.use(express.json())
app.use("/",require('./routes/router.js'))

app.get('/getaccess',verify,(req,res)=>{
    console.log("logged in ")
})

app.listen(PORT,()=>{
    console.log("server listning on port "+PORT)
})