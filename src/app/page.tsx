'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import AIFlowGenerator from '@/components/landing/AIFlowGenerator';
import TypingEffect from '@/components/landing/TypingEffect';
import MockPlayground from '@/components/landing/MockPlayground';
import UserJourneySection from '@/components/landing/UserJourneySection';

// Demo feature data
const features = [
  {
    id: 1,
    title: 'AI-Powered Flow Creation',
    description: 'Let AI generate tailored WhatsApp flows instantly based on your needs.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-500">
        <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
        <path d="M20 10a8 8 0 1 0-16 0" />
        <path d="M2 10h10v10" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Drag-and-Drop Editor',
    description: 'Customize your flows with an intuitive visual editor - no coding required.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-500">
        <path d="M21 9V6a2 2 0 0 0-2-2H9" />
        <path d="M3 16v3a2 2 0 0 0 2 2h10" />
        <path d="M21 16v-3a2 2 0 0 0-2-2H9" />
        <path d="M3 9V6a2 2 0 0 1 2-2h10" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Real-time Preview',
    description: 'Watch your flow come to life as you build it – no surprises.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-500">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'WhatsApp API Deployment',
    description: 'Deploy your flows to WhatsApp Business API with just one click.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-500">
        <path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z" />
        <path d="M14 10v10a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z" />
        <path d="M21 9v11a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z" />
        <path d="M22 2H2" />
        <path d="M7 6V2" />
        <path d="M14 6V2" />
        <path d="M21 6V2" />
      </svg>
    ),
  },
];

// Demo testimonials
const testimonials = [
  {
    id: 1,
    text: "WhatsFlow has transformed how we handle customer support. Our response time has decreased by 75%!",
    author: "Sarah Johnson",
    role: "Customer Support Manager",
    company: "TechGlobe",
  },
  {
    id: 2,
    text: "Creating automated flows for our product launches used to take days. With WhatsFlow, we can set them up in minutes.",
    author: "Michael Chen",
    role: "Marketing Director",
    company: "NovaSphere",
  },
];

export default function LandingPage() {
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const openDemoVideo = () => setShowDemoVideo(true);
  const closeDemoVideo = () => setShowDemoVideo(false);

  return (
    <div className="bg-gray-50 overflow-auto">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white to-gray-100 py-20 px-6 md:py-28 pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'The Silver Editorial', serif" }}>
              <span className="font-normal">WhatsFlow</span> <span className="italic">–</span> <span className="block md:inline">Build Seamless WhatsApp </span>
              <TypingEffect
                text="Automations with Ease!"
                className="italic"
                speed={80}
                delay={1200}
              />
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl">
              Streamline Your WhatsApp Interactions with AI-Powered Automation
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/onboarding"
                className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-[8px] shadow-lg hover:bg-emerald-800 transition-colors"
              >
                Get Started with WhatsFlow
              </Link>
              <button
                onClick={openDemoVideo}
                className="px-8 py-4 cursor-pointer rounded-[8px] shadow-md border-emerald-500 border-2 
                text-emerald-500 text-bold hover:text-white hover:bg-emerald-600 transition-colors"
              >
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative mt-16">
            <div className="relative overflow-hidden rounded-xl shadow-2xl max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-200/30 to-transparent pointer-events-none z-10"></div>
              <MockPlayground />
            </div>
          </div>
        </div>
      </div>

      {/* Video Demo Modal */}
      {showDemoVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300">
          <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden">
            <button
              onClick={closeDemoVideo}
              className="absolute top-4 right-4 z-10  rounded-full p-2 transition-colors bg-black/20 hover:bg-black/40"
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Container - Using an embedded YouTube video instead of local file */}
            <div className="aspect-video w-full bg-black relative">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/_sNS74tygXw?autoplay=1&mute=0"
                title="WhatsFlow Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* Fallback content if iframe doesn't load */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 opacity-0 pointer-events-none">
                <p className=" text-center px-4">
                  Video could not be loaded. Please try again later.
                </p>
                <button
                  className="mt-4 px-6 py-2 bg-emerald-500  rounded-lg"
                  onClick={closeDemoVideo}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 bg-white">
              <h3 className="text-2xl font-bold mb-2">WhatsFlow Demo</h3>
              <p className="text-gray-600">
                See how WhatsFlow helps businesses automate WhatsApp interactions with AI-powered workflows.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What is WhatsFlow?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              WhatsFlow helps businesses automate customer interactions on WhatsApp with AI-generated,
              customizable flows. Say goodbye to manual responses and hello to streamlined,
              efficient communication.
            </p>
          </div>

          <div>
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full -mr-20 -mt-20 opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-50 rounded-full -ml-10 -mb-10 opacity-30"></div>
              <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-yellow-100 rounded-full transform -translate-y-1/2 opacity-60"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-12 md:mb-0 md:mr-12 max-w-xl">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">Create AI-Powered WhatsApp Flows in Minutes</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      WhatsFlow combines the power of AI with an intuitive design interface, allowing you to create
                      sophisticated WhatsApp automation flows without any technical expertise.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Describe your flow in plain English",
                        "AI automatically generates a complete flow",
                        "Customize with our visual editor",
                        "Test in real-time",
                        "Deploy to WhatsApp with one click",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-2/5">
                    {/* Add phone frame around the mockup */}
                    <div className="relative">
                      {/* Phone frame shadow */}
                      <div className="absolute -inset-4 bg-gradient-to-tr from-gray-200 to-white rounded-3xl -z-10 shadow-xl"></div>

                      {/* Subtle highlight reflection */}
                      <div className="absolute -right-2 -top-2 w-12 h-12 bg-green-100 rounded-full blur-xl opacity-60"></div>
                      <div className="absolute -left-3 -bottom-3 w-16 h-16 bg-blue-100 rounded-full blur-xl opacity-40"></div>

                      {/* The actual mockup component */}
                      <AIFlowGenerator />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, customize, and deploy WhatsApp automation flows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 flex flex-col"
              >
                <div className="bg-green-50 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 flex-grow">{feature.description}</p>
                <div className="mt-4">
                  <a href="#" className="text-emerald-500 font-medium flex items-center hover:underline">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Journey Section */}
      <UserJourneySection />

      {/* Testimonials */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of businesses that have transformed their WhatsApp communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-lg"
              >
                <svg className="w-10 h-10 text-green-200 mb-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H7c0-1.7 1.3-3 3-3V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-7c0-1.7 1.3-3 3-3V8z" />
                </svg>
                <p className="text-gray-700 mb-6 italic">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-emerald-500 mr-4">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-800 text-white rounded-2xl shadow-xl p-12  text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your WhatsApp Experience?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Join thousands of businesses using WhatsFlow to create seamless, automated WhatsApp interactions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/onboarding"
                className="px-8 py-4 bg-white font-medium rounded-[8px] shadow-lg hover:bg-gray-100 transition-colors text-emerald-500"
              >
                Get Started with WhatsFlow
              </Link>
            </div>
            <p className="mt-4 text-sm opacity-80">No credit card required. Free plan available.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-emerald-500 mb-2">WhatsFlow</h2>
              <p className="text-gray-600">AI-powered WhatsApp flows</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
              <div>
                <h3 className="font-bold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Features</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Pricing</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Demo</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Documentation</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Blog</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Guides</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">About</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Careers</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Privacy</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Terms</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-emerald-500">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">© {new Date().getFullYear()} WhatsFlow. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-emerald-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 