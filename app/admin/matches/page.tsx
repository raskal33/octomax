"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { getBetOfTheDayMatchByDate, evaluatePrediction, MatchData } from "@/app/ai-matches/services/matchService";
import { calculateDate } from "@/app/ai-matches/utils";

// Match interface for admin page
interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  league: string;
  prediction: string;
  odds: number;
  result?: string;
  correct?: boolean;
  categories: string[]; // Array of categories instead of single category
  status?: "Upcoming" | "Live" | "Ended"; // Match status
  score?: string;
}

// Function to transform MatchData to Match
function transformToMatch(matchData: MatchData): Match {
  return {
    id: matchData.id,
    homeTeam: matchData.homeTeam,
    awayTeam: matchData.awayTeam,
    date: matchData.matchDate,
    time: matchData.time || "",
    league: "Unknown", // Default value as MatchData doesn't have league
    prediction: matchData.bestTip,
    odds: matchData.odds,
    result: matchData.result,
    correct: matchData.isCorrect || false,
    categories: matchData.categories || [],
    status: matchData.status,
    score: matchData.score
  };
}

// Date selection buttons component
function DateSelector({ selectedDate, onDateSelect }: { 
  selectedDate: string; 
  onDateSelect: (date: string) => void;
}) {
  const dateOptions = [
    { label: "Today", value: "0" },
    { label: "Yesterday", value: "-1" },
    { label: "2 Days Ago", value: "-2" },
    { label: "3 Days Ago", value: "-3" }
  ];
  
  return (
    <div className="flex space-x-4 mb-6">
      {dateOptions.map((option) => (
        <button
          key={option.label}
          onClick={() => onDateSelect(option.value)}
          className={`px-4 py-2 rounded-lg ${
            selectedDate === option.value
              ? "bg-[#9945FF] text-white"
              : "bg-[#1A1A1A] text-gray-400 hover:bg-[#9945FF]/70 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Result selection buttons component
function ResultSelector({ 
  matchId, 
  currentScore,
  prediction,
  onScoreUpdate,
  onScoreRemove
}: { 
  matchId: string;
  currentScore?: string;
  prediction: string;
  onScoreUpdate: (matchId: string, score: string) => void;
  onScoreRemove: (matchId: string) => void;
}) {
  const [score, setScore] = useState<string>(currentScore || "");
  const [isEditing, setIsEditing] = useState(false);

  // Function to evaluate if prediction is correct
  const evaluateResult = (scoreStr: string, prediction: string): boolean => {
    if (!scoreStr || !prediction) return false;
    
    // Parse the score
    const scoreParts = scoreStr.includes(':') 
      ? scoreStr.split(':').map(s => s.trim())
      : scoreStr.split('-').map(s => s.trim());
    
    if (scoreParts.length !== 2) return false;
    
    const homeScore = parseInt(scoreParts[0], 10);
    const awayScore = parseInt(scoreParts[1], 10);
    
    if (isNaN(homeScore) || isNaN(awayScore)) return false;
    
    return evaluatePrediction(prediction, homeScore, awayScore);
  };

  return (
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="e.g. 2:1"
            className="w-20 px-2 py-1 rounded bg-[#1A1A1A] text-white border border-[#9945FF]"
          />
          <button
            onClick={() => {
              if (score) {
                onScoreUpdate(matchId, score);
                setIsEditing(false);
              }
            }}
            className="px-2 py-1 rounded bg-[#14F195] text-black text-sm"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-2 py-1 rounded bg-[#FF6B4A] text-black text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {currentScore ? (
            <div className="flex items-center space-x-2">
              <span className="text-white">{currentScore}</span>
              <span className={`ml-2 px-2 py-1 rounded-md text-xs font-bold ${
                evaluateResult(currentScore, prediction)
                  ? "bg-[#14F195]/20 text-[#14F195]"
                  : "bg-[#FF6B4A]/20 text-[#FF6B4A]"
              }`}>
                {evaluateResult(currentScore, prediction) ? "✓" : "✗"}
              </span>
              <button
                onClick={() => onScoreRemove(matchId)}
                className="ml-2 px-2 py-1 rounded bg-[#FF6B4A]/20 text-[#FF6B4A] text-sm hover:bg-[#FF6B4A]/40"
                title="Remove result"
              >
                ✕
              </button>
            </div>
          ) : (
            <span className="text-gray-400">No score</span>
          )}
          <button
            onClick={() => {
              setScore(currentScore || "");
              setIsEditing(true);
            }}
            className="px-2 py-1 rounded bg-[#9945FF]/20 text-[#9945FF] text-sm hover:bg-[#9945FF]/40"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default function MatchesAdmin() {
  const [selectedDate, setSelectedDate] = useState<string>("0"); // Use "0" for Today
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ [key: string]: string[] }>({});
  const [scores, setScores] = useState<{ [key: string]: string }>({});

  // Fetch matches when date changes
  useEffect(() => {
    fetchMatches();
  }, [selectedDate]);

  // Function to fetch matches
  const fetchMatches = async () => {
    setLoading(true);
    try {
      // Calculate date from selected option - use the same calculation as AI Matches page
      const date = calculateDate(selectedDate);
      console.log('Admin - Fetching matches for date:', date, 'selectedDate:', selectedDate);
      
      // Fetch matches from API
      const matchesData = await getBetOfTheDayMatchByDate(date);
      console.log('Admin - Fetched matches:', matchesData.length);
      
      // Load categories from localStorage
      const categoriesKey = `matchCategories_${date.year}_${date.month}_${date.day}`;
      const savedCategoriesStr = localStorage.getItem(categoriesKey);
      const savedCategories = savedCategoriesStr ? JSON.parse(savedCategoriesStr) : {};
      
      console.log('Admin - Saved categories:', savedCategories);
      
      // Load scores from localStorage
      const scoresKey = `matchScores_${date.year}_${date.month}_${date.day}`;
      const savedScoresStr = localStorage.getItem(scoresKey);
      const savedScores = savedScoresStr ? JSON.parse(savedScoresStr) : {};
      
      console.log('Admin - Saved scores:', savedScores);
      
      // Transform MatchData to Match and apply categories and scores
      const matchesWithCategories: Match[] = matchesData.map(matchData => {
        const match = transformToMatch(matchData);
        return {
          ...match,
          categories: savedCategories[match.id] || [],
          score: savedScores[match.id] || match.score
        };
      });
      
      setMatches(matchesWithCategories);
      setCategories(savedCategories);
      setScores(savedScores);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setLoading(false);
    }
  };

  // Toggle category for a match
  const toggleCategory = (matchId: string, category: string) => {
    setMatches(prevMatches => {
      return prevMatches.map(match => {
        if (match.id === matchId) {
          const categories = [...(match.categories || [])];
          const index = categories.indexOf(category);
          
          if (index === -1) {
            categories.push(category);
          } else {
            categories.splice(index, 1);
          }
          
          return {
            ...match,
            categories
          };
        }
        return match;
      });
    });

    // Update categories state
    setCategories(prevCategories => {
      const newCategories = { ...prevCategories };
      
      if (!newCategories[matchId]) {
        newCategories[matchId] = [];
      }
      
      const categoryIndex = newCategories[matchId].indexOf(category);
      if (categoryIndex === -1) {
        newCategories[matchId].push(category);
      } else {
        newCategories[matchId].splice(categoryIndex, 1);
      }
      
      // Save to localStorage immediately
      const date = calculateDate(selectedDate);
      const categoriesKey = `matchCategories_${date.year}_${date.month}_${date.day}`;
      localStorage.setItem(categoriesKey, JSON.stringify(newCategories));
      
      return newCategories;
    });
  };

  // Quick action: Add all to Sure Bets
  const addAllToSureBets = () => {
    const newCategories = { ...categories };
    
    matches.forEach(match => {
      if (!newCategories[match.id]) {
        newCategories[match.id] = [];
      }
      
      if (!newCategories[match.id].includes("sureBet")) {
        newCategories[match.id].push("sureBet");
      }
    });
    
    // Update state
    setCategories(newCategories);
    
    // Update matches
    setMatches(prevMatches => {
      return prevMatches.map(match => {
        return {
          ...match,
          categories: newCategories[match.id] || []
        };
      });
    });
    
    // Save to localStorage
    const date = calculateDate(selectedDate);
    const categoriesKey = `matchCategories_${date.year}_${date.month}_${date.day}`;
    localStorage.setItem(categoriesKey, JSON.stringify(newCategories));
    
    // Show success message
    setSaveStatus('All matches added to Sure Bets!');
    setTimeout(() => setSaveStatus(null), 3000);
  };
  
  // Quick action: Add all to Daily Parlay
  const addAllToDailyParlay = () => {
    const newCategories = { ...categories };
    
    matches.forEach(match => {
      if (!newCategories[match.id]) {
        newCategories[match.id] = [];
      }
      
      if (!newCategories[match.id].includes("dailyParlay")) {
        newCategories[match.id].push("dailyParlay");
      }
    });
    
    // Update state
    setCategories(newCategories);
    
    // Update matches
    setMatches(prevMatches => {
      return prevMatches.map(match => {
        return {
          ...match,
          categories: newCategories[match.id] || []
        };
      });
    });
    
    // Save to localStorage
    const date = calculateDate(selectedDate);
    const categoriesKey = `matchCategories_${date.year}_${date.month}_${date.day}`;
    localStorage.setItem(categoriesKey, JSON.stringify(newCategories));
    
    // Show success message
    setSaveStatus('All matches added to Daily Parlay!');
    setTimeout(() => setSaveStatus(null), 3000);
  };
  
  // Quick action: Clear all categories
  const clearAllCategories = () => {
    // Create empty categories
    const newCategories = {};
    
    // Update state
    setCategories(newCategories);
    
    // Update matches
    setMatches(prevMatches => {
      return prevMatches.map(match => {
        return {
          ...match,
          categories: []
        };
      });
    });
    
    // Save to localStorage
    const date = calculateDate(selectedDate);
    const categoriesKey = `matchCategories_${date.year}_${date.month}_${date.day}`;
    localStorage.setItem(categoriesKey, JSON.stringify(newCategories));
    
    // Show success message
    setSaveStatus('All categories cleared!');
    setTimeout(() => setSaveStatus(null), 3000);
  };
  
  // Quick action: Undo all edits (remove all scores)
  const undoAllEdits = () => {
    // Create empty scores
    const newScores = {};
    
    // Update state
    setScores(newScores);
    
    // Update matches
    setMatches(prevMatches => {
      return prevMatches.map(match => {
        return {
          ...match,
          score: undefined
        };
      });
    });
    
    // Save to localStorage
    const date = calculateDate(selectedDate);
    const scoresKey = `matchScores_${date.year}_${date.month}_${date.day}`;
    localStorage.setItem(scoresKey, JSON.stringify(newScores));
    
    // Show success message
    setSaveStatus('All result edits undone!');
    setTimeout(() => setSaveStatus(null), 3000);
  };
  
  // Quick action: Refresh data
  const refreshData = () => {
    fetchMatches();
    setSaveStatus('Data refreshed!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Save categories to localStorage
  const saveCategories = () => {
    try {
      const date = calculateDate(selectedDate);
      const categoriesKey = `matchCategories_${date.year}_${date.month}_${date.day}`;
      
      // Save to localStorage
      localStorage.setItem(categoriesKey, JSON.stringify(categories));
      
      // Also save scores to ensure they're persisted
      const scoresKey = `matchScores_${date.year}_${date.month}_${date.day}`;
      localStorage.setItem(scoresKey, JSON.stringify(scores));
      
      // Show success message
      setSaveStatus('Categories and scores saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveStatus('Error saving data');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Check if match has a specific category
  const hasCategory = (match: Match, category: string) => {
    return match.categories && match.categories.includes(category);
  };

  // Handle score update
  const handleScoreUpdate = (matchId: string, score: string) => {
    console.log(`Updating score for match ${matchId} to ${score}`);
    
    // Update matches state
    setMatches(prevMatches => {
      return prevMatches.map(match => {
        if (match.id === matchId) {
          // Update the match with the new score
          return {
            ...match,
            score: score
          };
        }
        return match;
      });
    });

    // Update scores state
    setScores(prevScores => {
      const newScores = { ...prevScores };
      newScores[matchId] = score;
      
      // Save to localStorage immediately
      const date = calculateDate(selectedDate);
      const scoresKey = `matchScores_${date.year}_${date.month}_${date.day}`;
      localStorage.setItem(scoresKey, JSON.stringify(newScores));
      
      return newScores;
    });
    
    console.log(`Score saved to localStorage: ${matchId} = ${score}`);
  };
  
  // Handle score remove
  const handleScoreRemove = (matchId: string) => {
    console.log(`Removing score for match ${matchId}`);
    
    // Update matches state
    setMatches(prevMatches => {
      return prevMatches.map(match => {
        if (match.id === matchId) {
          // Remove the score from the match
          const { score, ...matchWithoutScore } = match;
          return matchWithoutScore;
        }
        return match;
      });
    });

    // Update scores state
    setScores(prevScores => {
      const newScores = { ...prevScores };
      delete newScores[matchId];
      
      // Save to localStorage immediately
      const date = calculateDate(selectedDate);
      const scoresKey = `matchScores_${date.year}_${date.month}_${date.day}`;
      localStorage.setItem(scoresKey, JSON.stringify(newScores));
      
      return newScores;
    });
    
    console.log(`Score removed from localStorage: ${matchId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[#0d0d0d] rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">
            Matches Management
          </h1>
          
          <button
            onClick={saveCategories}
            className="px-4 py-2 bg-[#14F195] text-black rounded-lg font-bold hover:bg-[#14F195]/80 transition-colors"
          >
            Save Categories
          </button>
        </div>
        
        {saveStatus && (
          <div className="bg-[#14F195]/20 text-[#14F195] p-3 rounded-lg mb-6">
            {saveStatus}
          </div>
        )}
        
        <p className="text-gray-400 mb-6">
          Select a date to view and categorize matches. You can mark matches as "Sure Bets" or "Daily Parlay".
        </p>
        
        <DateSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        
        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={addAllToSureBets}
            className="px-3 py-2 rounded bg-[#14F195]/20 text-[#14F195] text-sm hover:bg-[#14F195]/40 transition-colors"
          >
            Add All to Sure Bets
          </button>
          <button
            onClick={addAllToDailyParlay}
            className="px-3 py-2 rounded bg-[#9945FF]/20 text-[#9945FF] text-sm hover:bg-[#9945FF]/40 transition-colors"
          >
            Add All to Daily Parlay
          </button>
          <button
            onClick={clearAllCategories}
            className="px-3 py-2 rounded bg-[#FF6B4A]/20 text-[#FF6B4A] text-sm hover:bg-[#FF6B4A]/40 transition-colors"
          >
            Clear All Categories
          </button>
          <button
            onClick={undoAllEdits}
            className="px-3 py-2 rounded bg-[#FF6B4A]/20 text-[#FF6B4A] text-sm hover:bg-[#FF6B4A]/40 transition-colors"
          >
            Undo All Edits
          </button>
          <button
            onClick={refreshData}
            className="px-3 py-2 rounded bg-[#00C2FF]/20 text-[#00C2FF] text-sm hover:bg-[#00C2FF]/40 transition-colors"
          >
            Refresh Data
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No matches found for the selected date.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#1A1A1A] border-b border-[#333]">
                <tr>
                  <th className="p-3 text-left text-gray-400">Match</th>
                  <th className="p-3 text-left text-gray-400">Time</th>
                  <th className="p-3 text-left text-gray-400">Prediction</th>
                  <th className="p-3 text-left text-gray-400">Odds</th>
                  <th className="p-3 text-left text-gray-400">Result</th>
                  <th className="p-3 text-left text-gray-400">Categories</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id} className="border-b border-[#333] hover:bg-[#1A1A1A]/50">
                    <td className="p-3 text-white">
                      {match.homeTeam} vs {match.awayTeam}
                    </td>
                    <td className="p-3 text-gray-300">{match.date}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded bg-[#9945FF]/20 text-[#9945FF]">
                        {match.prediction}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#14F195]">{match.odds.toFixed(2)}</td>
                    <td className="p-3">
                      <ResultSelector
                        matchId={match.id}
                        currentScore={match.score}
                        prediction={match.prediction}
                        onScoreUpdate={handleScoreUpdate}
                        onScoreRemove={handleScoreRemove}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleCategory(match.id, "sureBet")}
                          className={`px-3 py-1 rounded text-sm ${
                            hasCategory(match, "sureBet")
                              ? "bg-[#14F195] text-black"
                              : "bg-[#1A1A1A] text-gray-300 hover:bg-[#14F195]/20 hover:text-[#14F195]"
                          }`}
                        >
                          Sure Bet
                        </button>
                        <button
                          onClick={() => toggleCategory(match.id, "dailyParlay")}
                          className={`px-3 py-1 rounded text-sm ${
                            hasCategory(match, "dailyParlay")
                              ? "bg-[#9945FF] text-white"
                              : "bg-[#1A1A1A] text-gray-300 hover:bg-[#9945FF]/20 hover:text-[#9945FF]"
                          }`}
                        >
                          Daily Parlay
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 