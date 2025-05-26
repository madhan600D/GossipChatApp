import MessageModel from "../../Models/Messages.model.js";
import UserModel from '../../Models/User.model.js'
import cloudinary from '../Lib/Cloudinary.js'
import {io, GetSocketID} from '../Lib/Socket.js'

export const GetMessages = async (req , res) => {
    try {
        const DestinationID = req.params.id ;
        const SourceID = req.user.id ;

        //Query DB and get the relevent Messages
        const Messages = await MessageModel.find({$or:[{SenderID:SourceID,ReceiverID:DestinationID} , 
                                                   {SenderID:DestinationID , ReceiverID:SourceID}]});

        return res.status(200).json({success:true , data:Messages})

    } catch (error) {
        console.log("Erorr at GetMessages Controller")
        return res.status(200).json({success:false , data:[],Message:error})
    }
    
}

export const AddMessage = async (req , res) => {
    try {
        const DestinationID = req.params.id
        const SourceID = req.user.id
        const image = req.body ? req.body.selectedImage : ''
        let NewMessage = ''
        if(image){
            //Add in Cloudinary and add the reference in DB
            const CloudinaryResponse = await cloudinary.uploader.upload(image);
            NewMessage = await new MessageModel({
                SenderID:SourceID,
                ReceiverID:DestinationID,
                Text:req.body.currentMessage,
                Image:CloudinaryResponse.secure_url
            })
            await NewMessage.save()
        }
        else{
            NewMessage = await new MessageModel({
                SenderID:SourceID,
                ReceiverID:DestinationID,
                Text:req.body.currentMessage,
                Image:''
            })
            await NewMessage.save()
            
        }
        
            //After saving send the message to the socket ID
            const SocketID = GetSocketID(DestinationID);
            //Validation is crucial to send message only to online user
            if(SocketID){
                io.to(SocketID).emit("SendMessage" , NewMessage)
            }
            return res.status(200).json({success:true , message:"Message updated in DB" ,data:NewMessage}) 
        
    } catch (error) {
        console.log("Server side error while updating in DB")
        return res.status(500).json({success:true , message:error}) 
    }
}

export const GetUsers = async (req , res) => {
    try {
        //Get Users to fill side bar
        const SourceID = req.user._id;
        const FilteredUsers = await UserModel.find({_id:{$ne:SourceID}}).select("-Password");
        return res.status(200).json({success:true , data:FilteredUsers , Message:"Users from Data Base"});
    } catch (error) {
        console.log("Error in obtaining Users from Data Base")
        return res.status(500).json({success:false , Message:"Error in obtaining Users from Data Base"});
    }
    
    
}
