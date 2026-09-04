import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a8f8',
          500: '#0e8ce4',
          600: '#026fc2',
          700: '#03589d',
          800: '#074b82',
          900: '#0A2540',
          950: '#061729',
        },
        navy: {
          800: '#111c30',
          850: '#0d1627',
          900: '#090f1c',
          950: '#040810',
        },
        signal: {
          green: '#10B981',
          greenLight: '#34D399',
          amber: '#F59E0B',
          amberLight: '#FBBF24',
          red: '#EF4444',
          redLight: '#F87171',
          blue: '#3B82F6',
        },
        ir: {
          maroon: '#831843',
          gold: '#d97706',
          orange: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'train-flow': 'trainFlow 4s linear infinite',
      },
      keyframes: {
        trainFlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
