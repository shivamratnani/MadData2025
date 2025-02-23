import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, MessageCircle, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import dayjs from 'dayjs';

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
  const { user } = useAuth();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDreams, setExpandedDreams] = useState({});

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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold dark:text-gray-100">My Dreams</h1>
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
                    {dayjs(dream.timestamp).format('MMMM D, YYYY')}
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
                    Themes & Symbols
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dream.themes_symbols?.map((theme, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-dark-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                      >
                        {theme}
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
                      Hide Analysis
                    </>
                  ) : (
                    <>
                      <ChevronDown className={`w-4 h-4 mr-1 transform transition-transform duration-444`} />
                      Show Analysis
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
                    Analysis
                  </div>
                  <div className="prose dark:prose-dark max-w-none">
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