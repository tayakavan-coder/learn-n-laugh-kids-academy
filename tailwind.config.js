/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fff1f7', 100: '#ffe4f0', 200: '#fecde3', 300: '#fdabc9',
          400: '#fb7fa8', 500: '#FF4FA3', 600: '#e0308a', 700: '#be195f',
          800: '#9d124d', 900: '#7d0f3e',
        },
        brand: {
          pink: '#FF4FA3',
          blue: '#3B82F6',
          green: '#22C55E',
          yellow: '#F59E0B',
          orange: '#F97316',
        },
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-mid': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'shimmer': 'shimmer 2.5s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '200%' },
        },
      },
    },
  },
  plugins: [],
}
