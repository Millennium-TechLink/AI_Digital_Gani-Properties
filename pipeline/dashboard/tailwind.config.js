/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gp: {
          ink: '#1a1a1a',
          'ink-muted': '#666666',
          accent: '#c9b589',
          gold: '#d4af37',
          surface: '#f5f5f5',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

