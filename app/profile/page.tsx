"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { FaCopy, FaCheck, FaTrophy } from "react-icons/fa";
import { useWallet } from "@solana/wallet-adapter-react";

// Types matching Solana program structures
interface UserStats {
  player: PublicKey;
  totalBets: number;
  winningBets: number;
  totalWinnings: number;
  bestOddsHit: number;
  bestCorrectCount: number;
  lastBetTimestamp: number;
}

interface BettingSlip {
  player: PublicKey;
  totalStake: number;
  predictions: [number, number][]; // Array of 10 [moneyline, overUnder] predictions
  matches: PublicKey[]; // Array of 10 match pubkeys
  matchResults: [number, number][]; // Array of 10 [moneyline, overUnder] results
  timestamp: number;
  correctCount: number;
  cumulativeOdds: number;
  isInitialized: boolean;
  isQualified: boolean;
  isPrizeClaimed: boolean;
  isSettled: boolean;
  isWinner: boolean;
  resolutionTimestamp: number;
}

const ENTRY_FEE = 0.07; // SOL

// Winner badge thresholds
const WINNER_TIERS = {
  BRONZE: { wins: 1, color: "#CD7F32", label: "Bronze Winner" },
  SILVER: { wins: 5, color: "#C0C0C0", label: "Silver Winner" },
  GOLD: { wins: 10, color: "#FFD700", label: "Gold Winner" },
  PLATINUM: { wins: 20, color: "#E5E4E2", label: "Platinum Winner" },
};

