"use client";

import Button from "@/components/button";
import { usePreferences } from "@/store/usePreferences";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "zustand";

interface Pick {
  id: number;
  time: string;
  match: string;
  pick: "odds1" | "oddsX" | "odds2" | "over" | "under";
  odd: number;
}

const matches = [
  {
    id: 1,
    time: "10:00",
    team1: "SK Poltava",
    team2: "Metalist",
    odds1: 2.75,
    oddsX: 3.02,
    odds2: 2.4,
    over: 1.85,
    under: 2.0,
  },
  {
    id: 2,
    time: "12:15",
    team1: "Al Najma",
    team2: "Alhazm",
    odds1: 3.2,
    oddsX: 3.2,
    odds2: 2.35,
    over: 2.1,
    under: 1.8,
  },
  {
    id: 3,
    time: "17:30",
    team1: "Empoli",
    team2: "Udinese",
    odds1: 2.78,
    oddsX: 2.9,
    odds2: 2.88,
    over: 1.95,
    under: 2.1,
  },
  {
    id: 4,
    time: "19:45",
    team1: "Venezia",
    team2: "Lecce",
    odds1: 2.8,
    oddsX: 3.25,
    odds2: 3.25,
    over: 2.0,
    under: 1.85,
  },
  {
    id: 5,
    time: "14:30",
    team1: "Arsenal",
    team2: "Liverpool",
    odds1: 2.45,
    oddsX: 3.40,
    odds2: 2.90,
    over: 1.75,
    under: 2.15,
  },
  {
    id: 6,
    time: "16:00",
    team1: "Barcelona",
    team2: "Real Madrid",
    odds1: 2.10,
    oddsX: 3.50,
    odds2: 3.20,
    over: 1.65,
    under: 2.30,
  },
  {
    id: 7,
    time: "20:15",
    team1: "PSG",
    team2: "Bayern Munich",
    odds1: 2.60,
    oddsX: 3.30,
    odds2: 2.70,
    over: 1.70,
    under: 2.20,
  },
  {
    id: 8,
    time: "13:45",
    team1: "Manchester City",
    team2: "Chelsea",
    odds1: 1.95,
    oddsX: 3.60,
    odds2: 3.80,
    over: 1.60,
    under: 2.40,
  },
  {
    id: 9,
    time: "15:30",
    team1: "Juventus",
    team2: "AC Milan",
    odds1: 2.30,
    oddsX: 3.20,
    odds2: 3.10,
    over: 1.80,
    under: 2.10,
  },
  {
    id: 10,
    time: "18:00",
    team1: "Atletico Madrid",
    team2: "Sevilla",
    odds1: 2.15,
    oddsX: 3.10,
    odds2: 3.50,
    over: 1.90,
    under: 2.05,
  },
];

// Define statsData at the top level
interface StatData {
  title: string;
  value: string;
}

const statsData: StatData[] = [
  {
    title: "Prize Pool",
    value: "650 SOL",
  },
  {
    title: "Slips Today",
    value: "6500",
  },
  {
    title: "Players",
    value: "430",
  },
];

