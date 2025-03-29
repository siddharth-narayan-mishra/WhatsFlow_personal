import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

function ChatInput({ onSendMessage }: ChatInputProps) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 rounded-full bg-white border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <button
                type="submit"
                disabled={!message.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${message.trim()
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
    );
}

export default ChatInput;