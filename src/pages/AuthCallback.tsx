import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error during auth callback:', error.message);
        navigate('/login?error=auth_failed');
        return;
      }

      if (data?.session) {
        // Redirection logic based on your app's needs
        // For example, redirect to admin dashboard
        navigate('/admin');
      } else {
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
      <h2 className="text-xl font-bold text-gray-900">Completing sign in...</h2>
      <p className="text-gray-500">You will be redirected in just a moment.</p>
    </div>
  );
};
