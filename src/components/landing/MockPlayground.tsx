'use client';

import React, { useEffect, useState } from 'react';

export default function MockPlayground() {
  const [animate, setAnimate] = useState(false);
  const [activeNode, setActiveNode] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "What kind of WhatsApp flow would you like to create?", isUser: false },
  ]);
  
  // Animation sequence
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 600);
    
    // Add chat messages with delay
    const messageTimers = [
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: "I need a customer support flow for my e-commerce store.", 
          isUser: true 
        }]);
      }, 1200),
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: "Perfect! I'll create a flow with: welcome message, order status, returns and FAQs.", 
          isUser: false 
        }]);
      }, 2500),
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: "Can you add a live agent handoff option?", 
          isUser: true 
        }]);
      }, 4000),
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: "Absolutely! I've added a 'Connect with Agent' option to the flow.", 
          isUser: false 
        }]);
        setActiveNode(1);
      }, 5500),
    ];
    
    // Cycle through active nodes to simulate someone working
    const nodeInterval = setInterval(() => {
      setActiveNode(prev => (prev + 1) % 5);
      
      // Show tooltip briefly
      if (Math.random() > 0.6) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      }
    }, 3000);
    
    // Cycle between preview messages
    const previewInterval = setInterval(() => {
      setCurrentPreviewIndex(prev => (prev + 1) % 2);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      messageTimers.forEach(clearTimeout);
      clearInterval(nodeInterval);
      clearInterval(previewInterval);
    };
  }, []);

  // WhatsApp preview messages
  const whatsappMessages = [
    {
      text: "👋 Welcome to Our Store Support! How can I help you today?",
      options: ["📦 Check Order Status", "↩️ Return Item", "❓ FAQs", "👤 Speak to Agent"]
    },
    {
      text: "Please enter your order number to check its status:",
      input: true
    }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-700 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Browser-like header */}
      <div className="bg-gray-50 px-4 py-2 flex items-center border-b">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-sm text-center flex-grow font-medium">WhatsFlow Playground</div>
      </div>

      <div className="grid grid-cols-12 h-[400px] overflow-hidden">
        {/* Left Side - AI Chat */}
        <div className="col-span-3 border-r flex flex-col bg-white">
          <div className="bg-gray-50 p-3 border-b text-sm font-medium">AI Assistant</div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`text-sm p-2.5 rounded-lg max-w-[90%] shadow-sm transition-all transform animate-fade-in-up ${
                  msg.isUser 
                    ? 'bg-green-50 ml-auto text-gray-800' 
                    : 'bg-gray-50 border border-gray-100 text-gray-700'
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex bg-white">
            <input 
              type="text" 
              placeholder="Ask a question..."
              className="text-sm flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-emerald-500" 
            />
            <button className="bg-emerald-500 text-white text-sm px-3 rounded-r-md hover:bg-emerald-700 transition-colors">
              Send
            </button>
          </div>
        </div>

        {/* Middle - Flow Builder */}
        <div className="col-span-6 border-r relative bg-white">
          <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
            <span className="font-medium text-sm">Flow Editor</span>
            <div className="flex space-x-2">
              <button className="text-sm bg-gray-100 px-3 py-1 rounded font-medium hover:bg-gray-200 transition-colors">
                Zoom
              </button>
              <button className="text-sm bg-gray-100 px-3 py-1 rounded font-medium hover:bg-gray-200 transition-colors">
                Undo
              </button>
            </div>
          </div>
          
          <div className="bg-white h-full overflow-hidden p-4">
            {/* Flow layout - matching reference image exactly */}
            <div className="w-full h-full relative flex flex-col items-center">
              {/* Welcome Message Node */}
              <div 
                className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-[180px] py-3 px-4 rounded-lg border transition-all duration-300 ${
                  activeNode === 0 
                    ? 'border-blue-400 bg-blue-50 shadow-md scale-105' 
                    : 'border-blue-200 bg-blue-50/90'
                }`}
              >
                <div className="text-center font-medium text-sm">Welcome Message</div>
              </div>

              {/* Connecting line with animation */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <path 
                  d="M 270,50 L 270,95" 
                  stroke="#CBD5E1" 
                  strokeWidth="2" 
                  fill="none"
                  strokeDasharray="6 3"
                  className={activeNode === 0 ? "animate-line-dash" : ""}
                />
              </svg>

              {/* Support Options Node */}
              <div 
                className={`absolute top-[110px] left-1/2 transform -translate-x-1/2 w-[180px] py-3 px-4 rounded-lg border transition-all duration-300 ${
                  activeNode === 1 
                    ? 'border-purple-400 bg-purple-50 shadow-md scale-105' 
                    : 'border-purple-200 bg-purple-50/90'
                }`}
              >
                <div className="text-center font-medium text-sm">Support Options</div>
              </div>

              {/* Connecting lines with animations */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* Support Options to 3 branches */}
                <path 
                  d="M 270,150 L 270,170 L 150,170 L 150,210" 
                  stroke="#CBD5E1" 
                  strokeWidth="2" 
                  fill="none"
                  strokeDasharray="6 3"
                  className={activeNode === 1 ? "animate-line-dash" : ""}
                />
                <path 
                  d="M 270,150 L 270,210" 
                  stroke="#CBD5E1" 
                  strokeWidth="2" 
                  fill="none"
                  strokeDasharray="6 3"
                  className={activeNode === 1 ? "animate-line-dash" : ""}
                  style={{ animationDelay: "0.2s" }}
                />
                <path 
                  d="M 270,150 L 270,170 L 390,170 L 390,210" 
                  stroke="#CBD5E1" 
                  strokeWidth="2" 
                  fill="none"
                  strokeDasharray="6 3"
                  className={activeNode === 1 ? "animate-line-dash" : ""}
                  style={{ animationDelay: "0.3s" }}
                />
              </svg>

              {/* Three option nodes in a row */}
              <div className="absolute top-[210px] left-0 right-0 flex justify-center space-x-12">
                <div 
                  className={`w-[160px] py-3 px-4 rounded-lg border transition-all duration-300 transform ${
                    activeNode === 2 
                      ? 'border-orange-400 bg-orange-50 shadow-md scale-105' 
                      : 'border-orange-200 bg-orange-50/90'
                  }`}
                >
                  <div className="text-center font-medium text-sm">Order Status</div>
                </div>
                <div 
                  className={`w-[160px] py-3 px-4 rounded-lg border transition-all duration-300 transform ${
                    activeNode === 3 
                      ? 'border-green-400 bg-green-50 shadow-md scale-105' 
                      : 'border-green-200 bg-green-50/90'
                  }`}
                >
                  <div className="text-center font-medium text-sm">Returns Process</div>
                </div>
                <div 
                  className={`w-[160px] py-3 px-4 rounded-lg border transition-all duration-300 transform ${
                    activeNode === 4 
                      ? 'border-yellow-400 bg-yellow-50 shadow-md scale-105' 
                      : 'border-yellow-200 bg-yellow-50/90'
                  }`}
                >
                  <div className="text-center font-medium text-sm">FAQs</div>
                </div>
              </div>

              {/* Bottom connecting line */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <path 
                  d="M 270,260 L 270,310" 
                  stroke="#CBD5E1" 
                  strokeWidth="2" 
                  fill="none"
                  strokeDasharray="6 3"
                  className={activeNode === 3 ? "animate-line-dash" : ""}
                />
              </svg>

              {/* Speak to Agent node */}
              <div 
                className={`absolute top-[310px] left-1/2 transform -translate-x-1/2 w-[180px] py-3 px-4 rounded-lg border transition-all duration-300 ${
                  activeNode === 0 
                    ? 'border-red-400 bg-red-50 shadow-md scale-105' 
                    : 'border-red-200 bg-red-50/90'
                }`}
              >
                <div className="text-center font-medium text-sm">Speak to Agent</div>
              </div>

              {/* Add button control with animations */}
              <div 
                className={`absolute transition-all duration-500 ${
                  showTooltip && activeNode === 1 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-4'
                }`} 
                style={{ top: '110px', right: '70px' }}
              >
                <div className="bg-gray-800 text-white text-xs p-2 rounded shadow-lg">
                  Add Support Option
                </div>
                <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -left-1 top-1/2 -mt-1.5"></div>
              </div>

              {/* Grid dots for background */}
              <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0"></div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="bg-white text-emerald-700 border border-emerald-500 text-sm px-3 py-1.5 rounded shadow-sm hover:bg-green-50 transition-colors">
              Export
            </button>
            <button className="bg-emerald-500 text-white text-sm px-3 py-1.5 rounded shadow-sm hover:bg-emerald-700 transition-colors">
              Save Flow
            </button>
          </div>
        </div>

        {/* Right Side - WhatsApp Preview */}
        <div className="col-span-3 flex flex-col">
          <div className="bg-[#128C7E] p-3 text-white text-sm font-medium">WhatsApp Preview</div>
          <div className="flex-1 bg-[#e5ddd5] bg-opacity-30 p-3 overflow-y-auto flex flex-col space-y-3">
            <div 
              className="bg-white p-3 rounded-lg shadow-sm text-sm animate-fade-in"
            >
              <p>👋 Welcome to Our Store Support! How can I help you today?</p>
              
              <div className="mt-3 space-y-1.5">
                {["📦 Check Order Status", "↩️ Return Item", "❓ FAQs", "👤 Speak to Agent"].map((option, j) => (
                  <button 
                    key={j} 
                    className={`block w-full text-left p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors ${
                      currentPreviewIndex === 1 && j === 0 ? 'bg-gray-100' : j === 0 ? 'bg-gray-50' : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            {currentPreviewIndex === 1 && (
              <div 
                className="bg-white p-3 rounded-lg shadow-sm text-sm animate-fade-in-up"
              >
                <p>Please enter your order number to check its status:</p>
                <div className="mt-3">
                  <input 
                    type="text" 
                    className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                    placeholder="Type your response..."
                  />
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t flex bg-white">
            <input 
              type="text" 
              placeholder="Type a message"
              className="text-sm flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-emerald-500" 
            />
            <button className="bg-[#128C7E] text-white text-sm px-3 rounded-r-md hover:bg-[#0a6e61] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 