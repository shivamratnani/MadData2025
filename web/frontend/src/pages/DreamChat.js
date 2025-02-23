import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

const DreamChat = () => {
  const { dreamId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Dummy data for the dream
  const dreamData = {
    text: 'I dreamt I was flying above a burning home',
    date: '2025-01-20',
    tags: ['fire', 'home', 'fear', 'flying'],
    analysis: 'This dream suggests themes of escape and transformation. The burning home could represent a desire to leave behind old patterns or situations, while flying indicates a sense of freedom and transcendence. The presence of fire may symbolize both destruction and purification.',
    messages: [
      {
        role: 'assistant',
        content: 'I notice this dream has strong elements of both freedom (flying) and danger (burning home). Would you like to explore what these contrasting elements might mean for you?'
      }
    ]
  };

  const [messages, setMessages] = useState(dreamData.messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

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
          model: 'anthropic/claude-3-sonnet',
          messages: [
            {
              role: 'system',
              content: `You are a dream analysis assistant. Help interpret dreams with psychological insight and empathy. The current dream being discussed is: "${dreamData.text}". The identified themes are: ${dreamData.tags.join(', ')}. Initial analysis: ${dreamData.analysis}`
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content
        }]);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}. Please try again.`
      }]);
    } finally {
      setLoading(false);
    }
  };

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
            <p className="text-sm">{dreamData.analysis}</p>
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
                {msg.content}
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
