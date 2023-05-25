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
        'theme-activity-bar-dark': 'rgb(35, 40, 45)',
        'theme-activity-bar-light': 'rgb(234, 234, 234)',
        'theme-primary-menu-dark': '#1f2428',
        'theme-primary-menu-light': '#F9f9f9',
        'theme-select-dark': '#1f2428',
        'theme-select-light': '#F9f9f9',
      },
      backgroundColor: {
        'theme-dark': '#343541',
        'theme-light': '#ffffff',
        'theme-hover-dark': 'rgb(76 77 93 / 0.3)',
        'theme-hover-light': 'rgb(76 77 93 / 0.10)',
        'theme-select-dark': 'rgb(76 77 93 / 0.8)',
        'theme-select-light': 'rgb(76 77 93 / 0.3)',
      },
      borderColor: {
        'theme-border-dark': 'rgba(90, 90, 110, 1)',
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
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
