import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, ChevronRight, User, MessageCircle, Moon, Sun } from 'lucide-react';
import { submitDream, fetchDreams } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';
import logo from '../assets/icon.png';

const Calendar = ({ dreams }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [currentTime, setCurrentTime] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  // Add a function to check if a date has a dream entry
  const hasDreamEntry = (year, month, day) => {
    return dreams.some(dream => {
      const dreamDate = new Date(dream.timestamp);
      return dreamDate.getFullYear() === year &&
             dreamDate.getMonth() === month &&
             dreamDate.getDate() === day;
    });
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="w-48 p-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg">
        <div className="flex justify-between items-center mb-2 text-sm dark:text-gray-300">
          <button onClick={() => {
            const newMonth = new Date(currentMonth);
            newMonth.setMonth(newMonth.getMonth() - 1);
            setCurrentMonth(newMonth);
          }}>←</button>
          <span className="font-mono text-xs">
            {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toLowerCase()}
          </span>
          <button onClick={() => {
            const newMonth = new Date(currentMonth);
            newMonth.setMonth(newMonth.getMonth() + 1);
            setCurrentMonth(newMonth);
          }}>→</button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(currentMonth).map((day, i) => (
            <div
              key={i}
              className={`
                aspect-square flex items-center justify-center text-xs
                ${day === null ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'}
                ${day === today.getDate() && 
                  currentMonth.getMonth() === today.getMonth() &&
                  currentMonth.getFullYear() === today.getFullYear() 
                  ? 'border-2 border-blue-500' : ''}
                ${day !== null && hasDreamEntry(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                ) ? 'bg-gray-100 dark:bg-gray-700' : ''}
                dark:text-gray-300
                rounded
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {timezone.replace('_', ' ')}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-mono">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

// First, let's add some custom styles for the markdown content
const markdownStyles = {
  p: 'mb-4 last:mb-0',  // Add margin between paragraphs
  strong: 'font-bold',   // Style bold text
  em: 'italic',         // Style italic text
  ul: 'list-disc ml-4 mb-4', // Style unordered lists
  ol: 'list-decimal ml-4 mb-4', // Style ordered lists
  li: 'mb-2',           // Style list items
  blockquote: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4' // Style quotes
};

const DreamJournal = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [dreams, setDreams] = useState([]);
  const [newDream, setNewDream] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedTheme, setExpandedTheme] = useState(null);
  const [showThemeContent, setShowThemeContent] = useState(false);

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

  useEffect(() => {
    const getDreams = async () => {
      try {
        const data = await fetchDreams();
        if (Array.isArray(data) && data.length > 0) {
          setDreams(data);  // Set dreams with dynamic data from Supabase
        } else {
          console.log("No dreams found or data is empty");
        }
      } catch (error) {
        console.error("Error fetching dreams:", error);
      }
    };

    getDreams();
  }, []);

  const sortedDreams = [...dreams].sort((a, b) => {
    return sortOrder === "newest"
      ? dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()
      : dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf();
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDream.trim()) return;

    try {
      const response = await submitDream(newDream);
      const dream = {
        dream_id: response.data.dream_id,
        dream_text: response.data.dream_text,
        themes_symbols: response.data.themes,
        interpretation: response.data.analysis,
        timestamp: response.data.created_at,
        showAnalysis: false
      };

      setDreams([dream, ...dreams]);
      setNewDream('');
    } catch (error) {
      console.error('Error submitting dream:', error);
      // You might want to show an error message to the user here
    }
  };

  const toggleAnalysis = (dreamId) => {
    setDreams(dreams.map(dream =>
      dream.dream_id === dreamId
        ? { ...dream, showAnalysis: !dream.showAnalysis }
        : dream
    ));
  };

  // Add keyboard event listener
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

  const handleChatClick = (dreamId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    console.log('Navigating to chat with dream ID:', dreamId);
    navigate(`/chat/${dreamId}`);
  };

  // Add new function to get theme counts and associated dreams
  const getThemeCounts = () => {
    const themeCounts = {};
    const themeDreams = {};
    
    dreams.forEach(dream => {
      dream.themes_symbols.forEach(theme => {
        const normalizedTheme = theme.toLowerCase();
        themeCounts[normalizedTheme] = (themeCounts[normalizedTheme] || 0) + 1;
        themeDreams[normalizedTheme] = themeDreams[normalizedTheme] || [];
        themeDreams[normalizedTheme].push(dream);
      });
    });

    return { themeCounts, themeDreams };
  };

  // Modify the theme click handler to handle animations
  const handleThemeClick = (theme) => {
    if (expandedTheme === theme) {
      setShowThemeContent(false);
      setTimeout(() => {
        setExpandedTheme(null);
      }, 444); // Match the transition duration
    } else {
      setExpandedTheme(theme);
      setTimeout(() => {
        setShowThemeContent(true);
      }, 50); // Small delay to ensure DOM update
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 font-mono">
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

      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 p-2 z-20 text-gray-600 dark:text-gray-200"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-20 z-30' : 'opacity-0 -z-10'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
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

        <div className="flex items-center justify-center mt-6">
          <img src={logo} alt="Dreams Logo" className="w-12 h-12 rounded-lg overflow-hidden" />
          <span className="ml-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
            dreams
          </span>
        </div>

        <div className="mt-8 space-y-2 p-4">
          <Link 
            to="/" 
            className="block py-2 bg-gray-200 dark:bg-dark-600 rounded px-3 text-gray-800 dark:text-gray-200"
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
            to="/graph" 
            className="block py-2 hover:bg-gray-50 dark:hover:bg-dark-700 rounded px-3 text-gray-600 dark:text-gray-300"
          >
            <div className="flex items-center">
              graph view
            </div>
          </Link>
          <Link 
            to="/about"
            className="block py-2 hover:bg-gray-50 dark:hover:bg-dark-700 rounded px-3 text-gray-600 dark:text-gray-300"
          >
            about
          </Link>
        </div>
      </nav>

      <div className="flex justify-center gap-8 p-8 pt-16">
        {/* Calendar Section */}
        <div className="space-y-2">
          <Calendar dreams={sortedDreams} />
        </div>

        {/* Dreams Section */}
        <div className="w-[600px]">
          <div className="mb-8">
            <textarea
              value={newDream}
              onChange={(e) => setNewDream(e.target.value)}
              placeholder="new dream..."
              className="w-full h-32 p-4 border border-gray-200 dark:border-dark-700 rounded-lg resize-none mb-2 font-mono bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-mono hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              submit
            </button>
          </div>

          <div className="space-y-6">
            {sortedDreams.map((dream) => (
              <div key={dream.dream_id} className="bg-white dark:bg-dark-800 p-6 rounded-lg border border-gray-200 dark:border-dark-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {dayjs(dream.timestamp).format('MMMM D, YYYY').toLowerCase()}
                </div>
                <p className="mb-4 text-gray-900 dark:text-gray-100">{dream.dream_text}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {dream.themes_symbols.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {tag.toLowerCase()}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleAnalysis(dream.dream_id)}
                    className="text-sm border border-blue-500 rounded px-3 py-1 inline-flex items-center text-blue-500"
                  >
                    <ChevronRight className={`w-4 h-4 mr-1 transform transition-transform duration-444 ${dream.showAnalysis ? 'rotate-90' : ''}`} />
                    ai analysis
                  </button>
                  <button 
                    onClick={() => handleChatClick(dream.dream_id)}
                    className="text-sm border border-blue-500 rounded px-3 py-1 inline-flex items-center text-blue-500"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    chat
                  </button>
                </div>
                <div 
                  className={`
                    overflow-hidden transition-all duration-444 ease-in-out
                    ${dream.showAnalysis ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="pl-4 text-sm text-gray-600 dark:text-gray-300">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className={markdownStyles.p} {...props} />,
                        strong: ({node, ...props}) => <strong className={markdownStyles.strong} {...props} />,
                        em: ({node, ...props}) => <em className={markdownStyles.em} {...props} />,
                        ul: ({node, ...props}) => <ul className={markdownStyles.ul} {...props} />,
                        ol: ({node, ...props}) => <ol className={markdownStyles.ol} {...props} />,
                        li: ({node, ...props}) => <li className={markdownStyles.li} {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className={markdownStyles.blockquote} {...props} />
                      }}
                    >
                      {dream.interpretation}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="w-48">
          <div 
            className="relative bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-2"
          >
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between text-sm px-2 py-1 text-gray-600 dark:text-gray-200"
            >
              sort & filter
              <ChevronDown className="w-4 h-4" />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-lg py-1">
                <button 
                  onClick={() => setSortOrder("newest")}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-dark-700 text-sm text-gray-600 dark:text-gray-200 ${
                    sortOrder === "newest" ? "bg-gray-50 dark:bg-dark-700" : ""
                  }`}
                >
                  latest first
                </button>
                <button 
                  onClick={() => setSortOrder("oldest")}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-dark-700 text-sm text-gray-600 dark:text-gray-200 ${
                    sortOrder === "oldest" ? "bg-gray-50 dark:bg-dark-700" : ""
                  }`}
                >
                  oldest first
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* After the filter section div, add: */}
      <div className="w-full max-w-4xl mx-auto mt-12 p-6 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
        <h2 className="text-lg text-gray-900 dark:text-gray-100 mb-4">themes & symbols</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(getThemeCounts().themeCounts).map(([theme, count]) => (
            <button
              key={theme}
              onClick={() => handleThemeClick(theme)}
              className={`
                px-3 py-1 rounded-full text-sm flex items-center gap-2
                ${expandedTheme === theme 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors
              `}
            >
              <span>{theme}</span>
              <span className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full text-xs">
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Expanded theme details */}
        {expandedTheme && (
          <div 
            className={`
              mt-4 space-y-4 overflow-hidden transition-all duration-444 ease-in-out
              ${showThemeContent ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            {getThemeCounts().themeDreams[expandedTheme].map(dream => (
              <div 
                key={dream.dream_id} 
                className={`
                  p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600
                  transform transition-all duration-444 ease-in-out
                  ${showThemeContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
              >
                {/* Date */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {dayjs(dream.timestamp).format('MMMM D, YYYY').toLowerCase()}
                </div>

                {/* Dream Text */}
                <div className="text-gray-900 dark:text-gray-100 mb-4">
                  {dream.dream_text.length > 200 
                    ? `${dream.dream_text.substring(0, 200)}...` 
                    : dream.dream_text}
                </div>

                {/* Related Themes */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    themes & symbols
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dream.themes_symbols.map((theme, index) => (
                      <span
                        key={index}
                        className={`
                          px-3 py-1 rounded-full text-sm transition-colors duration-444
                          ${theme.toLowerCase() === expandedTheme
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                        `}
                      >
                        {theme.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Analysis */}
                <div className="transform transition-all duration-444 ease-in-out">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    analysis
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 pl-3 border-l-2 border-gray-200 dark:border-gray-600">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className={markdownStyles.p} {...props} />,
                        strong: ({node, ...props}) => <strong className={markdownStyles.strong} {...props} />,
                        em: ({node, ...props}) => <em className={markdownStyles.em} {...props} />,
                        ul: ({node, ...props}) => <ul className={markdownStyles.ul} {...props} />,
                        ol: ({node, ...props}) => <ol className={markdownStyles.ol} {...props} />,
                        li: ({node, ...props}) => <li className={markdownStyles.li} {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className={markdownStyles.blockquote} {...props} />
                      }}
                    >
                      {dream.interpretation}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => handleChatClick(dream.dream_id)}
                    className="text-sm border border-blue-500 rounded px-3 py-1 inline-flex items-center text-blue-500 transition-colors duration-444"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    chat about this dream
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamJournal;