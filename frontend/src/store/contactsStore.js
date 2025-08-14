import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const contactsStore = create((set, get) => ({
    isgettinSuggestions: false,
    isSettingFollow:false,
    navRefresh:false,
    searchedUser: [],
    isSearchingUser: false,

    suggestionData: [],


    getSuggestion: async () => {
        set({ isgettinSuggestions: true })

        try {
            const { suggestionData } = get();
            const res = await axiosInstance.get("/contacts/suggestions");

            set({ suggestionData: res.data.suggestions });

        } catch (error) {
            set({ isgettinSuggestions: false })
            console.error("Error fetching suggestions:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch suggestions");
        } finally {
            set({ isgettinSuggestions: false })
        }
    },

    checkFollowing: async (userId) => {

        try {
            const res = await axiosInstance.get(`/contacts/checkfollow/${userId}`)
            const data = res.data.following;
            return (data);
            
        } catch (error) {
            console.error("Error while checking following:", error);
            toast.error(error?.response?.data?.message || "Failed to check following");
        }
    },

    setFollowing: async(userId)=>{

        set({isSettingFollow:true});
        const {authUser} = get();
        try{
            await axiosInstance.post(`/contacts/follow/${userId}`);
           
        }catch(error){
            set({isSettingFollow:false});
            console.error("Error while following:", error);
            toast.error(error?.response?.data?.message || "Failed to  follow");
        }finally{
            set({isSettingFollow:false});
            set({navRefresh:(prev)=>{!prev}})
        }
    },

    setUnFollowing: async(userId)=>{

        set({isSettingFollow:true});

        try{
            await axiosInstance.delete(`/contacts/unfollow/${userId}`);
            
        }catch(error){
            set({isSettingFollow:false});
            console.error("Error while unfollowing:", error);
            toast.error(error?.response?.data?.message || "Failed to  unfollow");
        }finally{
            set({isSettingFollow:false});
            set({navRefresh:(prev)=>{!prev}})
        }
    },

    searchContact: async (searchedId) => {
        set({ isSearchingUser: true });

        try {
            console.log("Searching for user:", searchedId);
            const res = await axiosInstance.post("/contacts/searchUser", searchedId);
            const data = res.data.user;

            if (data) {
                set({ searchedUser: data });
            } else {
                toast.error("No user found");
                set({ searchedUser: [] });
            }

        } catch (error) {
            set({ isSearchingUser: false });
            console.error("Error while searching user:", error);
            toast.error(error?.response?.data?.message || "Failed to search user");
        } finally {
            set({ isSearchingUser: false });
        }
    }   



}))