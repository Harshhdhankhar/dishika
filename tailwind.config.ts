import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dishika: {
          primary: "#0f766e",
          secondary: "#0369a1",
          accent: "#06b6d4",
          light: "#f8fafc",
          surface: "#ffffff",
        },
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "pulse-scale": "pulse-scale 1.5s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "flash": "flash 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(10px)" },
        },
        "pulse-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        flash: {
          "0%": { backgroundColor: "#ef4444" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(6, 182, 212, 0.4)",
        "glow-md": "0 0 20px rgba(6, 182, 212, 0.3)",
        "glow-lg": "0 0 40px rgba(6, 182, 212, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
