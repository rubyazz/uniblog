import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postsAPI, categoriesAPI, tagsAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    status: 'DRAFT',
    categoryId: '',
    tagIds: [],
    featured: false,
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [cats, tgs] = await Promise.all([categoriesAPI.getAll(), tagsAPI.getAll()]);
        setCategories(cats.data || []);
        setTags(tgs.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMeta();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        tagIds: form.tagIds.map(Number),
      };
      const res = await postsAPI.create(payload);
      toast.success(form.status === 'PUBLISHED' ? 'Post published!' : 'Draft saved!');
      navigate(`/post/${res.data.slug}`);
    } catch (err) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const toggleTag = (tagId) => {
    setForm({
      ...form,
      tagIds: form.tagIds.includes(tagId)
        ? form.tagIds.filter((id) => id !== tagId)
        : [...form.tagIds, tagId],
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
        <p className="text-slate-400 mb-8">Share your knowledge with the community</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={update('title')}
                required
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Your article title"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Content (HTML)</label>
              <textarea
                value={form.content}
                onChange={update('content')}
                required
                rows={12}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono text-sm"
                placeholder="<h2>Your heading</h2><p>Your content here...</p>"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={update('excerpt')}
                rows={2}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                placeholder="Brief description of your article"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Cover Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={update('imageUrl')}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Category</label>
              <select
                value={form.categoryId}
                onChange={update('categoryId')}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      form.tagIds.includes(tag.id)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#0f172a] text-slate-400 border border-[#334155] hover:border-indigo-500/50'
                    }`}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={update('featured')}
                className="w-4 h-4 rounded bg-[#0f172a] border-[#334155] text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-300">Mark as featured</span>
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              onClick={() => setForm({ ...form, status: 'PUBLISHED' })}
              disabled={loading}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium transition-all"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 glass-card text-slate-300 hover:text-white rounded-lg font-medium transition-all"
            >
              Save Draft
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;
