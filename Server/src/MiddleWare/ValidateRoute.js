import UserModel from "../../Models/User.model.js"
import jwt from 'jsonwebtoken'


export const ValidateRoute = async (req , res , next) => {
    const Token = req.cookies.jwt
    try {
        if(!Token){
            return await res.status(400).json({success:false , message: "Your request doesn't has a token"})
        }

        const Verification =  jwt.verify(Token , process.env.JWT_Key)
        if(!Verification){
            return await res.status(400).json({success:false , message: "Unauthorized access"})
        }
        const user = await UserModel.findOne({_id:Verification.NewUser})

        if(!user){
            return await res.status(400).json({success:false , message: "Unauthorized access"})
        }

        req.user = user
        next()
    } catch (error) 
    {
        console.log(error)
        return await res.status(500).json({success:false , message:"JWT Validation error"})
    }
    
}