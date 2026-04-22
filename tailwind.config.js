/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        calm: {
          bg: '#faf5ff',
          surface: '#f3e8ff',
          border: '#e9d5ff',
          text: '#4c1d95',
          muted: '#6d28d9',
        },
        danger: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Rubik-Regular'],
        medium: ['Rubik-Medium'],
        bold: ['Rubik-Bold'],
        light: ['Rubik-Light'],
      },
    },
  },
  plugins: [],
};
