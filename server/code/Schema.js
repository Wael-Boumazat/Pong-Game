const mongoose=require('mongoose')

const schema=new mongoose.Schema({
    user:{type:String, unique:true, required:true},
    friends:[String],
    following:[String],
    followers:[String]
})
const sch=new mongoose.Schema({
    imagename:String,
    imageextension:String,
    file: Buffer,
    username: String,
    contentType: String
})


const sc=new mongoose.Schema({
    name:String,
    email:String,
    pseudo:String,
    password:String
})
const notification_schema=new mongoose.Schema({
    username:{type:String, unique:true},
    notif:[{
    type:{type:String},
    from:{type:String},
    PartyId:{type:String }
    }]

})
const Schema_room=new mongoose.Schema({
    room:String,
    users:[
        {
            user:String,
            isjoined:Boolean,
            requested:Boolean,
            toWho:Boolean
        },
    ]
})

const Schema_Game=new mongoose.Schema({
    room:String,
    users:[
        {
        user:String,
        isjoined:Boolean,
        requested:Boolean,
        toWho:Boolean,
        isOnline:Boolean
        },
    ]
})

module.exports={schema,sch,sc,notification_schema,Schema_room,Schema_Game}