export default function ProfilePage() {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState("overview");
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activeSlips, setActiveSlips] = useState<BettingSlip[]>([]);
  const [pastSlips, setPastSlips] = useState<BettingSlip[]>([]);
  const [expandedSlips, setExpandedSlips] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  // Calculate additional stats
  const totalSlips = (userStats?.totalBets || 0) + activeSlips.length;
  const slipsToday = activeSlips.length + pastSlips.filter(slip => 
    new Date(slip.timestamp).toDateString() === new Date().toDateString()
  ).length;
  const volumeGenerated = totalSlips * ENTRY_FEE;
  
  // Calculate prediction accuracy
  const totalPredictions = totalSlips * 10; // 10 predictions per slip
  const correctPredictions = pastSlips.reduce((acc, slip) => acc + slip.correctCount, 0);
  const predictionAccuracy = totalPredictions > 0 
    ? (correctPredictions / totalPredictions) * 100 
    : 0;

  const copyToClipboard = async () => {
    if (!userStats) return;
    try {
      await navigator.clipboard.writeText(userStats.player.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate Octo username with consistent ID
  const generateOctoId = (pubkey: string) => {
    // Use the last 4 bytes of the public key to generate a consistent number
    const idNumber = parseInt(pubkey.slice(-8), 16) % 10000;
    return `Octo${idNumber.toString().padStart(4, '0')}`;
  };

  // Determine winner tier based on winning bets
  const getWinnerTier = (winningBets: number) => {
    if (winningBets >= 20) return WINNER_TIERS.PLATINUM;
    if (winningBets >= 10) return WINNER_TIERS.GOLD;
    if (winningBets >= 5) return WINNER_TIERS.SILVER;
    if (winningBets >= 1) return WINNER_TIERS.BRONZE;
    return null;
  };

  // Fetch user stats and slips
  useEffect(() => {
    // TODO: Replace with actual wallet connection
    const connectedWallet = wallet.publicKey || new PublicKey("FCfTtT88vW8yqvVFdoKsyB7gV4J2UK5PEkVG8oX9JLxe");

    // TODO: Implement actual data fetching from Solana
    setUserStats({
      player: connectedWallet,
      totalBets: 25,
      winningBets: 12,
      totalWinnings: 2.5,
      bestOddsHit: 12.5,
      bestCorrectCount: 8,
      lastBetTimestamp: Date.now(),
    });

    // Mock active slips (today's unresolved)
    setActiveSlips([
      {
        player: new PublicKey("FCfTtT88vW8yqvVFdoKsyB7gV4J2UK5PEkVG8oX9JLxe"),
        totalStake: ENTRY_FEE,
        predictions: Array(10).fill([1, 255]), // Example: all "1" predictions
        matches: Array(10).fill(new PublicKey("FCfTtT88vW8yqvVFdoKsyB7gV4J2UK5PEkVG8oX9JLxe")),
        matchResults: Array(10).fill([0, 0]),
        timestamp: Date.now(),
        correctCount: 0,
        cumulativeOdds: 1000,
        isInitialized: true,
        isQualified: false,
        isPrizeClaimed: false,
        isSettled: false,
        isWinner: false,
        resolutionTimestamp: 0,
      },
    ]);

    // Mock past slips
    setPastSlips([
      {
        player: new PublicKey("FCfTtT88vW8yqvVFdoKsyB7gV4J2UK5PEkVG8oX9JLxe"),
        totalStake: ENTRY_FEE,
        predictions: Array(10).fill([1, 255]),
        matches: Array(10).fill(new PublicKey("FCfTtT88vW8yqvVFdoKsyB7gV4J2UK5PEkVG8oX9JLxe")),
        matchResults: Array(10).fill([1, 255]),
        timestamp: Date.now() - 86400000,
        correctCount: 7,
        cumulativeOdds: 1500,
        isInitialized: true,
        isQualified: true,
        isPrizeClaimed: true,
        isSettled: true,
        isWinner: true,
        resolutionTimestamp: Date.now() - 43200000,
      },
    ]);
  }, [wallet.publicKey]);

  const toggleSlip = (index: number) => {
    setExpandedSlips((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const renderProfileHeader = () => {
    if (!userStats) return null;

    const winnerTier = getWinnerTier(userStats.winningBets);
    const octoUsername = generateOctoId(userStats.player.toString());

    const quickStats = [
      {
        label: "Total Slips",
        value: totalSlips,
        color: "bg-[#14F195]/10",
      },
      {
        label: "Slips Today",
        value: slipsToday,
        color: "bg-[#9945FF]/10",
      },
      {
        label: "Volume Generated",
        value: `${volumeGenerated.toFixed(2)} SOL`,
        color: "bg-[#00C2FF]/10",
      },
      {
        label: "Prediction Accuracy",
        value: `${predictionAccuracy.toFixed(1)}%`,
        color: "bg-[#14F195]/10",
      },
    ];

  return (
      <div className="mb-8 space-y-6">
        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2A2A2A] hover:border-[#14F195]/50 transition-colors duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{octoUsername}</h1>
                {winnerTier && (
                  <div 
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                    style={{ 
                      backgroundColor: `${winnerTier.color}20`,
                      color: winnerTier.color 
                    }}
                  >
                    <FaTrophy className="w-3 h-3" />
                    {winnerTier.label}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-400">Active since {new Date(userStats.lastBetTimestamp - 86400000 * 30).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Wallet:</span>
                <code className="text-sm bg-[#121212] px-2 py-1 rounded border border-[#2A2A2A]">
                  {userStats.player.toString().slice(0, 8)}...{userStats.player.toString().slice(-8)}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-[#14F195] transition-colors p-2 hover:bg-[#14F195]/10 rounded-full"
                >
                  {copied ? <FaCheck className="w-4 h-4" /> : <FaCopy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat) => (
              <motion.div
                key={stat.label}
                className={`p-4 rounded-lg ${stat.color} border border-[#2A2A2A] hover:border-[#14F195]/50 transition-all duration-300 hover:scale-[1.02]`}
                whileHover={{ y: -2 }}
              >
                <div className="text-sm font-medium mb-1 text-gray-400">{stat.label}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#14F195]/20 to-transparent" />
    </div>
  );
  };

  const renderOverview = () => {
    if (!userStats) return null;

const stats = [
  {
        title: "Total Bets",
        value: userStats.totalBets,
        color: "border-[#14F195]",
      },
      {
        title: "Win Rate",
        value: `${((userStats.winningBets / userStats.totalBets) * 100).toFixed(1)}%`,
        color: "border-[#9945FF]",
      },
      {
        title: "Total Winnings",
        value: `${userStats.totalWinnings.toFixed(2)} SOL`,
        color: "border-[#00C2FF]",
      },
      {
        title: "Best Odds Hit",
        value: userStats.bestOddsHit.toFixed(2),
        color: "border-[#14F195]",
      },
      {
        title: "Best Correct",
        value: `${userStats.bestCorrectCount}/10`,
        color: "border-[#9945FF]",
      },
      {
        title: "Last Bet",
        value: new Date(userStats.lastBetTimestamp).toLocaleDateString(),
        color: "border-[#00C2FF]",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-lg bg-[#1A1A1A] border ${stat.color} hover:border-[#14F195]/50 transition-all duration-300 hover:scale-[1.02]`}
            whileHover={{ y: -2 }}
          >
            <h3 className="text-sm font-bold mb-2 text-gray-400">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderSlip = (slip: BettingSlip, index: number, isActive: boolean) => {
    const isExpanded = expandedSlips.has(index);
    
    return (
      <motion.div
        key={slip.timestamp}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1A1A1A] rounded-lg p-4 mb-4 border border-[#2A2A2A] hover:border-[#14F195]/50 transition-all duration-300"
        whileHover={{ scale: 1.01 }}
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSlip(index)}
        >
          <div>
            <h3 className="text-lg font-bold">
              Slip #{index + 1} - {new Date(slip.timestamp).toLocaleDateString()}
            </h3>
            <p className="text-sm text-gray-400">
              {isActive ? "Pending" : slip.isWinner ? "Won" : "Lost"} - {slip.correctCount}/10 correct
            </p>
          </div>
          <motion.button
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-2xl"
          >
            ▼
          </motion.button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="space-y-2">
                <p>Total Stake: {ENTRY_FEE} SOL</p>
                <p>Cumulative Odds: {(slip.cumulativeOdds / 1000).toFixed(2)}</p>
                {slip.predictions.map((pred, i) => (
                  <div key={i} className="flex justify-between items-center p-2 border-b border-gray-800">
                    <span className="text-gray-300">Match {i + 1}:</span>
                    <span className={
                      pred[0] !== 255
                        ? pred[0] === 0 
                          ? "text-[#14F195] font-medium" // 1 - Green
                          : pred[0] === 1 
                            ? "text-[#9945FF] font-medium" // X - Purple
                            : "text-[#FF6B4A] font-medium" // 2 - Orange/Red
                        : pred[1] === 0
                          ? "text-[#00C2FF] font-medium" // Over - Blue
                          : "text-[#FFD700] font-medium" // Under - Gold
                    }>
                      {pred[0] !== 255
                        ? ["1", "X", "2"][pred[0]]
                        : ["Over", "Under"][pred[1]]}
                    </span>
                    {!isActive && (
                      <span
                        className={
                          slip.matchResults[i][0] === pred[0] ||
                          slip.matchResults[i][1] === pred[1]
                            ? "text-[#14F195] font-bold"
                            : "text-red-500 font-bold"
                        }
                      >
                        {slip.matchResults[i][0] !== 255
                          ? ["1", "X", "2"][slip.matchResults[i][0]]
                          : ["Over", "Under"][slip.matchResults[i][1]]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "active", label: "Active Slips" },
    { id: "past", label: "Past Slips" },
  ];

  return (
    <div className="space-y-8">
      {renderProfileHeader()}
      
      <div className="flex space-x-4 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-bold relative ${
              activeTab === tab.id
                ? "text-[#14F195]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14F195]"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {activeTab === "overview" && renderOverview()}
          {activeTab === "active" && (
            <div className="space-y-4">
              {activeSlips.length === 0 ? (
                <p className="text-gray-400">No active slips</p>
              ) : (
                activeSlips.map((slip, i) => renderSlip(slip, i, true))
              )}
            </div>
          )}
          {activeTab === "past" && (
            <div className="space-y-4">
              {pastSlips.length === 0 ? (
                <p className="text-gray-400">No past slips</p>
              ) : (
                pastSlips.map((slip, i) => renderSlip(slip, i, false))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Global Stats Section */}
      <div className="mt-12">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Global Statistics</h2>
          <div className="h-px bg-gradient-to-r from-transparent via-[#9945FF]/20 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-gradient-to-br from-[#14F195]/10 via-[#14F195]/5 to-transparent rounded-lg p-6 border border-[#2A2A2A] hover:border-[#14F195]/50 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Platform Volume</h3>
            <div className="text-2xl font-bold text-white">
              <span className="text-[#14F195]">1,234.56</span> SOL
            </div>
            <p className="text-sm text-gray-500 mt-2">From all betting slips</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#9945FF]/10 via-[#9945FF]/5 to-transparent rounded-lg p-6 border border-[#2A2A2A] hover:border-[#9945FF]/50 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <h3 className="text-sm font-medium text-gray-400 mb-2">Active Players</h3>
            <div className="text-2xl font-bold text-white">
              <span className="text-[#9945FF]">2,345</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Unique wallets this week</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#00C2FF]/10 via-[#00C2FF]/5 to-transparent rounded-lg p-6 border border-[#2A2A2A] hover:border-[#00C2FF]/50 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Predictions</h3>
            <div className="text-2xl font-bold text-white">
              <span className="text-[#00C2FF]">156,780</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Across all betting slips</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#14F195]/10 via-[#14F195]/5 to-transparent rounded-lg p-6 border border-[#2A2A2A] hover:border-[#14F195]/50 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <h3 className="text-sm font-medium text-gray-400 mb-2">Global Win Rate</h3>
            <div className="text-2xl font-bold text-white">
              <span className="text-[#14F195]">47.8</span>%
            </div>
            <p className="text-sm text-gray-500 mt-2">Average prediction accuracy</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <motion.div
            className="bg-gradient-to-br from-[#9945FF]/10 via-[#9945FF]/5 to-transparent rounded-lg p-6 border border-[#2A2A2A] hover:border-[#9945FF]/50 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <h3 className="text-sm font-medium text-gray-400 mb-2">Leaderboard Highlights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#FFD700]">🏆 Highest Win Streak</span>
                <span className="text-white">12 slips</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#C0C0C0]">💰 Biggest Win</span>
                <span className="text-white">24.5 SOL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#CD7F32]">⚡ Most Active Player</span>
                <span className="text-white">86 slips</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#00C2FF]/10 via-[#00C2FF]/5 to-transparent rounded-lg p-6 border border-[#2A2A2A] hover:border-[#00C2FF]/50 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <h3 className="text-sm font-medium text-gray-400 mb-2">Today's Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Slips</span>
                <span className="text-white">234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Volume Today</span>
                <span className="text-white">16.38 SOL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Win Rate Today</span>
                <span className="text-white">52.3%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
