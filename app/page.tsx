"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight, FaChartLine, FaRobot, FaTrophy, FaUserAstronaut } from "react-icons/fa";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="mb-8 pixel-border bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-6 text-center pixel-box hover:from-[#14F195]/5 hover:to-[#9945FF]/10 transition-all duration-300 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[30%] left-[20%] w-16 h-16 bg-[#14F195] rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-[40%] left-[70%] w-20 h-20 bg-[#9945FF] rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <h1 className="mb-4 text-4xl font-bold pixel-heading">
          Welcome to <span className="bg-gradient-to-r from-[#14F195] via-[#9945FF] to-[#00C2FF] text-transparent bg-clip-text">OctoPaul</span>
        </h1>
        <div className="mx-auto mb-4 h-4 w-48 bg-gradient-to-r from-[#14F195] via-[#9945FF] to-[#00C2FF]"
             style={{ 
               clipPath: 'polygon(0% 0%, 12.5% 100%, 25% 0%, 37.5% 100%, 50% 0%, 62.5% 100%, 75% 0%, 87.5% 100%, 100% 0%)',
               imageRendering: 'pixelated'
             }}></div>
        <p className="text-gray-300 pixel-text-sm">Your ultimate platform for <span className="text-[#14F195]">sports predictions</span> and <span className="text-[#9945FF]">decentralized betting.</span></p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A] hover:border-[#9945FF]/50 transition-all duration-300 relative overflow-hidden"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          {/* Background glow effect */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#9945FF]/20 rounded-full blur-xl"></div>
          
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#9945FF]/20 flex items-center justify-center text-[#9945FF] mr-4">
              <FaTrophy size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">OctoMax Challenge</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Compete against other players by predicting match outcomes. Make 10 selections to qualify for the leaderboard and win prizes.
          </p>
          <Link href="/octomax">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pixel-border flex items-center gap-2 bg-gradient-to-r from-[#9945FF] to-[#9945FF]/80 px-6 py-3 text-sm font-bold text-white pixel-box hover:shadow-[0_0_15px_rgba(153,69,255,0.5)] transition-all duration-300"
            >
              Enter Challenge <FaArrowRight />
            </motion.button>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A] hover:border-[#14F195]/50 transition-all duration-300 relative overflow-hidden"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          {/* Background glow effect */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#14F195]/20 rounded-full blur-xl"></div>
          
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#14F195]/20 flex items-center justify-center text-[#14F195] mr-4">
              <FaRobot size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">OctoAI Predictions</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Get AI-powered match predictions with high accuracy. Browse Sure Bets for high-confidence picks and Daily Parlay for accumulator bets.
          </p>
          <Link href="/octoai">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pixel-border flex items-center gap-2 bg-gradient-to-r from-[#14F195] to-[#14F195]/80 px-6 py-3 text-sm font-bold text-black pixel-box hover:shadow-[0_0_15px_rgba(20,241,149,0.5)] transition-all duration-300"
            >
              View Predictions <FaArrowRight />
            </motion.button>
          </Link>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A] hover:border-[#00C2FF]/50 transition-all duration-300 relative overflow-hidden"
        whileHover={{ scale: 1.01 }}
      >
        {/* Background glow effect */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#00C2FF]/20 rounded-full blur-xl"></div>
        
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[#00C2FF]/20 flex items-center justify-center text-[#00C2FF] mr-4">
            <FaUserAstronaut size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Your Profile</h2>
        </div>
        <p className="text-gray-400 mb-6">
          Track your prediction history, view your stats, and manage your account settings. Connect your wallet to get started.
        </p>
        <Link href="/profile">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pixel-border flex items-center gap-2 border-2 border-[#00C2FF] bg-transparent px-6 py-3 text-sm font-bold text-[#00C2FF] pixel-box hover:bg-[#00C2FF]/10 hover:shadow-[0_0_15px_rgba(0,194,255,0.5)] transition-all duration-300"
          >
            View Profile <FaUserAstronaut />
          </motion.button>
        </Link>
      </motion.div>
      
      {/* Pixelated footer decoration */}
      <div className="mt-8 h-8 w-full bg-gradient-to-r from-[#14F195] via-[#9945FF] to-[#00C2FF]"
           style={{ 
             clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)',
             imageRendering: 'pixelated'
           }}>
      </div>
    </div>
  );
}
