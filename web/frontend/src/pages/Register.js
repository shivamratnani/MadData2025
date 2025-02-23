import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleIcon from '../components/GoogleIcon';

const Register = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signUp(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      // The redirect will happen automatically
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-mono flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p>Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 disabled:opacity-50"
            disabled={loading}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register; 