export default function Page() {
  const [picks, setPicks] = useState<Pick[] | undefined>([]);
  const [slips, setSlips] = useState<Pick[][] | undefined>([]);
  const [index, setIndex] = useState<"1" | "2">("1");
  const [isVisible, setIsVisible] = useState(false);
  const [entryFee, setEntryFee] = useState(0.1);
  const darkMode = usePreferences((state) => state.darkMode);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  
  // CSS classes for pixelated text
  const pixelatedTextClass = "font-[monospace] tracking-wide font-bold" +
    (darkMode ? " text-white" : " text-black");
  
  const pixelatedHeadingClass = pixelatedTextClass + " uppercase tracking-wider";
  
  const pixelatedValueClass = pixelatedTextClass + " [text-shadow:1px_1px_0px_rgba(0,0,0,0.8)]";
  
  // Simulated pool data
  const [poolData] = useState({
    totalPool: 650,
    participantCount: 430,
    highestOdd: 1250.75,
    minCorrectPredictions: 5,
    prizeDistribution: {
      first: 40,
      second: 30,
      third: 10,
      fourth: 5,
      fifth: 5,
      platform: 10
    }
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Add countdown effect
  useEffect(() => {
    // Get the first match time (10:00 from the first match)
    const firstMatchTime = matches[0]?.time || "10:00";
    const [hours, minutes] = firstMatchTime.split(":").map(Number);
    
    const updateCountdown = () => {
      const now = new Date();
      const matchDate = new Date();
      matchDate.setHours(hours, minutes, 0, 0);
      
      // If match time is in the past for today, set to tomorrow
      if (matchDate < now) {
        matchDate.setDate(matchDate.getDate() + 1);
      }
      
      const diff = matchDate.getTime() - now.getTime();
      
      // Check if expired
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      // Calculate remaining time
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ 
        hours: hoursLeft, 
        minutes: minutesLeft, 
        seconds: secondsLeft 
      });
      setIsExpired(false);
    };
    
    // Update immediately and then every second
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const pickOptions = [
    { label: "Odds1", key: "odds1" },
    { label: "OddsX", key: "oddsX" },
    { label: "Odds2", key: "odds2" },
    { label: "Over", key: "over" },
    { label: "Under", key: "under" },
  ];

  const totalOdd = picks
    ?.reduce((acc, reducer) => acc * reducer.odd, 1)
    .toFixed(2);
    
  // Function to calculate winning chance based on user's odds
  const calculateWinningChance = (userOdds: number) => {
    // Simple estimation based on user's odds compared to highest odds in pool
    const chance = Math.min(100, (userOdds / poolData.highestOdd) * 100);
    return chance.toFixed(1);
  };
  
  // Function to calculate potential payout from the pool
  const calculatePotentialPayout = (userOdds: number) => {
    // Calculate estimated share of the pool based on odds ratio
    const oddsRatio = userOdds / poolData.highestOdd;
    const estimatedShare = Math.min(0.4, oddsRatio); // Cap at 40% (first place)
    return (poolData.totalPool * estimatedShare).toFixed(2);
  };
  
  // Function to clear all selections
  const clearSelections = () => {
    setPicks([]);
  };
  
  // Calculate estimated ranking based on total odd
  const estimateRanking = () => {
    if (!picks || picks.length < 10) return "Not Qualified";
    
    const userOdd = Number(totalOdd);
    
    // Simplified ranking estimation based on odds
    if (userOdd > poolData.highestOdd * 0.9) return "1st";
    if (userOdd > poolData.highestOdd * 0.7) return "2nd";
    if (userOdd > poolData.highestOdd * 0.5) return "3rd";
    if (userOdd > poolData.highestOdd * 0.3) return "4th-5th";
    return "Outside Top 5";
  };
  
  // Calculate qualification chance (chance of getting at least 5 correct predictions)
  const calculateQualificationChance = () => {
    if (!picks || picks.length < 10) return 0;
    
    // This is a simplified model - in reality this would be more complex
    // Assuming each pick has a 50% chance of being correct independently
    // Calculate probability of getting at least 5 correct out of 10
    let chance = 0;
    for (let i = poolData.minCorrectPredictions; i <= 10; i++) {
      // Calculate binomial probability: C(10,i) * 0.5^i * 0.5^(10-i)
      // C(10,i) = 10! / (i! * (10-i)!)
      const combinations = factorial(10) / (factorial(i) * factorial(10 - i));
      chance += combinations * Math.pow(0.5, 10);
    }
    
    return Math.round(chance * 100);
  };
  
  // Helper function for factorial calculation
  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  // Update the existing setPicks function to check for expiration
  const handlePickSelection = (matchId: number, pick: "odds1" | "oddsX" | "odds2" | "over" | "under") => {
    if (isExpired) {
      alert("Betting is closed for today's matches");
      return;
    }
    
    setPicks((prev) => {
      // Remove existing pick for this match
      const filteredPicks = (prev || []).filter(p => p.id !== matchId);
      // Add new pick if it's not the same as the one being removed
      if (!prev?.find(p => p.id === matchId && p.pick === pick)) {
        return [
          ...filteredPicks,
          {
            id: matchId,
            time: matches.find(m => m.id === matchId)?.time || "",
            match: matches.find(m => m.id === matchId)?.team1 + " - " + matches.find(m => m.id === matchId)?.team2 || "",
            pick: pick,
            odd: matches.find(m => m.id === matchId)?.[pick] || 0,
          },
        ];
      }
      return filteredPicks;
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-8">
          {/* Pixelated header - Now First */}
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
            
            <h1 className="mb-4 text-2xl font-bold pixel-heading">
              <span className="bg-gradient-to-r from-[#14F195] via-[#9945FF] to-[#00C2FF] text-transparent bg-clip-text">OctoMax</span>
            </h1>
            <div className="mx-auto mb-4 h-4 w-32 bg-gradient-to-r from-[#14F195] via-[#9945FF] to-[#00C2FF]"
                 style={{ 
                   clipPath: 'polygon(0% 0%, 25% 100%, 50% 0%, 75% 100%, 100% 0%)',
                   imageRendering: 'pixelated'
                 }}></div>
            <p className="text-gray-300 pixel-text-sm">Outpredict, Outplay <span className="text-[#14F195]">, Outwin!</span> </p>
            
            {/* Quick stats */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-[#14F195] font-bold text-xl">10</span>
                <span className="text-gray-400 text-xs">Matches</span>
              </div>
              <div className="w-px h-10 bg-[#9945FF]/30"></div>
              <div className="flex flex-col items-center">
                <span className="text-[#9945FF] font-bold text-xl">5</span>
                <span className="text-gray-400 text-xs">Winners</span>
              </div>
              <div className="w-px h-10 bg-[#9945FF]/30"></div>
              <div className="flex flex-col items-center">
                <span className="text-[#00C2FF] font-bold text-xl">1</span>
                <span className="text-gray-400 text-xs">Champion</span>
              </div>
            </div>
          </motion.div>

          {/* Countdown box - Now Second */}
          <div className="mb-6 bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4 rounded-lg border border-[#9945FF]/30 text-center pixel-box hover:from-[#14F195]/5 hover:to-[#9945FF]/10 transition-all duration-300 relative overflow-hidden">
            <h3 className={pixelatedHeadingClass}>Time until matches start</h3>
            {isExpired ? (
              <div className="text-[#FF6B4A] font-bold text-xl">
                Betting is closed for today's matches
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <motion.div 
                  className="bg-[#0d0d0d] p-3 rounded-md border border-[#14F195]/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className={pixelatedValueClass + " text-[#14F195]"}>{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-gray-400 text-xs">HOURS</div>
                </motion.div>
                <motion.div 
                  className="bg-[#0d0d0d] p-3 rounded-md border border-[#9945FF]/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                >
                  <div className={pixelatedValueClass + " text-[#9945FF]"}>{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-gray-400 text-xs">MINUTES</div>
                </motion.div>
                <motion.div 
                  className="bg-[#0d0d0d] p-3 rounded-md border border-[#00C2FF]/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                >
                  <div className={pixelatedValueClass + " text-[#00C2FF]"}>{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-gray-400 text-xs">SECONDS</div>
                </motion.div>
              </div>
            )}
            <div className="mt-2 text-gray-300 text-sm">
              {isExpired 
                ? "You can view your existing slips below" 
                : "Select your predictions before time expires"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`col-span-full`}>
              {/* Remove duplicate OctoMax header section */}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`group-hover group relative col-span-full flex h-fit select-none flex-col gap-4 pixel-border bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-6 text-gray-300 pixel-box hover:from-[#121212] hover:to-[#1A1A1A] hover:shadow-[0_0_15px_rgba(153,69,255,0.2)] transition-all duration-300`}
            >
              <h2 className="mb-6 text-center text-xl font-bold pixel-heading text-[#14F195]">
                <span className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-transparent bg-clip-text">Global Stats</span>
              </h2>

              <div className={`mb-8 grid grid-cols-3 gap-4`}>
                {statsData.map((stat: StatData, i: number) => {
                  const gradients = [
                    "bg-gradient-to-br from-[#121212] via-[#121212] to-[#14F195]/20 hover:from-[#121212] hover:via-[#121212] hover:to-[#14F195]/40",
                    "bg-gradient-to-br from-[#121212] via-[#121212] to-[#9945FF]/20 hover:from-[#121212] hover:via-[#121212] hover:to-[#9945FF]/40",
                    "bg-gradient-to-br from-[#121212] via-[#121212] to-[#00C2FF]/20 hover:from-[#121212] hover:via-[#121212] hover:to-[#00C2FF]/40",
                  ];
                  
                  return (
                    <div
                      key={i}
                      className={`${gradients[i % gradients.length]} p-4 rounded-lg border border-[#9945FF]/30 transition-all duration-300 hover:border-[#9945FF]/70 hover:shadow-lg hover:shadow-[#9945FF]/10`}
                    >
                      <h3 className={`${pixelatedHeadingClass} text-gray-300`}>{stat.title}</h3>
                      <p className={`${pixelatedValueClass} text-[#14F195]`}>{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              <h2 className="mb-6 text-center text-xl font-bold pixel-heading text-[#14F195]">
                <span className="bg-gradient-to-r from-[#9945FF] to-[#00C2FF] text-transparent bg-clip-text">How it works</span>
              </h2>

              <div className={`flex justify-between gap-4 max-lg:flex-col`}>
                <div
                  className={`flex max-w-lg items-center gap-4 pixel-border bg-gradient-to-r from-[#121212] to-[#1A1A1A] p-4 pixel-box hover:from-[#14F195]/10 hover:to-[#9945FF]/20 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(20,241,149,0.3)]`}
                >
                  <div className={`flex flex-col items-center`}>
                    <div
                      className={`grid size-12 shrink-0 place-items-center rounded-full bg-[#0d0d0d] text-xl text-[#14F195] font-bold pixel-text-value border-2 border-[#14F195]/30`}
                      style={{ imageRendering: 'pixelated' }}
                    >
                      1
                    </div>
                  </div>
                  <div className={`text-gray-300 pixel-text-sm`}>Place your predictions for a fixed fee.</div>
                </div>

                <div
                  className={`flex max-w-lg items-center gap-4 pixel-border bg-gradient-to-r from-[#121212] to-[#1A1A1A] p-4 pixel-box hover:from-[#9945FF]/10 hover:to-[#00C2FF]/20 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(153,69,255,0.3)]`}
                >
                  <div className={`flex flex-col items-center`}>
                    <div
                      className={`grid size-12 shrink-0 place-items-center rounded-full bg-[#0d0d0d] text-xl text-[#9945FF] font-bold pixel-text-value border-2 border-[#9945FF]/30`}
                      style={{ imageRendering: 'pixelated' }}
                    >
                      2
                    </div>
                  </div>
                  <div className={`text-gray-300 pixel-text-sm`}>
                    Rank in the top three with the highest odds.
                  </div>
                </div>

                <div
                  className={`flex max-w-lg items-center gap-4 pixel-border bg-gradient-to-r from-[#121212] to-[#1A1A1A] p-4 pixel-box hover:from-[#00C2FF]/10 hover:to-[#14F195]/20 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,194,255,0.3)]`}
                >
                  <div className={`flex flex-col items-center`}>
                    <div
                      className={`grid size-12 shrink-0 place-items-center rounded-full bg-[#0d0d0d] text-xl text-[#00C2FF] font-bold pixel-text-value border-2 border-[#00C2FF]/30`}
                      style={{ imageRendering: 'pixelated' }}
                    >
                      3
                    </div>
                  </div>
                  <div className={`text-gray-300 pixel-text-sm`}>
                    Share the total pool with other two winners.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Matches and Slip Builder Section */}
            <div className={`col-span-full grid grid-cols-12 gap-4`}>
              {/* Tabs for Today and Slips */}
              <div className="col-span-full mb-4 pixel-border bg-[#121212] p-2 pixel-box">
                <div className="flex w-full items-center justify-center gap-8 text-center text-xl font-bold">
                  <div
                    className={`${index == "1" ? "bg-[#9945FF] text-white" : ""} basis-1/2 cursor-pointer rounded-lg p-2 transition-all duration-200 pixel-heading hover:bg-[#9945FF]/70`}
                    onClick={() => setIndex("1")}
                  >
                    Today
                  </div>
                  <div
                    className={`${index == "2" ? "bg-[#9945FF] text-white" : ""} basis-1/2 cursor-pointer rounded-lg p-2 transition-all duration-200 pixel-heading hover:bg-[#9945FF]/70`}
                    onClick={() => setIndex("2")}
                  >
                    Slips
                  </div>
                </div>
              </div>

              {index === "1" ? (
                <>
                  {/* Matches Section - Left Side */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`col-span-full flex flex-col gap-4 pixel-border bg-[#121212] p-4 md:col-span-8 pixel-box hover:border-[#14F195]/50`}
                  >
                    <div className={`flex items-center justify-between mb-4`}>
                      <h2 className={`text-xl font-bold pixel-text text-[#14F195]`}>
                        Matches
                      </h2>
                    </div>

                    <div className={`flex flex-col gap-2 overflow-x-auto`}>
                      <div
                        className={`grid grid-cols-12 border-b-2 border-[#14F195]/30 p-2 font-mono font-bold text-[#14F195] min-w-[800px]`}
                      >
                        <div className={`col-span-1`}>Time</div>
                        <div className={`col-span-4`}>Match</div>
                        <div className={`col-span-1 text-center`}>1</div>
                        <div className={`col-span-1 text-center`}>X</div>
                        <div className={`col-span-1 text-center`}>2</div>
                        <div className={`col-span-2 text-center`}>Over 2.5</div>
                        <div className={`col-span-2 text-center`}>Under 2.5</div>
                      </div>

                      {matches.map((match, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
                          transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                          className={`grid grid-cols-12 border-b border-dashed border-[#9945FF]/20 p-2 font-mono hover:bg-[#1A1A1A] min-w-[800px]`}
                        >
                          <div className={`col-span-1 text-gray-300`}>{match.time}</div>
                          <div className={`col-span-4 font-medium text-white`}>
                            {match.team1} - {match.team2}
                          </div>
                          <div
                            onClick={() => handlePickSelection(match.id, "odds1")}
                            className={`col-span-1 cursor-pointer text-center transition rounded-md mx-1 py-1 ${
                              picks?.find(
                                (e) => e.id === match.id && e.pick === "odds1"
                              ) 
                              ? "bg-gradient-to-r from-[#14F195] to-[#00C2FF] text-black font-bold shadow-inner" 
                              : "bg-[#1E1E1E] text-[#14F195] hover:bg-[#2A2A2A] hover:transform hover:scale-105 hover:shadow-[0_0_8px_rgba(20,241,149,0.5)]"
                            }`}
                          >
                            {match.odds1}
                          </div>
                          <div
                            onClick={() => handlePickSelection(match.id, "oddsX")}
                            className={`col-span-1 cursor-pointer text-center transition rounded-md mx-1 py-1 ${
                              picks?.find(
                                (e) => e.id === match.id && e.pick === "oddsX"
                              )
                              ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-black font-bold shadow-inner"
                              : "bg-[#1E1E1E] text-[#9945FF] hover:bg-[#2A2A2A] hover:transform hover:scale-105 hover:shadow-[0_0_8px_rgba(153,69,255,0.5)]"
                            }`}
                          >
                            {match.oddsX}
                          </div>
                          <div
                            onClick={() => handlePickSelection(match.id, "odds2")}
                            className={`col-span-1 cursor-pointer text-center transition rounded-md mx-1 py-1 ${
                              picks?.find(
                                (e) => e.id === match.id && e.pick === "odds2"
                              )
                              ? "bg-gradient-to-r from-[#FF6B4A] to-[#9945FF] text-black font-bold shadow-inner"
                              : "bg-[#1E1E1E] text-[#FF6B4A] hover:bg-[#2A2A2A] hover:transform hover:scale-105 hover:shadow-[0_0_8px_rgba(255,107,74,0.5)]"
                            }`}
                          >
                            {match.odds2}
                          </div>
                          <div
                            onClick={() => handlePickSelection(match.id, "over")}
                            className={`col-span-2 cursor-pointer text-center transition rounded-md mx-1 py-1 ${
                              picks?.find(
                                (e) => e.id === match.id && e.pick === "over"
                              ) 
                              ? "bg-gradient-to-r from-[#00C2FF] to-[#14F195] text-black font-bold shadow-inner" 
                              : "bg-[#1E1E1E] text-[#00C2FF] hover:bg-[#2A2A2A] hover:transform hover:scale-105 hover:shadow-[0_0_8px_rgba(0,194,255,0.5)]"
                            }`}
                          >
                            {match.over}
                          </div>
                          <div
                            onClick={() => handlePickSelection(match.id, "under")}
                            className={`col-span-2 cursor-pointer text-center transition rounded-md mx-1 py-1 ${
                              picks?.find(
                                (e) => e.id === match.id && e.pick === "under"
                              ) 
                              ? "bg-gradient-to-r from-[#00C2FF] to-[#9945FF] text-black font-bold shadow-inner" 
                              : "bg-[#1E1E1E] text-[#00C2FF] hover:bg-[#2A2A2A] hover:transform hover:scale-105 hover:shadow-[0_0_8px_rgba(0,194,255,0.5)]"
                            }`}
                          >
                            {match.under}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Slip Builder Section - Right Side */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`col-span-full flex flex-col gap-4 pixel-border bg-[#121212] p-4 md:col-span-4 pixel-box hover:border-[#9945FF]/50`}
                  >
                    <h2 className="mb-4 text-center text-xl font-bold pixel-text text-[#14F195]">
                      Slip Builder
                    </h2>

                    <AnimatePresence mode="wait">
                      {picks !== undefined && picks.length > 0 ? (
                        <motion.div
                          key="with-picks"
                          layout
                          className={`flex flex-col gap-4`}
                        >
                          <div className="overflow-x-auto">
                            <table className="w-full table-auto border-separate overflow-hidden rounded-lg text-left text-sm">
                              <thead className="bg-[#0d0d0d] text-xs uppercase text-[#14F195]">
                                <tr>
                                  <th scope="col" className="px-4 py-3">
                                    Match
                                  </th>
                                  <th scope="col" className="px-4 py-3">
                                    Pick
                                  </th>
                                  <th scope="col" className="px-4 py-3">
                                    Odd
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {picks?.map((e, i) => (
                                  <tr
                                    key={i}
                                    className="border-b border-[#9945FF]/30 bg-[#0d0d0d] hover:bg-[#1A1A1A] transition-colors duration-200"
                                  >
                                    <td className="px-4 py-3 text-white">{e.match}</td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`px-2 py-1 rounded-md text-black font-bold ${
                                          e.pick === "odds1" ? "bg-[#14F195]" : 
                                          e.pick === "odds2" ? "bg-[#FF6B4A]" : 
                                          e.pick === "oddsX" ? "bg-[#9945FF]" : "bg-[#00C2FF]"
                                        }`}
                                      >
                                        {e.pick}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-[#14F195]">
                                      {e.odd}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          {/* Selection count indicator */}
                          <div className="self-center text-center">
                            <p className={`text-sm ${picks.length < 10 ? 'text-[#FF6B4A]' : 'text-[#14F195]'} pixel-text-sm`}>
                              {picks.length}/10 selections
                            </p>
                            <div className="w-full bg-[#1E1E1E] h-2 mt-1 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#14F195] h-full transition-all duration-300 ease-in-out"
                                style={{ width: `${(picks.length / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <p className="text-gray-300 pixel-text-sm">Total Odds:</p>
                              <p className="text-[#14F195] font-bold pixel-text-value">{totalOdd}x</p>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <p className="text-gray-300 pixel-text-sm">Entry Fee:</p>
                              <div className="relative w-48">
                                <input
                                  type="number"
                                  value={entryFee}
                                  onChange={(e) => setEntryFee(Number(e.target.value))}
                                  className="w-full bg-[#1E1E1E] border border-[#9945FF] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:border-transparent"
                                  step="0.1"
                                  min="0.1"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">SOL</span>
                              </div>
                            </div>
                          </div>

                          <h3 className="text-center text-sm font-bold text-[#14F195] mt-2 pixel-text-sm">
                            Potential Winnings
                          </h3>

                          <div className="self-center mt-2">
                            <Button
                              onClick={() => {
                                if (isExpired) {
                                  alert("Betting is closed for today's matches");
                                  return;
                                }
                                if (picks.length < 10) {
                                  alert("You need to select 10 matches");
                                  return;
                                }
                                setSlips([...(slips || []), [...(picks || [])]]);
                                setPicks([]);
                                alert("Slip created successfully");
                              }}
                              variant="primary"
                              className={`text-lg pixel-text px-6 py-3 hover:transform hover:scale-105 transition-transform duration-200 ${
                                isExpired 
                                  ? "bg-gray-500 cursor-not-allowed" 
                                  : "bg-gradient-to-r from-[#9945FF] to-[#00C2FF]"
                              } text-black font-bold shadow-md`}
                              disabled={isExpired}
                            >
                              {isExpired ? "Betting Closed" : "Place Bet"}
                            </Button>
                          </div>
                          
                          {picks.length === 10 && (
                            <div className="mt-4 p-4 bg-[#1E1E1E] rounded-lg border border-[#14F195]/30 hover:border-[#14F195]/70 transition-colors duration-300">
                              <div className="flex justify-between items-center mb-3">
                                <p className="text-gray-300 pixel-text-sm">Prize Pool:</p>
                                <p className="text-[#14F195] font-bold pixel-text-value">{poolData.totalPool} SOL</p>
                              </div>
                              <div className="flex justify-between items-center mb-3">
                                <p className="text-gray-300 pixel-text-sm">Min. Correct Picks:</p>
                                <p className="text-[#9945FF] font-bold pixel-text-value">{poolData.minCorrectPredictions}</p>
                              </div>
                              <div className="flex justify-between items-center mb-3">
                                <p className="text-gray-300 pixel-text-sm">Your Total Odds:</p>
                                <p className="text-[#00C2FF] font-bold pixel-text-value">{totalOdd}x</p>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-gray-300 pixel-text-sm">Top 5 Chance:</p>
                                <p className={`font-bold pixel-text-value ${
                                  Number(calculateWinningChance(Number(totalOdd))) > 70 ? "text-[#14F195]" : 
                                  Number(calculateWinningChance(Number(totalOdd))) > 40 ? "text-[#9945FF]" : 
                                  "text-[#FF6B4A]"
                                }`}>{calculateWinningChance(Number(totalOdd))}%</p>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-gray-300 pixel-text-sm">Est. Payout:</p>
                                <p className="text-[#14F195] font-bold pixel-text-value">{calculatePotentialPayout(Number(totalOdd))} SOL</p>
                              </div>
                              <div className="mt-3 text-xs text-gray-400 text-center">
                                Top 5 slips with highest odds share the prize pool
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="without-picks"
                          className={`flex flex-col gap-4 items-center justify-center h-64`}
                        >
                          <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#9945FF]/30 text-center hover:border-[#9945FF]/70 transition-colors duration-300">
                            <p className="text-center text-gray-300 mb-2">No selections yet</p>
                            <p className="text-center text-gray-300 text-sm">Click on odds to add selections to your slip</p>
                            <p className="text-center text-[#14F195] text-sm mt-4">You need to select exactly 10 matches</p>
                            <p className="text-center text-[#00C2FF] text-sm mt-2">Higher odds = bigger potential wins!</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              ) : (
                // Slips Tab Content
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className={`col-span-full flex flex-col gap-4 pixel-border bg-[#121212] p-4 pixel-box hover:border-[#14F195]/50`}
                >
                  <h2 className="mb-4 text-center text-xl font-bold pixel-text text-[#14F195]">
                    Your Submitted Slips
                  </h2>

                  <AnimatePresence mode="wait">
                    {slips !== undefined && slips.length > 0 ? (
                      <motion.div
                        key="with-slips"
                        className={`flex flex-col gap-6`}
                      >
                        {slips.map((slip, slipIndex) => {
                          const slipTotalOdd = slip
                            ?.reduce((acc, reducer) => acc * reducer.odd, 1)
                            .toFixed(2);
                            
                          return (
                            <div key={slipIndex} className="flex flex-col gap-4 hover:transform hover:scale-[1.01] transition-transform duration-300">
                              <div className="bg-[#0d0d0d] p-4 rounded-lg mb-2 hover:bg-[#151515] transition-colors duration-200">
                                <div className="flex justify-between items-center mb-4">
                                  <p className={`text-[#14F195] font-bold pixel-text-sm`}>Slip #{slipIndex + 1}</p>
                                  <p className={`text-gray-300 text-sm pixel-text-sm`}>Submitted: {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                  <p className={`text-gray-300 pixel-text-sm`}>Status: <span className={`text-[#14F195] bg-[#1E1E1E] px-2 py-1 rounded-md pixel-text-value`}>Active</span></p>
                                  <p className={`text-gray-300 pixel-text-sm`}>Total Odd: <span className={`text-[#14F195] font-bold pixel-text-value`}>{slipTotalOdd}x</span></p>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                  <p className={`text-gray-300 pixel-text-sm`}>Potential Ranking:</p>
                                  <p className={`font-bold px-2 py-1 rounded-md pixel-text-value ${
                                    Number(slipTotalOdd) > poolData.highestOdd * 0.9 ? "bg-[#FFD700]/20 text-[#FFD700]" : 
                                    Number(slipTotalOdd) > poolData.highestOdd * 0.7 ? "bg-[#C0C0C0]/20 text-[#C0C0C0]" : 
                                    Number(slipTotalOdd) > poolData.highestOdd * 0.5 ? "bg-[#CD7F32]/20 text-[#CD7F32]" : 
                                    Number(slipTotalOdd) > poolData.highestOdd * 0.3 ? "bg-[#14F195]/20 text-[#14F195]" : 
                                    "bg-[#FF6B4A]/20 text-[#FF6B4A]"
                                  }`}>
                                    {
                                      Number(slipTotalOdd) > poolData.highestOdd * 0.9 ? "1st Place" : 
                                      Number(slipTotalOdd) > poolData.highestOdd * 0.7 ? "2nd Place" : 
                                      Number(slipTotalOdd) > poolData.highestOdd * 0.5 ? "3rd Place" : 
                                      Number(slipTotalOdd) > poolData.highestOdd * 0.3 ? "4th-5th Place" : 
                                      "Outside Top 5"
                                    }
                                  </p>
                                </div>
                              </div>
                              
                              <div className="overflow-x-auto">
                                <table className="w-full table-auto border-separate overflow-hidden rounded-lg text-left text-sm">
                                  <thead className="bg-[#0d0d0d] text-xs uppercase text-[#14F195]">
                                    <tr>
                                      <th scope="col" className="px-4 py-3">
                                        Time
                                      </th>
                                      <th scope="col" className="px-4 py-3">
                                        Match
                                      </th>
                                      <th scope="col" className="px-4 py-3">
                                        Pick
                                      </th>
                                      <th scope="col" className="px-4 py-3">
                                        Odd
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {slip?.map((e, i) => (
                                      <tr key={i} className="border-b border-[#9945FF]/30 bg-[#0d0d0d] hover:bg-[#151515] transition-colors duration-200">
                                        <td className="px-4 py-3 text-white">{e.time}</td>
                                        <td className="px-4 py-3 text-white">{e.match}</td>
                                        <td className="px-4 py-3">
                                          <span
                                            className={`px-2 py-1 rounded-md text-black font-bold ${
                                              e.pick === "odds1" ? "bg-[#14F195]" : 
                                              e.pick === "odds2" ? "bg-[#FF6B4A]" : 
                                              e.pick === "oddsX" ? "bg-[#9945FF]" : "bg-[#00C2FF]"
                                            }`}>
                                            {e.pick}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-[#14F195]">{e.odd}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}
                        
                        <div className="mt-4 text-center">
                          <Button
                            onClick={() => {
                              setIndex("1");
                            }}
                            className="hover:transform hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-[#9945FF] to-[#00C2FF] text-black font-bold px-6 py-3 shadow-md"
                          >
                            Create New Slip
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="without-slip"
                        className={`flex flex-col gap-4 items-center justify-center h-64`}
                      >
                        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#9945FF]/30 text-center hover:border-[#9945FF]/70 transition-colors duration-300">
                          <p className="text-center text-gray-300">No slips submitted yet</p>
                          <p className="text-center text-gray-300 text-sm mb-4">Submit a slip with 10 selections to see it here</p>
                          <Button
                            onClick={() => {
                              setIndex("1");
                            }}
                            className="hover:transform hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-[#9945FF] to-[#00C2FF] text-black font-bold px-6 py-3 shadow-md"
                          >
                            Create New Slip
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
