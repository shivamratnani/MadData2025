import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Search, Settings, Menu, Sun, Moon } from 'lucide-react';
import * as d3 from 'd3';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/icon.png';
import stringSimilarity from 'string-similarity';

const DreamGraphView = ({ dreamDict, userDreams = [] }) => {
  const location = useLocation();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState({
    showTags: true,
    showOrphans: true,
    nodeSize: 2,
    linkThickness: 1,
    textFade: 2.2,
    showArrows: true,
    showDatasetDreams: true,
    showUserDreams: true,
    nodeDistance: 100,
    labelVisibilityThreshold: 2.2,
    showSimilarSymbols: true,
    similarityThreshold: 0.6
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Add keyboard event listener for escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    if (!dreamDict) {
      console.log('No dream dictionary data');
      return;
    }

    console.log('Processing dream dictionary:', dreamDict);

    const nodes = [];
    const links = [];
    const processedSymbols = new Set();
    const referenceCount = {};

    // First pass: Count references and create nodes
    Object.entries(dreamDict).forEach(([symbol, interpretation]) => {
      referenceCount[symbol] = referenceCount[symbol] || 0;

      const symbolPattern = /\b([A-Za-z\s]+)\s+dreams?\b/gi;
      const matches = interpretation.match(symbolPattern) || [];
      
      matches.forEach(match => {
        const referencedSymbol = match.replace(/\s+dreams?\b/i, '').trim().toLowerCase();
        if (dreamDict[referencedSymbol]) {
          referenceCount[referencedSymbol] = (referenceCount[referencedSymbol] || 0) + 1;
        }
      });
    });

    // Create nodes for dataset dreams
    if (settings.showDatasetDreams) {
      Object.entries(dreamDict).forEach(([symbol, interpretation]) => {
        nodes.push({
          id: symbol,
          name: symbol,
          val: Math.max(3, (referenceCount[symbol] || 0) * 2),
          color: '#1E88E5', // Blue for dataset dreams
          desc: interpretation,
          type: 'dataset'
        });
        processedSymbols.add(symbol);

        const symbolPattern = /\b([A-Za-z\s]+)\s+dreams?\b/gi;
        const matches = interpretation.match(symbolPattern) || [];
        
        matches.forEach(match => {
          const referencedSymbol = match.replace(/\s+dreams?\b/i, '').trim().toLowerCase();
          if (dreamDict[referencedSymbol] && referencedSymbol !== symbol) {
            links.push({
              source: symbol,
              target: referencedSymbol,
              value: 1
            });
          }
        });
      });

      if (settings.showSimilarSymbols) {
        const symbols = Object.keys(dreamDict);
        symbols.forEach((symbolA, i) => {
          symbols.slice(i + 1).forEach(symbolB => {
            const similarity = stringSimilarity.compareTwoStrings(symbolA, symbolB);
            if (similarity > settings.similarityThreshold) {
              links.push({
                source: symbolA,
                target: symbolB,
                value: similarity,
                type: 'similarity'
              });
            }
          });
        });
      }
    }

    // Add user dreams if enabled
    if (settings.showUserDreams && userDreams.length > 0) {
      userDreams.forEach(dream => {
        nodes.push({
          id: `user_${dream.id}`,
          name: dream.title || 'Untitled Dream',
          val: 4,
          color: '#E53935', // Red for user dreams
          desc: dream.content,
          type: 'user'
        });

        // Create links based on dream content analysis
        // This is a simplified version - you might want to implement more sophisticated matching
        Object.keys(dreamDict).forEach(symbol => {
          const similarity = stringSimilarity.compareTwoStrings(
            dream.content.toLowerCase(), 
            symbol.toLowerCase()
          );
          if (similarity > settings.similarityThreshold) {
            links.push({
              source: `user_${dream.id}`,
              target: symbol,
              value: similarity,
              type: 'similarity'
            });
          }
        });
      });
    }

    console.log('Created graph data:', { nodes, links });
    setGraphData({ nodes, links });
  }, [dreamDict, userDreams, settings.showDatasetDreams, settings.showUserDreams, settings.showSimilarSymbols, settings.similarityThreshold]);

  // Filter nodes based on search term
  const filteredData = {
    nodes: graphData.nodes.filter(node => 
      searchTerm === '' || 
      node.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    links: graphData.links.filter(link => {
      if (searchTerm === '') return true;
      const sourceNode = graphData.nodes.find(n => n.id === link.source);
      const targetNode = graphData.nodes.find(n => n.id === link.target);
      return sourceNode?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             targetNode?.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
  };

  return (
    <div className="relative h-screen w-full bg-gray-100 dark:bg-black">
      {/* App Drawer */}
      <div className={`fixed inset-0 bg-black transition-opacity duration-300 ${isDrawerOpen ? 'opacity-20 z-30' : 'opacity-0 -z-10'}`} 
           onClick={() => setIsDrawerOpen(false)} />

      <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out shadow-lg z-40`}>
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="absolute top-2 right-2 px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
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
            className={`block py-2 rounded px-3 ${
              location.pathname === '/' 
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            home
          </Link>
          <Link 
            to="/my-dreams" 
            className={`block py-2 rounded px-3 ${
              location.pathname === '/my-dreams' 
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            my dreams
          </Link>
          <Link 
            to="/graph" 
            className={`block py-2 rounded px-3 ${
              location.pathname === '/graph' 
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              graph view
            </div>
          </Link>
          <Link 
            to="/about"
            className={`block py-2 rounded px-3 ${
              location.pathname === '/about' 
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            about
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Menu className="w-5 h-5 dark:text-white" />
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Settings className="w-5 h-5 dark:text-white" />
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 dark:text-white" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow">
          <Search className="w-5 h-5 ml-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search symbols..."
            className="p-2 bg-transparent border-none focus:ring-0 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 left-4 z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="font-medium mb-4 dark:text-white">Graph Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm dark:text-gray-300">Show Dataset Dreams</label>
              <input
                type="checkbox"
                checked={settings.showDatasetDreams}
                onChange={(e) => setSettings({...settings, showDatasetDreams: e.target.checked})}
                className="rounded text-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm dark:text-gray-300">Show User Dreams</label>
              <input
                type="checkbox"
                checked={settings.showUserDreams}
                onChange={(e) => setSettings({...settings, showUserDreams: e.target.checked})}
                className="rounded text-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm dark:text-gray-300">Show Similar Symbols</label>
              <input
                type="checkbox"
                checked={settings.showSimilarSymbols}
                onChange={(e) => setSettings({...settings, showSimilarSymbols: e.target.checked})}
                className="rounded text-blue-500"
              />
            </div>
            {/* Existing settings */}
            <div className="flex items-center justify-between">
              <label className="text-sm dark:text-gray-300">Node Size</label>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.nodeSize}
                onChange={(e) => setSettings({...settings, nodeSize: Number(e.target.value)})}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm dark:text-gray-300">Link Thickness</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={settings.linkThickness}
                onChange={(e) => setSettings({...settings, linkThickness: Number(e.target.value)})}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm dark:text-gray-300">Show Arrows</label>
              <input
                type="checkbox"
                checked={settings.showArrows}
                onChange={(e) => setSettings({...settings, showArrows: e.target.checked})}
                className="rounded text-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm dark:text-gray-300">Node Distance</label>
              <input
                type="range"
                min="50"
                max="300"
                value={settings.nodeDistance}
                onChange={(e) => setSettings({...settings, nodeDistance: Number(e.target.value)})}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm dark:text-gray-300">Label Visibility</label>
              <input
                type="range"
                min="0.5"
                //max="3"
                step="0.1"
                value={settings.labelVisibilityThreshold}
                onChange={(e) => setSettings({...settings, labelVisibilityThreshold: Number(e.target.value)})}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm dark:text-gray-300">Similarity Threshold</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.similarityThreshold}
                onChange={(e) => setSettings({...settings, similarityThreshold: Number(e.target.value)})}
                className="w-32"
              />
            </div>
          </div>
        </div>
      )}

      <ForceGraph2D
        graphData={filteredData}
        nodeLabel={node => `${node.name}\n\n${node.desc}`}
        nodeColor={node => node.color}
        nodeVal={node => (node.val || 1) * settings.nodeSize * 0.5}
        linkWidth={settings.linkThickness}
        linkDirectionalArrowLength={settings.showArrows ? 3 : 0}
        backgroundColor={isDarkMode ? '#000000' : '#f3f4f6'}
        linkColor={isDarkMode ? '#4B5563' : '#9CA3AF'}
        nodeCanvasObject={(node, ctx, globalScale) => {
          // Draw circle
          const size = Math.max(1, (node.val || 1) * settings.nodeSize * 0.5 / globalScale);
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
          ctx.fillStyle = node.color;
          ctx.fill();
          
          // Only draw label if we're zoomed in enough
          if (globalScale > settings.labelVisibilityThreshold) {
            const label = node.name;
            const fontSize = Math.max(2, 10/globalScale);
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, node.x, node.y + size + fontSize);
          }
        }}
        d3Force={{
          link: d3.forceLink()
            .id(d => d.id)
            .distance(settings.nodeDistance),
          charge: -100,
          center: d3.forceCenter(),
          collide: d3.forceCollide().radius(d => (d.val || 1) * settings.nodeSize * 1.5)
        }}
        cooldownTicks={100}
        onEngineStop={() => {
          console.log('Graph stabilized');
        }}
        minZoom={0.01}
        maxZoom={10}
      />
    </div>
  );
};

export default DreamGraphView; 