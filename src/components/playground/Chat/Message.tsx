import React from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from "react-markdown";

interface MessageProps {
    content: string;
    isUser: boolean;
}

function Message({ content, isUser }: MessageProps) {
    return (
        <div className={`flex items-start gap-4 max-w-3xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-[#dcf8c6]' : 'bg-white'
                }`}>
                {isUser ? (
                    <User className="w-5 h-5 text-black" />
                ) : (
                    <Bot className="w-5 h-5 text-black" />
                )}
            </div>
            <div className={`flex-1 px-4 py-3 rounded-lg text-sm ${isUser ? 'bg-[#dcf8c6] text-black' : 'bg-gray-100 text-gray-800'
                }`}>
                <ReactMarkdown>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default Message;