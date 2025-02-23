import React, {useState} from 'react';
import { Menu } from 'lucide-react';

const AboutPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

      <div className="max-w-2xl mx-auto p-8 pt-16">
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          <h1 className="text-2xl mb-8">about</h1>
          
          <section className="space-y-4">
            <h2 className="text-lg">what is this?</h2>
            <p className="text-gray-600">
              this is an ai-powered dream journal that helps you track, analyze, and understand your dreams. record your nighttime experiences and let our ai uncover patterns, symbols, and deeper meanings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg">features</h2>
            <div className="space-y-2 text-gray-600">
              <p>→ daily dream recording</p>
              <p>→ automatic theme detection and tagging</p>
              <p>→ ai-powered dream analysis</p>
              <p>→ pattern recognition across entries</p>
              <p>→ calendar view for tracking dream frequency</p>
              <p>→ searchable dream archive</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg">how it works</h2>
            <p className="text-gray-600">
              our ai analyzes your dream descriptions to identify recurring themes, symbols, and emotional patterns. it draws from psychological research and dream interpretation frameworks to provide insights into your subconscious mind.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg">privacy</h2>
            <p className="text-gray-600">
              your dreams are personal. all entries are encrypted and visible only to you. ai analysis happens locally on your device. we never share your data with third parties.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <div className="border-t border-gray-100 pt-8">
              <p className="text-sm text-gray-500">
                version 1.0.0 • made with care by dreamscape labs
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;