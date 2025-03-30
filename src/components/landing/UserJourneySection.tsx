'use client';

import React, { useState, useEffect, useRef } from 'react';

interface JourneyStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  index: number;
}

const JourneyStep: React.FC<JourneyStepProps> = ({ icon, title, description, isActive, index }) => {
  return (
    <div className={`flex flex-col items-center transition-all duration-300 ${isActive ? 'opacity-100 scale-105' : 'opacity-60 scale-100'}`}>
      <div className={`relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-gray-50 shadow-md transition-all duration-300 ${isActive ? 'bg-green-50 text-emerald-500 border-emerald-500 shadow-lg' : 'text-gray-500 border-gray-200'}`}>
        <div className="text-2xl md:text-3xl">{icon}</div>
        {index < 4 && (
          <div className={`absolute left-full top-1/2 w-12 md:w-16 lg:w-24 h-0.5 transform -translate-y-1/2 transition-all duration-300 ${isActive ? 'bg-emerald-500' : 'bg-gray-300'} hidden md:block`}>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        )}
      </div>
      <h3 className={`mt-4 font-medium text-center transition-all duration-300 ${isActive ? 'text-emerald-500' : ''}`}>{title}</h3>
      <p className="mt-2 text-center text-sm text-gray-600 max-w-[180px]">{description}</p>
    </div>
  );
};

export default function UserJourneySection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const journeySteps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      title: "Home Page",
      description: "Users land on homepage"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
      title: "AI Conversation",
      description: "Interactive AI guidance"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
      title: "Playground",
      description: "Build your flow"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
        </svg>
      ),
      title: "Optimization",
      description: "A/B testing & deployment"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      title: "Analytics",
      description: "Track & optimize KPIs"
    }
  ];

  // Intersection Observer to trigger animation when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Animate through steps when section is visible
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % journeySteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible, journeySteps.length]);

  const PlaygroundDetails = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg animate-fade-in">
            <h3 className="text-xl font-semibold mb-3">Modern Landing Page</h3>
            <p className="text-gray-600">Users arrive at a clean, modern landing page with a compelling CTA that invites them to create their own WhatsApp automation flow.</p>
            <div className="mt-4 flex justify-center">
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow">Create Your WhatsApp Flow</button>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg animate-fade-in">
            <h3 className="text-xl font-semibold mb-3">AI-Powered Conversation</h3>
            <p className="text-gray-600">The AI assistant engages in a brief, focused conversation to understand your business needs and WhatsApp automation requirements.</p>
            <div className="mt-4 bg-gray-100 p-3 rounded-lg">
              <div className="flex items-start mb-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600 mr-2">AI</div>
                <div className="bg-gray-200 p-2 rounded-lg">What kind of WhatsApp flow are you looking to create?</div>
              </div>
              <div className="flex items-start justify-end">
                <div className="bg-emerald-500 text-white p-2 rounded-lg">A customer support flow for my e-commerce store</div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg animate-fade-in">
            <h3 className="text-xl font-semibold mb-3">Three-Panel Playground</h3>
            <p className="text-gray-600">Customize your WhatsApp flow in our intuitive playground environment.</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-100 p-3 rounded-lg h-auto sm:h-40">
              <div className="bg-white p-2 rounded border text-center flex flex-col items-center justify-center text-xs py-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                AI Chat
              </div>
              <div className="bg-white p-2 rounded border text-center flex flex-col items-center justify-center text-xs py-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                Flow Builder
              </div>
              <div className="bg-white p-2 rounded border text-center flex flex-col items-center justify-center text-xs py-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                Preview
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg animate-fade-in">
            <h3 className="text-xl font-semibold mb-3">One-Click Deployment</h3>
            <p className="text-gray-600">Deploy your flow to the WhatsApp Business API with a single click and test different variants.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow">Deploy Flow</button>
              <button className="px-4 py-2 bg-white border border-emerald-500 text-emerald-500 rounded-lg shadow">A/B Test</button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg animate-fade-in">
            <h3 className="text-xl font-semibold mb-3">Performance Analytics</h3>
            <p className="text-gray-600">Monitor the performance of your WhatsApp flows with detailed analytics and KPIs.</p>
            <div className="mt-4 bg-gray-100 p-3 rounded-lg h-auto sm:h-32 flex items-center justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <div className="bg-white p-2 rounded text-center">
                  <div className="text-emerald-500 font-bold">87%</div>
                  <div className="text-xs text-gray-600">Response Rate</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="text-emerald-500 font-bold">2.5m</div>
                  <div className="text-xs text-gray-600">Avg. Response Time</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="text-emerald-500 font-bold">68%</div>
                  <div className="text-xs text-gray-600">Conversion Rate</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      ref={sectionRef} 
      className={`py-20 px-6 bg-white opacity-0 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : ''}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">The WhatsFlow Journey</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow the seamless user experience from landing page to deployment and analytics.
          </p>
        </div>

        {/* Desktop Journey Steps */}
        <div className="mb-16 hidden md:block">
          <div className="flex justify-between items-start max-w-4xl mx-auto">
            {journeySteps.map((step, index) => (
              <JourneyStep
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                isActive={activeStep === index}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Mobile Journey Steps */}
        <div className="mb-16 md:hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory py-4 -mx-6 px-6 scrollbar-hide">
            <div className="flex gap-6 min-w-max">
              {journeySteps.map((step, index) => (
                <div key={index} className="snap-center" style={{ minWidth: '150px' }}>
                  <JourneyStep
                    icon={step.icon}
                    title={step.title}
                    description={step.description}
                    isActive={activeStep === index}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {journeySteps.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${activeStep === index ? 'bg-emerald-500' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 min-h-[280px] flex items-center justify-center">
          <PlaygroundDetails />
        </div>
      </div>
    </div>
  );
} 