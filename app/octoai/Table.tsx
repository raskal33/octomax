"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { calculateDate, formatDate } from "./utils";
import { getBetOfTheDayMatchByDate, evaluatePrediction } from "./services/matchService";

type Value = string;

// Simple backdrop component
function Backdrop({ active }: { active: boolean }) {
  return active ? (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : null;
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

// Function to get match start time as Date object for sorting
function getMatchDateTime(match: any): Date {
  try {
    const now = new Date();
    
    if (match.matchDate.includes("-")) {
      // Full date format (YYYY-MM-DD)
      const [year, month, day] = match.matchDate.split("-").map(Number);
      const [hours, minutes] = (match.time || "00:00").split(":").map(Number);
      
      return new Date(year, month - 1, day, hours || 0, minutes || 0);
    } else if (match.matchDate === "Match continue") {
      // Live matches should be at the top
      return new Date(now.getTime() - 1000); // 1 second ago
    } else {
      // Just time format, assume today
      const [hours, minutes] = (match.time || match.matchDate || "00:00").split(":").map(Number);
      
      const date = new Date();
      date.setHours(hours || 0, minutes || 0, 0, 0);
      return date;
    }
  } catch (error) {
    console.error("Error parsing match date/time for sorting:", error, match);
    return new Date(9999, 11, 31); // Far future date for sorting errors to the bottom
  }
}

// Match data table component
function MatchDataTable({ 
  matchData 
}: { 
  matchData: any[] 
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-separate overflow-hidden rounded-lg text-left text-sm">
        <thead className="bg-[#0d0d0d] text-xs uppercase text-[#14F195]">
          <tr>
            <th scope="col" className="px-4 py-3">Match</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Prediction</th>
            <th scope="col" className="px-4 py-3">Odds</th>
            <th scope="col" className="px-4 py-3">Confidence</th>
            <th scope="col" className="px-4 py-3">Result</th>
          </tr>
        </thead>
        <tbody>
          {matchData.map((match, index) => {
            // Check if the match has a result (score, win, or loss)
            const hasResult = 
              (match.homeScore !== undefined && match.awayScore !== undefined) || 
              match.score || 
              match.result;
            
            // Force status to "Ended" if there's a result
            const displayStatus = hasResult ? "Ended" : (match.status || getMatchStatus(match.matchDate, match.time));
            
            return (
              <motion.tr
                key={match.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="border-b border-[#9945FF]/30 bg-[#0d0d0d] hover:bg-[#1A1A1A] transition-colors duration-200"
              >
                <td className="px-4 py-3 font-medium text-white">
                  {match.homeTeam || 'Unknown'} - {match.awayTeam || 'Unknown'}
                </td>
                <td className="px-4 py-3">
                  {displayStatus === "Live" ? (
                    <span className="px-2 py-1 rounded-md text-xs font-bold bg-[#FF6B4A]/20 text-[#FF6B4A]">
                      Live
                    </span>
                  ) : displayStatus === "Ended" ? (
                    <span className="px-2 py-1 rounded-md text-xs font-bold bg-[#14F195]/20 text-[#14F195]">
                      Ended
                    </span>
                  ) : match.matchDate === "Match continue" ? (
                    <span className="px-2 py-1 rounded-md text-xs font-bold bg-[#FF6B4A]/20 text-[#FF6B4A]">
                      Live
                    </span>
                  ) : (
                    <span className="text-gray-300">{match.matchDate || 'TBD'}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {match.bestTip ? (
                    <span
                      className={`px-2 py-1 rounded-md text-black font-bold ${
                        match.bestTip.includes("1") 
                          ? "bg-[#14F195]" 
                          : match.bestTip.includes("X") 
                            ? "bg-[#9945FF]" 
                            : match.bestTip.includes("2") 
                              ? "bg-[#FF6B4A]"
                              : match.bestTip.includes("O")
                                ? "bg-[#00C2FF]"
                                : match.bestTip.includes("U")
                                  ? "bg-[#FFD700]"
                                  : "bg-[#9945FF]"
                      }`}
                    >
                      {match.bestTip}
                    </span>
                  ) : (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </td>
                <td className="px-4 py-3 font-bold text-[#14F195]">
                  {typeof match.odds === 'number' ? match.odds.toFixed(2) : 'N/A'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-bold ${
                      match.confidence === "High" 
                        ? "bg-[#14F195]/20 text-[#14F195]" 
                        : match.confidence === "Medium" 
                          ? "bg-[#FFD700]/20 text-[#FFD700]" 
                          : "bg-[#FF6B4A]/20 text-[#FF6B4A]"
                    }`}
                  >
                    {match.confidence || "Medium"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {match.score ? (
                    <div>
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        match.isCorrect 
                          ? "bg-[#14F195]/20 text-[#14F195]" 
                          : "bg-[#FF6B4A]/20 text-[#FF6B4A]"
                      }`}>
                        {match.score}
                        {match.isCorrect !== undefined ? (match.isCorrect ? " ✓" : " ✗") : ""}
                      </span>
                    </div>
                  ) : match.homeScore !== undefined && match.awayScore !== undefined ? (
                    <div>
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        match.isCorrect 
                          ? "bg-[#14F195]/20 text-[#14F195]" 
                          : "bg-[#FF6B4A]/20 text-[#FF6B4A]"
                      }`}>
                        {match.homeScore} - {match.awayScore}
                        {match.isCorrect !== undefined ? (match.isCorrect ? " ✓" : " ✗") : ""}
                      </span>
                    </div>
                  ) : match.result ? (
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-bold ${
                        match.result === "Win" 
                          ? "bg-[#14F195]/20 text-[#14F195]" 
                          : match.result === "Loss" 
                            ? "bg-[#FF6B4A]/20 text-[#FF6B4A]" 
                            : "bg-[#9945FF]/20 text-[#9945FF]"
                      }`}
                    >
                      {match.result}
                    </span>
                  ) : displayStatus === "Ended" ? (
                    <span className="text-gray-500">Result Pending</span>
                  ) : (
                    <span className="text-gray-500">Pending</span>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface TableProps {
  value: Value;
  tabIndex: number;
}

export default function Table({ value, tabIndex }: TableProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  
  // Data states
  const [matches, setMatches] = useState<any[]>([]);
  const [sureBets, setSureBets] = useState<any[]>([]);
  const [dailyParlay, setDailyParlay] = useState<any[]>([]);

  useEffect(() => {
    setIsVisible(true);
    setIsLoading(true);
    setPage(1); // Reset page when date changes
    
    // Calculate date from value
    const date = calculateDate(value);
    const formattedDate = formatDate(date);
    console.log('Table - Selected date value:', value);
    console.log('Table - Calculated date:', date);
    console.log('Table - Formatted date:', formattedDate);
    
    // Fetch data from API
    const fetchData = async () => {
      try {
        // Fetch match data
        const matchesData = await getBetOfTheDayMatchByDate(date);
        
        console.log('Table - Fetched data:', {
          matchesCount: matchesData.length,
          sampleMatch: matchesData.length > 0 ? matchesData[0] : null
        });
        
        if (!Array.isArray(matchesData) || matchesData.length === 0) {
          console.warn('No matches returned from API or invalid data format');
          setMatches([]);
          setSureBets([]);
          setDailyParlay([]);
          setIsLoading(false);
          return;
        }
        
        // Load categories from localStorage
        const savedCategoriesStr = localStorage.getItem(`matchCategories_${date.year}_${date.month}_${date.day}`);
        const savedCategories = savedCategoriesStr ? JSON.parse(savedCategoriesStr) : {};
        
        console.log('Table - Saved categories:', savedCategories);
        
        // Load scores from localStorage
        const savedScoresStr = localStorage.getItem(`matchScores_${date.year}_${date.month}_${date.day}`);
        const savedScores = savedScoresStr ? JSON.parse(savedScoresStr) : {};
        
        console.log('Table - Saved scores:', savedScores);
        
        // Apply categories and scores to matches
        const matchesWithCategories = matchesData.map(match => {
          // Ensure match has an id
          if (!match.id) {
            console.warn('Match without ID:', match);
            match.id = `match_${Math.random().toString(36).substr(2, 9)}`;
          }
          
          // Determine match status
          const status = getMatchStatus(match.matchDate, match.time, match.result);
          
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
          
          return {
            ...match,
            categories: savedCategories[match.id] || [], // Default to empty array if not categorized
            status,
            score,
            homeScore,
            awayScore,
            isCorrect
          };
        });
        
        console.log('Table - Matches with categories:', matchesWithCategories.slice(0, 2));
        
        // Store all matches
        setMatches(matchesWithCategories);
        
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
        
        // Sort matches by start time (earliest first)
        sureBetsData.sort((a, b) => {
          const timeA = getMatchDateTime(a);
          const timeB = getMatchDateTime(b);
          return timeA.getTime() - timeB.getTime();
        });
        
        dailyParlayData.sort((a, b) => {
          const timeA = getMatchDateTime(a);
          const timeB = getMatchDateTime(b);
          return timeA.getTime() - timeB.getTime();
        });
        
        console.log('Table - Sure bets count:', sureBetsData.length);
        console.log('Table - Daily parlay count:', dailyParlayData.length);
        
        // Store filtered matches
        setSureBets(sureBetsData);
        setDailyParlay(dailyParlayData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        
        // Set fallback data in case of error
        setMatches([]);
        setSureBets([]);
        setDailyParlay([]);
      }
    };
    
    fetchData();
  }, [value]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  // Get the current data based on the active tab
  const currentData = tabIndex === 0 ? sureBets : dailyParlay;
  
  // Paginate the data
  const pagedData = currentData.slice((page - 1) * 10, page * 10);
  const pageCount = Math.max(1, Math.ceil(currentData.length / 10));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="pixel-border bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-6 pixel-box"
    >
      <Backdrop active={isLoading} />
      
      {currentData.length === 0 && !isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No matches found for this category.</p>
          <p className="text-gray-500 text-sm mt-2">
            {tabIndex === 0
              ? "Check the Daily Parlay tab or try selecting a different date." 
              : "Check the Sure Bets tab or try selecting a different date."}
          </p>
        </div>
      ) : (
        <MatchDataTable
          matchData={pagedData}
        />
      )}

      {currentData.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  page === i + 1 
                    ? "bg-[#9945FF] text-white" 
                    : "bg-[#1A1A1A] text-gray-400 hover:bg-[#9945FF]/70 hover:text-white"
                } transition-all duration-200`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
} 