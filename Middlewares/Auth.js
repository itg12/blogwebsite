const jwt = require("jsonwebtoken")
const User = require('../Models/UserSchema')

const AuthenticateUser = async(req,res,next)=>{
    try {
        const token = req.headers.authorization
        if(!token){
            return res.status(401).json({message:"Unautherized request"})
        }

        // Verifying the JWT Token
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({_id:decode.id})
        
        if(!user){
            return res.status(402).json({message:"No user Found"})
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(404).json({message:"Some Error Occured"})
    }
}

module.exports=AuthenticateUser
