import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI, postsAPI } from '../services/api';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineChat,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineBan,
} from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

const AdminDashboard = () => {
  const location = useLocation();

  const tabs = [
    { path: '/admin', icon: HiOutlineViewGrid, label: 'Dashboard', exact: true },
    { path: '/admin/posts', icon: HiOutlineDocumentText, label: 'Posts' },
    { path: '/admin/users', icon: HiOutlineUsers, label: 'Users' },
    { path: '/admin/comments', icon: HiOutlineChat, label: 'Comments' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
      <p className="text-slate-400 mb-8">Manage your blog platform</p>

      {/* Tabs */}
      <div className="flex space-x-1 glass-card rounded-xl p-1 mb-8 w-fit">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.exact}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="posts" element={<PostsManager />} />
        <Route path="users" element={<UsersManager />} />
        <Route path="comments" element={<CommentsManager />} />
      </Routes>
    </div>
  );
};

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then((res) => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'from-indigo-500 to-blue-600' },
    { label: 'Total Posts', value: stats?.totalPosts || 0, color: 'from-purple-500 to-pink-600' },
    { label: 'Total Comments', value: stats?.totalComments || 0, color: 'from-amber-500 to-orange-600' },
    { label: 'Pending Reviews', value: stats?.pendingComments || 0, color: 'from-emerald-500 to-teal-600' },
  ];

  const chartData = [
    { name: 'Users', value: stats?.totalUsers || 0 },
    { name: 'Posts', value: stats?.totalPosts || 0 },
    { name: 'Comments', value: stats?.totalComments || 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="glass-card rounded-xl p-5">
            <p className="text-sm text-slate-400 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Content Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAllPosts().then((res) => {
      setPosts(res.data.content || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postsAPI.delete(id);
      setPosts(posts.filter((p) => p.id !== id));
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#334155]">
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Title</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Author</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Views</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-[#334155]/50 hover:bg-white/5">
              <td className="px-6 py-4">
                <p className="text-sm text-white font-medium">{post.title}</p>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">{post.author?.username}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${
                  post.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-400' :
                  post.status === 'DRAFT' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {post.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">{post.viewCount}</td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then((res) => {
      setUsers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleUser = async (id) => {
    try {
      const res = await adminAPI.toggleUser(id);
      setUsers(users.map((u) => (u.id === id ? res.data : u)));
      toast.success('User updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#334155]">
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">User</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Email</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Role</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-[#334155]/50 hover:bg-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs">{u.username?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-white">{u.username}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">{u.email}</td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  {u.roles?.map((role) => (
                    <span key={role} className="px-2 py-0.5 text-xs rounded bg-indigo-500/20 text-indigo-400">
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 text-xs rounded-full ${
                  u.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {u.enabled ? 'Active' : 'Disabled'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => toggleUser(u.id)}
                  className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                  title={u.enabled ? 'Disable user' : 'Enable user'}
                >
                  {u.enabled ? <HiOutlineBan className="w-4 h-4" /> : <HiOutlineCheck className="w-4 h-4" />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CommentsManager = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getPendingComments().then((res) => {
      setComments(res.data.content || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const approveComment = async (id) => {
    try {
      await adminAPI.approveComment(id);
      setComments(comments.filter((c) => c.id !== id));
      toast.success('Comment approved');
    } catch {
      toast.error('Failed to approve');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Pending Comments</h3>
      {comments.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-slate-400">No pending comments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="glass-card rounded-xl p-5 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-white">{comment.author?.username}</span>
                  <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-300">{comment.content}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => approveComment(comment.id)}
                  className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                >
                  <HiOutlineCheck className="w-5 h-5" />
                </button>
                <button
                  onClick={async () => {
                    try {
                      await adminAPI.deleteComment(comment.id);
                      setComments(comments.filter((c) => c.id !== comment.id));
                      toast.success('Comment deleted');
                    } catch {
                      toast.error('Failed');
                    }
                  }}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
