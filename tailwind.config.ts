import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "cursive"],
        mono: ['"Share Tech Mono"', "monospace"],
        vt: ['"VT323"', "monospace"],
        // Fallbacks for existing standard classes
        display: ['"Press Start 2P"', "cursive"],
        body: ['"Share Tech Mono"', "monospace"],
        game: ['"VT323"', "monospace"],
      },
      colors: {
        border: "rgba(255, 255, 255, 0.1)",
        input: "rgba(30, 30, 30, 0.85)",
        ring: "#6B2EC7",
        background: "#000000",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#6B2EC7",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          foreground: "#B8B8B8",
        },
        destructive: {
          DEFAULT: "#E63946",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "rgba(40, 40, 40, 0.9)",
          foreground: "#B8B8B8",
        },
        accent: {
          DEFAULT: "#00D9FF",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "rgba(30, 30, 30, 0.85)",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "rgba(30, 30, 30, 0.85)",
          foreground: "#FFFFFF",
        },
        // Retro Block Specific
        retro: {
          bg: "#000000",
          bgSecondary: "#0a0a0a",
          card: "rgba(30, 30, 30, 0.85)",
          cardHover: "rgba(40, 40, 40, 0.9)",
          orange: "#FF6B35",
          orangeDark: "#E63946",
          purple: "#6B2EC7",
          purpleDark: "#4A1C8C",
          cyan: "#00D9FF",
          cyanGlow: "#00F0FF",
          text: "#FFFFFF",
          textSec: "#B8B8B8",
          border: "rgba(255, 255, 255, 0.1)",
        },
        // Compatibility Mappings
        "turtle-blue": "#00D9FF", // Map to Cyan for old classes
        "rabbit-green": "#FF6B35", // Map to Orange for old classes (VS concept: Green vs Orange/Purple)
        "versus-purple": "#6B2EC7",
        "neon-green": "#00D9FF",
        "neon-gold": "#FF6B35",
      },
      backgroundImage: {
        "pixel-gradient": "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        "primary-gradient": "linear-gradient(135deg, #6B2EC7 0%, #4A1C8C 100%)",
        "primary-gradient-hover":
          "linear-gradient(135deg, #8B4EE7 0%, #6B2EC7 100%)",
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 217, 255, 0.5)",
        "glow-orange": "0 0 30px rgba(255, 107, 53, 0.6)",
        "glow-purple": "0 0 20px rgba(107, 46, 199, 0.6)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        scanlineScroll: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" },
        },
        raceShake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-1px)" },
          "75%": { transform: "translateX(1px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scanline: "scanlineScroll 2s linear infinite",
        "race-shake": "raceShake 0.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
