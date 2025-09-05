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
      fontFamily: {
        'sans': ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-mono)', 'Consolas', 'monospace'],
      },
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
    },
  },
  plugins: [],
}