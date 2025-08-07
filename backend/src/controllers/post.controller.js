import cloudinary from "../lib/cloudinary.js";
import Comment from "../models/comments.model.js";
import Like from "../models/likes.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import user from "../models/user.model.js";


export const createPost = async (req, res) => {

    const { postImg, postContent } = req.body;
    const userId = req.user._id;
    const userName = req.user.fullName;
    const userProfilePic = req.user.profilepic;

    try {
        if (!postContent) {
            return res.status(400).json({ message: "post content can't be empty" });
        }
        if (!userId) {
            return res.status(400).json({ message: "unable to find user while posting" });
        }

        let updatedImg = "";
        if (postImg) {
            const uploadResponse = await cloudinary.uploader.upload(postImg);
            updatedImg = uploadResponse.secure_url;
        }
        const newPost = new Post({
            postImg: updatedImg,
            postUserId: userId,
            postUserName: userName,
            postContent: postContent,
            postUserImg: userProfilePic,
        });

        if (newPost) {
            await newPost.save();

            res.status(201).json({
                _id: newPost._id,
                postImg: newPost.postImg,
                postUserId: newPost.postUserId,
                postUserName: newPost.postUserName,
                postContent: newPost.postContent,
                postUserImg: newPost.postUserImg,

            });
        } else {
            return res.status(400).json({ message: "Invalid Post data" })
        }
    } catch (error) {
        console.log("error in create Post controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }

}

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

        if(checklike.length >=1){
            return res.status(400).json({message: "Already liked" })
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
        // console.log(req.body)
        // console.log(numberToSkip)
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

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "error not found while getting my posts" });
        }

        const myPosts = await Post.find({ postUserId: userId })

        return res.status(200).json({
            mypost: myPosts
        })
    } catch (error) {
        console.log("error in myPosts controller", error.message);
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
    const userId  = req.user._id;

    try {
        if (!postId) {
            return res.status(400).json({ message: "postid required" })
        }

        const checklike = await Like.find({ likeUserId: userId, likePostId: postId });

        if(checklike.length >=1){
            return res.status(200).json({liked:true})
        }else{
            return res.status(200).json({liked:false})
        }
    } catch (error) {
        console.log("error in check like controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}




