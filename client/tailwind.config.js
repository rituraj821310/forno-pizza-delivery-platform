/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crust: {
          DEFAULT: '#D8A24A',
          dark: '#B9812F',
          light: '#E8C081',
        },
        char: {
          DEFAULT: '#241C15',
          light: '#392C20',
        },
        tomato: {
          DEFAULT: '#C1440E',
          dark: '#9A360B',
          light: '#E2662F',
        },
        basil: {
          DEFAULT: '#5B7A5A',
          dark: '#435D43',
        },
        flour: {
          DEFAULT: '#FBF3E7',
          dark: '#F2E6D3',
        },
        cheese: '#F2B705',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pizza: '999px',
      },
    },
  },
  plugins: [],
}
