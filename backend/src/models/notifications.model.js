import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        notifiyById: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        notifiedToId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text:{
            type: String,
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: false, // Not all notifications will be related to a post
        },
        type: {
            type: String,
            enum: ["like", "comment", "follow", "mention"], // Define the types of notifications
            required: true,
        },



    }, { timestamps: true }
);
const notification = mongoose.model("Notification", notificationSchema);

export default notification;