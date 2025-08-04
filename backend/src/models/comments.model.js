import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        commentUserImg:{
            type:String,
            default:"",
        },
        commentUserId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true,
        },
        commentUserName:{
            type:String,
            required:true,
        },
        commentContent:{
            type:String,
            required:true,
        },
        commentPostId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required:true,
        },
        
    },{timestamps:true}
);
const comment = mongoose.model("Comment",commentSchema);

export default comment;