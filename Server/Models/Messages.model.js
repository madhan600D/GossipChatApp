import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        SenderID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,

        },
        ReceiverID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        Text:{
            type:String

        },
        Image:{
            //Image will be in Base64 Encoding
            type:String
        }
        
    },
    {
        timestamps :true
    }
)
const MessageModel = mongoose.model('MessageModel' , MessageSchema) ;
export default MessageModel