import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  isTyping?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  isTyping = false,
}) => {
  const isAI = sender === 'ai';
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Style based on sender
  const containerStyles = cn(
    'flex w-full mb-4 transition-opacity duration-300 ease-in-out',
    isAI ? 'justify-start' : 'justify-end',
    'animate-fadeIn'
  );
  
  const messageStyles = cn(
    'max-w-[80%] sm:max-w-[70%] rounded-3xl p-4 break-words shadow-sm transition-all duration-300',
    isAI 
      ? 'bg-white border border-gray-200 rounded-tl-lg text-gray-800 hover:shadow-md'
      : 'bg-emerald-500 text-white rounded-tr-lg hover:shadow-md hover:bg-emerald-500/95'
  );
  
  return (
    <div className={containerStyles}>
      <div>
        <div className={messageStyles}>
          {isTyping ? (
            <div className="flex space-x-2 items-center h-6 px-2">
              <span className="w-2 h-2 rounded-full bg-current animate-pulse delay-0"></span>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse delay-150"></span>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse delay-300"></span>
            </div>
          ) : (
            <div className="transition-all duration-300 ease-in-out">
              {content}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1 px-1 opacity-80">
          {isAI ? 'WhatsFlow Architect' : 'You'} • {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

// Add a keyframe animation for fade-in
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .animate-typing span:nth-child(1) {
    animation-delay: 0s;
  }
  
  .animate-typing span:nth-child(2) {
    animation-delay: 0.15s;
  }
  
  .animate-typing span:nth-child(3) {
    animation-delay: 0.3s;
  }
  
  .delay-0 {
    animation-delay: 0s;
  }
  
  .delay-150 {
    animation-delay: 0.15s;
  }
  
  .delay-300 {
    animation-delay: 0.3s;
  }
`;

// Only add the style element on the client side
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}

export default ChatMessage; 