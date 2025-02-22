import React, { useState } from 'react';
import { Menu, ChevronDown, ChevronLeft } from 'lucide-react';
import { submitDream } from '../api';

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
  const [dreams, setDreams] = useState([
    {
      id: 1,
      date: '2025-01-20',
      text: 'I dreamt I was flying above a burning home',
      tags: ['fire', 'home', 'fear', 'flying'],
      aiAnalysis: 'This dream suggests themes of escape and transformation...',
      showAnalysis: false
    }
  ]);
  const [newDream, setNewDream] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      dream.id === dreamId 
        ? {...dream, showAnalysis: !dream.showAnalysis}
        : dream
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 p-2 z-20"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
          <nav className="fixed left-0 top-0 w-64 h-full bg-white z-40 p-4 shadow-lg">
            <div className="mt-8 space-y-2">
              <a href="#dreams" className="block py-2 hover:bg-gray-50 rounded px-3">my dreams</a>
              <a href="#themes" className="block py-2 hover:bg-gray-50 rounded px-3">themes & symbols</a>
              <a href="#about" className="block py-2 hover:bg-gray-50 rounded px-3">about</a>
              <a href="#account" className="block py-2 hover:bg-gray-50 rounded px-3">account</a>
            </div>
          </nav>
        </>
      )}

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
              <div key={dream.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-2">{dream.date}</div>
                <p className="mb-4">{dream.text}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {dream.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => toggleAnalysis(dream.id)}
                  className="text-sm border border-blue-500 rounded px-3 py-1 inline-flex items-center text-blue-500"
                >
                  <ChevronLeft className={`w-4 h-4 mr-1 transform transition-transform ${dream.showAnalysis ? 'rotate-90' : ''}`} />
                  ai analysis
                </button>
                {dream.showAnalysis && (
                  <div className="mt-4 pl-4 text-sm text-gray-600">
                    {dream.aiAnalysis}
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
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Latest first</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Oldest first</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Has analysis</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamJournal;