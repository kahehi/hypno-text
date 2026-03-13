import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d0c7',
          300: '#a2b2a2',
          400: '#7a907a',
          500: '#5e735e',
          600: '#4a5c4a',
          700: '#3c4a3c',
          800: '#313d31',
          900: '#29332a',
        },
        warm: {
          50: '#faf9f7',
          100: '#f3f0eb',
          200: '#e8e1d6',
          300: '#d8ccb8',
          400: '#c4b196',
          500: '#b09878',
          600: '#9c8264',
          700: '#826c53',
          800: '#6b5946',
          900: '#57493b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
