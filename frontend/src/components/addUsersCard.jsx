import React, { useState, useEffect } from "react";
import { User as UserIcon, UserPlus } from "lucide-react";
import { contactsStore } from "../store/contactsStore";
import { HashLoader } from "react-spinners";
import { authStore } from "../store/authStore";

export default function AddUsersCard({ users }) {
  const [follow, setFollow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { checkFollowing, setFollowing, setUnFollowing, isSettingFollow, navRefresh } = contactsStore();
  const { authUser } = authStore();

  useEffect(() => {
    const fetchFollowStatus = async () => {
      setLoading(true);
      try {
        const check = await checkFollowing(users._id);
        setFollow(check);
      } catch (err) {
        console.error("Error checking follow status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowStatus();
  }, [navRefresh]);

  const handleFollow = (user) => {

    if (!follow) {
      setFollowing(user._id)
      setFollow(true)
    } else {
      setUnFollowing(user._id)
      setFollow(false)
    }

  };



  return (
    <div className="mx-auto w-full">
      <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition-all">
        {/* Profile Section */}
        <div className="flex items-center gap-3 min-w-0">
          {users.profilepic ? (
            <img
              src={users.profilepic}
              alt={users.fullName}
              className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
              <UserIcon size={24} className="text-gray-400" />
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <h3 className="text-gray-800 font-semibold truncate">
              {users.fullName}
            </h3>
            <p className="text-gray-500 text-sm truncate">@{users.email}</p>
          </div>
        </div>

        {/* Follow Button or Loader */}
        {loading ? (
          <HashLoader size={20} color="#facc15" />
        ) : (

          authUser._id === users._id ? (<span className="px-3 py-1.5 bg-yellow-300 text-yellow-700 font-semibold text-sm rounded-full flex items-center">You</span>) : (<button
            onClick={() => handleFollow(users)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-sm transition-colors ${
              follow
                ? `bg-gray-400 ${isSettingFollow?"cursor-not-allowed":""}`
                : `bg-yellow-500 hover:bg-yellow-600 ${isSettingFollow?"cursor-not-allowed":""}`
            }`}
          >
            {/* <UserPlus size={16} /> */}
            {follow ? "Unfollow" : "Follow"}
          </button>)

        )}
      </div>
      
    </div>
  );
}
