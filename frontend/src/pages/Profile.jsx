import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineUser, HiOutlineCalendar } from 'react-icons/hi';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-3xl font-bold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-indigo-400 font-medium">@{user?.username}</p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <HiOutlineMail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <HiOutlineCalendar className="w-4 h-4" />
                  <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                </span>
              </div>

              {user?.roles && (
                <div className="flex gap-2 mt-4">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    >
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
