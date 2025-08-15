import cloudinary from "../lib/cloudinary.js";
import Comment from "../models/comments.model.js";
import Like from "../models/likes.model.js";
import Notification from "../models/notifications.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";


export const createPost = async (req, res) => {
    const { postContent } = req.body;
    const userId = req.user._id;
    const userName = req.user.fullName;
    const userProfilePic = req.user.profilepic;

    try {
        if (!postContent) {
            return res.status(400).json({ message: "Post content can't be empty" });
        }
        if (!userId) {
            return res.status(400).json({ message: "Unable to find user while posting" });
        }

        let updatedImg = "";

        if (req.file) {
            // Convert buffer to base64 for Cloudinary
            const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

            // Detect if it's a video
            const isVideo = req.file.mimetype.startsWith("video");

            // Upload to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
                resource_type: isVideo ? "video" : "image",
                folder: "social_media_app_posts",
                // If MKV, convert to MP4
                format: isVideo ? "mp4" : undefined
            });

            updatedImg = uploadResponse.secure_url;
        }

        const newPost = new Post({
            postImg: updatedImg,
            postUserId: userId,
            postUserName: userName,
            postContent: postContent,
            postUserImg: userProfilePic,
        });

        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const createLike = async (req, res) => {

    const userId = req.user._id;
    const { postId } = req.params;

    try {
        if (!userId) {
            return res.status(401).json({ message: "cant find the User while liking the post" });
        }

        if (!postId) {


            return res.status(401).json({ message: "Post id is needed" });
        }


        const checkPost = await Post.findById(postId);

        if (!checkPost) {
            return res.status(401).json({ message: "Post not found" });
        }

        const checklike = await Like.find({ likeUserId: userId, likePostId: postId });

        if (checklike.length >= 1) {
            return res.status(400).json({ message: "Already liked" })
        }
        const newLike = new Like({
            likeUserId: userId,
            likePostId: postId,
        });

        if (newLike) {
            await newLike.save();
            res.status(201).json({
                likedBy: newLike.likeUserId,
                PostLiked: newLike.likePostId
            });
            if (checkPost.postUserId.toString() !== userId.toString()) {
                const userName = req.user.fullName;
                new Notification({
                    notifiyById: userId,
                    notifiedToId: checkPost.postUserId,
                    text: `${userName} liked your post`,
                    postId: postId,
                    type: "like"
                })
                    .save()
            }

        } else {
            return res.status(400).json({ message: "Invalid Like data" })
        }

    } catch (error) {
        console.log("error in create-Like controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const createComment = async (req, res) => {

    const { commentContent, commentPostId } = req.body;
    const userId = req.user._id;
    const userName = req.user.fullName;
    const profilePic = req.user.profilepic;

    try {
        if (!userId) {
            return res.status(401).json({ message: "cant find the User while commenting" });
        }
        if (!commentContent) {
            return res.status(401).json({ message: "content needed for comment" });
        }
        if (!commentPostId) {
            return res.status(401).json({ message: "post id required" });
        }

        const checkPost = await Post.findById(commentPostId);

        if (!checkPost) {
            return res.status(401).json({ message: "Post not found" });
        }


        const newComment = new Comment({
            commentUserImg: profilePic,
            commentUserId: userId,
            commentUserName: userName,
            commentContent: commentContent,
            commentPostId: commentPostId,
        });

        if (newComment) {
            await newComment.save();
            res.status(200).json({
                userProfilePic: newComment.commentUserImg,
                userwhocomment: newComment.commentUserId,
                nameofUser: newComment.commentUserName,
                content: newComment.commentContent,
                postId: newComment.commentPostId,
            });

            if (checkPost.postUserId.toString() !== userId.toString()) {
                new Notification({
                    notifiyById: userId,
                    notifiedToId: checkPost.postUserId,
                    text: `${userName} commented on your post`,
                    postId: commentPostId,
                    type: "comment"
                })
                    .save()
            }

        } else {
            return res.status(400).json({ message: "Invalid Comment data" })
        }
    } catch (error) {
        console.log("error in createComment controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getAllPosts = async (req, res) => {


    const { numberToSkip } = req.body;

    try {
        const posts = await Post.find().sort({ createdAt: -1 }).skip(numberToSkip).limit(10).exec();

        return res.status(200).json({
            posts
        })
    } catch (error) {
        console.log("error in getPosts controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const getMyPost = async (req, res) => {

    const userId = req.user._id;
    const numberToSkip = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "error not found while getting my posts" });
        }

        const posts = await Post.find({ postUserId: userId }).sort({ createdAt: -1 }).exec();

        return res.status(200).json({
            posts
        })
    } catch (error) {
        console.log("error in myPosts controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getSinglePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);

        return res.status(200).json({
            post
        })

    } catch (error) {
        console.log("error in single post controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getPostLike = async (req, res) => {
    const { postId } = req.params;

    try {
        if (!postId) {
            return res.status(401).json({ message: "postId is required" });
        }

        const likes = await Like.find({ likePostId: postId });

        res.status(200).json({
            totalLikes: likes.length
        })
    } catch (error) {
        console.log("error in getLikes controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getComments = async (req, res) => {

    const { postId } = req.params;

    try {

        if (!postId) {
            return res.status(401).json({ message: "postId is required" });
        }

        const comments = await Comment.find({ commentPostId: postId });

        res.status(200).json({
            comments
        })

    } catch (error) {
        console.log("error in getComments controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }

}

export const checkLiked = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    try {
        if (!postId) {
            return res.status(400).json({ message: "postid required" })
        }

        const checklike = await Like.find({ likeUserId: userId, likePostId: postId });

        if (checklike.length >= 1) {
            return res.status(200).json({ liked: true })
        } else {
            return res.status(200).json({ liked: false })
        }
    } catch (error) {
        console.log("error in check like controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}




