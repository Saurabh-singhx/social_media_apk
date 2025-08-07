// models/Otp.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String, // store as string
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // ⏰ OTP expires in 5 mins (300s)
    },
});

const otp = mongoose.model("Otp", otpSchema);

export default otp;