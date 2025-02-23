import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-mono flex items-center justify-center">
      <div className="text-center">
        <p>Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 