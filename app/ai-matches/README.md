# AI Matches Page

This directory contains the AI Matches page for the Poctol prediction platform. The page displays AI-generated match predictions and betting tips.

## Components

- **page.tsx**: Main page component that renders the AI Matches page
- **DayPicker.tsx**: Component for selecting different days to view predictions
- **Display.tsx**: Component for displaying statistics about the predictions
- **Table.tsx**: Component for displaying the match predictions in a table
- **utils.ts**: Utility functions for date calculations and formatting

## Features

- View AI-generated match predictions for different days (Today, Yesterday, 2 Days Ago, 3 Days Ago)
- See statistics about prediction accuracy and betting slips
- Filter between "Sure Bets" and "Daily Parlay" options
- View detailed information about each match prediction
- Live match status indicators
- Responsive design with animations and hover effects

## Styling

The page follows the pixelated styling of the Oddyssey page, using:
- Gradient backgrounds
- Pixelated borders and effects
- Animated elements
- Consistent color scheme (#14F195 green, #9945FF purple, #00C2FF blue)

## Display Format

- **Match Column**: Shows home team vs away team
- **Status Column**: Shows "Live" for ongoing matches or the scheduled time for upcoming matches
- **Prediction Column**: Shows the predicted bet type (1, X, 2, Over, Under) without odds
- **Odds Column**: Shows the numerical odds value
- **Confidence Column**: Shows the AI confidence level (High, Medium, Low)
- **Result Column**: Shows the outcome of completed matches (Win, Loss) or "Pending" for unresolved matches

## Future Enhancements

- Connect to real data sources for match predictions
- Add user interaction features for creating custom betting slips
- Implement authentication for personalized recommendations
- Add historical performance tracking for AI predictions 