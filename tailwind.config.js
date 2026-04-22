/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Apple-native neutral. Deep slate replaces warm plum.
        // brand-700 = primary dark surface / near-black (used for sexy buttons).
        brand: {
          50:  "#F2F2F7",
          100: "#E5E5EA",
          200: "#D1D1D6",
          300: "#C7C7CC",
          400: "#8E8E93",
          500: "#48484A",
          600: "#2C2C2E",
          700: "#1C1C1E",
          800: "#0F0F12",
          900: "#050507",
        },
        // iOS system blue accent.
        accent: {
          50:  "#E5F0FF",
          100: "#CCE2FF",
          200: "#99C4FF",
          300: "#66A6FF",
          400: "#3388FF",
          500: "#007AFF",
          600: "#0062CC",
          700: "#004A99",
        },
        // iOS grouped-background off-white (replaces warm cream).
        cream: {
          DEFAULT: "#F2F2F7",
          50:  "#FFFFFF",
          100: "#F2F2F7",
          200: "#E5E5EA",
          300: "#D1D1D6",
        },
        ink: {
          DEFAULT: "#1C1C1E",
          muted:   "#636366",
          faint:   "#AEAEB2",
        },
        danger:  "#FF3B30",
        success: "#34C759",
      },
      fontFamily: {
        sans:   ["Rubik_400Regular"],
        medium: ["Rubik_500Medium"],
        bold:   ["Rubik_700Bold"],
      },
      borderRadius: {
        "squircle":    "32px",
        "squircle-sm": "18px",
      },
    },
  },
  plugins: [],
};
