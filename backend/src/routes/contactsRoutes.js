import express from "express"
import { checkFollowing, follow, getUsersAsSuggestion, searchContact, unfollow } from "../controllers/contacts.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/follow/:otherUserId",protectRoute,follow);
router.delete("/unfollow/:otherUserId",protectRoute,unfollow);
router.get("/checkfollow/:otherUserId",protectRoute,checkFollowing);
router.get("/suggestions",protectRoute,getUsersAsSuggestion);
router.post("/searchUser",protectRoute,searchContact);


export default router;