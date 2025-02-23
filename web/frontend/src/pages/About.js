import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, ArrowLeft, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/icon.png';

const About = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', !isDarkMode);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Add keyboard event listener for sidebar
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(!isSidebarOpen);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 font-mono">
      {/* Top Bar Buttons */}
      <div className="fixed top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full text-gray-600 dark:text-gray-300"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        {user ? (
          <>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              Sign Out
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            Login
          </button>
        )}
      </div>

      {/* Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 p-2 z-20 text-gray-600 dark:text-gray-200"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-20 z-30' : 'opacity-0 -z-10'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <nav 
        className={`fixed left-0 top-0 w-64 h-full bg-white dark:bg-dark-800 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-2 right-2 px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded"
        >
          esc
        </button>

        {/* Logo and App Name */}
        <div className="flex items-center justify-center mt-6">
          <img src={logo} alt="Dreams Logo" className="w-12 h-12" />
          <span className="ml-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
            dreams
          </span>
        </div>

        <div className="mt-8 space-y-2 p-4">
          <Link 
            to="/" 
            className="block py-2 hover:bg-gray-50 dark:hover:bg-dark-700 rounded px-3 text-gray-600 dark:text-gray-300"
          >
            home
          </Link>
          <Link 
            to="/my-dreams" 
            className="block py-2 hover:bg-gray-50 dark:hover:bg-dark-700 rounded px-3 text-gray-600 dark:text-gray-300"
          >
            my dreams
          </Link>
          <Link 
            to="/about"
            className="block py-2 bg-gray-50 dark:bg-dark-700 rounded px-3 text-gray-600 dark:text-gray-300"
          >
            about
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-8 pt-24">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold dark:text-gray-100">about</h1>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-8 space-y-6">
          <section className="space-y-4">
            <h2 className="text-lg dark:text-gray-100">what is this?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              this is an ai-powered dream journal that helps you track, analyze, and understand your dreams. record your nighttime experiences and let our ai uncover patterns, symbols, and deeper meanings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg dark:text-gray-100">features</h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p>→ daily dream recording</p>
              <p>→ automatic theme detection and tagging</p>
              <p>→ ai-powered dream analysis</p>
              <p>→ pattern recognition across entries</p>
              <p>→ calendar view for tracking dream frequency</p>
              <p>→ searchable dream archive</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg dark:text-gray-100">how it works</h2>
            <p className="text-gray-600 dark:text-gray-300">
              our ai analyzes your dream descriptions to identify recurring themes, symbols, and emotional patterns. it draws from psychological research and dream interpretation frameworks to provide insights into your subconscious mind.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg dark:text-gray-100">privacy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              your dreams are personal. all entries are encrypted and visible only to you. ai analysis happens locally on your device. we never share your data with third parties.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <div className="border-t border-gray-100 dark:border-dark-700 pt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                version 1.0.0 <br /> made by Shivam Ratnani, Tarak Sristy, and Shrivats Sriram
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About; 