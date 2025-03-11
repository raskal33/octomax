/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9945FF",
        secondary: "#14F195",
        accent: "#00C2FF",
        dark: "#121212",
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        mono: ["'VT323'", "monospace"],
      },
      textRendering: {
        pixelated: "pixelated",
      },
      fontSmoothing: {
        none: "none",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}; 