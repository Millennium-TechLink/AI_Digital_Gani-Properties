/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gp-bg': '#FFFFFF',
        'gp-surface': '#F9F9F9',
        'gp-accent': '#DD2B1C',
        'gp-red': '#DD2B1C',
        'gp-gold': '#D5B36A',
        'gp-ink': '#1A1A1A',
        'gp-ink-muted': '#666666',
        background: '#ffffff',
        foreground: '#1A1A1A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        ui: ['var(--font-ui)', 'sans-serif'],
      },
      borderRadius: {
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
    },
  },
  plugins: [],
}
