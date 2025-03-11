import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = 'https://bitredict--2-grexbug2hwekegg7.westeurope-01.azurewebsites.net';

// Configure axios with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // Increase timeout to 30 seconds
});

// Fallback mock data for when the API is unavailable
const FALLBACK_MATCHES = [
  {
    id: 'mock-1',
    teams: 'Arsenal Chelsea',
    matchDate: '19:30',
    odds1: '1.85',
    oddsX: '3.40',
    odds2: '2.75',
    tip: '1 1.85',
    goals: 'O2.5 1.95',
    gg: 'YES 1.80',
    bestTip: '1 1.85',
    trust: '9.5/10'
  },
  {
    id: 'mock-2',
    teams: 'Barcelona RealMadrid',
    matchDate: 'Match continue',
    odds1: '2.10',
    oddsX: '3.40',
    odds2: '2.75',
    tip: 'X 3.40',
    goals: 'O2.5 1.95',
    gg: 'YES 1.80',
    bestTip: 'X 3.40',
    trust: '7.5/10'
  },
  {
    id: 'mock-3',
    teams: 'BayernMunich Dortmund',
    matchDate: '21:00',
    odds1: '1.85',
    oddsX: '3.40',
    odds2: '2.75',
    tip: '2 2.75',
    goals: 'O2.5 1.95',
    gg: 'YES 1.80',
    bestTip: '2 2.75',
    trust: '6.0/10'
  },
  {
    id: 'mock-4',
    teams: 'Liverpool ManCity',
    matchDate: 'Match continue',
    odds1: '1.85',
    oddsX: '3.40',
    odds2: '2.75',
    tip: '1 1.85',
    goals: 'O2.5 1.95',
    gg: 'YES 1.80',
    bestTip: 'O2.5 1.95',
    trust: '8.5/10'
  },
  {
    id: 'mock-5',
    teams: 'PSG Juventus',
    matchDate: '18:45',
    odds1: '1.85',
    oddsX: '3.40',
    odds2: '2.75',
    tip: '1 1.85',
    goals: 'U2.5 2.10',
    gg: 'YES 1.80',
    bestTip: 'U2.5 2.10',
    trust: '7.0/10'
  }
];

/**
 * Make API request with retries
 * @param url API URL
 * @param params Query parameters
 * @param maxRetries Maximum number of retries
 * @returns API response
 */
async function makeRequestWithRetry(url: string, params: any, maxRetries = 2) {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      console.log(`API request attempt ${i + 1}/${maxRetries + 1}`);
      const response = await api.get(url, { params });
      return response;
    } catch (error: any) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      lastError = error;
      
      // If this is not the last attempt, wait before retrying
      if (i < maxRetries) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff: 1s, 2s, 4s, etc.
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All retries failed
  throw lastError;
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    const day = searchParams.get('day');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    if (!endpoint || !day || !month || !year) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Only support the getBetOfTheDayMatchByDate and getBetOfTheDayBakers endpoints
    if (endpoint !== 'getBetOfTheDayMatchByDate' && endpoint !== 'getBetOfTheDayBakers') {
      return NextResponse.json(
        { error: 'Unsupported endpoint' },
        { status: 400 }
      );
    }
    
    console.log(`Proxying request to ${endpoint} for date: ${year}-${month}-${day}`);
    
    // Try to get data for the requested date
    try {
      // Make request to external API with retries
      const apiUrl = `/api/Match/${endpoint}`;
      console.log(`Making request to: ${API_BASE_URL}${apiUrl}`);
      console.log(`With params:`, { day, month, year });
      
      const response = await makeRequestWithRetry(apiUrl, {
        day,
        month,
        year
      });
      
      console.log(`API response status: ${response.status}`);
      console.log(`API response data length: ${Array.isArray(response.data) ? response.data.length : 'not an array'}`);
      
      // If we got data, return it
      if (Array.isArray(response.data) && response.data.length > 0) {
        return NextResponse.json(response.data);
      }
      
      // If we got no data, return fallback data
      console.log('No data returned from API, using fallback data');
      return NextResponse.json(FALLBACK_MATCHES);
    } catch (apiError: any) {
      console.error(`API error for ${endpoint}:`, apiError.message);
      
      // Return fallback data for any error
      console.log('API error, using fallback data');
      return NextResponse.json(FALLBACK_MATCHES);
    }
  } catch (error: any) {
    console.error('Proxy server error:', error);
    
    // Return fallback data for any error
    console.log('Proxy server error, using fallback data');
    return NextResponse.json(FALLBACK_MATCHES);
  }
} 