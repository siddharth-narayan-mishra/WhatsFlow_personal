"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "motion/react";
import {
    ArrowUp,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Download,
    Share,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface CodeProps {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export default function Chat() {
    const [model, setModel] = useState("deepseek:deepseek-reasoner");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [expandedReasoning, setExpandedReasoning] = useState<number[]>([]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Model parameters
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(4000);
    const [topP, setTopP] = useState(0.9);
    const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
    const [presencePenalty, setPresencePenalty] = useState(0.0);

    const toggleReasoning = (index: number) => {
        setExpandedReasoning((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const handleCopyCode = async (code: string) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    // const { messages, isLoading, input, handleInputChange, handleSubmit } =
    //     useChat({
    //         body: {
    //             model,
    //             temperature,
    //             maxTokens,
    //             topP,
    //             frequencyPenalty,
    //             presencePenalty,
    //             systemPrompt,
    //         }
    //     });


    const components = {
        code({ node, inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'text';
            const code = String(children).replace(/\n$/, '');

            return !inline ? (
                <div className="relative rounded-lg overflow-hidden my-2">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#282C34] text-gray-200">
                        <span className="text-xs font-medium">{language}</span>
                        <button
                            onClick={() => handleCopyCode(code)}
                            className="hover:text-white transition-colors"
                        >
                            {copiedCode === code ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <SyntaxHighlighter
                        style={oneDark}
                        language={language}
                        PreTag="div"
                        className="!bg-[#1E1E1E] !m-0 !p-4 !rounded-b-lg"
                    >
                        {code}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div className="flex flex-col h-screen dark:bg-black bg-white dark:text-white text-black">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-[65vh]">
                <header className="flex items-center justify-between py-3 px-4 border-b dark:border-zinc-800 border-zinc-200">
                        <Link prefetch={true} href="/">
                            <div className="flex items-center gap-2">
                                <h1 className="text-sm font-medium">AI Chat</h1>
                            </div>
                        </Link>
                        <Select value={model} onValueChange={setModel}>
                            <SelectTrigger className="w-1/2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="openai:gpt-4o">gpt-4o</SelectItem>
                                <SelectItem value="openai:gpt-4">gpt-4</SelectItem>
                                <SelectItem value="openai:gpt-3.5-turbo">
                                    gpt-3.5 turbo
                                </SelectItem>
                                <SelectItem value="openai:gpt-4-turbo">
                                    gpt-4 turbo
                                </SelectItem>
                                <SelectItem value="deepseek:deepseek-chat">
                                    deepseek chat
                                </SelectItem>
                                <SelectItem value="deepseek:deepseek-coder">
                                    deepseek coder
                                </SelectItem>
                                <SelectItem value="deepseek:deepseek-reasoner">
                                    deepseek-r
                                </SelectItem>
                                <SelectItem value="groq:deepseek-r1-distill-llama-70b">
                                    deepseek-r1-distill-llama-70b
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs dark:border-zinc-800 border-zinc-200 dark:hover:bg-zinc-900 hover:bg-zinc-100 hidden "
                        >
                            <Share className="w-3.5 h-3.5 mr-1.5" />
                            Share
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs dark:border-zinc-800 border-zinc-200 dark:hover:bg-zinc-900 hover:bg-zinc-100 hidden "
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Export
                        </Button>
                    </div>
                </header>

                <ScrollArea className="flex-1 p-4">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <AnimatePresence>
                            {/* {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex items-start gap-3 ${message.role === "assistant"
                                            ? "flex-row"
                                            : "flex-row-reverse"
                                        }`}
                                >
                                    <div className="flex flex-col gap-2 max-w-[480px]">
                                        {message.reasoning && (
                                            <div
                                                className={`${message.role === "user"
                                                        ? "bg-[#007AFF] text-white"
                                                        : "bg-[#E9E9EB] dark:bg-[#1C1C1E] text-black dark:text-white"
                                                    } rounded-[20px] ${message.role === "user"
                                                        ? "rounded-br-[8px]"
                                                        : "rounded-bl-[8px]"
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => toggleReasoning(index)}
                                                    className="w-full flex items-center justify-between px-3 py-2"
                                                >
                                                    <span className="text-xs font-medium opacity-70">
                                                        Reasoning
                                                    </span>
                                                    {expandedReasoning.includes(index) ? (
                                                        <ChevronUp className="w-3 h-3 opacity-70" />
                                                    ) : (
                                                        <ChevronDown className="w-3 h-3 opacity-70" />
                                                    )}
                                                </button>
                                                {expandedReasoning.includes(index) && (
                                                    <div className="px-3 pb-3 text-[12px] opacity-70">
                                                        <ReactMarkdown components={components}>
                                                            {message.reasoning}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {message.content && (
                                            <div
                                                className={`${message.role === "user"
                                                        ? "bg-[#007AFF] text-white"
                                                        : "bg-[#E9E9EB] dark:bg-[#1C1C1E] text-black dark:text-white"
                                                    } rounded-[20px] ${message.role === "user"
                                                        ? "rounded-br-[8px]"
                                                        : "rounded-bl-[8px]"
                                                    } px-3 py-2`}
                                            >
                                                <div className="text-[14px]">
                                                    <ReactMarkdown components={components}>
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))} */}
                        </AnimatePresence>

                        {/* Only show loading when isLoading is true AND there's no message being streamed */}
                        {/* {isLoading &&
                            messages[messages.length - 1]?.role !== "assistant" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3 dark:bg-zinc-900/50 bg-white rounded-lg p-4"
                                >
                                    <div className="w-6 h-6 rounded-full border dark:border-zinc-800 border-zinc-200 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex gap-1 mt-[0.5rem]">
                                            <span
                                                className="w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-200 animate-bounce"
                                                style={{ animationDelay: "0ms" }}
                                            />
                                            <span
                                                className="w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-200 animate-bounce"
                                                style={{ animationDelay: "150ms" }}
                                            />
                                            <span
                                                className="w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-200 animate-bounce"
                                                style={{ animationDelay: "300ms" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )} */}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t dark:border-zinc-800 border-zinc-200">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            {/* <Textarea
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                                placeholder="Send a message..."
                                className="min-h-[60px] dark:bg-zinc-900/50 bg-white border dark:border-zinc-800 border-zinc-200 focus:border-zinc-400 dark:focus:border-zinc-600"
                            /> */}
                            <div className="absolute bottom-3 right-3">
                                {/* <Button
                                    size="sm"
                                    onClick={handleSubmit}
                                    disabled={isLoading || !input.trim()}
                                    className="h-8 bg-white hover:bg-zinc-200 text-black"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </Button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}