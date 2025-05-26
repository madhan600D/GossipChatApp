import UserModel from '../../Models/User.model.js'
import bcrypt from 'bcryptjs'
import { GenerateJWT } from '../Lib/utils.js';
import cloudinary from '../Lib/Cloudinary.js';
import fs from "fs";
import path from 'path';
import {fileURLToPath}  from 'url'
//Variables
const __filename = fileURLToPath(import.meta.url);
const CurrentDirectory = path.dirname(__filename);
const ThemeFilePath = path.join(CurrentDirectory,'../', 'ThemeStateFile' , 'LastUsedTheme.txt');



export const Signup = async (req , res) => {
    //Handle the signup API 
    const {UserName , Password } = req.body ;
    if (!Password || !UserName){

        return await res.status(400).json({success : false , message:"Enter all the required fields"}); 
        
    }
    // If userName is already present
    if(await UserModel.findOne({UserName:UserName})){
        return await res.status(400).json({success : false , message:`User name (${UserName}) has been taken`}); 
    }
    //Password Validation
    if(Password.length < 6){
    
        return await res.status(400).json({success : false , message:"Enter a strong password with more than 6 characters"}); 
    }
    //Salt and Hash the password
    const salt = await bcrypt.genSalt(10) ;
    const HashedPassword = await bcrypt.hash(Password , salt);
    //save in Database
    try {
        const NewUser = new UserModel({
            UserName,
            Password:HashedPassword,
        })
        if(NewUser){
            //consider user as logged in and generate a JWT
            GenerateJWT(NewUser ,res) ;

            NewUser.save()
                .then(() => {
    
                    console.log("User saved successfully.");
                })
                .catch((err) => {
                    // Error handling
                    console.log("Error at controler")
                    return res.status(400).json({success : false , message:err}); 
                    console.error("Error saving user:", err);
                });
                const ResponseData = {_id:NewUser._id, 
                UserName:NewUser.UserName,
                Password:HashedPassword,}
                return await res.status(201).json({success : true , message:"User has been created" , data:ResponseData}); 
        }
        else{
            return await res.status(500).json({success : false , message:"Failed to save the user in Database"});   
        }
    } catch (error) {
        return await res.status(500).json({success : false , message:"Failed to save the user in Database"}); 
    }

}

export const Login = async (req , res) => {
    const {UserName , Password} = req.body
    
    try {
        //Check user is in DB
        const user = await UserModel.findOne({UserName})
        if(user){
            
            //Hash and salt the password again to verify credentials
            const isPasswordCorrect = await bcrypt.compare(Password , user.Password);
            
            //Verify in DB
            if(isPasswordCorrect){
                
                //Generate a JWT and sent in Res object
                try {
                    GenerateJWT(user._id , res) ;
                    return res.status(200).json({success:true , message:"Logged in Successfully...!"})  
                } catch (error) {
                    return res.status(500).json({success:false , message:"Server side Error...!"})  
                }   
            }
            else{
            return res.status(400).json({success:false , message:"Invalid Credentials"})
        }
        
        }
        else{
            return res.status(400).json({success:false , message:"Invalid Credentials"})}
    } catch (err) {
        return res.status(500).json({success:false , message:"Server side error at login process"})
    }
}

export const Logout = async (req , res) => {
    try {
        res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
        });
        return res.status(200).json({success:true , message:"User logged out successfully...!"})
    } catch (error) {
        
    }
    
}
export const UpdateProfile = async (req , res) => {
    try {
        const {base64}  = req.body
        //This usere value is setup in ValidateRoute Middleware
        const user = req.user

        if(!base64){ 
            return res.status(400).json({success:false , message:"Please provide a picture to upload"});
        }
        const CloudinaryResponse = await cloudinary.uploader.upload(base64);
        const NewUser = await UserModel.findByIdAndUpdate(user._id , {ProfilePic:CloudinaryResponse.secure_url} , {new:true})
        return res.status(200).json({success:true , data:NewUser , message:"Image Uploaded Successfully"})
    } catch (error) {
        console.log("Error at upload controller" ,error)
        return res.status(500).json({success:false , data:NewUser , message:"Server error while uploading image:", error})
    }
  
} 

export const ValidateUser = async (req , res) => {
    console.log('USer Validation called')
    if(req.user){
    
        return res.status(200).json({success:true , message:"Valid user",data:req.user})
    }
    return res.status(400).json({success:false , message:"Invalid user"}) 
}
export const LastUsedTheme = async (req , res) => {
    const FileData = fs.readFileSync(ThemeFilePath , 'utf-8' , (err , data) => {
        if(err){
            return res.status(400).json({success:false , message:"Couldnt Read Theme File"}) 
        }
        return data
    })
    if(!FileData){
        res.status(200).json({success:true , data:'dark'})
    }
    res.status(200).json({success:true , data:FileData})

}
export const UpdateLastUsedTheme = async (req , res) => {
    const {theme} = req?.body;
    try {
        if(!theme){
            return res.status(400).json({success:false , message:"No theme provided"}) 
        }
        fs.writeFileSync(ThemeFilePath , theme , (err) => {
            return res.status(400).json({success:false , message:"Server side error while updating theme"}) 
        })
        res.status(200).json({success:true , message:'Theme state updated successfully'})
    } catch (error) {
        return res.status(400).json({success:false , message:"Server side error while updating theme"}) 
    }
}