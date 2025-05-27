import jwt from 'jsonwebtoken'

export const GenerateJWT = async (NewUser , res) => {
    const token = jwt.sign({NewUser:NewUser._id }, process.env.JWT_Key , {
        expiresIn: '1h'
    })
    res.cookie("jwt",
        token , {
            maxAge: 60 * 60 * 1000,
            httpOnly:true,
            secure:process.env.NODE_ENV !== "development",
            
        }
    )
    return token 
}