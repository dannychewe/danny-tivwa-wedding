import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF9F6",
        gold: "#C8A96A",
        ink: "#1F1A17",
        rose: "#EADFD2"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(31, 26, 23, 0.08)"
      },
      backgroundImage: {
        heroGlow:
          "radial-gradient(circle at top, rgba(200, 169, 106, 0.20), transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))"
      }
    }
  },
  plugins: []
};

export default config;
