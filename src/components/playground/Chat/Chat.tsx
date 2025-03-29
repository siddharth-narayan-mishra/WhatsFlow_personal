import React, { Dispatch, SetStateAction, useState } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import { Button } from '@/components/ui/button';
import { MessageCircleIcon } from 'lucide-react';

interface ChatMessage {
    content: string;
    isUser: boolean;
}

function Chat({ setHasInteracted }: { setHasInteracted: Dispatch<SetStateAction<boolean>> }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const handleSendMessage = (content: string) => {
        const newMessages = [
            ...messages,
            { content, isUser: true },
            { content: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione tempora quaerat quidem enim doloremque sed aut assumenda nesciunt odit porro doloribus totam, ipsum exercitationem error fugiat omnis ad, vero fuga?", isUser: false }
        ];
        setMessages(newMessages);
        setHasInteracted(true);
    };

    return (
        <div className="relative flex flex-col h-screen bg-[#ece5dd]">

            {/* Header */}
            <div className={`flex justify-center gap-2 items-center ${messages.length === 0 ? 'text-4xl mt-4' : 'p-2'}`}>
                <MessageCircleIcon className={`text-primary ${messages.length === 0 ? 'scale-150' : 'scale-125'}`} />
                <h1 className='text-primary font-bold'>WhatsFlow</h1>
            </div>

            {/* Messages Container */}
            <div
                className={`flex-1 overflow-y-auto transition-all duration-500 ease-in-out ${messages.length === 0 ? 'flex items-center justify-center' : 'pt-4'
                    }`}
            >
                {messages.length === 0 ? (
                    <div className={`text-center px-6 py-8 rounded-lg max-w-2xl mx-auto transition-opacity duration-300 ${messages.length > 0 ? 'opacity-0' : 'opacity-100'
                        }`}>
                        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to WhatsFlow</h1>
                        <p className="text-lg text-gray-600 mb-8">Start a conversation by sending a message below.</p>
                    </div>
                ) : (
                    <div className="space-y-4 px-4 pb-4">
                        {messages.map((message, index) => (
                            <Message key={index} content={message.content} isUser={message.isUser} />
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Input Container */}
            <div className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${messages.length === 0 ? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2' : 'sticky bottom-0 border-t border-gray-200'
                }`}>
                <div className={`mx-auto px-4 py-6 flex gap-4 items-center justify-center ${messages.length === 0 ? 'flex-row w-1/3' : 'flex-col'}`}>
                    <ChatInput onSendMessage={handleSendMessage} />
                    <Button size="lg" className={`${messages.length === 0 ? 'w-fit' : 'w-full'}`}>Send</Button>
                </div>
            </div>
        </div>
    );
}

export default Chat;