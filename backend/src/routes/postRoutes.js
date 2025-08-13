import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkLiked, createComment, createLike, createPost, getAllPosts, getComments, getMyPost, getPostLike, getSinglePost } from "../controllers/post.controller.js";
import { uploadMiddleware } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/createpost",protectRoute,uploadMiddleware.single('file'),createPost);
router.post("/like/:postId",protectRoute,createLike);
router.post("/createcomment",protectRoute,createComment);
router.post("/getposts",protectRoute,getAllPosts);
router.get("/getSinglePost/:postId",protectRoute,getSinglePost);
router.get("/getmyposts",protectRoute,getMyPost);
router.get("/getlikes/:postId",protectRoute,getPostLike);
router.get("/getcomments/:postId",protectRoute,getComments);
router.get("/checkliked/:postId",protectRoute,checkLiked);


export default router;