import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { axiosInstance } from '../lib/axios';
import { useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { HashLoader } from 'react-spinners';
import { authStore } from '../store/authStore';

function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const { authUser } = authStore();

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/post/getSinglePost/${id}`);
        setPost(res.data.post);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader color={"#f8e513"} size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {!authUser && (
        <button
          onClick={() => navigate("/loginSignUp")}
          className="py-2 px-6 bg-yellow-300 text-white font-semibold rounded-lg"
        >
          Try Logging In
        </button>
      )}

      {authUser && post && <Card post={post} />}
    </div>
  );
}

export default PostView;
