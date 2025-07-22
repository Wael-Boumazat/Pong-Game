import {postdata,getCookies,getAcces,uploadFiles,postpseudo} from "./functions.js"
import { refreshToken } from "./middlewarshandling.js"

 let object={
    name:undefined,
    email:undefined,
    pseudo:undefined,
    password:undefined
}
 async function loginwithtokens(){
    try{
    console.log("begin with that tranquilo")
    const res=await fetch("/auth/login",{
        method:"GET",
        credentials:"include"
    })
    if(!res.ok){
        return console.log("no user found")
    }
    const data=await res.json()
    const status= res.status
    console.log(data)
    switch(true){
        case status===200&&data.userdata!==undefined:
        object.pseudo=data.userdata.pseudo
        ppsp.textContent=object.pseudo
        ppsp.style.fontWeight="bold"
        break;
        default:
            return ;
    }
    }catch(err){
        console.error(err)
    }
}
window.addEventListener('DOMContentLoaded',()=>{
setTimeout(()=>{
 async function findImage(user){
    try{
        if(!user){
            return console.log(user);
        }
        console.log(user)
        const res=await fetch("/auth/findimg",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({"username":user})
        })
        if(!res.ok){
            console.log("a problem happened ")
        }
        const contentType=res.headers.get("content-type")
        if(contentType.includes("application/json")){
            console.log("no photo for this user")
            const json_data=await res.json()
            console.log(json_data.data)
            switch (true){
                case json_data.data==="no user":
                    console.log("no user in the photo-database")
                    no_pp_img.src='/src/assets/nopp.jpg'
                    return ;
                    case json_data.data==="no photo":
                        no_pp_img.src='/src/assets/nopp.jpg'
                        console.log("no photo for "+user)
                        return;
            }
            return ;
        }
        const data=await res.blob()
        console.log("the user have an image")
        no_pp_img.src=URL.createObjectURL(data)

    }catch(err){
        console.error(err)
    }
}
async function running(){
    try{
    await loginwithtokens()
    await refreshToken()
    await findImage(object.pseudo)
    }catch(err){
        console.error(err)
    }
}
running()

const create=document.getElementById('create')
const windoww=document.getElementById('window')
const button=document.getElementById('close')
const namme=document.getElementById('name')
const no_pp_img=document.getElementById('imgnopp')
const email=document.getElementById('email')
const password=document.getElementById('password')
const pseudo=document.getElementById('pseudo')
const submit=document.getElementById('submit')
const form=document.getElementById('form')
const notification_div=document.getElementById('message')
const ppsp=document.getElementById('ppsp')
const inputFile=document.getElementById('pp')
const errormsg=document.getElementById('errormsg')
const email_errormsg=document.getElementById('email-errormsg')
const label=document.getElementById('labelpp')
unshow()

function removeFormtxt(){
    namme.value=""
    email.value=""
    pseudo.value=""
    password.value=""
}

function show(){
    windoww.style.display="block"
}
function unshow(){
    windoww.style.display="none "
    removeFormtxt()
}

inputFile.onchange=()=>{
    if(!object.pseudo){
       return notification("you need an account !")
    }
    const imageext=inputFile.files[0].name.split('.').pop()
    const picture=URL.createObjectURL(inputFile.files[0])
    const data=new FormData()
    data.append("image",inputFile.files[0])
    data.append("username",object.pseudo)
    data.append("imageext",imageext)
    console.log(data)
no_pp_img.src=picture
uploadFiles("/file/img",data)
}

create.addEventListener('click',()=>{
show()
})
button.addEventListener('click',()=>{
unshow()
})
namme.addEventListener('blur',(e)=>{
object.name=namme.value
})
email.addEventListener('blur',(e)=>{
    if(email.value.length>0){
        postpseudo(null,"/login/users",notification,email,email_errormsg,"email",email.value,object)
    }
})
pseudo.addEventListener('blur',(e)=>{
    if(pseudo.value.length>0){
    postpseudo(pseudo.value,"/login/users",notification,pseudo,errormsg,"pseudo",null,object)
    }
})
password.addEventListener('blur',()=>{
    object.password=password.value
    console.log(object)
})


 function notification(msg){
notification_div.textContent=msg
notification_div.style.top="20px"

setTimeout(()=>{
    notification_div.style.top="-100px"
},3000)
}
 function afterlogin(){
    removeFormtxt()
    notification(`user logged in ${object.pseudo}`)
    unshow()
    ppsp.textContent=object.pseudo
    ppsp.style.fontWeight="bold"
}

submit.addEventListener('click',async(e)=>{
    e.preventDefault()
    const hasFalsyField = Object.values(object).some(value => !value);
    if(hasFalsyField){
        notification("please complete correctly the form")
        return ;
    }
    try{
        await postdata(object,"/login/users")
        await getCookies(object.pseudo,"/login/log")
        await refreshToken()
        await getAcces()
        await findImage(object.pseudo)
        afterlogin()


    }catch(err){
        console.error(err)
    }
})
},200)
})