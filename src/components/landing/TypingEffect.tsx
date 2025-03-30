'use client';

import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export default function TypingEffect({
  text,
  speed = 100,
  delay = 0,
  className = '',
  onComplete
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDelaying, setIsDelaying] = useState(true);

  useEffect(() => {
    if (isDelaying) {
      const delayTimer = setTimeout(() => {
        setIsDelaying(false);
      }, delay);
      
      return () => clearTimeout(delayTimer);
    }
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, isDelaying, onComplete, speed, text]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
} 