"use client";

import { useEffect } from 'react';

export default function PixelatedStyles() {
  useEffect(() => {
    // Add pixelated class to document root
    document.documentElement.classList.add('pixelated-text');
    
    // Create a style element to enforce pixelated rendering
    const style = document.createElement('style');
    
    // Use a unique ID to avoid duplicate styles and check if it already exists
    style.id = 'pixelated-persistent-styles';
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById('pixelated-persistent-styles');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    
    style.textContent = `
      /* Force pixelated rendering on all text */
      html, body, h1, h2, h3, h4, h5, h6, p, span, div, button, input, a {
        font-family: 'VT323', 'Press Start 2P', monospace !important;
        -webkit-font-smoothing: none !important;
        -moz-osx-font-smoothing: grayscale !important;
        font-smooth: never !important;
        text-rendering: geometricPrecision !important;
      }
      
      /* Ensure pixelated rendering for specific elements */
      .pixelated, .pixelated * {
        image-rendering: pixelated !important;
        image-rendering: -moz-crisp-edges !important;
        image-rendering: crisp-edges !important;
        -ms-interpolation-mode: nearest-neighbor !important;
      }
      
      /* Improve text visibility */
      .text-gray-300 {
        color: #E0E0E0 !important;
      }
      
      /* Cool pixelated hover effects */
      .pixel-box {
        transition: all 0.1s steps(2) !important;
        position: relative;
        overflow: hidden;
      }
      
      .pixel-box:hover {
        transform: translateY(-2px);
        box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.7) !important;
      }
      
      /* Add pixelated glow effect on hover */
      .pixel-box::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, rgba(153, 69, 255, 0) 0%, rgba(153, 69, 255, 0.1) 100%);
        opacity: 0;
        transition: opacity 0.2s steps(3);
        pointer-events: none;
      }
      
      .pixel-box:hover::after {
        opacity: 1;
      }
      
      /* Pixelated button hover effect */
      button:hover, .btn:hover {
        transform: translateY(-2px);
        transition: transform 0.1s steps(2) !important;
      }
      
      /* Pixelated animations */
      @keyframes pixel-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .pixel-animate {
        animation: pixel-pulse 0.8s steps(4) infinite;
      }
      
      /* Pixelated text shadow for better readability */
      .pixel-text, h1, h2, h3, h4, h5, h6 {
        text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.7) !important;
      }
      
      /* Pixelated border for tables */
      table {
        border-collapse: separate;
        border-spacing: 0;
        border: 4px solid #9945FF;
        border-radius: 8px;
        overflow: hidden;
      }
      
      /* Ensure table headers are visible */
      table th {
        background-color: #121212 !important;
        color: #14F195 !important;
        font-weight: bold !important;
        text-transform: uppercase;
        padding: 12px !important;
      }
      
      /* Ensure table cells are visible */
      table td {
        padding: 10px !important;
        border-bottom: 1px solid rgba(153, 69, 255, 0.3) !important;
      }
      
      /* Alternating row colors for better readability */
      table tr:nth-child(even) {
        background-color: rgba(153, 69, 255, 0.05) !important;
      }
      
      /* Table row hover effect */
      table tr:hover {
        background-color: rgba(153, 69, 255, 0.1) !important;
      }
      
      /* Improve form input visibility */
      input, select, textarea {
        background-color: #1E1E1E !important;
        border: 2px solid #9945FF !important;
        color: white !important;
        padding: 8px 12px !important;
      }
      
      /* Pixelated scrollbar */
      ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }
      
      ::-webkit-scrollbar-track {
        background: #121212;
        border: 2px solid #222;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #9945FF;
        border: 2px solid #000;
        image-rendering: pixelated;
      }
      
      /* Cool selection colors */
      ::selection {
        background: rgba(153, 69, 255, 0.7);
        color: white;
        text-shadow: none;
      }
      
      /* Pixelated grid background */
      .pixelated-grid-bg {
        background-image: linear-gradient(rgba(153, 69, 255, 0.1) 1px, transparent 1px),
                          linear-gradient(to right, rgba(153, 69, 255, 0.1) 1px, transparent 1px);
        background-size: 16px 16px;
        image-rendering: pixelated;
      }
      
      /* Neon glow effect for important elements */
      .neon-glow {
        box-shadow: 0 0 5px #9945FF, 0 0 10px #9945FF, 0 0 15px #9945FF;
        transition: all 0.2s steps(3);
      }
      
      .neon-glow:hover {
        box-shadow: 0 0 10px #9945FF, 0 0 20px #9945FF, 0 0 30px #9945FF;
      }
      
      /* Pixelated hover effect for clickable elements */
      [class*="cursor-pointer"] {
        transition: all 0.1s steps(2);
      }
      
      [class*="cursor-pointer"]:hover {
        transform: scale(1.02);
      }
      
      /* Pixelated focus effect for form elements */
      input:focus, select:focus, textarea:focus {
        outline: none;
        box-shadow: 0 0 0 2px #9945FF, 0 0 0 4px rgba(153, 69, 255, 0.3);
        border-color: #9945FF !important;
      }
    `;
    
    // Append the style element at the end of head to ensure it has higher priority
    document.head.appendChild(style);
    
    // Create a small delay to ensure our styles are applied after any framework styles
    setTimeout(() => {
      // Force a re-application of critical styles
      const criticalStyle = document.createElement('style');
      criticalStyle.id = 'critical-styles';
      criticalStyle.textContent = `
        /* HEADER SPECIFIC STYLES - HIGHEST SPECIFICITY */
        html body header a[href].text-\\[\\#14F195\\].font-bold {
          color: #14F195 !important;
          font-weight: bold !important;
        }
        
        html body header a[href]:hover {
          color: #9945FF !important;
        }
        
        html body header a[href].text-base.md\\:text-lg {
          font-size: 1rem !important;
        }
        
        @media (min-width: 768px) {
          html body header a[href].text-base.md\\:text-lg {
            font-size: 1.125rem !important;
          }
        }
        
        /* PROFILE PAGE SPECIFIC STYLES - HIGHEST SPECIFICITY */
        html body main .flex.justify-center.space-x-6 > div.bg-gradient-to-br {
          background-image: var(--tw-gradient-stops) !important;
          transform: scale(1) !important;
          transition: all 0.3s !important;
        }
        
        html body main .flex.justify-center.space-x-6 > div.bg-gradient-to-br:hover {
          transform: scale(1.05) !important;
          box-shadow: var(--tw-shadow) !important;
        }
        
        /* WALLET BUTTON STYLES */
        .wallet-adapter-button {
          font-size: 0.9rem !important;
        }
      `;
      
      // Remove existing critical style if it exists
      const existingCriticalStyle = document.getElementById('critical-styles');
      if (existingCriticalStyle) {
        document.head.removeChild(existingCriticalStyle);
      }
      
      document.head.appendChild(criticalStyle);
    }, 100);
    
    return () => {
      // Clean up
      const styleToRemove = document.getElementById('pixelated-persistent-styles');
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
      
      const criticalStyleToRemove = document.getElementById('critical-styles');
      if (criticalStyleToRemove) {
        document.head.removeChild(criticalStyleToRemove);
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
} 