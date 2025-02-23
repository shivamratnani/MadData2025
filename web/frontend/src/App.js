import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DreamJournal from './components/DreamJournal';
import DreamChat from './pages/DreamChat';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './components/AuthCallback';
import MyDreams from './pages/MyDreams';
import './App.css';

function App() {
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
