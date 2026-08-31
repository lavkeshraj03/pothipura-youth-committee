import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vedic: {
          blue: "#0B1D3A",
          deepBlue: "#071428",
          royalBlue: "#1E3A8A",
          gold: "#D97706",
          lightGold: "#FBBF24",
          amber: "#F59E0B",
          saffron: "#EA580C",
          cream: "#FFFBEB",
          marigold: "#D9531E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        hindi: ["var(--font-gotu)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
