import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { createComment, createLike, createPost, getAllPosts, getComments, getMyPost, getPostLike } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createpost",protectRoute,createPost);
router.post("/like/:postId",protectRoute,createLike);
router.post("/createcomment",protectRoute,createComment);
router.get("/getposts",protectRoute,getAllPosts);
router.get("/getmyposts",protectRoute,getMyPost);
router.get("/getlikes/:postId",protectRoute,getPostLike);
router.get("/getcomments/:postId",protectRoute,getComments);


export default router;