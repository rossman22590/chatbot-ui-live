/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        unsaged: 'rgba(35, 40, 45, 1)',
        'unsaged-light': 'rgba(35, 40, 45, 0.8)',
        'unsaged-border': 'rgba(27, 30, 35, 1)',
        'unsaged-border-light': 'rgba(27, 30, 35, 0.8)',
        'unsaged-menu': 'rgb(31, 36, 40)',
      },
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
