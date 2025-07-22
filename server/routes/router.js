const express=require('express')
const router=express.Router()
const path=require('path')
const handlerefreshtoken=require('../middlewars/refreshtoken')
const login=require('../middlewars/login')
const verify=require('../middlewars/jwtmiddlewar')
const findImage=require('../middlewars/image')

router.get('/game',verify,(req,res)=>{
})
router.get('/login',login,(req,res)=>{
    console.log("middlwar actived")
})
router.get('/refreshtokens',handlerefreshtoken,(req,res)=>{
    console.log("new token created")
})
router.post('/findimg',findImage,(req,res)=>{
    console.log("image found")
})

module.exports= router