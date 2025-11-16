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
          DEFAULT: '#FF4444',
          dark: '#CC0000',
          light: '#FF6666',
        },
        secondary: {
          DEFAULT: '#1a1a1a',
          light: '#333333',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'Arial', 'sans-serif'],
        vazir: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
