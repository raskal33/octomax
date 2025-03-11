import axios from 'axios';

// Use relative URL for the proxy API route
const API_BASE_URL = '/api/matches';

// Configure axios with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // Increase timeout to 30 seconds
});

export interface MatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  time?: string; // Add time property
  bestTip: string;
  odds: number;
  confidence: "High" | "Medium" | "Low";
  result?: string;
  trust?: string; // Trust rating from API
  categories?: string[]; // Categories for the match
  status?: "Upcoming" | "Live" | "Ended"; // Match status
  homeScore?: number; // Home team score
  awayScore?: number; // Away team score
  isCorrect?: boolean; // Whether the prediction was correct
  score?: string; // Raw score string (e.g., "2:1")
}

// Fallback mock data for when the API is unavailable
const FALLBACK_MATCHES: MatchData[] = [
  {
    id: 'mock-1',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    matchDate: '19:30',
    bestTip: '1',
    odds: 1.85,
    confidence: 'High',
    trust: '9.5/10'
  },
  {
    id: 'mock-2',
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    matchDate: 'Match continue',
    bestTip: 'X',
    odds: 3.40,
    confidence: 'Medium',
    trust: '7.5/10'
  },
  {
    id: 'mock-3',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Dortmund',
    matchDate: '21:00',
    bestTip: '2',
    odds: 2.75,
    confidence: 'Low',
    trust: '6.0/10'
  },
  {
    id: 'mock-4',
    homeTeam: 'Liverpool',
    awayTeam: 'Man City',
    matchDate: 'Match continue',
    bestTip: 'O2.5',
    odds: 1.95,
    confidence: 'High',
    trust: '8.5/10'
  },
  {
    id: 'mock-5',
    homeTeam: 'PSG',
    awayTeam: 'Juventus',
    matchDate: '18:45',
    bestTip: 'U3.5',
    odds: 2.10,
    confidence: 'Medium',
    trust: '7.0/10'
  }
];

/**
 * Evaluates if a prediction was correct based on the match result
 * @param prediction The prediction (e.g., "1", "X", "2", "O2.5", "U3.5", "H1", "H2")
 * @param homeScore Home team score
 * @param awayScore Away team score
 * @returns Boolean indicating if the prediction was correct
 */
