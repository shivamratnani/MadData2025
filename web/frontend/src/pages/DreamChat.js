import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
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

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api';

const DreamChat = () => {
  const { dreamId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dreamData, setDreamData] = useState(null);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDreamData = async () => {
      try {
        if (!user) throw new Error('No authenticated user');

        // Fetch dream directly from Supabase
        const { data, error } = await supabase
          .from('Dreams')
          .select('*')
          .eq('dream_id', dreamId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Dream not found');

        console.log('Received dream data:', data);
        
        setDreamData({
          text: data.dream_text,
          date: new Date(data.timestamp).toISOString().split('T')[0],
          tags: data.themes_symbols || [],
          analysis: data.interpretation || 'No analysis available',
        });

        setMessages([{
          role: 'assistant',
          content: 'I\'ve analyzed your dream. What aspects would you like to explore further?'
        }]);
      } catch (error) {
        console.error('Error fetching dream:', error);
        alert(error.message);
        navigate('/');
      }
    };

    if (dreamId && user) {
      fetchDreamData();
    } else if (!user) {
      navigate('/login');
    }
  }, [dreamId, navigate, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !dreamData) return;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const apiKey = process.env.REACT_APP_OPENROUTER_KEY;
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'system',
              content: `You are a dream analysis assistant. Keep your responses focused and concise (2-3 paragraphs max). 
              Always relate your interpretations back to the specific elements of the user's dream: "${dreamData.text}". 
              The identified themes are: ${dreamData.tags.join(', ')}. 
              Initial analysis: ${dreamData.analysis}
              
              Guidelines:
              - Keep responses brief but insightful
              - Reference specific dream elements in your analysis
              - Focus on the user's questions about their dream
              - Avoid generic interpretations
              - Don't speculate beyond what's in the dream content`
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            userMessage
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Details:', errorData);
        
        // Handle specific error cases
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        } else if (errorData.error?.message) {
          throw new Error(errorData.error.message);
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content
        }]);
      } else if (data.error) {
        // Handle error response with custom message
        throw new Error(
          data.error.message || 
          'The AI assistant is temporarily unavailable. Please try again in a moment.'
        );
      } else {
        throw new Error('Unexpected response format from AI assistant');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMessage = error.message;
      
      // Provide user-friendly error messages
      if (errorMessage.includes('API key not found')) {
        errorMessage = 'Configuration error. Please contact support.';
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${errorMessage}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching dream data
  if (!dreamData) {
    return (
      <div className="min-h-screen bg-gray-50 font-mono flex items-center justify-center">
        <div className="animate-pulse">Loading dream data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="text-sm text-gray-500">{dreamData.date}</div>
              <div className="text-sm font-medium">{dreamData.text}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-24">
        {/* Tags */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Themes & Symbols</div>
          <div className="flex flex-wrap gap-2">
            {dreamData.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Analysis */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Analysis</div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p className={`text-sm ${markdownStyles.p}`} {...props} />,
                strong: ({node, ...props}) => <strong className={markdownStyles.strong} {...props} />,
                em: ({node, ...props}) => <em className={markdownStyles.em} {...props} />,
                ul: ({node, ...props}) => <ul className={markdownStyles.ul} {...props} />,
                ol: ({node, ...props}) => <ol className={markdownStyles.ol} {...props} />,
                li: ({node, ...props}) => <li className={markdownStyles.li} {...props} />,
                blockquote: ({node, ...props}) => <blockquote className={markdownStyles.blockquote} {...props} />
              }}
            >
              {dreamData.analysis}
            </ReactMarkdown>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-200'
                }`}
              >
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
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="animate-pulse">Thinking...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DreamChat; 
