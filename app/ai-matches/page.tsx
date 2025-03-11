"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Display from "./Display";
import MatchDataTable from "./Table";
import DateSelector from "./DateSelector";
import { FaBrain, FaChartLine, FaShieldAlt } from "react-icons/fa";

export default function AIMatches() {
  const [selectedDate, setSelectedDate] = useState<string>("0");
  const [activeTab, setActiveTab] = useState(0);

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">AI Match Predictions</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Our AI analyzes thousands of matches to provide you with the most accurate predictions.
          Matches are categorized as Sure Bets (high confidence) and Daily Parlay (recommended for accumulator bets).
        </p>
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