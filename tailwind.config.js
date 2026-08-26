/** @type {import('tailwindcss').Config} */
// Force Vite HMR reload
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        secondary: '#FB923C',
        accent: '#FDBA74',
        background: '#FBFBFB',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        textPrimary: '#1E293B',
        textLight: '#64748B',
        border: '#E5E7EB',
        error: '#EF4444',
        black: '#000000',
        lightBlue: '#38BDF8',
        lightBlueBg: '#E0F2FE',
        lightGreen: '#4ADE80',
        lightGreenBg: '#DCFCE7',
        warning: '#F59E0B',
        danger: '#EF4444',
        dark: '#0F172A',
        'surface-dark': '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
