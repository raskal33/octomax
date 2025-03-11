"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { calculateDate, formatDate } from "./utils";
import { getBetOfTheDayMatchByDate, calculateAccuracy } from "./services/matchService";

type Value = string;

// Simple tooltip component
function TooltipWrapper({ content, tooltipText }: { content: string; tooltipText: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div 
        className="cursor-help border-b border-dotted border-gray-400"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {content}
      </div>
      {showTooltip && (
        <div className="absolute z-10 w-48 px-3 py-2 text-xs text-white bg-black rounded-lg shadow-lg -left-16 -top-16">
          {tooltipText}
          <div className="absolute w-3 h-3 bg-black transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
}

// Function to determine match status based on start time
function getMatchStatus(matchDate: string, matchTime?: string, result?: string): "Upcoming" | "Live" | "Ended" {
  // If there's a result, the match has ended
  if (result) {
    return "Ended";
  }
  
  // If matchDate is "Match continue", it's already live
  if (matchDate === "Match continue") {
    return "Live";
  }
  
  // Try to parse the date and time
  try {
    const now = new Date();
    
    // If matchDate is just a time (like "19:30"), assume it's today's date
    let matchDateTime: Date;
    
    if (matchDate.includes("-")) {
      // Full date format (YYYY-MM-DD)
      const [year, month, day] = matchDate.split("-").map(Number);
      const [hours, minutes] = (matchTime || "00:00").split(":").map(Number);
      
      matchDateTime = new Date(year, month - 1, day, hours || 0, minutes || 0);
    } else {
      // Just time format, assume today
      const [hours, minutes] = (matchTime || matchDate || "00:00").split(":").map(Number);
      
      matchDateTime = new Date();
      matchDateTime.setHours(hours || 0, minutes || 0, 0, 0);
    }
    
    // Calculate time difference in minutes
    const diffMs = now.getTime() - matchDateTime.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    // If match hasn't started yet
    if (diffMinutes < 0) {
      return "Upcoming";
    }
    
    // If match is ongoing (within 110 minutes of start time)
    if (diffMinutes <= 110) {
      return "Live";
    }
    
    // If match has ended (more than 110 minutes since start)
    return "Ended";
  } catch (error) {
    console.error("Error parsing match date/time:", error);
    return "Upcoming"; // Default to upcoming if parsing fails
  }
}

/**
 * Calculate accuracy based on match results
 * @param matches Array of match data
 * @returns Accuracy percentage (0-100)
 */
function calculatePredictionAccuracy(matches: any[]): number {
  // If no matches, return 0
  if (!matches || matches.length === 0) {
    return 0;
  }
  
  // Count matches with results (ended matches)
  const endedMatches = matches.filter(match => 
    match.status === "Ended" || 
    (match.homeScore !== undefined && match.awayScore !== undefined) ||
    match.isCorrect !== undefined ||
    match.result
  );
  
  if (endedMatches.length === 0) {
    return 0; // No ended matches to calculate accuracy
  }
  
  // Count correct predictions
  const correctPredictions = endedMatches.filter(match => 
    match.isCorrect === true || match.result === "Win"
  );
  
  // Calculate percentage: (correct predictions / total ended matches) * 100
  return Math.round((correctPredictions.length / endedMatches.length) * 100);
}

interface DisplayProps {
  value: Value;
  tabIndex: number;
}

export default function Display({ value, tabIndex }: DisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [sureBets, setSureBets] = useState<any[]>([]);
  const [dailyParlay, setDailyParlay] = useState<any[]>([]);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [liveMatchesCount, setLiveMatchesCount] = useState<number>(0);
  const [settledMatchesCount, setSettledMatchesCount] = useState<number>(0);
  const [endedMatchesCount, setEndedMatchesCount] = useState<number>(0);

  useEffect(() => {
    setIsVisible(true);
    setIsLoading(true);
    
    // Calculate date from value
    const date = calculateDate(value);
    const formattedDate = formatDate(date);
    console.log('Display - Selected date value:', value);
    console.log('Display - Calculated date:', date);
    console.log('Display - Formatted date:', formattedDate);
    
    // Fetch data from API
    const fetchData = async () => {
      try {
        // Fetch match data
        const matchesData = await getBetOfTheDayMatchByDate(date);
        
        console.log('Display - Fetched data:', {
          matchesCount: matchesData.length,
          sampleMatch: matchesData.length > 0 ? matchesData[0] : null
        });
        
        if (!Array.isArray(matchesData) || matchesData.length === 0) {
          console.warn('No matches returned from API or invalid data format');
          setSureBets([]);
          setDailyParlay([]);
          setAccuracy(0);
          setLiveMatchesCount(0);
          setSettledMatchesCount(0);
          setEndedMatchesCount(0);
          setIsLoading(false);
          return;
        }
        
        // Load categories from localStorage
        const savedCategoriesStr = localStorage.getItem(`matchCategories_${date.year}_${date.month}_${date.day}`);
        const savedCategories = savedCategoriesStr ? JSON.parse(savedCategoriesStr) : {};
        
        console.log('Display - Saved categories:', savedCategories);
        
        // Load scores from localStorage
        const savedScoresStr = localStorage.getItem(`matchScores_${date.year}_${date.month}_${date.day}`);
        const savedScores = savedScoresStr ? JSON.parse(savedScoresStr) : {};
        
        console.log('Display - Saved scores:', savedScores);
        
        // Apply categories and scores to matches
        const matchesWithCategories = matchesData.map(match => {
          // Ensure match has an id
          if (!match.id) {
            console.warn('Match without ID:', match);
            match.id = `match_${Math.random().toString(36).substr(2, 9)}`;
          }
          
          // Apply score from localStorage if available
          const score = savedScores[match.id];
          
          // If we have a score, parse it to get homeScore and awayScore
          let homeScore = match.homeScore;
          let awayScore = match.awayScore;
          let isCorrect = match.isCorrect;
          
          if (score) {
            // Parse the score
            const scoreParts = score.includes(':') 
              ? score.split(':').map((s: string) => s.trim())
              : score.split('-').map((s: string) => s.trim());
            
            if (scoreParts.length === 2) {
              homeScore = parseInt(scoreParts[0], 10);
              awayScore = parseInt(scoreParts[1], 10);
              
              if (!isNaN(homeScore) && !isNaN(awayScore)) {
                // Evaluate the prediction
                isCorrect = evaluatePrediction(match.bestTip, homeScore, awayScore);
              }
            }
          }
          
          // Determine match status - consider result field
          const status = getMatchStatus(match.matchDate, match.time, match.result);
          
          // Check if the match has a result (settled)
          const hasResult = 
            (homeScore !== undefined && awayScore !== undefined) || 
            score || 
            match.result;
          
          return {
            ...match,
            categories: savedCategories[match.id] || [], // Default to empty array if not categorized
            status,
            score,
            homeScore,
            awayScore,
            isCorrect,
            hasResult
          };
        });
        
        // If no categories are set, default all matches to sureBet
        const hasCategories = Object.keys(savedCategories).length > 0;
        
        // Filter matches by category
        let sureBetsData = matchesWithCategories.filter(match => 
          match.categories.includes("sureBet")
        );
        
        let dailyParlayData = matchesWithCategories.filter(match => 
          match.categories.includes("dailyParlay")
        );
        
        // If no categories are set, default all matches to sureBet
        if (!hasCategories) {
          sureBetsData = matchesWithCategories;
          dailyParlayData = [];
        }
        
        // Get active tab data
        const activeTabData = tabIndex === 0 ? sureBetsData : dailyParlayData;
        
        // Count live matches for active tab
        const liveMatches = activeTabData.filter(match => match.status === "Live").length;
        
        // Count settled matches (matches with results) for Sure Bets
        const settledMatches = sureBetsData.filter(match => match.hasResult).length;
        
        // Count ended matches for Daily Parlay
        const endedMatches = dailyParlayData.filter(match => 
          match.status === "Ended" || 
          match.hasResult
        ).length;
        
        // Calculate accuracy for the active tab
        const accuracy = calculatePredictionAccuracy(activeTabData);
        
        // Calculate total odds for daily parlay
        const totalOdds = dailyParlayData.reduce((acc, match) => {
          const odds = typeof match.odds === 'number' ? match.odds : 1.0;
          return acc * odds;
        }, 1.0);
        
        // Store filtered matches
        setSureBets(sureBetsData);
        setDailyParlay(dailyParlayData);
        setAccuracy(accuracy);
        setLiveMatchesCount(liveMatches);
        setSettledMatchesCount(settledMatches);
        setEndedMatchesCount(endedMatches);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        
        // Set fallback data in case of error
        setSureBets([]);
        setDailyParlay([]);
        setAccuracy(0);
        setLiveMatchesCount(0);
        setSettledMatchesCount(0);
        setEndedMatchesCount(0);
      }
    };
    
    fetchData();
  }, [value, tabIndex]); // Re-run when tab changes

  // Calculate total odds for daily parlay
  const totalOdds = dailyParlay.reduce((acc, match) => {
    const odds = typeof match.odds === 'number' ? match.odds : 1.0;
    return acc * odds;
  }, 1.0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
    >
      <motion.div
        className="bg-gradient-to-br from-[#14F195]/10 via-[#14F195]/5 to-transparent rounded-lg p-6 border border-[#2A2A2A] hover:border-[#14F195]/50 transition-all duration-300 backdrop-blur-sm"
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <h3 className="text-sm font-medium text-gray-400 mb-2">
          {tabIndex === 0 ? (
            <TooltipWrapper
              content="Sure Bets"
              tooltipText="Number of the matches labelled as High Trust by AI."
            />
          ) : (
            <TooltipWrapper
              content="Matches"
              tooltipText="Number of the matches in the slip."
            />
          )}
        </h3>
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#14F195] text-lg font-bold text-white">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              tabIndex === 0
                ? sureBets.length
                : dailyParlay.length
            )}
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="bg-gradient-to-br from-[#9945FF]/10 via-[#9945FF]/5 to-transparent rounded-lg p-6 border border-[#2A2A2A] hover:border-[#9945FF]/50 transition-all duration-300 backdrop-blur-sm"
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <h3 className="text-sm font-medium text-gray-400 mb-2">
          {tabIndex === 0 ? (
            <TooltipWrapper
              content="Settled Matches"
              tooltipText="Number of matches with results (score, win, or loss)."
            />
          ) : (
            <TooltipWrapper
              content="Ended"
              tooltipText="Number of the concluded games in the slip."
            />
          )}
        </h3>
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#9945FF] text-lg font-bold text-white">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              tabIndex === 0 
                ? settledMatchesCount 
                : endedMatchesCount
            )}
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="bg-gradient-to-br from-[#00C2FF]/10 via-[#00C2FF]/5 to-transparent rounded-lg p-6 border border-[#2A2A2A] hover:border-[#00C2FF]/50 transition-all duration-300 backdrop-blur-sm"
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <h3 className="text-sm font-medium text-gray-400 mb-2">
          {tabIndex === 0 ? (
            <TooltipWrapper
              content="Accuracy"
              tooltipText="Percentage of the correct predictions."
            />
          ) : (
            <TooltipWrapper
              content="Total Odds"
              tooltipText="Total odd amount of the games in the slip."
            />
          )}
        </h3>
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#00C2FF] text-lg font-bold text-white">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              tabIndex === 0
                ? accuracy ? `${accuracy}%` : "N/A"
                : totalOdds && totalOdds < 999
                  ? totalOdds.toFixed(2)
                  : "999+"
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper function to evaluate predictions
function evaluatePrediction(prediction: string, homeScore: number, awayScore: number): boolean {
  // Convert prediction to lowercase for case-insensitive comparison
  const pred = prediction.toLowerCase();
  
  // 1X2 predictions
  if (pred === "1") {
    return homeScore > awayScore; // Home win
  } else if (pred === "x" || pred === "draw") {
    return homeScore === awayScore; // Draw
  } else if (pred === "2") {
    return homeScore < awayScore; // Away win
  } 
  
  // Handicap predictions (win by margin)
  else if (pred === "h1") {
    return (homeScore - awayScore) >= 2; // Home team wins by 2 or more
  } else if (pred === "h2") {
    return (awayScore - homeScore) >= 2; // Away team wins by 2 or more
  }
  
  // Double chance predictions
  else if (pred === "1x") {
    return homeScore >= awayScore; // Home win or draw
  } else if (pred === "x2") {
    return homeScore <= awayScore; // Away win or draw
  } else if (pred === "12") {
    return homeScore !== awayScore; // Home win or away win (not draw)
  }
  
  // Over/Under predictions
  else if (pred.startsWith("o") || pred.startsWith("over")) {
    // Extract the threshold value (e.g., "O2.5" -> 2.5)
    const thresholdMatch = pred.match(/[0-9]+(\.[0-9]+)?/);
    if (thresholdMatch) {
      const threshold = parseFloat(thresholdMatch[0]);
      return (homeScore + awayScore) > threshold;
    }
  } else if (pred.startsWith("u") || pred.startsWith("under")) {
    // Extract the threshold value (e.g., "U2.5" -> 2.5)
    const thresholdMatch = pred.match(/[0-9]+(\.[0-9]+)?/);
    if (thresholdMatch) {
      const threshold = parseFloat(thresholdMatch[0]);
      return (homeScore + awayScore) < threshold;
    }
  }
  
  // Both teams to score predictions
  else if (pred === "btts-yes" || pred === "gg") {
    return homeScore > 0 && awayScore > 0;
  } else if (pred === "btts-no" || pred === "ng") {
    return homeScore === 0 || awayScore === 0;
  }
  
  // Correct score predictions (e.g., "2-1")
  else if (pred.includes("-")) {
    const [predictedHome, predictedAway] = pred.split("-").map(Number);
    return predictedHome === homeScore && predictedAway === awayScore;
  }
  
  // If prediction format is not recognized
  console.warn(`Unrecognized prediction format: ${prediction}`);
  return false;
} 