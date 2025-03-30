'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-emerald-500 mr-2">WhatsFlow</Link>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <Link href="#features" className="text-gray-700 hover:text-emerald-500 transition-colors">
            Features
          </Link>
          <Link href="#about" className="text-gray-700 hover:text-emerald-500 transition-colors">
            About
          </Link>
          <Link href="#testimonials" className="text-gray-700 hover:text-emerald-500 transition-colors">
            Testimonials
          </Link>
          <Link href="/playground" className="text-gray-700 hover:text-emerald-500 transition-colors">
            Playground
          </Link>
          <Link href="/dashboard" className="text-gray-700 hover:text-emerald-500 transition-colors">
            Dashboard
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/playground" className="hidden sm:inline-block px-4 py-2 text-gray-700 hover:text-emerald-500 transition-colors">
            Try Demo
          </Link>
          <button className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
            scrolled 
              ? 'bg-whatsapp text-white hover:bg-whatsapp-dark' 
              : 'bg-white text-emerald-500 hover:bg-gray-100'
          }`}>
            Sign Up Free
          </button>
        </div>
      </div>
    </nav>
  );
} 