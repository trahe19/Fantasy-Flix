/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'movie-gold': '#FFD700',
        'movie-dark': '#1a1a2e',
        'movie-accent': '#16213e',
        'movie-highlight': '#e94560',
      },
    },
  },
  plugins: [],
}