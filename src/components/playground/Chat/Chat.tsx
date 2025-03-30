import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import { Button } from '@/components/ui/button';
import { MessageCircleIcon, PlusCircleIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
    content: string;
    isUser: boolean;
}

function Chat({
    setHasInteracted,
    setFlowJSON,
    interacted,
    setPreviewUrl
}: {
    setHasInteracted: Dispatch<SetStateAction<boolean>>,
    setFlowJSON: Dispatch<SetStateAction<{}>>,
    interacted: boolean,
    setPreviewUrl: Dispatch<SetStateAction<string>>
}) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isGeneratingFlow, setIsGeneratingFlow] = useState(false);

    // Only create a UUID if the user hasn't interacted before and there's no thread_id in localStorage
    useEffect(() => {
        if (!interacted || !localStorage.getItem("thread_id")) {
            localStorage.setItem("thread_id", uuidv4());
        }
    }, [interacted]);

    const handleSendMessage = async (content: string) => {

        // Get existing thread_id from localStorage or create a new one if it doesn't exist
        let thread_id = localStorage.getItem("thread_id");

        // If this is the first interaction and thread_id doesn't exist, create and store it
        if (!thread_id) {
            thread_id = uuidv4();
            localStorage.setItem("thread_id", thread_id);
        }

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ thread_id, user_input: content }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response");
            }

            const result = await response.json();
            setMessages(prevMessages => [
                ...prevMessages,
                { content, isUser: true },
                { content: result.reply, isUser: false }
            ]);

            setHasInteracted(true);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const makeFlow = async () => {
        setIsGeneratingFlow(true);
        console.log("Generating flow...");

        try {
            const thread_id = localStorage.getItem("thread_id");

            if (!thread_id) {
                throw new Error("No thread ID found");
            }

            // Call our Next.js API route which will handle all external API calls
            const response = await fetch("/api/flow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ thread_id }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate flow");
            }

            const result = await response.json();

            console.log("Flow generation result:", result);

            // Update state with the returned data
            if (result.reactJson) {
                setFlowJSON(result.reactJson);
            }

            if (result.previewUrl) {
                setPreviewUrl(result.previewUrl);
            }

            // Store IDs in localStorage if provided
            if (result.flowId) {
                localStorage.setItem("flow_id", result.flowId);
            }

            setMessages(prevMessages => [
                ...prevMessages,
                { content: result.flowPlan, isUser: false }
            ]);

            setMessages(prevMessages => [
                ...prevMessages,
                { content: "You can view the preview at:\n"+result.previewUrl, isUser: false }
            ]);

        } catch (error) {
            console.error("Error generating flow:", error);
        } finally {
            setIsGeneratingFlow(false);
        }
    };

    const startNewThread = () => {
        // Clear localStorage
        localStorage.removeItem("thread_id");
        localStorage.removeItem("flow_id");

        // Create new UUID
        localStorage.setItem("thread_id", uuidv4());

        // Clear chat messages
        setMessages([]);

        // Reset flow JSON
        setFlowJSON({ nodes: [], edges: {} });

        // Reset preview URL
        setPreviewUrl("");

        // Reset interaction state
        setHasInteracted(false);
    }

    return (
        <div className="relative flex flex-col h-screen bg-[#ece5dd]">

            {/* Header */}
            <div className={`flex items-center ${messages.length === 0 ? 'text-4xl mt-4 justify-center' : 'p-2 justify-between'}`}>
                <div className='flex gap-2 items-center'>
                    <MessageCircleIcon className={`text-primary ${messages.length === 0 ? 'scale-150' : 'scale-125'}`} />
                    <h1 className='text-primary font-bold'>WhatsFlow</h1>
                </div>

                {/* New Thread Button - only show if there are messages */}
                {messages.length > 0 && (
                    <Button
                        size="sm"
                        className='cursor-pointer'
                        onClick={startNewThread}
                    >
                        <PlusCircleIcon className="h-4 w-4" />
                        <span>New Thread</span>
                    </Button>
                )}
            </div>

            {/* Messages Container */}
            <div
                className={`flex-1 overflow-y-auto transition-all duration-500 ease-in-out ${messages.length === 0 ? 'flex items-center justify-center' : 'pt-4'
                    }`}
            >
                {
                    messages.length === 0 ? (
                        <div className={`text-center px-6 py-8 rounded-lg max-w-2xl mx-auto transition-opacity duration-300 ${messages.length > 0 ? 'opacity-0' : 'opacity-100'
                            }`} >
                            <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to WhatsFlow</h1>
                            <p className="text-lg text-gray-600 mb-8">Start a conversation by sending a message below.</p>
                        </div >
                    ) : (
                        <div className="space-y-4 px-4 pb-4">
                            {messages.map((message, index) => (
                                <Message key={index} content={message.content} isUser={message.isUser} />
                            ))}
                        </div>
                    )}
            </div >

            {/* Chat Input Container */}
            < div className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${messages.length === 0 ? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2' : 'sticky bottom-0 border-t border-gray-200'
                }`}>
                <div className={`mx-auto px-4 py-6 flex gap-4 items-center justify-center ${messages.length === 0 ? 'flex-row w-1/3' : 'flex-col'}`}>
                    <ChatInput onSendMessage={handleSendMessage} />
                    <Button
                        size="lg"
                        className={`${messages.length === 0 ? 'w-fit' : 'w-full'}`}
                        onClick={makeFlow}
                        disabled={isGeneratingFlow}
                    >
                        {isGeneratingFlow ? 'Generating Flow...' : 'Send'}
                    </Button>
                </div >
            </div >
        </div >
    );
}

export default Chat;