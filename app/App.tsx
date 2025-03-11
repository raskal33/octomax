"use client";

import { useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Add a class to the document to enable pixelated rendering
  useEffect(() => {
    // Force pixelated rendering on all text elements
    const style = document.createElement('style');
    style.textContent = `
      /* Ensure text is visible with good contrast */
      body, p, span, div, a {
        font-family: 'VT323', monospace !important;
        color: #FFFFFF !important;
      }
      
      /* Improve text visibility for specific elements */
      .text-gray-300 {
        color: #E0E0E0 !important;
      }
      
      /* Ensure headings are visible */
      h1, h2, h3, h4, h5, h6, button {
        font-family: 'Press Start 2P', monospace !important;
        color: #FFFFFF !important;
      }
      
      /* Add pixelated grid background */
      .pixelated-grid-bg {
        background-image: linear-gradient(rgba(153, 69, 255, 0.1) 1px, transparent 1px),
                          linear-gradient(to right, rgba(153, 69, 255, 0.1) 1px, transparent 1px);
        background-size: 16px 16px;
        image-rendering: pixelated;
      }
      
      /* Improve box shadows for depth */
      .pixel-box {
        box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5) !important;
        transition: all 0.2s ease;
      }
      
      .pixel-box:hover {
        transform: translateY(-2px);
        box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5) !important;
      }
      
      /* Improve button styling */
      button, .btn {
        text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5) !important;
      }
      
      /* Ensure tables are readable */
      table th {
        color: #14F195 !important;
        font-weight: bold !important;
      }
      
      table td {
        color: #FFFFFF !important;
      }
      
      /* Add cool scan lines effect */
      body::after {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.15),
          rgba(0, 0, 0, 0.15) 1px,
          transparent 1px,
          transparent 2px
        );
        pointer-events: none;
        z-index: 9999;
        opacity: 0.3;
      }
      
      /* HEADER SPECIFIC STYLES - HIGH SPECIFICITY */
      html body header a[href] {
        font-size: inherit !important;
      }
      
      html body header a[href].text-\\[\\#14F195\\] {
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
      
      /* PROFILE PAGE SPECIFIC STYLES - HIGH SPECIFICITY */
      html body main .flex.justify-center.space-x-6 > div {
        background-image: var(--tw-gradient-stops) !important;
        transform: scale(1) !important;
        transition: all 0.3s !important;
      }
      
      html body main .flex.justify-center.space-x-6 > div:hover {
        transform: scale(1.05) !important;
        box-shadow: var(--tw-shadow) !important;
      }
      
      html body main .flex.justify-center.space-x-6 > div span.font-bold {
        color: inherit !important;
      }
      
      /* WALLET BUTTON STYLES */
      .wallet-adapter-button {
        font-size: 0.9rem !important;
      }
    `;
    
    // Use a unique ID to avoid duplicate styles
    style.id = 'app-persistent-styles';
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById('app-persistent-styles');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    
    // Add the style element
    document.head.appendChild(style);
    
    return () => {
      const styleToRemove = document.getElementById('app-persistent-styles');
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto my-8 px-4 grow pixelated-grid-bg">
        <div className="flex flex-col gap-16 rounded-lg bg-[#121212] p-4 sm:p-6 md:p-8 lg:p-12 shadow-lg">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
