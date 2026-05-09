import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-[#334155]/50 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-bold gradient-text">UniBlog</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              The university blogging platform where students share ideas, knowledge,
              and experiences. Join our community of learners and contributors.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {['Home', 'Blog', 'About'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2">
              {['GitHub', 'Twitter', 'Discord'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[#334155]/50 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} UniBlog. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-2 sm:mt-0">
            Built with Spring Boot & React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
