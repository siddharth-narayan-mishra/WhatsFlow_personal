'use client';

import { useState, useEffect, useRef } from 'react';
import { Flow, FlowNode, NodeType, TextNodeData, MultipleChoiceNodeData, CollectInfoNodeData, ConditionalNodeData, EndNodeData } from '../types/flow';

interface WhatsAppPreviewProps {
  flow: Flow;
}

interface Message {
  id: string;
  text: string;
  fromUser: boolean;
  choices?: { id: string; text: string }[];
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export default function WhatsAppPreview({ flow }: WhatsAppPreviewProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find the starting node (typically the first node)
  useEffect(() => {
    if (flow?.nodes?.length > 0) {
      // Reset the simulation
      setMessages([]);
      setVariables({});
      
      // Find a node without incoming edges (a starting point)
      const incoming = new Set(flow.edges.map(edge => edge.target));
      const startNode = flow.nodes.find(node => !incoming.has(node.id));
      
      if (startNode) {
        setCurrentNodeId(startNode.id);
      } else {
        // Fallback to the first node
        setCurrentNodeId(flow.nodes[0].id);
      }
    }
  }, [flow]);

  // Process current node
  useEffect(() => {
    if (!currentNodeId) return;
    
    const node = flow.nodes.find(n => n.id === currentNodeId);
    if (!node) return;
    
    // Add typing indicator before processing node
    setIsTyping(true);
    setTimeout(() => {
      processNode(node);
      setIsTyping(false);
    }, 1500);
  }, [currentNodeId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Format current time for message timestamps
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const processNode = (node: FlowNode) => {
    switch (node.type) {
      case 'text':
        processTextNode(node, node.data as TextNodeData);
        break;
      case 'multipleChoice':
        processMultipleChoiceNode(node, node.data as MultipleChoiceNodeData);
        break;
      case 'collectInfo':
        processCollectInfoNode(node, node.data as CollectInfoNodeData);
        break;
      case 'conditional':
        processConditionalNode(node, node.data as ConditionalNodeData);
        break;
      case 'end':
        processEndNode(node, node.data as EndNodeData);
        break;
    }
  };

  const processTextNode = (node: FlowNode, data: TextNodeData) => {
    addBotMessage(data.message);
    
    // Move to next node after a short delay if next exists
    if (data.next) {
      setTimeout(() => {
        setCurrentNodeId(data.next || null);
      }, 2000);
    }
  };

  const processMultipleChoiceNode = (node: FlowNode, data: MultipleChoiceNodeData) => {
    addBotMessage(data.message, data.choices);
    setIsWaiting(true);
  };

  const processCollectInfoNode = (node: FlowNode, data: CollectInfoNodeData) => {
    addBotMessage(data.message);
    setIsWaiting(true);
  };

  const processConditionalNode = (node: FlowNode, data: ConditionalNodeData) => {
    // Don't show a message for conditional nodes
    // Check conditions and route to the appropriate next node
    const value = variables[data.variable] || '';
    
    // Find the first matching condition
    const matchedCondition = data.conditions.find(condition => {
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'contains':
          return value.includes(condition.value);
        case 'startsWith':
          return value.startsWith(condition.value);
        case 'endsWith':
          return value.endsWith(condition.value);
        case 'greaterThan':
          return parseFloat(value) > parseFloat(condition.value);
        case 'lessThan':
          return parseFloat(value) < parseFloat(condition.value);
        default:
          return false;
      }
    });
    
    if (matchedCondition && matchedCondition.next) {
      setCurrentNodeId(matchedCondition.next);
    } else if (data.defaultNext) {
      setCurrentNodeId(data.defaultNext);
    } else {
      // No matching condition and no default path
      addBotMessage("Error: No matching condition and no default path defined.");
    }
  };

  const processEndNode = (node: FlowNode, data: EndNodeData) => {
    if (data.message) {
      addBotMessage(data.message);
    }
    addBotMessage('This conversation has ended. Refresh to start again.');
  };

  const addBotMessage = (text: string, choices?: { id: string; text: string }[]) => {
    // Replace variables in text
    let processedText = text;
    for (const [key, value] of Object.entries(variables)) {
      processedText = processedText.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    
    setMessages(prev => [...prev, {
      id: `bot-${Date.now()}`,
      text: processedText,
      fromUser: false,
      choices,
      timestamp: getCurrentTime()
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      text,
      fromUser: true,
      timestamp: getCurrentTime(),
      status: 'read'
    }]);
  };

  const handleChoiceSelection = (choiceId: string, choiceText: string, choices: { id: string; text: string; next: string }[]) => {
    // Add user message
    addUserMessage(choiceText);
    
    // Find the corresponding choice and get the next node
    const choice = choices.find(c => c.id === choiceId);
    if (choice && choice.next) {
      setIsWaiting(false);
      setCurrentNodeId(choice.next);
    }
  };

  const handleUserInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !isWaiting) return;
    
    // Add user message
    addUserMessage(userInput);
    
    // Find current node to process the input
    const node = flow.nodes.find(n => n.id === currentNodeId);
    if (!node) return;
    
    if (node.type === 'collectInfo') {
      const data = node.data as CollectInfoNodeData;
      
      // Store the input in variables
      setVariables(prev => ({
        ...prev,
        [data.variableName]: userInput
      }));
      
      // Move to next node if next exists
      if (data.next) {
        setIsWaiting(false);
        setCurrentNodeId(data.next);
      } else {
        addBotMessage("Error: No next node defined for this collect info node.");
      }
    }
    
    // Clear input
    setUserInput('');
  };

  const handleReset = () => {
    // Reset the conversation
    setMessages([]);
    setVariables({});
    
    // Find a starting node
    const incoming = new Set(flow.edges.map(edge => edge.target));
    const startNode = flow.nodes.find(node => !incoming.has(node.id));
    
    if (startNode) {
      setCurrentNodeId(startNode.id);
    } else if (flow.nodes.length > 0) {
      setCurrentNodeId(flow.nodes[0].id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 border border-gray-300 rounded-lg overflow-hidden max-w-sm mx-auto shadow-lg">
      {/* Header */}
      <div className="bg-whatsapp p-3 text-white flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex-shrink-0 overflow-hidden">
          <svg viewBox="0 0 212 212" width="36" height="36" fill="white">
            <path d="M106 0C47.5 0 0 47.5 0 106s47.5 106 106 106 106-47.5 106-106S164.5 0 106 0zm0 30c20.6 0 37.3 16.7 37.3 37.3S126.6 104.7 106 104.7 68.7 87.9 68.7 67.3 85.4 30 106 30zM106 182c-30.9 0-58.1-15.8-74-39.7 3.2-26.7 50.9-41.3 74-41.3s70.8 14.6 74 41.3c-15.9 23.9-43.1 39.7-74 39.7z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-white">{flow.name || 'WhatsApp Preview'}</h3>
          <p className="text-xs text-green-100">Online</p>
        </div>
        <button 
          onClick={handleReset}
          className="ml-auto text-xs bg-green-600 hover:bg-green-700 text-white rounded px-2 py-1"
        >
          Reset
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#e5ded8]" style={{ 
        height: "500px", 
        backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAA4klEQVQ4jc3SPwoBYRDG4WcTkYuwZ3AEbkBxAPskOU1ukCJKyp5AoVBsJXICxT5/y86XsbHJZ741Tfvs7E4z82ekNE2DCmmhh36WOGKLpeSkaVo6nZAlNtguV+jXmr6I2SIucIhNf0GcPYf3hK930dCZ8dKQzB19MwZS/SQ8V/ghHOGCHlp2jy5WqKMRrR0wRccurNpD+o1XuRdxj5Dm5RnmYWiQlXE2JLNN/2VvI3xJWGUFMcfkzfcJH7nWw7DKNm/o2NVOeN0TmDcwprjLDLt2aGHyVtivd7dE14bG/vbMK3ABM0o+Cev/HK0AAAAASUVORK5CYII=')",
        backgroundRepeat: "repeat" 
      }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-600 my-8 bg-white/80 p-3 rounded-lg backdrop-blur-sm">
            The conversation will begin momentarily...
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`mb-4 ${message.fromUser ? 'flex justify-end' : ''}`}>
              <div 
                className={`p-2 rounded-lg max-w-[80%] relative ${
                  message.fromUser 
                    ? 'bg-[#dcf8c6] rounded-tr-none' 
                    : 'bg-white rounded-tl-none'
                }`}
              >
                <p className="text-sm break-words">{message.text}</p>
                
                {/* Timestamp */}
                <div className="text-[10px] text-gray-500 text-right mt-1 pr-1">
                  {message.timestamp}
                  {message.fromUser && message.status && (
                    <span className="ml-1 text-blue-500">
                      {message.status === 'sent' && '✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'read' && '✓✓'}
                    </span>
                  )}
                </div>
                
                {/* Choice buttons */}
                {message.choices && (
                  <div className="mt-3 space-y-2">
                    {message.choices.map(choice => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoiceSelection(
                          choice.id,
                          choice.text,
                          message.choices as { id: string; text: string; next: string }[]
                        )}
                        className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                      >
                        {choice.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="mb-4">
            <div className="p-2 rounded-lg max-w-[60%] bg-white rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleUserInputSubmit} className="p-2 bg-[#f0f0f0] border-t flex items-center">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={!isWaiting || isTyping}
          placeholder={isWaiting ? "Type a message..." : "Waiting for the next step..."}
          className="flex-1 p-2 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-whatsapp"
        />
        <button
          type="submit"
          disabled={!isWaiting || !userInput.trim() || isTyping}
          className="ml-2 w-10 h-10 rounded-full bg-whatsapp text-white flex items-center justify-center disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </div>
  );
} 