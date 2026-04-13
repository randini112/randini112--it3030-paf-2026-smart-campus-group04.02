/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        foreground: '#f8fafc',
        surface: '#111827',
        'surface-elevated': '#1f2937',
        border: '#374151',
        muted: '#9ca3af',
        'muted-foreground': '#9ca3af',
        accent: '#94a3b8',
        'accent-foreground': '#f8fafc',
        'dark-bg': '#0f172a',
        'dark-surface': '#1f2937',
        'dark-border': '#374151',
        'accent-cyan': '#94a3b8',
        'accent-blue': '#64748b',
        'accent-slate': '#9ca3af',
      },
      blue: {
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
      },
      purple: {
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
      },
    },
  },
  plugins: [],
}
