import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineHeart, HiOutlineChat, HiOutlineClock } from 'react-icons/hi';

const PostCard = ({ post, featured = false }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={`group glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:glow-effect ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <Link to={`/post/${post.slug}`} className="block">
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'h-64 md:h-80' : 'h-48'}`}>
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-4xl opacity-30">{post.category?.icon || '📝'}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 to-transparent" />

          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-4 left-4">
              <span
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: `${post.category.color || '#6366f1'}20`,
                  color: post.category.color || '#6366f1',
                  border: `1px solid ${post.category.color || '#6366f1'}40`,
                }}
              >
                {post.category.name}
              </span>
            </div>
          )}

          {post.featured && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className={`font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2 ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 text-xs rounded-md bg-slate-700/50 text-slate-300"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-[#334155]/50">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-medium">
                  {post.author?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-slate-400">{post.author?.username}</span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <HiOutlineEye className="w-3.5 h-3.5" />
                <span>{post.viewCount || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <HiOutlineHeart className="w-3.5 h-3.5" />
                <span>{post.likeCount || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <HiOutlineChat className="w-3.5 h-3.5" />
                <span>{post.commentCount || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default PostCard;
