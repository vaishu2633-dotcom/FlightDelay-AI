/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#071B34', // Deep navy blue
          dark: '#041021',
          light: '#0D274A',
        },
        secondary: {
          DEFAULT: '#087DCC', // Aviation blue
          hover: '#0669AD',
          light: '#E0F0FA',
        },
        accent: {
          DEFAULT: '#38BDF8', // Sky blue
          hover: '#0EA5E9',
        },
        aviation: {
          50: '#F0F7FF',
          100: '#E0EFFE',
          200: '#BAE0FD',
          300: '#7CC8FB',
          400: '#38BDF8',
          500: '#087DCC',
          600: '#0669AD',
          700: '#05558E',
          800: '#043E68',
          900: '#071B34',
          950: '#041021',
        },
        navy: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          700: '#1E293B',
          800: '#0D274A',
          900: '#071B34',
          950: '#041021',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(7, 27, 52, 0.06), 0 2px 6px -1px rgba(7, 27, 52, 0.04)',
        'aviation': '0 10px 30px -5px rgba(8, 125, 204, 0.25)',
        'card': '0 8px 30px -4px rgba(7, 27, 52, 0.08)',
      }
    },
  },
  plugins: [],
}
