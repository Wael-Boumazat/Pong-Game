const mongoose=require('mongoose')
const {schema,sch,sc}=require('./Schema')
const {Friends}=require('../code/server functions/server_functions')
async function set_follow(req,res,user_id,followeduser_id,model,user_img_database,database){
    try{
        //finding the document of the user who followed
    const user_database=await model.findOne({user:user_id})
    if(!user_database)throw new Error(`"on user":${user_id}`)
        if(user_database.following.includes(followeduser_id)){
            return ;
        }

        //updating it following field
    user_database.following.push(followeduser_id)

    //now we do it for the other user who got followed
    let followeduser_database=await model.findOne({user:followeduser_id})
    if(!followeduser_database){
        //we create his database if he don't own one (possible)
        const newmodel=new model({
        user:followeduser_id,
        friends:[],
        following:[],
        followers:[]
        })
        followeduser_database=newmodel
    }
    //if he is already followed by him then we stop (i was too lazy to do a set)
    if(followeduser_database.followers.includes(user_id)){
     return;
    }

    //we update it field 
    console.log("jveygryefyirfgyerygfery")
    followeduser_database.followers.push(user_id)
    console.log(user_database,followeduser_database)

    //we verify if they are both following each other and if it is true we set them to friend using a class

    const AreTheyFriends=user_database.followers.includes(followeduser_id)&&followeduser_database.followers.includes(user_id)
    console.log(AreTheyFriends)
    if(AreTheyFriends){
        console.log("uvfhvegve")
        //create the friends
        const Friend=new Friends(user_database.friends,followeduser_database.friends,user_database,followeduser_database).addFriend(user_id,followeduser_id)
        console.log("you are friends !!:)")
        res.status(200).json({"message":"succesfriends"})
    }else{
        console.log("c la maatatatatat")
    }
    await user_database.save()
    await followeduser_database.save()
    }catch(err){
        console.error(err)
    }}

    //function for Unfollow a user

async function unFollow(req,res,user_id,unfolloweduser_id,model,user_img_database,database){
try{
    //we get the first user who unfollowed
const user_database=await model.findOne({user:user_id})

//and now the other user who got unfollowed

const unfolloweduser_database=await model.findOne({user:unfolloweduser_id})
if(!user_database)throw new Error(`no user found for ${user_id}`)


    //finding the user index
const deleted_user=user_database.following.indexOf(unfolloweduser_id)
console.log(deleted_user)
if(deleted_user<= -1){
return res.status(400).json("no user found")
}
const the_guy_who_unfollowed=unfolloweduser_database.followers.indexOf(user_id)
if(the_guy_who_unfollowed<=-1){
    return res.status(400).json("no user found")
}

//verifying if they were friends so we delete them in the friend field

const AreTheyFriends=user_database.followers.includes(unfolloweduser_id)&&unfolloweduser_database.followers.includes(user_id)
if(AreTheyFriends){
const friends=new Friends(user_database.friends,unfolloweduser_database.friends,user_database,unfolloweduser_database).removeFriends(deleted_user,the_guy_who_unfollowed)
console.log("fnrehfrehvre"+friends)
}else{
    console.log("failed , they weren't friends")
}
console.log("la database friend du user est :"+user_database.friends)
console.log("la databse 2 du user est :"+ unfolloweduser_database.friends)

//update the database with .save()
user_database.following.splice(deleted_user,1)
console.log("la databse du 1er user apres l'avoir updated ressemble a "+user_database)
console.log(`the database of following of ${user_id} is ${user_database.following.splice(deleted_user,1)}`)
await user_database.save()

unfolloweduser_database.followers.splice(the_guy_who_unfollowed,1)
console.log("la database du 2eme user ressemble a cela :"+unfolloweduser_database)
console.log("the database of the "+unfolloweduser_id+"is "+user_database.followers.splice(the_guy_who_unfollowed,1))
await unfolloweduser_database.save()
return res.status(200).json({"message":"the users don't follow each other anymore",
    "data":await model.find()})

}catch(err){
    console.error(err)
}
}

module.exports={
    follow:set_follow,
    unfollow:unFollow
}