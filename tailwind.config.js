/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./script.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
        'tajawal': ['Tajawal', 'sans-serif']
      },
      colors: {
        'sls-blue': {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#3a6fa0',
          900: '#4a7dba',
          950: '#1e3a8a'
        },
        'sls-teal': {
          500: '#3b82f6',
          600: '#2563eb',
          800: '#1d4ed8'
        },
        'sls-gold': {
          400: '#fbbf24',
          500: '#f59e0b'
        }
      }
    },
  },
  plugins: [],
}