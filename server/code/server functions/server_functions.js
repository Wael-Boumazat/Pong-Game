    const mongoose=require('mongoose')
    class Friends_set{
    constructor(user_friends,user2_friends,user_database,user2_database){
        this.userfriends=user_friends
        this.user_friends_2=user2_friends
        this.user_database=user_database
        this.user2_database=user2_database
        this.set=new Set()
        this.set2=new Set()
        this.emptyArray=[]
        this.emptyArray2=[]
    }
    async set_function(){
        try{
        this.set.clear()
        this.set2.clear()
        this.userfriends.forEach((user)=>{
            this.set.add(user)
        })
        this.user_friends_2.forEach((user)=>{
            this.set2.add(user)
        })
        this.user_database.friends=Array.from(this.set)
        this.user2_database.friends=Array.from(this.set2)
        console.log("la database friend du user 1 est "+this.user_database)
        console.log("la databse friend du user 2 est :"+this.user2_database)
    }catch(err){
        console.error(err)
    }

    }
    addFriend(friend,friend2){
        this.userfriends.push(friend2)
        console.log(this.userfriends)
        this.user_friends_2.push(friend)
        console.log(this.user_friends_2)
        this.set_function()
    }
    removeFriends(id,id2){
        this.userfriends.splice(id2,1)
        console.log(this.userfriends)
        this.user_friends_2.splice(id,1)
        console.log(this.user_friends_2)
        this.set_function()
    }
}
async function verifypseudo(req,res,pseudo,model,email,type){
    try{
        if(type==="pseudo"){
    const document=await model.findOne({pseudo:pseudo})

    if(!document){
    console.log("valid pseudo")
    return res.status(200).json({"message":"valid pseudo"})
    }
    return res.status(200).json({"message":"invalid repeated pseudo"})
}else if(type==="email"){
    console.log("fureygr")
    const document=await model.findOne({email:email})
    console.log(document)
    console.log(document)
    if(!document){
        console.log("valid email")
        return res.status(200).json({"message":"valid email"})
    }
    console.log("invalid email")
    return res.status(200).json({"message":"invalid repeated email"})
}
    }catch(err){
        console.error(err)
    }
}
async function getNotif(req,res,pseudo,model,database,user_img_database,friendsmodel){
try{
let document=await model.findOne({username:pseudo})
if(!document){
    //create a datbase for the user
    const newdocument=new model({
        username:pseudo,
        notif:[]
    })
    await newdocument.save()
    document=newdocument
}
const users=document.notif
if(users.length<=0){
return res.json({"message":"no notification"})
}
const user_consummer_data=await database.findOne({pseudo:pseudo})
const user_consummer_data_img=await user_img_database.findOne({username:pseudo})
const user_consummer_data_friends=await friendsmodel.findOne({user:pseudo})

const userdata={
    userinfo:user_consummer_data,
    userimg:user_consummer_data_img,
    userfriends:user_consummer_data_friends,
}
const data=await Promise.all(
users.map(async (user)=>{
    //return the data
    const User_data_info=await database.findOne({pseudo:user.from})
    const User_data_img=await user_img_database.findOne({username:user.from})
    const friends=await friendsmodel.findOne({user:user.from})
    return {
        type:user.type,
        url:user.PartyId,
        userdata:User_data_info,
        userimg:User_data_img,
        userfriends:friends
    }
})
)
return res.status(200).json({"data":data,
    "userdata":userdata
})
}catch(err){
    console.error(err)
}
}

 async function addPartyNotifToDatabase(toUser,fromUser,url,model,type){
    try{
        console.log(url)
    const document =await model.findOne({"username":toUser})
    if(!document){
        throw new Error("no document found ")
    }
    
    const objectData={
        type:type,
        from:fromUser,
        PartyId:url
    }
    document.notif.push(objectData)
    console.log({"notification party sent with success":document.notif})
    await document.save()
    }catch(err){
        console.error(err)
    }
}

class userImgdata{
    constructor(username1,username2,user1data,user2data){
        this.user1=username1
        this.user2=username2
        this.user1data=user1data
        this.user2data=user2data
        return this.createUsersDataObject()
    }
    
    createUsersDataObject=()=>{
        return [
            {
                username:this.user1,
                userimg:this.user1data
            },
            {
                username:this.user2,
                userimg:this.user2data
            }
        ]
    }

}

async function FindUserData_Game(room,user,model,user_img_model,socket){
    try{
        if(!room||!user)return ;
        console.log(room)
        const document=await model.findOne({room:room,
            "users.user":user
         })
        if(!document){
         socket.emit("palyer_data_Game",false)
         throw new Error("no document found")
        }
        const user1=document.users.find((user)=>user.requested).user   //.user stand for name
        const user2=document.users.find((user)=>user.toWho).user   
        const user1_data= await user_img_model.findOne({username:user1})
        const user2_data=await user_img_model.findOne({username:user2})
        const DataClass=new userImgdata(user1,user2,user1_data,user2_data)
        return DataClass;

        }catch(err){
       console.error(err)
        }
}
module.exports={
    Friends:Friends_set,
    verifypseudo:verifypseudo,
    getNotif:getNotif,
    addParty:addPartyNotifToDatabase,
    findUserdata:FindUserData_Game
}