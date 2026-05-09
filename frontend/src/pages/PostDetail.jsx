import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';
import {
  HiOutlineEye,
  HiOutlineHeart,
  HiOutlineChat,
  HiOutlineClock,
  HiOutlineArrowLeft,
  HiOutlineShare,
  HiOutlineThumbUp,
} from 'react-icons/hi';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postsAPI.getBySlug(slug);
        setPost(res.data);
        const commentsRes = await commentsAPI.getByPost(res.data.id);
        setComments(commentsRes.data.content || []);
      } catch (err) {
        toast.error('Post not found');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, navigate]);

  const handleLike = async () => {
    try {
      const res = await postsAPI.like(post.id);
      setPost(res.data);
      toast.success('Liked!');
    } catch {
      toast.error('Failed to like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await commentsAPI.create(post.id, { content: commentText });
      setComments([res.data, ...comments]);
      setCommentText('');
      toast.success('Comment added!');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loading />;
  if (!post) return null;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        to="/blog"
        className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        <span>Back to Blog</span>
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {post.category && (
          <span
            className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4"
            style={{
              backgroundColor: `${post.category.color || '#6366f1'}20`,
              color: post.category.color || '#6366f1',
            }}
          >
            {post.category.name}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {post.author?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{post.author?.username}</p>
              {post.author?.firstName && (
                <p className="text-xs text-slate-500">
                  {post.author.firstName} {post.author.lastName}
                </p>
              )}
            </div>
          </div>
          <span className="flex items-center space-x-1">
            <HiOutlineClock className="w-4 h-4" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <HiOutlineEye className="w-4 h-4" />
            <span>{post.viewCount} views</span>
          </span>
        </div>
      </motion.div>

      {/* Cover Image */}
      {post.imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden mb-10"
        >
          <img src={post.imageUrl} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="blog-content text-slate-300 leading-relaxed mb-10"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 border border-[#334155]"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 py-6 border-t border-b border-[#334155]/50 mb-10">
        <button
          onClick={handleLike}
          className="flex items-center space-x-2 px-4 py-2 glass-card rounded-lg text-slate-300 hover:text-rose-400 hover:border-rose-400/30 transition-all"
        >
          <HiOutlineHeart className="w-5 h-5" />
          <span>{post.likeCount}</span>
        </button>
        <span className="flex items-center space-x-2 px-4 py-2 glass-card rounded-lg text-slate-300">
          <HiOutlineChat className="w-5 h-5" />
          <span>{post.commentCount || comments.length} comments</span>
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied!');
          }}
          className="flex items-center space-x-2 px-4 py-2 glass-card rounded-lg text-slate-300 hover:text-indigo-400 transition-all ml-auto"
        >
          <HiOutlineShare className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6">
          Comments ({comments.length})
        </h3>

        {isAuthenticated ? (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
            <button
              type="submit"
              className="mt-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="glass-card rounded-xl p-6 mb-8 text-center">
            <p className="text-slate-400 text-sm">
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link> to leave a comment
            </p>
          </div>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="glass-card rounded-xl p-5">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {comment.author?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{comment.author?.username}</p>
                  <p className="text-xs text-slate-500">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};

export default PostDetail;
