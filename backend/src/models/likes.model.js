import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likeUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likePostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Prevent duplicate likes by the same user on the same post
likeSchema.index({ likeUserId: 1, likePostId: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;
