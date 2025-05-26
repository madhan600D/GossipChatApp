import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    UserName:{
        type : String,
        required : true,
        unique:true,
    },
    Password:{
        type : String ,
        required: true ,
        minlength: 6,
    },
    ProfilePic:{
        type:String,
        default: "",

    }
},{
    timeStamps :true
}
)

const UserModel = mongoose.model('UserModel' , UserSchema);

export default UserModel;