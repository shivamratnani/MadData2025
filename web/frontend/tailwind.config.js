/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        dark: {
          900: '#000000',  // Pure black
          800: '#111111',  // Almost black
          700: '#1a1a1a',  // Very dark gray
          600: '#222222',  // Dark gray
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 