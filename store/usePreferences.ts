import { create } from 'zustand';

interface PreferencesState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Add any other preferences you need
  showTips: boolean;
  toggleShowTips: () => void;
  
  // Theme color
  themeColor: string;
  setThemeColor: (color: string) => void;
}

export const usePreferences = create<PreferencesState>((set) => ({
  darkMode: true, // Default to dark mode
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  
  showTips: true, // Default to showing tips
  toggleShowTips: () => set((state) => ({ showTips: !state.showTips })),
  
  themeColor: '#9945FF', // Default theme color
  setThemeColor: (color: string) => set({ themeColor: color }),
})); 