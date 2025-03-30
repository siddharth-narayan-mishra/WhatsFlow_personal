'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ChatMessage from '@/components/onboarding/ChatMessage';

// Define the message type interface
interface Message {
    role: string;
    content: string;
    suggestions?: string[];
    timestamp?: number; // Added timestamp for compatibility
}

export default function OnboardingPage() {
    const router = useRouter();

    // State variables
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 7; // Added step for AI chat

    // Business type
    const [businessType, setBusinessType] = useState<string>('');

    // Business details
    const [businessDetails, setBusinessDetails] = useState({
        name: '',
        website: '',
        size: '',
        region: ''
    });

    // Business goals
    const [businessGoals, setBusinessGoals] = useState<string[]>([]);

    // Communication style
    const [communicationStyle, setCommunicationStyle] = useState<string>('');

    // AI conversation
    const [aiConversation, setAiConversation] = useState({
        messages: [
            {
                role: 'assistant',
                content: 'Hi there! I\'m your WhatsApp AI assistant. I can help you customize your automation flows based on your business needs. What questions do you have about setting up WhatsApp for your business?'
            }
        ] as Message[],
        completed: false
    });

    const [userMessage, setUserMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // AI typing indicator
    const [isAiTyping, setIsAiTyping] = useState(false);

    // Navigation handlers
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleContinue = () => {
        if (canProceedToNextStep() && currentStep < 7) {
            setCurrentStep(currentStep + 1);
        }
        if (currentStep >= 6) {
            router.push('/playground');
            
        }
    };

    const handleCompleteOnboarding = () => {
        router.push('/playground');
    };

    // Step validation
    const canProceedToNextStep = () => {
        switch (currentStep) {
            case 1: // Business Type
                return !!businessType;
            case 2: // Business Details
                return !!businessDetails.name && !!businessDetails.size && !!businessDetails.region;
            case 3: // Business Goals
                return businessGoals.length > 0;
            case 4: // Communication Style
                return !!communicationStyle;
            case 5: // Review
                return true;
            case 6: // AI Chat
                return true;
            default:
                return true;
        }
    };

    // Toggle goal selection
    const handleToggleGoal = (goalId: string): void => {
        if (businessGoals.includes(goalId)) {
            setBusinessGoals(businessGoals.filter(id => id !== goalId));
        } else {
            setBusinessGoals([...businessGoals, goalId]);
        }
    };

    // Handle sending messages in AI chat
    const handleSendMessage = () => {
        if (!userMessage.trim() || aiConversation.completed) return;

        // Add user message
        const updatedMessages = [
            ...aiConversation.messages,
            { role: 'user', content: userMessage, timestamp: Date.now() } as Message
        ];

        setAiConversation({
            ...aiConversation,
            messages: updatedMessages
        });

        setUserMessage('');
        setIsAiTyping(true);

        // Simulate AI response
        setTimeout(() => {
            let aiResponse = '';
            let suggestions: string[] = [];

            if (updatedMessages.length === 2) {
                // First user message
                aiResponse = `Thanks for sharing! Based on your ${businessType} business, I recommend setting up automated responses for common customer inquiries. Would you like to know more about specific automation options?`;
                suggestions = [
                    "Tell me about customer support automation",
                    "How can I set up order notifications?",
                    "What about appointment reminders?"
                ];
            } else if (updatedMessages.length === 4) {
                // Second user message
                aiResponse = "Great! I've added those automation flows to your account. You'll be able to test and customize them in the playground. Is there anything else you'd like to set up?";
                suggestions = [
                    "How do I customize message templates?",
                    "Can I integrate with my existing systems?",
                    "No, I'm all set!"
                ];
            } else {
                // Third or more user message
                aiResponse = "Perfect! Your WhatsApp automation is all set up. You're now ready to move to the playground to test your flows in action. Click 'Finish' to continue.";
                suggestions = [];
                // Mark as completed
                setAiConversation({
                    messages: [
                        ...updatedMessages,
                        {
                            role: 'assistant',
                            content: aiResponse,
                            suggestions: suggestions,
                            timestamp: Date.now()
                        } as Message
                    ],
                    completed: true
                });
                setIsAiTyping(false);
                return;
            }

            setAiConversation({
                messages: [
                    ...updatedMessages,
                    {
                        role: 'assistant',
                        content: aiResponse,
                        suggestions: suggestions,
                        timestamp: Date.now()
                    } as Message
                ],
                completed: false
            });
            setIsAiTyping(false);
        }, 1500);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: string) => {
        setUserMessage(suggestion);
        setTimeout(() => {
            handleSendMessage();
        }, 100);
    };

    // Handle Enter key press
    const handleMessageKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Scroll to bottom of chat when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [aiConversation.messages]);

    // Render step indicators
    const renderStepIndicators = () => {
        const steps = [
            { title: 'Business Type' },
            { title: 'Business Details' },
            { title: 'Goals' },
            { title: 'Style' },
            { title: 'Review' }
        ];

        return (
            <div className="mb-16 relative">
                {/* Desktop step indicators with connecting lines */}
                <div className="hidden md:flex justify-between items-center w-full max-w-3xl mx-auto relative">
                    {/* Horizontal connecting lines - behind the circles */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

                    {/* Green completed lines */}
                    <div
                        className="absolute top-5 left-0 h-0.5 bg-emerald-500 z-0"
                        style={{
                            width: `${Math.min(100, (currentStep - 1) * 25)}%`
                        }}
                    ></div>

                    {/* Circles and labels */}
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center relative z-10">
                            <div
                                className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium 
                ${currentStep > index + 1
                                        ? 'bg-emerald-500 text-white'
                                        : currentStep === index + 1
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white text-gray-400 border-2 border-gray-300'
                                    }`}
                            >
                                {currentStep > index + 1 ? (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${currentStep > index + 1 ? 'text-emerald-500' : currentStep === index + 1 ? 'text-emerald-500' : 'text-gray-400'
                                }`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Mobile step indicator */}
                <div className="md:hidden absolute -bottom-6 w-full text-center text-sm font-medium text-gray-700">
                    Step {currentStep} of {steps.length}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">Set Up Your WhatsApp Business Account</h1>

                {/* Step indicators */}
                {renderStepIndicators()}

                {/* Step content */}
                <div className="mb-10">
                    {/* Step 1: Business Type */}
                    {currentStep === 1 && (
                        <div
                            className={`bg-white rounded-2xl shadow-md p-8 transition-all hover:shadow-lg
              ${currentStep === 1 ? 'border-2 border-emerald-500' : 'border border-gray-200'}`}>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">What type of business do you run?</h2>
                            <p className="text-gray-600 mb-8">This helps us tailor the WhatsApp experience for your specific needs.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { id: 'ecommerce', label: 'E-Commerce', icon: '🛒' },
                                    { id: 'service', label: 'Service Business', icon: '🔧' },
                                    { id: 'agency', label: 'Agency/Consultant', icon: '👥' },
                                    { id: 'restaurant', label: 'Restaurant/Cafe', icon: '🍽️' },
                                    { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
                                    { id: 'education', label: 'Education', icon: '🎓' },
                                    { id: 'retail', label: 'Retail Store', icon: '🏪' },
                                    { id: 'other', label: 'Other', icon: '✨' }
                                ].map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setBusinessType(type.id)}
                                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${businessType === type.id
                                                ? 'border-2 border-emerald-500 bg-emerald-500/10'
                                                : 'border-2 border-gray-200 hover:border-emerald-500'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-3">{type.icon}</span>
                                            <span className="text-gray-800 font-medium">{type.label}</span>
                                            {businessType === type.id && (
                                                <svg className="w-5 h-5 text-emerald-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Business Details */}
                    {currentStep === 2 && (
                        <div className={`bg-white rounded-2xl shadow-md p-8 transition-all hover:shadow-lg
              ${currentStep === 2 ? 'border-2 border-emerald-500' : 'border border-gray-200'}`}>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Tell us about your business</h2>
                            <p className="text-gray-600 mb-8">This information helps us customize your WhatsApp flows.</p>

                            <div className="space-y-6">
                                <div className="group">
                                    <label htmlFor="business-name" className="block text-sm font-medium transition-colors group-hover:text-emerald-500 focus-within:text-emerald-500 mb-1">
                                        Business Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative rounded-md shadow-sm focus-within:z-10">
                                        <input
                                            type="text"
                                            id="business-name"
                                            value={businessDetails.name}
                                            onChange={(e) => setBusinessDetails({ ...businessDetails, name: e.target.value })}
                                            className="block w-full rounded-2xl border transition-colors py-3 px-4 
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                        group-hover:border-emerald-500 border-gray-300"
                                            placeholder="Your business name"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label htmlFor="business-website" className="block text-sm font-medium transition-colors group-hover:text-emerald-500 focus-within:text-emerald-500 mb-1">
                                        Website (optional)
                                    </label>
                                    <div className="relative rounded-md shadow-sm focus-within:z-10">
                                        <input
                                            type="url"
                                            id="business-website"
                                            value={businessDetails.website}
                                            onChange={(e) => setBusinessDetails({ ...businessDetails, website: e.target.value })}
                                            className="block w-full rounded-2xl border transition-colors py-3 px-4 
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                        group-hover:border-emerald-500 border-gray-300"
                                            placeholder="https://yourbusiness.com"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label htmlFor="business-size" className="block text-sm font-medium transition-colors group-hover:text-emerald-500 focus-within:text-emerald-500 mb-1">
                                        Business Size <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative rounded-md shadow-sm focus-within:z-10">
                                        <select
                                            id="business-size"
                                            value={businessDetails.size}
                                            onChange={(e) => setBusinessDetails({ ...businessDetails, size: e.target.value })}
                                            className="block w-full rounded-2xl border transition-colors py-3 px-4 
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                        group-hover:border-emerald-500 border-gray-300"
                                        >
                                            <option value="">Select size</option>
                                            <option value="Solo">Solo (1 person)</option>
                                            <option value="Small">Small (2-10 employees)</option>
                                            <option value="Medium">Medium (11-50 employees)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="group">
                                    <label htmlFor="business-region" className="block text-sm font-medium transition-colors group-hover:text-emerald-500 focus-within:text-emerald-500 mb-1">
                                        Primary Operation Region <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative rounded-md shadow-sm focus-within:z-10">
                                        <select
                                            id="business-region"
                                            value={businessDetails.region}
                                            onChange={(e) => setBusinessDetails({ ...businessDetails, region: e.target.value })}
                                            className="block w-full rounded-2xl border transition-colors py-3 px-4 
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                        group-hover:border-emerald-500 border-gray-300"
                                        >
                                            <option value="">Select region</option>
                                            <option value="Local">Local (city/town)</option>
                                            <option value="Regional">Regional (state/province)</option>
                                            <option value="National">National</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Goals */}
                    {currentStep === 3 && (
                        <div className={`bg-white rounded-2xl shadow-md p-8 transition-all hover:shadow-lg
              ${currentStep === 3 ? 'border-2 border-emerald-500' : 'border border-gray-200'}`}>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">What are your business goals?</h2>
                            <p className="text-gray-600 mb-8">Select the goals you want to achieve with WhatsApp automation.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { id: 'leads', label: 'Generate more leads', description: 'Attract potential customers', icon: '🎯' },
                                    { id: 'sales', label: 'Increase sales', description: 'Convert conversations to purchases', icon: '💰' },
                                    { id: 'support', label: 'Improve customer support', description: 'Respond faster to inquiries', icon: '🤝' },
                                    { id: 'retention', label: 'Enhance customer retention', description: 'Keep customers engaged', icon: '🔄' },
                                    { id: 'automation', label: 'Automate repetitive tasks', description: 'Save time and resources', icon: '⚙️' },
                                    { id: 'engagement', label: 'Boost customer engagement', description: 'Interact more effectively', icon: '💬' }
                                ].map((goal) => (
                                    <div
                                        key={goal.id}
                                        onClick={() => handleToggleGoal(goal.id)}
                                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden ${businessGoals.includes(goal.id)
                                                ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {businessGoals.includes(goal.id) && (
                                            <div className="absolute top-0 right-0 h-12 w-12 -mr-6 -mt-6 bg-emerald-500/20 transform rotate-45"></div>
                                        )}
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center mt-1">
                                                <input
                                                    id={goal.id}
                                                    type="checkbox"
                                                    className="h-5 w-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 transition-all"
                                                    checked={businessGoals.includes(goal.id)}
                                                    onChange={() => handleToggleGoal(goal.id)}
                                                />
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center">
                                                    <span className="mr-2 text-xl">{goal.icon}</span>
                                                    <label htmlFor={goal.id} className="font-medium text-gray-800">{goal.label}</label>
                                                </div>
                                                <p className="text-gray-500 text-sm mt-1">{goal.description}</p>
                                            </div>
                                            {businessGoals.includes(goal.id) && (
                                                <div className="flex-shrink-0 self-start">
                                                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-center">
                                <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 max-w-lg">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-600">
                                                Select at least one goal to continue. Your choices will help us create the most effective WhatsApp automation flows for your business.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Communication Style */}
                    {currentStep === 4 && (
                        <div className={`bg-white rounded-2xl shadow-md p-8 transition-all hover:shadow-lg
              ${currentStep === 4 ? 'border-2 border-emerald-500' : 'border border-gray-200'}`}>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose your communication style</h2>
                            <p className="text-gray-600 mb-8">How would you like your WhatsApp messages to sound?</p>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'professional', label: 'Professional', description: 'Formal and business-like', icon: '👔', color: 'blue' },
                                    { id: 'friendly', label: 'Friendly', description: 'Warm and approachable', icon: '😊', color: 'green' },
                                    { id: 'casual', label: 'Casual', description: 'Relaxed and conversational', icon: '🙂', color: 'purple' },
                                    { id: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and excited', icon: '🎉', color: 'orange' }
                                ].map((style) => (
                                    <div
                                        key={style.id}
                                        onClick={() => setCommunicationStyle(style.id)}
                                        className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${communicationStyle === style.id
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center flex-1">
                                            <span className="text-2xl mr-4">{style.icon}</span>
                                            <div>
                                                <h3 className="font-medium text-gray-800">{style.label}</h3>
                                                <p className="text-gray-500 text-sm">{style.description}</p>
                                            </div>
                                        </div>
                                        {communicationStyle === style.id && (
                                            <svg className="w-5 h-5 text-emerald-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="font-medium text-gray-800 mb-4">Example Message Preview</h3>
                                <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                                    <p className="text-gray-600">
                                        {communicationStyle === 'professional' && "Thank you for your inquiry. Your order #12345 has been received and will be processed within 24-48 hours. Please don't hesitate to contact us if you have any questions."}
                                        {communicationStyle === 'friendly' && "Hi there! Thanks for reaching out to us. We've got your order #12345 and we're working on it right now. Feel free to message us if you need anything else!"}
                                        {communicationStyle === 'casual' && "Hey! Got your order #12345 - we're on it! Let us know if you need anything else, ok?"}
                                        {communicationStyle === 'enthusiastic' && "Awesome!!! 🎉 We're SUPER excited to get your order #12345! We're jumping right on it! Can't wait to get this to you ASAP! Don't hesitate to reach out!"}
                                        {!communicationStyle && "Select a communication style to see a preview..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 5 && (
                        <div className={`bg-white rounded-2xl shadow-md p-8 transition-all hover:shadow-lg
              ${currentStep === 5 ? 'border-2 border-emerald-500' : 'border border-gray-200'}`}>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Review your information</h2>
                            <p className="text-gray-600 mb-8">Please confirm your choices before we create your WhatsApp flows.</p>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-all">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <h3 className="font-medium text-gray-800">Business Type</h3>
                                    </div>
                                    <p className="text-gray-700 capitalize pl-7">{businessType || 'Not selected'}</p>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-all">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <h3 className="font-medium text-gray-800">Business Details</h3>
                                    </div>
                                    <div className="pl-7">
                                        <p className="text-gray-700 font-medium">{businessDetails.name}</p>
                                        {businessDetails.website && <p className="text-gray-500 text-sm mt-1">{businessDetails.website}</p>}
                                        <div className="flex mt-2">
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                {businessDetails.size}
                                            </span>
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 ml-2">
                                                {businessDetails.region}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-all">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <h3 className="font-medium text-gray-800">Business Goals</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pl-7">
                                        {businessGoals.length > 0 ? businessGoals.map((goalId) => {
                                            // Find the goal label from the id
                                            const goalLabel = {
                                                'leads': 'Generate leads',
                                                'sales': 'Increase sales',
                                                'support': 'Customer support',
                                                'retention': 'Customer retention',
                                                'automation': 'Automation',
                                                'engagement': 'Customer engagement'
                                            }[goalId] || goalId;

                                            const goalIcon = {
                                                'leads': '🎯',
                                                'sales': '💰',
                                                'support': '🤝',
                                                'retention': '🔄',
                                                'automation': '⚙️',
                                                'engagement': '💬'
                                            }[goalId] || '';

                                            return (
                                                <span key={goalId} className="bg-emerald-500/10 text-emerald-500 text-xs px-3 py-1.5 rounded-full flex items-center">
                                                    <span className="mr-1">{goalIcon}</span>
                                                    {goalLabel}
                                                </span>
                                            );
                                        }) : (
                                            <span className="text-gray-500">No goals selected</span>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-all">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <h3 className="font-medium text-gray-800">Communication Style</h3>
                                    </div>
                                    <div className="pl-7 flex items-center">
                                        <span className="text-gray-700 capitalize">{communicationStyle || 'Not selected'}</span>
                                        {communicationStyle && (
                                            <span className="ml-2">
                                                {{
                                                    'professional': '👔',
                                                    'friendly': '😊',
                                                    'casual': '🙂',
                                                    'enthusiastic': '🎉'
                                                }[communicationStyle] || ''}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-green-50 p-5 rounded-xl border border-green-200 transition-all shadow-sm animate-pulse">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-base text-green-700 font-medium">
                                                Your WhatsApp automation flows are ready to be created!
                                            </p>
                                            <p className="text-sm text-green-600 mt-1">
                                                Click "Next" to continue and chat with our AI to customize your flows further.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: AI Chat */}
                    {currentStep === 6 && (
                        <div className={`bg-white rounded-2xl shadow-md p-8 transition-all hover:shadow-lg
              ${currentStep === 6 ? 'border-2 border-emerald-500' : 'border border-gray-200'}`}>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Chat with our AI assistant</h2>
                            <p className="text-gray-600 mb-8">Ask questions or provide more details about your WhatsApp automation needs.</p>

                            <div
                                ref={chatContainerRef}
                                className="h-96 overflow-y-auto bg-gray-50 rounded-3xl border border-gray-200 p-6 mb-5 flex flex-col space-y-4 shadow-inner"
                            >
                                {aiConversation.messages.map((message, index) => (
                                    <React.Fragment key={index}>
                                        <ChatMessage
                                            content={message.content}
                                            sender={message.role === 'assistant' ? 'ai' : 'user'}
                                            timestamp={message.timestamp || Date.now() - (aiConversation.messages.length - index) * 60000}
                                            isTyping={false}
                                        />
                                        {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                                            <div className="ml-8 mt-2 mb-4 max-w-[80%] space-y-2">
                                                {message.suggestions.map((suggestion, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="w-full text-left text-sm text-gray-600 bg-gray-50 py-2.5 px-3.5 rounded-2xl hover:bg-gray-100 transition-all duration-300 ease-in-out border border-gray-100 hover:border-gray-200 hover:text-gray-800 hover:shadow-sm"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                                {isAiTyping && (
                                    <ChatMessage
                                        content=""
                                        sender="ai"
                                        timestamp={Date.now()}
                                        isTyping={true}
                                    />
                                )}
                            </div>

                            <div className="flex items-center bg-white rounded-3xl shadow-sm border border-gray-200 transition-all duration-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent hover:border-emerald-500/50">
                                <input
                                    type="text"
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    onKeyDown={handleMessageKeyDown}
                                    placeholder="Type your message here..."
                                    className="flex-1 p-4 rounded-3xl border-0 focus:outline-none focus:ring-0 text-gray-800 bg-transparent placeholder-gray-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!userMessage.trim()}
                                    className={`p-4 rounded-r-3xl transition-all duration-300 ${userMessage.trim()
                                            ? 'text-emerald-500 hover:bg-gray-50 hover:text-emerald-500/80'
                                            : 'text-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-6 bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-sm">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 text-blue-500">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700 font-medium">
                                            This is an optional step. Feel free to chat with our AI assistant to get answers to your questions or provide more specific details about your needs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 7: Completion */}
                    {currentStep === 7 && (
                        <div className={`bg-white rounded-2xl shadow-md p-8 transition-all hover:shadow-lg
              ${currentStep === 7 ? 'border-2 border-emerald-500' : 'border border-gray-200'}`}>
                            <div className="text-center">
                                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <h2 className="text-3xl font-bold mb-4 text-gray-800">Onboarding Complete!</h2>
                                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                                    Thank you for completing the onboarding process. Your WhatsApp automation flows are now ready to use!
                                </p>

                                <div className="bg-blue-50 p-6 rounded-2xl mb-10 border border-blue-200 max-w-lg mx-auto">
                                    <h3 className="font-medium text-blue-800 mb-3">What happens next?</h3>
                                    <ul className="text-left text-blue-700 space-y-3">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Your WhatsApp automation flows are being set up</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>You'll be taken to the playground to test your flows</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>You can customize your flows at any time</span>
                                        </li>
                                    </ul>
                                </div>

                                <Link href="/playground">
                                    <button
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-emerald-500 hover:bg-emerald-500/90 transition-all transform hover:scale-105"
                                        onClick={handleCompleteOnboarding}
                                    >
                                        Go to Playground
                                        <svg className="ml-2 -mr-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                    {currentStep > 1 && (
                        <button
                            onClick={handleBack}
                            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    )}

                    {currentStep < 7 && (
                        <button
                            onClick={handleContinue}
                            disabled={!canProceedToNextStep()}
                            className={`ml-auto flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${canProceedToNextStep()
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-500/90 shadow-md hover:shadow-lg'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {currentStep === 6 ? 'Finish' : 'Continue'}
                            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 