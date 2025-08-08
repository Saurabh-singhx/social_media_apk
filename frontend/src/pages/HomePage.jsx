import React, { useState } from 'react'
import Card from '../components/Card'
import { Plus, ImagePlus, X, Loader } from 'lucide-react'
import { authStore } from '../store/authStore'
import { useEffect } from 'react'
import { useRef } from 'react'
import { HashLoader } from "react-spinners";

function HomePage({ showMyPosts }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const { getAllPost, AllPosts, createPost, isPosting, isLoadingMyPosts, myPosts, getMyPost, isLoadingPosts } = authStore();
  const [numberToSkip, setNumberToSkip] = useState(0)


  useEffect(() => {
    if (!showMyPosts) {
      getAllPost({ numberToSkip: numberToSkip });
    } else {
      getMyPost({ numberToSkip: numberToSkip });
    }
  }, [numberToSkip, showMyPosts])


  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return alert("Post content is required.");

    let base64Image = "";

    if (image) {
      base64Image = await toBase64(image);
    }

    const newPostData = {
      postContent: content,
      postImg: base64Image,
    };

    await createPost(newPostData);

    setContent("");
    setImage(null);
    setIsModalOpen(false);
  };

  // Utility function
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // this converts it to base64
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // console.log(AllPosts)

  const handleLoadMore = (e) => {
    e.preventDefault();
    setNumberToSkip((prev) => prev + 10);
  }

  if (isLoadingMyPosts) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        {/* <Loader className="w-10 h-10 animate-spin text-yellow-500" /> */}
        <HashLoader color={"#f8e513"} size={40} />
      </div>
    )
  }
  return (
    <div className='relative min-h-screen pt-10 pb-4'>
      {/* Posts Section */}
      <div className="flex flex-col items-center lg:w-[65%] mx-auto md:w-[80%] w-[95%] mt-10">
        {(showMyPosts ? myPosts : AllPosts).map((post) => (
          <div key={post._id} className="w-full">
            <Card post={post} />
          </div>
        ))}
      </div>


      {/* Floating Create Post Button  */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition duration-300 group"

        >
          <Plus size={24} />
          <span className="absolute opacity-0 group-hover:opacity-100 bg-yellow-400 text-white text-xs px-2 py-1 rounded-md -top-10 transition font-bold">
            Create Post
          </span>
        </button>
      </div>



      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setIsModalOpen(false)}
            className='fixed inset-0 bg-black/50 z-40'
          />

          {/* Modal Content */}
          <div className='fixed inset-0 flex items-center justify-center z-50'>
            <form
              onSubmit={handlePostSubmit}
              className='relative bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl space-y-4'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <h2 className='text-xl font-semibold text-gray-800 mb-2'>Create a Post</h2>

              <textarea
                rows='4'
                placeholder='What do you want to talk about?'
                className='w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-yellow-400'
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>

              <label className='flex items-center gap-2 text-sm text-gray-600 cursor-pointer'>
                <ImagePlus size={18} className='text-yellow-500' />
                Add Image
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              <button
                type='submit'
                disabled={isPosting}
                className={`w-full text-white py-2 rounded-md transition ${isPosting
                  ? 'bg-yellow-300 cursor-not-allowed'
                  : 'bg-yellow-400 hover:bg-yellow-500'
                  }`}
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>

            </form>
          </div>
        </>
      )}

      {
        (!isLoadingPosts && !showMyPosts) ? (<div
          className="flex items-centre justify-center h-8">
          <button
            onClick={handleLoadMore}
            className='bg-yellow-200 px-4 rounded-full text-yellow-600 h-6'>Load More..</button>
        </div>) : (<div
          className={`flex items-center justify-center h-6 mb-2 ${showMyPosts ? "hidden" : "flex"} ${AllPosts.length<=0 ?"h-[80vh]":""}`}
        >
          <HashLoader color="#f8e513" size={30} />
        </div>)
      }

    </div>
  )
}

export default HomePage
