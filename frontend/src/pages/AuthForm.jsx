import React, { useState, useEffect } from "react";
import { User, Mail, Lock } from "lucide-react";
import { authStore } from "../store/authStore";

const AuthForm = () => {
    const {login,signup,isSigningUp,isLoggingIn} = authStore();
    const [mode, setMode] = useState("login");
    const [focusedInput, setFocusedInput] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email.includes("@")) newErrors.email = "Invalid email";
        if (formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        if (mode === "register" && formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        if (mode === "register" && !formData.fullName.trim())
            newErrors.fullName = "Full name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        console.log("Form Data:", formData);

        if(mode ==="login"){
            login(formData)
        }else{
            signup(formData)
        }
    };

    const isAllFilled = () => {
        if (mode === "login") {
            return formData.email && formData.password;
        } else {
            return (
                formData.fullName &&
                formData.email &&
                formData.password &&
                formData.confirmPassword
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white rounded-[32px] shadow-lg w-full max-w-md p-6">
                {/* Tab Switch */}
                <div className="relative flex bg-gray-200 rounded-full p-1 mb-6">
                    <div
                        className={`absolute top-0 left-0 h-full w-1/2 bg-white rounded-full shadow transition-transform duration-300 ${mode === "register" ? "translate-x-full" : "translate-x-0"
                            }`}
                    />
                    <button
                        onClick={() => setMode("login")}
                        className={`w-1/2 z-10 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${mode === "login" ? "text-black" : "text-gray-500"
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setMode("register")}
                        className={`w-1/2 z-10 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${mode === "register" ? "text-black" : "text-gray-500"
                            }`}
                    >
                        Register
                    </button>
                </div>

                {/* Avatar Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <User
                            size={36}
                            className={`transition-colors duration-300 ${isAllFilled() ? "text-yellow-400" : "text-gray-500"
                                }`}
                        />
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "register" && (
                        <div>
                            <label className="flex items-center gap-2 border-b py-2">
                                <User
                                    size={18}
                                    className={`transition-colors duration-300 ${focusedInput === "fullName" || formData.fullName
                                            ? "text-yellow-400"
                                            : "text-gray-400"
                                        }`}
                                />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput("fullName")}
                                    onBlur={() => setFocusedInput("")}
                                    className="flex-1 outline-none text-sm bg-transparent"
                                />
                            </label>
                            {errors.fullName && (
                                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="flex items-center gap-2 border-b py-2">
                            <Mail
                                size={18}
                                className={`transition-colors duration-300 ${focusedInput === "email" || formData.email
                                        ? "text-yellow-400"
                                        : "text-gray-400"
                                    }`}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Username or e-mail"
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={() => setFocusedInput("email")}
                                onBlur={() => setFocusedInput("")}
                                className="flex-1 outline-none text-sm bg-transparent"
                            />
                        </label>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 border-b py-2">
                            <Lock
                                size={18}
                                className={`transition-colors duration-300 ${focusedInput === "password" || formData.password
                                        ? "text-yellow-400"
                                        : "text-gray-400"
                                    }`}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() => setFocusedInput("password")}
                                onBlur={() => setFocusedInput("")}
                                className="flex-1 outline-none text-sm bg-transparent"
                            />
                        </label>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {mode === "register" && (
                        <div>
                            <label className="flex items-center gap-2 border-b py-2">
                                <Lock
                                    size={18}
                                    className={`transition-colors duration-300 ${focusedInput === "confirmPassword" || formData.confirmPassword
                                            ? "text-yellow-400"
                                            : "text-gray-400"
                                        }`}
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput("confirmPassword")}
                                    onBlur={() => setFocusedInput("")}
                                    className="flex-1 outline-none text-sm bg-transparent"
                                />
                            </label>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-yellow-400 text-white py-2 rounded-full w-full font-semibold mt-4 hover:bg-yellow-500 transition"
                    >
                        {mode === "login" ? "Sign in" : "Register"}
                    </button>

                    <div className="text-center mt-2 text-sm text-gray-600">
                        {mode === "login" ? (
                            <>
                                Don’t have an account?{" "}
                                <span
                                    onClick={() => setMode("register")}
                                    className="text-black font-medium cursor-pointer"
                                >
                                    Register
                                </span>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <span
                                    onClick={() => setMode("login")}
                                    className="text-black font-medium cursor-pointer"
                                >
                                    Sign in
                                </span>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
