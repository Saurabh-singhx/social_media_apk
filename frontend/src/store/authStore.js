import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const authStore = create((set, get) => ({

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isPosting: false,
    isUpdatingProfile: false,
    isLoadingPosts: false,
    isLoadingMyPosts: false,
    AllPosts: [],
    myPosts: [],
    AllComments: [],


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message)
            // console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (formdata) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", formdata);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (formdata) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", formdata);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            set({ AllPosts: [] })
            set({ myPosts: [] })
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    getAllPost: async (numberToSkip) => {
        set({ isLoadingPosts: true });
        try {
            const { AllPosts } = get();
            const res = await axiosInstance.post("/post/getposts", numberToSkip);

            const newPosts = Array.isArray(res.data.posts) ? res.data.posts : [res.data.posts];

            // 🧠 Filter out duplicates by _id
            const existingIds = new Set(AllPosts.map(post => post._id));
            const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post._id));

            set({ AllPosts: [...AllPosts, ...uniqueNewPosts] });

        } catch (error) {
            set({ isLoadingPosts: false });
            console.error("Error fetching posts:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch posts");
        } finally {
            set({ isLoadingPosts: false });
        }
    },


    createLike: async (postId) => {
        try {
            await axiosInstance.post(`/post/like/${postId}`);
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error(error?.response?.data?.message || "Failed to like");
        }
    },

    createPost: async (postData) => {
        set({ isPosting: true })
        try {

            await axiosInstance.post("/post/createpost", postData)

        } catch (error) {
            console.error("Error in create comment:", error);
            toast.error(error?.response?.data?.message || "Failed to comment");
            set({ isPosting: false })
        } finally {
            set({ isPosting: false })
        }
    },

    createComment: async (commentData) => {
        try {
            await axiosInstance.post("/post/createcomment", commentData)
            toast.success("commented successfully")
        } catch (error) {
            console.error("Error in create comment:", error);
            toast.error(error?.response?.data?.message || "Failed to comment");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            console.log("Updating profile with data:", data);
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            set({ isUpdatingProfile: false });
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    updateProfileDetails: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            console.log("Updating profile with data:", data);
            const res = await axiosInstance.put("/auth/update-profiledetails", data);
            set({ authUser: res.data });
            toast.success("Profile details updated successfully");
        } catch (error) {
            set({ isUpdatingProfile: false });
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    getMyPost: async (numberToSkip) => {
        set({ isLoadingMyPosts: true });
        try {
            const { myPosts } = get();
            const res = await axiosInstance.get("/post/getmyposts", numberToSkip);

            const newPosts = Array.isArray(res.data.posts) ? res.data.posts : [res.data.posts];

            // 🧠 Filter out duplicates by _id
            const existingIds = new Set(myPosts.map(post => post._id));
            const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post._id));

            set({ myPosts: [...myPosts, ...uniqueNewPosts] });

        } catch (error) {
            set({ isLoadingMyPosts: false });
            console.error("Error fetching myposts:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch posts");
        } finally {
            set({ isLoadingMyPosts: false });
        }
    },

    sendOtp: async (em) => {

        try {
            await axiosInstance.post("/auth/otp", em);
            // toast.success("otp sent successfully")

        } catch (error) {
            console.error("Error fetching myposts:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch posts");
        }
    }

}))