"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Display from "./Display";
import MatchDataTable from "./Table";
import DateSelector from "./DateSelector";
import { FaBrain, FaChartLine, FaRobot, FaShieldAlt } from "react-icons/fa";

export default function OctoAI() {
  const [selectedDate, setSelectedDate] = useState<string>("0");
  const [activeTab, setActiveTab] = useState(0);
  const [_isVisible, setIsVisible] = useState(false);

  useState(() => {
    setIsVisible(true);
  });

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 pixel-border bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-6 text-center pixel-box hover:from-[#14F195]/5 hover:to-[#9945FF]/10 transition-all duration-300 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[30%] left-[20%] w-16 h-16 bg-[#14F195] rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-[40%] left-[70%] w-20 h-20 bg-[#9945FF] rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <h1 className="mb-4 text-2xl font-bold pixel-heading">
          <span className="bg-gradient-to-r from-[#14F195] via-[#9945FF] to-[#00C2FF] text-transparent bg-clip-text">OctoAI Predictions</span>
        </h1>
        <div className="mx-auto mb-4 h-4 w-32 bg-gradient-to-r from-[#14F195] via-[#9945FF] to-[#00C2FF]"
             style={{ 
               clipPath: 'polygon(0% 0%, 25% 100%, 50% 0%, 75% 100%, 100% 0%)',
               imageRendering: 'pixelated'
             }}></div>
        <p className="text-gray-300 pixel-text-sm">AI-Powered <span className="text-[#14F195]">Match Predictions</span> with <span className="text-[#9945FF]">High Accuracy</span></p>
        
        {/* Quick stats */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-[#14F195] font-bold text-xl">
              <FaRobot className="inline-block mr-1" />
              AI
            </span>
            <span className="text-gray-400 text-xs">Analysis</span>
          </div>
          <div className="w-px h-10 bg-[#9945FF]/30"></div>
          <div className="flex flex-col items-center">
            <span className="text-[#9945FF] font-bold text-xl">
              <FaChartLine className="inline-block mr-1" />
              95%
            </span>
            <span className="text-gray-400 text-xs">Accuracy</span>
          </div>
          <div className="w-px h-10 bg-[#9945FF]/30"></div>
          <div className="flex flex-col items-center">
            <span className="text-[#00C2FF] font-bold text-xl">
              <FaShieldAlt className="inline-block mr-1" />
              24/7
            </span>
            <span className="text-gray-400 text-xs">Updates</span>
          </div>
        </div>
      </motion.div>
      
      <DateSelector value={selectedDate} onChange={handleDateChange} />
      
      <Display value={selectedDate} tabIndex={activeTab} />
      
      <div className="mb-8 flex h-12 w-full cursor-pointer select-none overflow-hidden rounded-lg bg-[#121212] text-sm font-semibold">
        <div
          onClick={() => setActiveTab(0)}
          className={`${activeTab === 0 ? "bg-[#9945FF] text-white" : "text-gray-400 hover:bg-[#9945FF]/70 hover:text-white"} flex basis-1/2 items-center justify-center uppercase transition-all duration-200`}
        >
          Sure Bets
        </div>
        <div
          onClick={() => setActiveTab(1)}
          className={`${activeTab === 1 ? "bg-[#9945FF] text-white" : "text-gray-400 hover:bg-[#9945FF]/70 hover:text-white"} flex basis-1/2 items-center justify-center uppercase transition-all duration-200`}
        >
          Daily Parlay
        </div>
      </div>
      
      <MatchDataTable value={selectedDate} tabIndex={activeTab} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]"
      >
        <h2 className="text-xl font-bold text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="bg-[#0d0d0d] p-6 rounded-lg border border-[#2A2A2A] hover:border-[#14F195]/50 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#14F195]/20 flex items-center justify-center text-[#14F195] mr-3">
                <FaBrain size={20} />
              </div>
              <h3 className="text-lg font-medium text-[#14F195]">AI Analysis</h3>
            </div>
            <p className="text-gray-400">
              Our advanced AI algorithms analyze historical data, team performance, player statistics, and market trends to generate highly accurate predictions with proven success rates.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-[#0d0d0d] p-6 rounded-lg border border-[#2A2A2A] hover:border-[#9945FF]/50 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#9945FF]/20 flex items-center justify-center text-[#9945FF] mr-3">
                <FaChartLine size={20} />
              </div>
              <h3 className="text-lg font-medium text-[#9945FF]">Dual Categorization</h3>
            </div>
            <p className="text-gray-400">
              Matches can be categorized as both Sure Bets (high confidence individual picks) and Daily Parlay (optimal accumulator combinations) to maximize your betting strategy and potential returns.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-[#0d0d0d] p-6 rounded-lg border border-[#2A2A2A] hover:border-[#00C2FF]/50 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#00C2FF]/20 flex items-center justify-center text-[#00C2FF] mr-3">
                <FaShieldAlt size={20} />
              </div>
              <h3 className="text-lg font-medium text-[#00C2FF]">Verified Results</h3>
            </div>
            <p className="text-gray-400">
              All predictions are tracked and verified with transparent results and accuracy metrics. Our system continuously learns from outcomes to improve future predictions and maintain high success rates.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 