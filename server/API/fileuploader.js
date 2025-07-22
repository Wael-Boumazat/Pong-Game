const express=require('express')
const app=express()
const mongoose=require('mongoose')
const cors=require('cors')
const multer=require('multer')
const findImage=require('../middlewars/image')

const whiteList=["http://localhost:3700","http://localhost:3700/img","http://localhost:3000"
    ,"http://localhost:3000/welcome","http://localhost:3700/findimage","http://localhost:3400"
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
const port=3700

app.use(express.json())
app.use(cors(corsorigins))

const storage=multer.memoryStorage()
const upload=multer({storage,limits:{fileSize:16*1024*1024}})


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

const schema=new mongoose.Schema({
    imagename:String,
    imageextension:String,
    file: Buffer,
    username: String,
    contentType: String
})
const model=mongoose.models.usersimg || mongoose.model("usersimg", schema);

app.get('/usersimg',async(req,res)=>{
    try{
      const collection=await model.findOne()
      if(!collection){
        return res.json({"no data found":collection})
      }
      res.json(collection)
    }catch(err){
        console.error(err)
        return res.json({"message":err})
    }
})

app.post('/img',upload.single('image'),async (req,res)=>{
    try{
       const {originalname,buffer,mimetype}=req.file
       const {username,imageext}=req.body
    console.log(originalname,buffer,mimetype)
       const newImage=new model({
        imagename:originalname,
        imageextension:imageext,
        file:buffer,
        username,
        contentType:mimetype
    })
    const document=await model.findOne({username:username})
    if(document){
        await model.updateOne({
            username:username
        },{$set:
            {file:buffer,
                contentType:mimetype,
                imageextension:imageext,
                imagename:originalname
            }})
            console.log("file uploaded and updated ")
            return res.json({"message":"file uploaded and updated"})
    }
    await newImage.save()
    console.log("file uploaded with succes")
    res.json({"message":"file uploaded with succes"})
    }catch(err){
        console.error(err)
        return res.json({"message":err})
    }
})

app.post('/findimage',findImage,(req,res)=>{
    console.log("file send")
    res.json({"image":"img"})
})

app.listen(port,()=>{
    console.log("server listening to"+port)
})
