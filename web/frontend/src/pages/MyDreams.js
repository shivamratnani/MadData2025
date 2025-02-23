import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, MessageCircle, ArrowLeft, Menu, User, Moon, Sun } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import dayjs from 'dayjs';
import logo from '../assets/icon.png';

const markdownStyles = {
  p: 'mb-4 last:mb-0',
  strong: 'font-bold',
  em: 'italic',
  ul: 'list-disc ml-4 mb-4',
  ol: 'list-decimal ml-4 mb-4',
  li: 'mb-2',
  blockquote: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4'
};

const MyDreams = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDreams, setExpandedDreams] = useState({});
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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('Dreams')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false });

        if (error) throw error;

        setDreams(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dreams:', error);
        setLoading(false);
      }
    };

    fetchDreams();
  }, [user, navigate]);

  const toggleDreamExpansion = (dreamId) => {
    setExpandedDreams(prev => ({
      ...prev,
      [dreamId]: !prev[dreamId]
    }));
  };

  const handleChatClick = (dreamId) => {
    navigate(`/chat/${dreamId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">Loading dreams...</div>
        </div>
      </div>
    );
  }

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

        {/* Add Logo and App Name */}
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
            className="block py-2 bg-gray-50 dark:bg-dark-700 rounded px-3 text-gray-600 dark:text-gray-300"
          >
            my dreams
          </Link>
          <Link 
            to="/about"
            className="block py-2 hover:bg-gray-50 dark:hover:bg-dark-700 rounded px-3 text-gray-600 dark:text-gray-300"
          >
            about
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-24">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold dark:text-gray-100">my dreams</h1>
        </div>

        {/* Dreams List */}
        <div className="space-y-6">
          {dreams.map((dream) => (
            <div 
              key={dream.dream_id}
              className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden"
            >
              {/* Dream Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {dayjs(dream.timestamp).format('MMMM D, YYYY').toLowerCase()}
                  </div>
                  <button 
                    onClick={() => handleChatClick(dream.dream_id)}
                    className="text-sm border border-blue-500 rounded px-3 py-1 inline-flex items-center text-blue-500"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </button>
                </div>
                
                <p className="text-gray-900 dark:text-gray-100 mb-4">
                  {dream.dream_text}
                </p>

                {/* Themes & Symbols */}
                <div className="mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    themes & symbols
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dream.themes_symbols?.map((theme, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-dark-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                      >
                        {theme.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleDreamExpansion(dream.dream_id)}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-600 transition-colors duration-444"
                >
                  {expandedDreams[dream.dream_id] ? (
                    <>
                      <ChevronUp className={`w-4 h-4 mr-1 transform transition-transform duration-444`} />
                      hide analysis
                    </>
                  ) : (
                    <>
                      <ChevronDown className={`w-4 h-4 mr-1 transform transition-transform duration-444`} />
                      show analysis
                    </>
                  )}
                </button>
              </div>

              {/* Expandable Analysis Section */}
              <div 
                className={`
                  overflow-hidden transition-all duration-444 ease-in-out
                  ${expandedDreams[dream.dream_id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className={`
                  px-6 pb-6
                  ${expandedDreams[dream.dream_id] ? 'pt-4' : 'pt-0'}
                `}>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    analysis
                  </div>
                  <div className="prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-300">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className={`text-sm text-gray-600 dark:text-gray-300 ${markdownStyles.p}`} {...props} />,
                        strong: ({node, ...props}) => <strong className={`text-gray-800 dark:text-gray-100 ${markdownStyles.strong}`} {...props} />,
                        em: ({node, ...props}) => <em className={`text-gray-700 dark:text-gray-200 ${markdownStyles.em}`} {...props} />,
                        ul: ({node, ...props}) => <ul className={`text-gray-600 dark:text-gray-300 ${markdownStyles.ul}`} {...props} />,
                        ol: ({node, ...props}) => <ol className={`text-gray-600 dark:text-gray-300 ${markdownStyles.ol}`} {...props} />,
                        li: ({node, ...props}) => <li className={`text-gray-600 dark:text-gray-300 ${markdownStyles.li}`} {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className={`text-gray-600 dark:text-gray-300 ${markdownStyles.blockquote}`} {...props} />
                      }}
                    >
                      {dream.interpretation}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {dreams.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No dreams recorded yet. Start by adding your first dream!
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDreams; 