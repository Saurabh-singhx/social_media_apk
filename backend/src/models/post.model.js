import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        postUserImg:{
            type:String,
            default:"",
        },
        postUserId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true,
        },
        postUserName:{
            type:String,
            required:true,
        },
        postContent:{
            type:String,
            required:true,
            minlength:4,
        },
        postImg:{
            type:String,
            default:"",
        },
        
    },{timestamps:true}
);
const post = mongoose.model("Post",postSchema);

export default post;