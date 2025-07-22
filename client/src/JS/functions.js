export async function postdata(data,url){
    try{
        console.log(data,url,"function running")
const res=await fetch(url,{
    method:"POST",
    headers:{
        "content-type":"application/json"
    },
    body:JSON.stringify({"data":data})
})
if(!res.ok){
    console.error("something went wrong")
}
console.log(res)
const jsondata=await res.json()
return jsondata
    }catch(err){
        console.error(err)
    }
}

export async function getCookies(pseudo,url){
    try{
     const res=await fetch(url,{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({"username":pseudo})
     })
     if(!res.ok){
        console.error("an error occured")
     }
     const data=await res.json()
     console.log("success")
     return data
    }catch(err){
        console.error(err)
    }
}

export async function getAcces(){
try{
const res=await fetch("/auth/getaccess",{
    method:"GET",
    credentials:"include"
})
if(!res.ok){
    console.log("an error occured")
}
const data=await res.json()
console.log("logged in")
return data
}catch(err){
    console.error(err)
}
}
export async function uploadFiles(url,data){
try{
    console.log("function posting files running")
const res=await fetch(url,{
    method:"POST",
    body:data
})
if(!res.ok){
    return console.error("something went wrong")
}
return console.log("file uploaded with succes")
}catch(err){
    console.error(err)
}
}

export  async function loginwithtokens(){
    try{
    const res=await fetch("/auth/login",{
        method:"GET",
        credentials:"include"
    })
    if(!res.ok){
        return console.log("no user found")
    }
    const data=await res.json()
    const status= res.status
    if(status===200&&data!==undefined){
        return data.userdata.pseudo
    }
}catch(err){
    throw new Error(err)
}
}
export function arrayBufferToBase64(bufferData) {
    let binary = '';
    const bytes = new Uint8Array(bufferData);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  export async function postpseudo(pseudo,url,notification,input,span,type,email,object){
    try{
        console.log(type)
        let fetchpseudo
        if(type==="pseudo"){
            fetchpseudo=await fetch(url,{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({"username":pseudo})
            })
        }else if(type==="email"){
            fetchpseudo=await fetch(url,{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({"email":email})
            })
        }
    const res=fetchpseudo
    if(!res.ok){
        console.error("something went wrong")
        notification("error , please retry")
        return ; 
    }
    const data=await res.json()
    switch (true){
        case data.message==="valid pseudo":
            console.log("valid pseudo")
            object.pseudo=pseudo
            validpseudo(input,span)
            break;
            case data.message==="invalid repeated pseudo":
                console.log("invalid pseudo")
                object.pseudo=undefined
                notvalidpseudo(input,span,type)
                break;
                case data.message==="valid email":
                    console.log("valid email")
                    object.email=email
                    validpseudo(input,span)
                    break;
                    case data.message==="invalid repeated email":
                        console.log("invalid email")
                        object.email=undefined
                        notvalidpseudo(input,span,type)
                        break;
    }

    }catch(err){
        console.error(err)
    }
  }
  function notvalidpseudo(input,span,type){
    console.log(type)
    input.style.border="2px solid red"
    input.style.color="red"
    if(type==="pseudo"){
        console.log("hfrue")
    span.innerHTML="invalid pseudo"
    }else if(type==="email"){
        span.innerHTML="invalid email"
    }
  }
  function validpseudo(input,span){
    input.style.border="2px solid black"
    input.style.color="black"
    span.innerHTML=""
  }