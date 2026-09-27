import React from 'react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`flex justify-center items-center p-8 ${className}`}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#FBBF24] rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
