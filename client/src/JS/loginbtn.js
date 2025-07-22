
import { getCookies,getAcces } from "./functions.js"
import { refreshToken } from "./middlewarshandling.js"
window.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>{
let object={
email:undefined,
password:undefined
}
let user=undefined
async function loginusers(){
    console.log(object)
    if(!object){
        console.log("no object")
        return object
    }
    console.log("function loginusers running")
    try{
        console.log("nous somme entrain de fetch")
    const res=await fetch("/logs/sign",{
        method:"POST",
        headers:{
            'content-type':"application/json"
        },
        body:JSON.stringify(object)
    })
    if(!res.ok){
        console.error("something went wrong")
        notification("error , please retry")
    }
    const data=await res.json()
    const message=data.message
    switch(true){
        case message==="invalid email":
            notification("wrong email")
            login_email.style.border="2px solid red"
            login_email.style.color="red"
            errormsg_email.innerHTML="wrong email"
            return false
            case message==="password incorrect":
                notification("incorect password")
                login_password.style.border="2px solid red"
                login_password.style.color="red"
                errormsg_password.innerHTML="wrong password"
                return false
                case data.pseudo!==undefined:
                    user=data.pseudo
                    return true;
                    default :
                    notification("an error occured")
                    return false
    }
    }catch(err){
        console.error(err)
    }
}
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

const logintb=document.getElementById('loginbtn')
const login_div=document.getElementById('loginwindow')
const login_btn_close=document.getElementById('close-btn-login')
const login_email=document.getElementById('emaill')
const login_password=document.getElementById('passwordd')
const login_submit=document.getElementById('submitt')
const notification_div=document.getElementById('message')
const no_pp_img=document.getElementById('imgnopp')
const errormsg_password=document.getElementById('login-errormsg-password')
const errormsg_email=document.getElementById('login-errormsg-email')
const label=document.getElementById('label-pp')
const ppsp=document.getElementById('ppsp')
function removeFormtext(){
    login_email.value=""
    login_password.value=""
}
function loginshow(){
login_div.style.display="block"
}
function loginunshow(){
    login_div.style.display="none"
    removeFormtext()
}

logintb.addEventListener('click',(e)=>{
    loginshow()
})
login_btn_close.addEventListener('click',()=>{
    loginunshow()
})
login_email.addEventListener('blur',(e)=>{
object.email=login_email.value
})
login_email.addEventListener('input',(e)=>{
    login_email.style.border="2px solid black"
    login_email.style.color="black"
    errormsg_email.innerHTML=""
})
login_password.addEventListener('input',()=>{
    login_password.style.border="2px solid black"
    login_password.style.color="black"
    errormsg_password.innerHTML=""
})
login_password.addEventListener('blur',()=>{
    object.password=login_password.value
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
    removeFormtext()
    notification(`user logged in ${user}`)
    loginunshow()
    ppsp.textContent=user
    ppsp.style.fontWeight="bold"
}

login_submit.addEventListener('click',async (e)=>{
    e.preventDefault()
    if(!object){
        notification("an error happened")
        loginunshow()
    }
    try{
    const login=await loginusers()
    if(!login)return ;
    await getCookies(user,"/login/log")
    await refreshToken()
    await getAcces()
    await findImage(user)
    await afterlogin()

    }catch(err){
        console.error(err)
     notification(err)
    }
})
},200)
})
