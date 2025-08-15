import { useState, useEffect, useRef } from "react";
import { authStore } from "../store/authStore";
import { Heart, MessageCircle, Share2, User, UserCircle, SendHorizontal } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { contactsStore } from "../store/contactsStore";
import toast from "react-hot-toast";
import CardSkeleton from "../skeletons/CardSkeleton";

const Card = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post?.totalLikes || 0);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState(post?.comments || []);
  const [showAll, setShowAll] = useState(false);
  const [follow, setFollow] = useState(false);
  const videoRef = useRef(null);

  const VISIBLE_COUNT = 1;
  const { authUser, createLike, createComment,isLoadingMyPosts,isLoadingPosts,AllPosts } = authStore();
  const { isSettingFollow, setFollowing, setUnFollowing, checkFollowing, navRefresh } = contactsStore();

  const visibleComments = showAll ? comments : comments.slice(0, VISIBLE_COUNT);
  const isContentTruncated = post?.postContent?.length > 150 && !expanded;

  const checkLiked = async () => {
    try {
      const res = await axiosInstance.get(`/post/checkliked/${post._id}`);
      setIsLiked(res?.data?.liked);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch liked status");
    }
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikes(prev => prev + 1);
    }
    setIsLiked(true);
    createLike(post._id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      commentContent: commentInput,
      createdAt: new Date().toISOString(),
      commentUserName: authUser?.fullName || "You",
      commentUserImg: authUser?.profilepic || null,
    };

    createComment({ commentPostId: post._id, commentContent: commentInput });
    setComments(prev => [newComment, ...prev]);
    setCommentInput("");
  };

  const getComments = async () => {
    try {
      const res = await axiosInstance.get(`/post/getcomments/${post._id}`);
      const fetchedComments = Array.isArray(res.data.comments) ? res.data.comments : [res.data.comments];
      setComments(fetchedComments);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch comments");
    }
  };

  const getLikes = async () => {
    try {
      const res = await axiosInstance.get(`/post/getlikes/${post._id}`);
      setLikes(res.data.totalLikes || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch likes");
    }
  };

  useEffect(() => {
    getComments();
    getLikes();
    checkLiked();
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoElement.play().catch(() => { });
        } else {
          videoElement.pause();
        }
      },
      {
        threshold: 0.5, // Play only if 50% visible
      }
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, []);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${post._id}`;

    if (navigator.share) {
      // Native share (Mobile & modern browsers)
      try {
        await navigator.share({
          title: "Check out this post!",
          text: post?.caption || "Look at this!",
          url: shareUrl,
        });
        console.log("Post shared successfully!");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }
  };

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const check = await checkFollowing(post.postUserId);
        setFollow(check);
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };
    fetchFollowStatus();
  }, [navRefresh]);

  const handleFollow = () => {
    if (!follow) {
      setFollowing(post.postUserId);
      setFollow(true);
    } else {
      setUnFollowing(post.postUserId);
      setFollow(false);
    }
  };

  if(isLoadingMyPosts || isLoadingPosts || AllPosts.length <= 0) {
    return(
      <CardSkeleton/>
    )
  }

  return (
    <div className="w-full max-w-screen-md mx-auto bg-slate-100 rounded-2xl shadow-md overflow-hidden mb-6 border border-gray-100">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        {post?.postUserImg ? (
          <img src={post.postUserImg} alt="poster" className="w-10 h-10 rounded-full object-cover border border-yellow-400" />
        ) : (
          <User className="w-10 h-10 text-gray-400 rounded-full border border-yellow-400 p-1 bg-gray-100" />
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-800">{post?.postUserName}</h3>
          <p className="text-xs text-gray-500">{new Date(post?.createdAt).toLocaleDateString()}</p>
        </div>

        {post?.postUserId === authUser?._id ? (
          <span className="px-3 py-1.5 bg-yellow-300 text-yellow-700 font-semibold text-sm rounded-full flex items-center">You</span>
        ) : (
          <button
            onClick={handleFollow}
            disabled={isSettingFollow}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-sm transition-colors ${follow
                ? `bg-gray-400 ${isSettingFollow ? "cursor-not-allowed" : ""}`
                : `bg-yellow-500 hover:bg-yellow-600 ${isSettingFollow ? "cursor-not-allowed" : ""}`
              }`}
          >
            {follow ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* Post Media */}
      {post?.postImg && (
        <div className="w-full max-h-[60vh] flex justify-center bg-white rounded-xl overflow-hidden">
          {post.postImg.includes("/video/upload/") ? (
            <video ref={videoRef}
              loop
              playsInline
              muted
              src={post.postImg} controls className="max-h-[60vh] w-auto object-contain" />
          ) : (
            <img src={post.postImg} alt="Post" className="max-h-[60vh] w-auto object-contain" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3 text-gray-700 text-sm leading-relaxed">
        {isContentTruncated ? `${post?.postContent?.slice(0, 150)}...` : post?.postContent}
        {post?.postContent?.length > 150 && (
          <button onClick={() => setExpanded(!expanded)} className="text-yellow-500 text-sm font-medium ml-1">
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-2 border-t flex items-center justify-around text-gray-600 text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 transition ${isLiked ? "text-yellow-500" : "hover:text-yellow-500"}`}
        >
          <Heart size={20} className={isLiked ? "fill-current" : ""} />
          {likes} Like
        </button>
        <button className="flex items-center gap-1 hover:text-yellow-500 transition">
          <MessageCircle size={18} />
          {comments.length} Comment
        </button>
        <button 
        onClick={handleShare}
        className="flex items-center gap-1 hover:text-yellow-500 transition">
          <Share2 size={18} />
          Share
        </button>
      </div>

      {/* Comment Input */}
      <form onSubmit={handleCommentSubmit} className="px-4 pb-3 mt-2 flex items-center gap-3">
        {authUser?.profilepic ? (
          <img src={authUser.profilepic} alt="Your Profile" className="w-9 h-9 rounded-full object-cover shrink-0" />
        ) : (
          <UserCircle className="w-9 h-9 text-gray-400" />
        )}
        <div className="flex items-center w-full gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button type="submit" className="text-sm text-white rounded-full">
            <SendHorizontal className="w-6 h-8 text-yellow-400" />
          </button>
        </div>
      </form>

      {/* Comments */}
      {comments.length > 0 && (
        <div className="px-4 pb-4 space-y-3 text-sm text-gray-700 max-h-64 overflow-y-auto">
          {visibleComments.map((comment, i) => (
            <div key={i} className="flex items-start gap-2 bg-gray-200 rounded-xl px-3 py-2">
              {comment.commentUserImg ? (
                <img src={comment.commentUserImg} alt="Commenter" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <UserCircle className="w-8 h-8 text-gray-400" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800">{comment.commentUserName}</p>
                <p className="text-gray-600">{comment.commentContent}</p>
                <p className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {comments.length > VISIBLE_COUNT && (
            <button onClick={() => setShowAll(!showAll)} className="text-yellow-500 text-xs font-medium hover:underline">
              {showAll ? "Show less" : `View all ${comments.length} comments`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
