import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";

dotenv.config();

export const otpVerify = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    try {

        const user = User.findOne({email})
        if(user){
            return res.status(400).json({ message: "email already exists try loging in" });
        }
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Nodemailer transporter setup
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: `"SOCIAL-X 🚀" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔐 Your OTP Code - Secure Login",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>👋 Hello!</h2>
                <p>You're almost there. Use the OTP below to complete your sign-up or login process.</p>
                <h3 style="color: #ff9900;">🔢 Your OTP: <strong>${otp}</strong></h3>
                <p>⏳ This code is valid for <strong>5 minutes</strong>.</p>
                <p>If you didn't request this, please ignore this email. 🔒</p>
                <br/>
                <p>Cheers,<br/>The SOCIAL-X Team 💛</p>
                </div>`,
        };


        // Remove old OTPs for this email
        await Otp.deleteMany({ email });

        // Save new OTP in DB
        const otpEntry = new Otp({ email, otp }); 
        await otpEntry.save();

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};
