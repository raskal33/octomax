import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        main: "var(--font-onest)",
      },
      colors: {
        primary: "#76D376",
        secondary: "#ffd500",
        dark: {
          1: "#161616",
          2: "#222222",
          3: "#333333",
        },
        light: {
          1: "#fefefe",
        },
        disabled: {
          1: "#d1d1d1",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