export function evaluatePrediction(prediction: string, homeScore?: number, awayScore?: number): boolean {
  // If scores are not available, we can't evaluate
  if (homeScore === undefined || awayScore === undefined) {
    return false;
  }

  console.log(`Evaluating prediction: ${prediction} with score ${homeScore}-${awayScore}`);

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

/**
 * Calculate accuracy based on match data
 * @param matches Array of match data
 * @returns Accuracy percentage (0-100)
 */
export function calculateAccuracy(matches: MatchData[]): number {
  // If no matches, return 0
  if (!matches || matches.length === 0) {
    return 0;
  }
  
  // Count matches with high trust rating
  const highTrustMatches = matches.filter(match => {
    if (match.trust) {
      const trustValue = parseFloat(match.trust);
      return trustValue >= 8; // Consider matches with trust >= 8 as high trust
    }
    return match.confidence === 'High'; // Fallback to confidence if trust is not available
  });
  
  // Calculate percentage
  return Math.round((highTrustMatches.length / matches.length) * 100);
}

/**
 * Transforms raw match data to our interface format
 * @param match Raw match data from API
 * @returns Formatted match data
 */
function transformMatchData(match: any): MatchData {
  // If match is already in the right format, return it
  if (match.homeTeam && match.awayTeam && match.bestTip) {
    // Parse scores if they exist in format "1 : 1"
    let homeScore: number | undefined = undefined;
    let awayScore: number | undefined = undefined;
    let isCorrect: boolean | undefined = undefined;
    let score: string | undefined = undefined;

    // First, check if the score is embedded in the team names (e.g., "FAS 2 : 0 - Platense")
    const fullMatchText = `${match.homeTeam} - ${match.awayTeam}`;
    const scoreRegex = /(\d+)\s*:\s*(\d+)/;
    const scoreMatch = fullMatchText.match(scoreRegex);
    
    if (scoreMatch && scoreMatch.length >= 3) {
      homeScore = parseInt(scoreMatch[1], 10);
      awayScore = parseInt(scoreMatch[2], 10);
      score = `${homeScore} : ${awayScore}`;
      
      if (!isNaN(homeScore) && !isNaN(awayScore)) {
        console.log(`Extracted score from team names: ${homeScore}-${awayScore}`);
        isCorrect = evaluatePrediction(match.bestTip, homeScore, awayScore);
        
        // Clean up team names by removing the score
        const cleanedText = fullMatchText.replace(scoreRegex, '');
        const teamParts = cleanedText.split('-').map((s: string) => s.trim());
        
        if (teamParts.length >= 2) {
          match.homeTeam = teamParts[0];
          match.awayTeam = teamParts[1];
        }
      }
    }
    // Then check if score is in the match object
    else if (match.score) {
      // Handle both "1 : 1" and "1-1" formats
      const scoreParts = match.score.includes(':') 
        ? match.score.split(':').map((s: string) => s.trim())
        : match.score.split('-').map((s: string) => s.trim());

      if (scoreParts.length === 2) {
        homeScore = parseInt(scoreParts[0], 10);
        awayScore = parseInt(scoreParts[1], 10);
        score = match.score;
        
        if (!isNaN(homeScore) && !isNaN(awayScore)) {
          isCorrect = evaluatePrediction(match.bestTip, homeScore, awayScore);
        }
      }
    }
    // Check if homeScore and awayScore are already set
    else if (match.homeScore !== undefined && match.awayScore !== undefined) {
      homeScore = match.homeScore;
      awayScore = match.awayScore;
      score = `${homeScore} : ${awayScore}`;
      
      // If we have scores, evaluate if prediction was correct
      isCorrect = evaluatePrediction(match.bestTip, homeScore, awayScore);
    }

    // Generate a unique ID if not present
    const id = match.id?.toString() || `match-${Math.random().toString(36).substr(2, 9)}`;

    return {
      ...match,
      id,
      confidence: match.confidence || "Medium",
      homeScore,
      awayScore,
      isCorrect,
      score
    };
  }
  
  // Split the teams string into home and away teams
  const teamsArray = match.teams ? match.teams.split(' ') : ['Unknown', 'Unknown'];
  
  // If there are at least two words, assume the last word is the away team
  // and everything before it is the home team
  let homeTeam = 'Unknown';
  let awayTeam = 'Unknown';
  
  if (teamsArray.length >= 2) {
    awayTeam = teamsArray.pop() || 'Unknown';
    homeTeam = teamsArray.join(' ');
  }
  
  // Extract odds from bestTip
  const bestTipParts = match.bestTip ? match.bestTip.split(' ') : ['Unknown', '1.0'];
  const odds = parseFloat(bestTipParts[1]) || 1.0;
  
  // Determine confidence level from trust rating
  let confidence: "High" | "Medium" | "Low" = "Medium";
  if (match.trust) {
    const trustValue = parseFloat(match.trust);
    if (trustValue >= 8) {
      confidence = "High";
    } else if (trustValue >= 6) {
      confidence = "Medium";
    } else {
      confidence = "Low";
    }
  }
  
  // Extract scores if available
  let homeScore: number | undefined = undefined;
  let awayScore: number | undefined = undefined;
  let isCorrect: boolean | undefined = undefined;
  let score: string | undefined = undefined;
  
  // Check if the score is embedded in the team names
  const fullMatchText = `${homeTeam} - ${awayTeam}`;
  const scoreRegex = /(\d+)\s*:\s*(\d+)/;
  const scoreMatch = fullMatchText.match(scoreRegex);
  
  if (scoreMatch && scoreMatch.length >= 3) {
    homeScore = parseInt(scoreMatch[1], 10);
    awayScore = parseInt(scoreMatch[2], 10);
    score = `${homeScore} : ${awayScore}`;
    
    if (!isNaN(homeScore) && !isNaN(awayScore)) {
      console.log(`Extracted score from team names: ${homeScore}-${awayScore}`);
      isCorrect = evaluatePrediction(bestTipParts[0], homeScore, awayScore);
      
      // Clean up team names by removing the score
      const cleanedText = fullMatchText.replace(scoreRegex, '');
      const teamParts = cleanedText.split('-').map((s: string) => s.trim());
      
      if (teamParts.length >= 2) {
        homeTeam = teamParts[0];
        awayTeam = teamParts[1];
      }
    }
  }
  // Then check if score is in the match object
  else if (match.score) {
    // Handle both "1 : 1" and "1-1" formats
    const scoreParts = match.score.includes(':') 
      ? match.score.split(':').map((s: string) => s.trim())
      : match.score.split('-').map((s: string) => s.trim());
    
    if (scoreParts.length === 2) {
      homeScore = parseInt(scoreParts[0], 10);
      awayScore = parseInt(scoreParts[1], 10);
      score = match.score;
      
      // If we have scores and a prediction, evaluate if it was correct
      if (!isNaN(homeScore) && !isNaN(awayScore) && match.bestTip) {
        isCorrect = evaluatePrediction(bestTipParts[0], homeScore, awayScore);
      }
    }
  }
  
  return {
    id: match.id?.toString() || `match-${Math.random().toString(36).substr(2, 9)}`,
    homeTeam,
    awayTeam,
    matchDate: match.matchDate || '',
    bestTip: match.bestTip?.split(' ')[0] || 'Unknown',
    odds,
    confidence,
    result: match.result,
    trust: match.trust,
    homeScore,
    awayScore,
    isCorrect,
    score
  };
}

/**
 * Fetches bet of the day matches by date
 * @param date Object containing day, month, and year
 * @returns Promise with match data
 */
export async function getBetOfTheDayMatchByDate(date: { day: number; month: number; year: number }) {
  try {
    console.log('getBetOfTheDayMatchByDate - Input date:', date);
    
    // Use our proxy API route
    const response = await api.get('', {
      params: {
        endpoint: 'getBetOfTheDayMatchByDate',
        day: date.day,
        month: date.month,
        year: date.year
      }
    });
    
    console.log('API Response status:', response.status);
    console.log('API Response data length:', Array.isArray(response.data) ? response.data.length : 'not an array');
    
    // Check if we got a valid response
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Invalid API response format, using fallback data');
      return FALLBACK_MATCHES;
    }
    
    // Transform API response to match our interface if needed
    const matches: MatchData[] = response.data.map(transformMatchData);
    
    console.log('Transformed matches:', matches.length);
    
    // If we got no matches, return fallback data
    if (matches.length === 0) {
      console.log('No matches returned from API, using fallback data');
      return FALLBACK_MATCHES;
    }
    
    return matches;
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    
    // If the endpoint doesn't exist (404), don't show an error
    if (error.response && error.response.status === 404) {
      console.log('Matches endpoint not found, using fallback data');
    } else {
      // For other errors, log them
      console.error('Error details:', error.message);
    }
    
    // Return fallback data in case of error
    console.log('Returning fallback data due to error');
    return FALLBACK_MATCHES;
  }
}

