/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090e',
          900: '#0b0f19',
          850: '#111827',
          800: '#151d30',
          700: '#1e293b',
          600: '#334155',
        },
        neon: {
          cyan: '#00f5d4',
          blue: '#3b82f6',
          purple: '#9d4edd',
          pink: '#f72585',
          gold: '#ffb703',
          emerald: '#10b981',
          crimson: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -5px rgba(0, 245, 212, 0.35)',
        'neon-purple': '0 0 20px -5px rgba(157, 78, 221, 0.35)',
        'neon-pink': '0 0 20px -5px rgba(247, 37, 133, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
