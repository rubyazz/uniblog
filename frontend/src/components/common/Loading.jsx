import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-indigo-500/30 rounded-full" />
        <div className="w-12 h-12 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin absolute top-0 left-0" />
      </div>
    </div>
  );
};

export default Loading;
