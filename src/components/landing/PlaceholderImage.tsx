'use client';

import React from 'react';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
}

export default function PlaceholderImage({
  width = 1200,
  height = 650,
  text = 'WhatsFlow Dashboard',
  className = '',
}: PlaceholderImageProps) {
  const color = '#25D366'; // WhatsApp green
  const textColor = '#FFFFFF';
  
  // Create SVG data URL
  const svgImage = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" 
        text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${text}</text>
    </svg>
  `;
  
  const encodedSvg = encodeURIComponent(svgImage);
  const dataUrl = `data:image/svg+xml,${encodedSvg}`;

  return (
    <img 
      src={dataUrl} 
      alt={text} 
      width={width} 
      height={height}
      className={className}
    />
  );
} 