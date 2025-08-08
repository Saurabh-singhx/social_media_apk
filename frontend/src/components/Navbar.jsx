import React, { useState } from "react";
import { Menu, X, UserCircle, LogOut, Camera,UserPen} from "lucide-react";
import { authStore } from "../store/authStore";
import { HashLoader } from "react-spinners";

const Navbar = ({ showMyPosts, setShowMyPosts }) => {
  const [open, setOpen] = useState(false);
  const [enteredBio, setEnteredBio] = useState("");
  const [enteredName, setEntredName] = useState("")


  const { logout, authUser, updateProfile, isUpdatingProfile } = authStore();

  const toggleDrawer = () => setOpen(!open);

  const handleLogout = () => {
    logout();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilepic: base64Image });
    };
  };

  const handlePostViewToggle = () => {
    const updatedState = !showMyPosts;
    setShowMyPosts(updatedState);
  };


  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={toggleDrawer}>
            {authUser.profilepic ? (
              <img
                src={authUser.profilepic}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400"
              />
            ) : (
              <UserCircle
                size={32}
                className="text-gray-600 hover:text-yellow-500 transition"
              />
            )}
          </button>
          <span className="text-gray-600 font-medium text-sm hidden sm:block">
            Profile
          </span>
        </div>

        {/* Post View Toggle */}
        <div className="flex items-center gap-3 bg-gray-100 px-2 py-1 rounded-full">
          {/* Label - All Posts */}
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full transition ${!showMyPosts
              ? "bg-yellow-400 text-white shadow"
              : "text-gray-500"
              }`}
          >
            All Posts
          </span>

          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showMyPosts}
              onChange={handlePostViewToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-yellow-400 transition-colors duration-300"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-full"></div>
          </label>

          {/* Label - My Posts */}
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full transition ${showMyPosts
              ? "bg-yellow-400 text-white shadow"
              : "text-gray-500"
              }`}
          >
            My Posts
          </span>
        </div>


        {/* Right side icons */}
        <div className="flex items-center gap-4">
          {/* Search Input (optional) */}
          <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-full shadow-sm">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-gray-600 w-32 placeholder-gray-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M5.5 11a5.5 5.5 0 1011 0 5.5 5.5 0 00-11 0z"
              />
            </svg>
          </div>

          {/* Notification Bell */}
          <button className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 hover:text-yellow-500 transition"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
              <path d="M10 18a2 2 0 002-2H8a2 2 0 002 2z" />
            </svg>
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </button>
        </div>
      </nav>

      {/* Profile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {
          !isUpdatingProfile ? (
            <>
              {/* Header */}
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-semibold text-gray-700">My Profile</h2>
                <button onClick={toggleDrawer}>
                  <X className="text-gray-600 hover:text-red-500 transition" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="p-6 flex flex-col items-center text-center relative ">
                {/* Profile Image */}
                {authUser.profilepic ? (
                  <img
                    src={authUser.profilepic}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400 mb-3"
                  />
                ) : (
                  <UserCircle size={72} className="text-yellow-400 mb-3" />
                )}

                {/* Upload Icon Overlay */}
                <label className="absolute top-8 right-28 bg-white p-1 rounded-full cursor-pointer border shadow">
                  <Camera size={18} className="text-yellow-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Name & Email */}
                <div className="flex flex-col gap-2 relative">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {authUser.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">{authUser.email}</p>

                  {/* Bio */}
                  {authUser.bio && (
                    <span className="text-xs mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                      {authUser.bio}
                    </span>
                  )}
                  <button 
                  title="update profile"
                  className="absolute -right-10 p-1 bg-white rounded-full shadow  border"><UserPen size={18} className=" text-yellow-500 "/></button>
                </div>

                <div className="w-full border-t my-4" />
                <p className="text-xs text-gray-400">
                  Joined: {new Date(authUser.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Logout Button */}
              <div className="px-6 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-full transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center p-6 text-gray-500 mt-auto h-80 flex-col">
              <HashLoader color={"#f8e513"} size={40} />
              <div>Updating Your profile👍</div>
            </div>
          )
        }


      </div>

      {/* Background Overlay */}
      {open && (
        <div onClick={toggleDrawer} className="fixed inset-0 bg-black/40 z-40" />
      )}
    </div>
  );
};

export default Navbar;