/**
 * Fetches bet of the day bakers by date
 * @param date Object containing day, month, and year
 * @returns Promise with match data
 */
export async function getBetOfTheDayBakers(date: { day: number; month: number; year: number }) {
  try {
    console.log('getBetOfTheDayBakers - Input date:', date);
    
    // Use our proxy API route
    const response = await api.get('', {
      params: {
        endpoint: 'getBetOfTheDayBakers',
        day: date.day,
        month: date.month,
        year: date.year
      }
    });
    
    console.log('API Response status:', response.status);
    console.log('API Response data length:', Array.isArray(response.data) ? response.data.length : 'not an array');
    
    // Check if we got a valid response
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Invalid API response format, using fallback data');
      return FALLBACK_MATCHES;
    }
    
    // Transform API response to match our interface if needed
    const matches: MatchData[] = response.data.map(transformMatchData);
    
    console.log('Transformed matches:', matches.length);
    
    // If we got no matches, return fallback data
    if (matches.length === 0) {
      console.log('No matches returned from API, using fallback data');
      return FALLBACK_MATCHES;
    }
    
    return matches;
  } catch (error: any) {
    console.error('Error fetching bakers:', error);
    
    // If the endpoint doesn't exist (404), don't show an error
    if (error.response && error.response.status === 404) {
      console.log('Bakers endpoint not found, using fallback data');
    } else {
      // For other errors, log them
      console.error('Error details:', error.message);
    }
    
    // Return fallback data in case of error
    console.log('Returning fallback data due to error');
    return FALLBACK_MATCHES;
  }
} 