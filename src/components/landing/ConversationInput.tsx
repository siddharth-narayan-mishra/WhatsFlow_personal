'use client';

import { useState } from 'react';

interface ConversationInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export default function ConversationInput({ onSubmit, isLoading }: ConversationInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    
    onSubmit(prompt);
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-4">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Describe your WhatsApp flow</h2>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-md mb-4 h-32 resize-none"
            placeholder="Example: I want to create a flow that asks users for their name, then their order preference, and finally confirms their selection."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit"
            className="w-full bg-whatsapp text-white py-2 px-4 rounded-md hover:bg-whatsapp-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Flow'}
          </button>
        </div>
      </div>
    </form>
  );
} 