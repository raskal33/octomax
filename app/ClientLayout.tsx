"use client";

import { useEffect, useState } from "react";
import App from "./App";
import dynamic from "next/dynamic";
import PixelatedStyles from "./components/PixelatedStyles";

// Dynamically import AppWalletProvider with ssr disabled
const AppWalletProvider = dynamic(
  () => import("./AppWalletProvider"),
  { ssr: false }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true when component mounts on client
    setMounted(true);
    console.log("ClientLayout mounted");
    
    // Add pixelated class to document root
    document.documentElement.classList.add('pixelated-text');
    
    // Force a re-render of styles after hydration
    const forceStylesTimeout = setTimeout(() => {
      // Create a style element with !important rules
      const style = document.createElement('style');
      style.id = 'hydration-fix-styles';
      style.textContent = `
        /* HEADER NAVIGATION LINKS */
        html body header a[href].header-active-link {
          color: #14F195 !important;
          font-weight: bold !important;
        }
        
        html body header a[href].header-inactive-link:hover {
          color: #9945FF !important;
        }
        
        /* PROFILE PAGE STAT BOXES */
        #profile-stats-container {
          display: flex !important;
          justify-content: center !important;
          gap: 1.5rem !important;
          margin-top: 1rem !important;
        }
        
        .profile-stat-box {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          padding: 0.75rem !important;
          border-radius: 0.5rem !important;
          transition: all 0.3s ease !important;
          transform: scale(1) !important;
        }
        
        .profile-stat-box-1 {
          background: linear-gradient(to bottom right, #121212, rgba(20, 241, 149, 0.2)) !important;
        }
        
        .profile-stat-box-2 {
          background: linear-gradient(to bottom right, #121212, rgba(153, 69, 255, 0.2)) !important;
        }
        
        .profile-stat-box-3 {
          background: linear-gradient(to bottom right, #121212, rgba(0, 194, 255, 0.2)) !important;
        }
        
        .profile-stat-value-1 {
          color: #14F195 !important;
          font-weight: bold !important;
          font-size: 1.25rem !important;
        }
        
        .profile-stat-value-2 {
          color: #9945FF !important;
          font-weight: bold !important;
          font-size: 1.25rem !important;
        }
        
        .profile-stat-value-3 {
          color: #00C2FF !important;
          font-weight: bold !important;
          font-size: 1.25rem !important;
        }
        
        /* WALLET BUTTON */
        html body button.wallet-adapter-button {
          font-size: 0.9rem !important;
        }
        
        /* Fix for wallet adapter button */
        .wallet-adapter-button {
          background-color: #512da8 !important;
        }
        
        .wallet-adapter-button-trigger {
          background-color: #512da8 !important;
        }
        
        .wallet-adapter-dropdown-list {
          background-color: #1a1a1a !important;
        }
        
        .wallet-adapter-dropdown-list-item {
          color: #fff !important;
        }
      `;
      
      // Remove existing style if it exists
      const existingStyle = document.getElementById('hydration-fix-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
      
      // Add the style element at the end of head
      document.head.appendChild(style);
    }, 100); // Small delay to ensure it runs after hydration
    
    return () => {
      clearTimeout(forceStylesTimeout);
      const styleToRemove = document.getElementById('hydration-fix-styles');
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, []);

  return (
    <>
      <PixelatedStyles />
      {mounted ? (
        <AppWalletProvider>
          <App>{children}</App>
        </AppWalletProvider>
      ) : (
        // Show a loading spinner until client-side rendering is ready
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
} 