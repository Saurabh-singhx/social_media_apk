import React, { useState } from 'react'
import Card from '../components/Card'
import { Plus, ImagePlus, X } from 'lucide-react'
import { authStore } from '../store/authStore'
import { useEffect } from 'react'

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const { getAllPost, AllPosts, createPost, isPosting } = authStore();



  useEffect(() => {
    getAllPost();

  }, [])


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

  return (
    <div className='relative min-h-screen pt-10'>
      {/* Posts Section */}
      <div className="flex flex-col items-center lg:w-[65%] mx-auto md:w-[80%] w-[95%] mt-10" >
        {AllPosts.map((index) => (
          <div key={index._id} className="w-full">
            <Card post={index} />
          </div>
        ))}
      </div>

      {/* Floating Create Post Button (centered) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-yellow-400 text-white p-4 rounded-full shadow-lg hover:bg-yellow-500 transition flex items-center gap-2'
        >
          <Plus size={20} />
          <span className='font-medium'>Create Post</span>
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
    </div>
  )
}

export default HomePage
