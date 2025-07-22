
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

const schema=new mongoose.Schema({
    imagename:String,
    imageextension:String,
    file: Buffer,
    username: String,
    contentType: String
})
const data=mongoose.model("usersimg",schema)

const findImage=async(req,res,next)=>{
    try{
        const username=req.body.username?.toString()
        console.log(username)
        if(!username){
            console.error('no user provided')
            return res.json({"data":"no user","user":username})
        }
    const database=await data.findOne({username:username})
    if(!database){
        console.log("the user don't have a photo")
        return res.json({"data":"no photo"})
    }
    res.setHeader('content-Type',database.contentType).send(database.file)
    console.log("image send")

    }catch(err){
        console.error(err)
        return res.json({"error":err})
    }
}

module.exports=findImage
