
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"



export const signup = async (req, res) => {

    const { fullName, email, password } = req.body;

    try {

        if (!fullName || !email || !password) {
            return res.status(500).json({ message: "All fields should be filled" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "message should be atleast six characters" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "user already exists" })
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,

        })

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullName,
                email: newUser.email,
                profilepic: newUser.profilepic,
                Bio: newUser.bio,
            });
        } else {
            return res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("error in signup controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
};


export const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilepic: user.profilepic,
        })
    } catch (error) {
        console.log("error in login controller", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

export const logout = (req, res) => {

    try {
        res.cookie("jwt", "", { maxAge: 0 })
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("error in logout controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "internal server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {

        const { profilepic } = req.body;
        const userId = req.user._id;

        if (!profilepic) {
            return res.status(400).json({ message: "profilepic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilepic);
        const updateUser = await User.findByIdAndUpdate(
            userId,
            { profilepic: uploadResponse.secure_url },
            { new: true },
        );
        return res.status(200).json({
            _id: updateUser._id,
            fullname: updateUser.fullName,
            email: updateUser.email,
            profilepic: updateUser.profilepic,
            Bio: updateUser.bio,
        });
    } catch (error) {
        console.log("error in updating profile", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}