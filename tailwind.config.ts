import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          light: '#6366F1',
        },
        secondary: {
          DEFAULT: '#1a1a1a',
          light: '#333333',
        },
        accent: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FB923C',
        },
        sale: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'Arial', 'sans-serif'],
        vazir: ['Vazirmatn', 'sans-serif'],
      },
      keyframes: {
        'modal-enter': {
          '0%': { opacity: '0', transform: 'scale(0.98) translateY(4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'modal-enter': 'modal-enter 0.01s ease-out',
        'fade-in': 'fade-in 0.01s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
