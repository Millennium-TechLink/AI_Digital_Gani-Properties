/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gp-bg': 'var(--gp-bg)',
        'gp-surface': 'var(--gp-surface)',
        'gp-accent': 'var(--gp-accent)',
        'gp-gold': 'var(--gp-gold)',
        'gp-ink': 'var(--gp-ink)',
        'gp-ink-muted': 'var(--gp-ink-muted)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
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

