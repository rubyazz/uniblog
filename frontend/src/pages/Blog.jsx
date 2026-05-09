import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postsAPI, categoriesAPI, tagsAPI } from '../services/api';
import PostCard from '../components/common/PostCard';
import Loading from '../components/common/Loading';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (searchQuery) {
        res = await postsAPI.search(searchQuery, page);
      } else if (activeCategory) {
        res = await postsAPI.getByCategory(activeCategory, page);
      } else {
        res = await postsAPI.getAll(page);
      }
      setPosts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory, page]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [cats, tgs] = await Promise.all([categoriesAPI.getAll(), tagsAPI.getAll()]);
        setCategories(cats.data || []);
        setTags(tgs.data || []);
      } catch (err) {
        console.error('Failed to fetch meta:', err);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setSearchParams(searchQuery ? { search: searchQuery } : {});
    fetchPosts();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('');
    setPage(0);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
        <p className="text-slate-400">Explore articles from our community</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-[#1e293b] border border-[#334155] rounded-l-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg font-medium transition-all"
          >
            Search
          </button>
        </form>

        {(searchQuery || activeCategory) && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-4 py-2.5 glass-card rounded-lg text-slate-300 hover:text-white text-sm"
          >
            <HiOutlineX className="w-4 h-4" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => { setActiveCategory(''); setPage(0); }}
          className={`px-4 py-1.5 text-sm rounded-lg transition-all ${
            !activeCategory ? 'bg-indigo-600 text-white' : 'bg-[#1e293b] text-slate-400 hover:text-white border border-[#334155]'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id.toString()); setPage(0); }}
            className={`px-4 py-1.5 text-sm rounded-lg transition-all ${
              activeCategory === cat.id.toString()
                ? 'text-white'
                : 'bg-[#1e293b] text-slate-400 hover:text-white border border-[#334155]'
            }`}
            style={activeCategory === cat.id.toString() ? { backgroundColor: cat.color || '#6366f1' } : {}}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {loading ? (
        <Loading />
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-10">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 glass-card rounded-lg text-sm text-slate-300 disabled:opacity-30 hover:text-white transition-all"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    i === page
                      ? 'bg-indigo-600 text-white'
                      : 'glass-card text-slate-400 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 glass-card rounded-lg text-sm text-slate-300 disabled:opacity-30 hover:text-white transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No articles found</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
