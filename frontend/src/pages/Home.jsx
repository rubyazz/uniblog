import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postsAPI, categoriesAPI } from '../services/api';
import PostCard from '../components/common/PostCard';
import Loading from '../components/common/Loading';
import { HiOutlineArrowRight, HiOutlineBookOpen, HiOutlineUsers, HiOutlineNewspaper } from 'react-icons/hi';

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, latest, cats] = await Promise.all([
          postsAPI.getFeatured(0, 3),
          postsAPI.getAll(0, 6),
          categoriesAPI.getAll(),
        ]);
        setFeaturedPosts(featured.data.content || []);
        setLatestPosts(latest.data.content || []);
        setCategories(cats.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="gradient-text">UniBlog</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
              Where university minds meet. Share your knowledge, discover new ideas,
              and connect with fellow students and researchers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/blog"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25 flex items-center space-x-2"
              >
                <span>Explore Articles</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 glass-card text-white rounded-xl font-medium transition-all hover:bg-white/10"
              >
                Start Writing
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16"
          >
            {[
              { icon: HiOutlineNewspaper, label: 'Articles', value: '500+' },
              { icon: HiOutlineUsers, label: 'Writers', value: '200+' },
              { icon: HiOutlineBookOpen, label: 'Topics', value: '50+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Posts</h2>
              <p className="text-slate-400 mt-1">Handpicked articles by our editors</p>
            </div>
            <Link to="/blog" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
              <span>View all</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post, i) => (
              <PostCard key={post.id} post={post} featured={i === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-white mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/blog?category=${cat.id}`}
                className="glass-card rounded-xl p-5 text-center group hover:glow-effect transition-all duration-300"
              >
                <span className="text-3xl mb-3 block">{cat.icon || '📁'}</span>
                <h3 className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Latest Posts</h2>
              <p className="text-slate-400 mt-1">Stay updated with newest articles</p>
            </div>
            <Link to="/blog" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
              <span>View all</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center glow-effect">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Get the latest articles and university news delivered to your inbox.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-[#0f172a] border border-[#334155] rounded-l-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg font-medium transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
