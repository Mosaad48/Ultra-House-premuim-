import React from 'react';
import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-9xl font-black text-gray-100 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">404</h1>
      <h2 className="text-3xl font-black mb-6">Page not found</h2>
      <p className="text-gray-500 max-w-md mb-10 font-medium">
        The page you looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/10"
      >
        <MoveLeft size={16} />
        Back to storefront
      </Link>
    </div>
  );
};
