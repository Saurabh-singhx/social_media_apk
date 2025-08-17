import { getRecieverSocketId, io } from "../lib/socket.js";
import Notification from "../models/notifications.model.js";
import User from "../models/user.model.js";

export const follow = async (req, res) => {

    const userId = req.user.id;
    const { otherUserId } = req.params;

    try {

        if (!otherUserId) {
            return res.status(400).json({ message: "userID is required to add contact" })
        }

        const folllowing = await User.findById(otherUserId);

        if (!folllowing) {
            return res.status(404).json({ message: "following user not found" });
        }

        // Prevent user from following themselves
        if (String(folllowing._id) === String(userId)) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { following: folllowing._id } }, // <- Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "error while following" });
        }

        const followingUser = await User.findByIdAndUpdate(
            folllowing._id,
            { $addToSet: { follower: userId } }, // <- Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!followingUser) {
            return res.status(400).json({ message: "error while following" });
        }



        const followingUserData = await User.findById(followingUser._id).select("-password -__v -_id -createdAt -updatedAt");


        res.status(200).json({
            message: "follow successfull",
            follower: followingUserData.follower,
        });

        const newNotification = await new Notification({
            notifiyById: userId,
            notifiedToId: otherUserId,
            text: `${updatedUser.fullName} started following you`,
            type: "follow"
        }).save()

        if(newNotification) {
            const recieverSocketId = getRecieverSocketId(otherUserId);

            if (recieverSocketId) {
                io.to(recieverSocketId).emit("newNotification", newNotification);
            }
        }

    } catch (error) {
        console.error("Error in addContacts controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const unfollow = async (req, res) => {

    const userId = req.user.id;
    const { otherUserId } = req.params;

    try {

        if (!otherUserId) {
            return res.status(400).json({ message: "user id required for unfollow" })
        }

        const unfollowing = await User.findById(otherUserId);

        if (!unfollowing) {
            return res.status(404).json({ message: "unfollowing user not found" });
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { following: unfollowing._id } }
        );

        await User.updateOne(
            { _id: unfollowing._id },
            { $pull: { follower: userId } }
        );

        return res.status(200).json({ message: "successfully unfollowed" })


    } catch (error) {
        console.error("Error in unfollow controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkFollowing = async (req, res) => {

    const userId = req.user.id;
    const { otherUserId } = req.params;

    try {
        if (!otherUserId) {
            return res.status(400).json({ messsage: "otheruserId required" })
        }

        const followingUser = await User.findById(otherUserId)
        const exists = await User.exists({
            _id: userId,
            following: followingUser._id
        })

        if (exists) {
            return res.status(200).json({ following: true })
        }

        return res.status(200).json({ following: false })
    } catch (error) {
        console.error("check follow:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUsersAsSuggestion = async (req, res) => {

    try {

        const suggestions = await User.find().sort({ createdAt: -1 }).limit(5).select("-password -__v -createdAt -updatedAt -bio -following -follower").exec();

        if (!suggestions) {
            res.status(400).json({ message: "error while finding suggestions" });
        }

        res.status(200).json({
            suggestions
        })
    } catch (error) {
        console.error("get suggestions", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const searchContact = async (req, res) => {

    const { searchedId } = req.body;
    try {
        if (!searchedId) {
            return res.status(400).json({ message: "check your user name or email " });
        }

        let user = "";

        if (searchedId.includes("@gmail")) {
            user = await User.findOne({ email: searchedId }).select("-password -__v -createdAt -updatedAt -bio -following -follower").exec();;
        } else {
            user = await User.find({ fullName: { $regex: searchedId, $options: "i" } }).select("-password -__v -createdAt -updatedAt -bio -following -follower").exec();
        }

        if (!user || user.length === 0) {
            return res.status(400).json({ message: "searched User does not exists" })
        }

        return res.status(200).json({ user });

    } catch (error) {
        console.error("search user", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getNotifications = async (req, res) => {
    const userId = req.user.id;

    try {
        const notifications = await Notification.find({ notifiedToId: userId })
            .sort({ createdAt: -1 })
            .populate("notifiyById", "-password -__v -createdAt -updatedAt -bio -following -follower")
            .exec();

        if (!notifications) {
            return res.status(404).json({ message: "No notifications found" });
        }

        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}

