'use client';

import React, { useState, useEffect, useRef } from 'react';

// Typing indicator animation component
const TypingIndicator = () => (
  <div className="flex space-x-1 mt-1 ml-1">
    {[0, 1, 2].map((i) => (
      <div 
        key={i}
        className={`w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-${i}`}
      ></div>
    ))}
  </div>
);

export default function AIFlowMockup() {
  const [currentStage, setCurrentStage] = useState(0);
  const [userMessage, setUserMessage] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [showAiOptions, setShowAiOptions] = useState(false);
  const [typing, setTyping] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Chat sequence
  const chatSequence = [
    {
      user: "I need a flow for a pizza restaurant that takes orders via WhatsApp",
      ai: "I'll create a pizza ordering flow with:"
    }
  ];
  
  // Type message with a realistic typing effect
  const typeMessage = (text: string, setter: React.Dispatch<React.SetStateAction<string>>, callback?: () => void) => {
    setTyping(true);
    let i = 0;
    const speed = 50; // typing speed in ms
    
    const type = () => {
      if (i < text.length) {
        setter(text.substring(0, i + 1));
        i++;
        setTimeout(type, speed);
      } else {
        setTyping(false);
        if (callback) callback();
      }
    };
    
    type();
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [userMessage, aiMessage, showAiOptions]);
  
  // Start animation sequence when component mounts
  useEffect(() => {
    // Set a short delay before starting animations to ensure component is fully visible
    const initialDelay = setTimeout(() => {
      setAnimationStarted(true);
    }, 300);

    return () => clearTimeout(initialDelay);
  }, []);

  // Start chat sequence after animation is started
  useEffect(() => {
    if (!animationStarted) return;
    
    const timer = setTimeout(() => {
      if (chatSequence[0]) {
        // Type user message
        typeMessage(chatSequence[0].user, setUserMessage, () => {
          // Wait a bit before AI starts "typing"
          setTimeout(() => {
            // Type AI message
            typeMessage(chatSequence[0].ai, setAiMessage, () => {
              // Show options after AI message is complete
              setTimeout(() => {
                setShowAiOptions(true);
              }, 500);
            });
          }, 800);
        });
      }
    }, 700); // Delay before starting the chat sequence
    
    return () => clearTimeout(timer);
  }, [animationStarted]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header bar with controls */}
      <div className="bg-emerald-200 text-black px-4 py-2 flex items-center">
        <div className="text-sm text-center flex-grow font-medium">AI Flow Generator</div>
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="p-4 h-80 overflow-y-auto bg-gray-100 flex flex-col space-y-3"
      >
        {/* User message */}
        {userMessage && (
          <div className="flex justify-end mb-2 animate-fade-in">
            <div className="bg-emerald-100 rounded-lg p-3 text-sm max-w-[80%]">
              <div className="font-medium text-xs mb-1 text-gray-600">You</div>
              <div>{userMessage}</div>
            </div>
          </div>
        )}
        
        {/* AI message with typing indicator */}
        {(typing || aiMessage) && (
          <div className="flex justify-start mb-2 animate-fade-in">
            <div className="bg-white rounded-lg p-3 text-sm max-w-[80%] shadow-sm">
              <div className="font-medium text-xs mb-1 text-gray-500">Assistant</div>
              <div>{aiMessage}</div>
              
              {/* Show typing indicator while typing */}
              {typing && !showAiOptions && <TypingIndicator />}
              
              {/* Show list items after message is complete */}
              {aiMessage && !typing && (
                <ul className="list-disc list-inside mt-2 text-xs space-y-1 text-gray-600 animate-fade-in-up">
                  <li>Welcome & menu options</li>
                  <li>Pizza size & crust selection</li>
                  <li>Toppings customization</li>
                  <li>Delivery details collection</li>
                  <li>Order confirmation</li>
                </ul>
              )}
            </div>
          </div>
        )}
        
        {/* Options after flow is complete */}
        {showAiOptions && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="bg-white rounded-lg p-3 text-sm max-w-[80%] shadow-sm">
              <p className="mb-2">Here's your flow! Would you like to:</p>
              <div className="space-y-2">
                <div className="bg-emerald-500 bg-opacity-10 hover:bg-opacity-20 p-2 rounded-md cursor-pointer text-center text-whatsapp-dark">
                  Edit in visual editor
                </div>
                <div className="bg-emerald-500 bg-opacity-10 hover:bg-opacity-20 p-2 rounded-md cursor-pointer text-center text-whatsapp-dark">
                  Test the flow
                </div>
                <div className="bg-emerald-500 bg-opacity-10 hover:bg-opacity-20 p-2 rounded-md cursor-pointer text-center text-whatsapp-dark">
                  Deploy to WhatsApp
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="px-4 py-3 border-t flex items-center bg-white">
        <input 
          type="text"
          placeholder="Describe your flow needs..."
          className="flex-1 p-2 border rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-whatsapp" 
          disabled={typing}
          readOnly
        />
        <button 
          className="px-4 py-2 rounded-r-md text-sm font-medium bg-emerald-400 text-white hover:bg-emerald-500-dark"
        >
          Generate Flow
        </button>
      </div>
    </div>
  );
} 