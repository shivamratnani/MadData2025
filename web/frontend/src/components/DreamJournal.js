import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, ChevronRight, User, MessageCircle } from 'lucide-react';
import { submitDream, fetchDreams } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

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

  return (
    <div className="w-48 p-2 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-2 text-sm">
        <button onClick={() => {
          const newMonth = new Date(currentMonth);
          newMonth.setMonth(newMonth.getMonth() - 1);
          setCurrentMonth(newMonth);
        }}>←</button>
        <span className="font-mono text-xs">
          {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
              ${day === null ? '' : 'hover:bg-gray-100 cursor-pointer'}
              ${day === today.getDate() && 
                currentMonth.getMonth() === today.getMonth() &&
                currentMonth.getFullYear() === today.getFullYear() 
                ? 'bg-gray-100' : ''}
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

const DreamJournal = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [dreams, setDreams] = useState([]);
  const [newDream, setNewDream] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);


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
        id: dreams.length + 1,
        date: new Date().toISOString().split('T')[0],
        text: newDream,
        tags: response.themes || ['analyzing...'],
        aiAnalysis: response.analysis || 'Analyzing...',
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

  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      <div className="fixed top-4 right-4 z-20 flex items-center gap-2">
        {user ? (
          <>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Sign Out
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <User className="w-6 h-6" />
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Login
          </button>
        )}
      </div>

      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 p-2 z-20"
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
        className={`fixed left-0 top-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-2 right-2 px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded"
        >
          esc
        </button>

        <div className="mt-8 space-y-2 p-4">
          <a href="#dreams" className="block py-2 hover:bg-gray-50 rounded px-3">my dreams</a>
          <a href="#chat" className="block py-2 hover:bg-gray-50 rounded px-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            chat
          </a>
          <a href="#themes" className="block py-2 hover:bg-gray-50 rounded px-3">themes & symbols</a>
          <a href="#about" className="block py-2 hover:bg-gray-50 rounded px-3">about</a>
          <a href="#account" className="block py-2 hover:bg-gray-50 rounded px-3">account</a>
        </div>
      </nav>

      <div className="flex justify-center gap-8 p-8 pt-16">
        {/* Calendar Section */}
        <div>
          <Calendar />
        </div>

        {/* Dreams Section */}
        <div className="w-[600px]">
          <div className="mb-8">
            <textarea
              value={newDream}
              onChange={(e) => setNewDream(e.target.value)}
              placeholder="new dream..."
              className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none mb-2 font-mono"
            />
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-black text-white rounded font-mono hover:bg-gray-800"
            >
              submit
            </button>
          </div>

          <div className="space-y-6">
            {dreams.map((dream) => (
              <div key={dream.dream_id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-2">{dayjs(dream.timestamp).format('YYYY-MM-DD')}</div>
                <p className="mb-4">{dream.dream_text}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {dream.themes_symbols.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                <button 
                  onClick={() => toggleAnalysis(dream.dream_id)}
                  className="text-sm border border-blue-500 rounded px-3 py-1 inline-flex items-center text-blue-500"
                >
                  <ChevronRight className={`w-4 h-4 mr-1 transform transition-transform ${dream.showAnalysis ? 'rotate-90' : ''}`} />
                  ai analysis
                </button>
                <button 
                    onClick={() => navigate(`/chat/${dream.dream_id}`)}
                    className="text-sm border border-blue-500 rounded px-3 py-1 inline-flex items-center text-blue-500"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    chat
                  </button>
                </div>
                {dream.showAnalysis && (
                  <div className="mt-4 pl-4 text-sm text-gray-600">
                    {dream.interpretation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="w-48">
          <div 
            className="relative bg-white rounded-lg border border-gray-200 p-2"
          >
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between text-sm px-2 py-1"
            >
              sort & filter
              <ChevronDown className="w-4 h-4" />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">latest first</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">oldest first</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamJournal;