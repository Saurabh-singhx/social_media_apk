import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        fullName:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        profilepic:{
            type:String,
            default:"",
        },
        bio:{
            type:String,
            default:"I am a Developer 😉",
            maxlength:100,
        },
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        
    },{timestamps:true}
);
const user = mongoose.model("User",userSchema);

export default user;