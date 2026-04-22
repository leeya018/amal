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
        // Warm, feminine, grounded. Deep plum base, terracotta action, cream surface.
        brand: {
          50:  "#F6EFF3",
          100: "#E8D5E0",
          200: "#C99BB5",
          300: "#A96489",
          400: "#7C3E5F",
          500: "#5A2A45",
          600: "#421F33",
          700: "#2E1A2E",
          800: "#1F1119",
          900: "#130A10",
        },
        accent: {
          50:  "#FBEDE9",
          100: "#F5D1C7",
          200: "#EEAD9C",
          300: "#E88A73",
          400: "#E06A53",
          500: "#C75239",
          600: "#9E3E29",
          700: "#76301F",
        },
        cream: {
          DEFAULT: "#FAF5F0",
          50:  "#FFFCF9",
          100: "#FAF5F0",
          200: "#F3EADF",
          300: "#E8DAC9",
        },
        ink: {
          DEFAULT: "#1F1A1F",
          muted:   "#6B5C66",
          faint:   "#A89AA2",
        },
        danger: "#B42F2F",
        success: "#5F7F3A",
      },
      fontFamily: {
        sans:   ["Rubik_400Regular"],
        medium: ["Rubik_500Medium"],
        bold:   ["Rubik_700Bold"],
      },
    },
  },
  plugins: [],
};
