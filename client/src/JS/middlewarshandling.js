export async function refreshToken(){
    try{
        const res=await fetch("/auth/refreshtokens",{
            method:"GET",
            credentials:'include'
        })
        if(!res.ok){
            return ;
        }
        const data=await res.json()
        switch(true){
            case data.cookie:
                console.log("user got a cookie")
                break;
                default:
                   return console.log("no user")
        }
        
    }catch(err){
        console.error(err)
    }
}

