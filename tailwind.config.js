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
        'theme-dark': '#343541',
        'theme-light': '#ffffff',
        'theme-activity-bar-dark': '#343541',
        'theme-activity-bar-light': '#fafafc',
        'theme-primary-menu-dark': '#1f2428',
        'theme-primary-menu-light': '#f4f6ff',
        'theme-select-dark': '#1f2428',
        'theme-select-light': '#F9f9f9',
      },
      backgroundColor: {
        'theme-dark': '#343541',
        'theme-light': '#fafafc',
        'theme-hover-dark': 'rgb(76 77 93 / 0.3)',
        'theme-hover-light': 'rgb(76 77 93 / 0.10)',
        'theme-select-dark': 'rgb(76 77 93 / 0.8)',
        'theme-select-light': 'rgb(76 77 93 / 0.3)',
        'theme-dropdown-dark': '#413e4f',
        'theme-dropdown-light': '#ffffff',
        'theme-dropdown-hover-dark': '#676473',
        'theme-dropdown-hover-light': 'rgb(76 77 93 / 0.10)',
      },
      borderColor: {
        'theme-border-dark': 'rgba(80, 80, 100, 1)',
        'theme-border-light': 'rgba(90, 90, 90, 0.3)',
      },
      textColor: {
        'theme-button-icon-dark': 'rgb(180, 180, 180)',
        'theme-button-icon-light': 'rgb(90, 90, 90)',
        'theme-button-icon-hover-dark': 'rgb(245, 245, 245)',
        'theme-button-icon-hover-light': 'rgb(40, 40, 40)',
        'theme-activity-bar-tab-dark': 'rgb(107 114 128 / 1)',
        'theme-activity-bar-tab-light': 'rgb(140 140 140 / 1)',
        'theme-activity-bar-tab-hover-dark': 'rgb(220 220 235 / 1)',
        'theme-activity-bar-tab-hover-light': 'rgb(65 65 65 / 1)',
        'theme-activity-bar-tab-select-dark': 'rgb(230 230 245 / 1)',
        'theme-activity-bar-tab-select-light': 'rgb(0 0 0 / 1)',
      },
      backgroundSize: {
        auto: 'auto',
        cover: 'cover',
        contain: 'contain',
        '175%': '175%',
      },
      keyframes: {
        'bg-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'zoom-pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'zoom-pulse-slow': 'zoom-pulse 8s ease infinite',
        'zoom-pulse-fast': 'zoom-pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bg-pan-fast': 'bg-pan 7s ease infinite',
        'bg-pan-slow': 'bg-pan 15s ease infinite',
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
