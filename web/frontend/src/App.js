import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DreamJournal from './components/DreamJournal';
import DreamChat from './pages/DreamChat';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './components/AuthCallback';
import MyDreams from './pages/MyDreams';
import About from './pages/About';
import DreamGraphView from './components/DreamGraphView';
import './App.css';

function App() {
  const [dreamDictionary, setDreamDictionary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userDreams, setUserDreams] = useState([]);

  useEffect(() => {
    const loadDreamDictionary = async () => {
      try {
        console.log('Fetching dream dictionary...');
        const response = await fetch('http://localhost:8000/api/dream-dictionary/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Loaded dream dictionary data:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Expected array of dream dictionary entries');
        }
        
        const dictionaryObj = {};
        data.forEach(entry => {
          if (entry && entry.symbol && entry.interpretation) {
            dictionaryObj[entry.symbol.toLowerCase()] = entry.interpretation;
          }
        });
        
        console.log('Processed dictionary object:', dictionaryObj);
        setDreamDictionary(dictionaryObj);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dream dictionary:', error);
        setIsLoading(false);
      }
    };

    loadDreamDictionary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<DreamJournal />} />
          <Route path="/chat/:dreamId" element={<DreamChat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/my-dreams" element={<MyDreams />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/graph" 
            element={
              <DreamGraphView 
                dreamDict={dreamDictionary}
                userDreams={userDreams}
              />
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
