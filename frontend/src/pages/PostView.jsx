import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { axiosInstance } from '../lib/axios';
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import { HashLoader } from 'react-spinners';

function PostView() {

    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        
        const getpost = async () => {
            setLoading(true)
            try {
                const res = await axiosInstance.get(`/post/getSinglePost/${id}`)

                setPost(res.data.post);
            } catch (error) {
                setLoading(false)
                console.error("Error fetching posts:", error);
                toast.error(error?.response?.data?.message || "Failed to fetch posts");
            } finally {
                setLoading(false)
            }
        }
        getpost();

    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <HashLoader color={"#f8e513"} size={40} />
            </div>
        )
    }

    return (
        <div>
            {
                post&&(<Card post={post}/>)
            }
        </div>
    )
}

export default PostView