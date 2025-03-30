'use client';

import React, { useState, useEffect, useRef } from 'react';
import AIFlowMockup from './AIFlowMockup';

export default function AIFlowGenerator() {
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When component is 20% visible, trigger animation
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect observer after triggering animation
          observer.disconnect();
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2, // 20% visibility triggers the callback
      }
    );

    // Start observing the component
    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={componentRef} 
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Only render the AIFlowMockup when visible to ensure animations start at the right time */}
      {isVisible && <AIFlowMockup />}
    </div>
  );
} 