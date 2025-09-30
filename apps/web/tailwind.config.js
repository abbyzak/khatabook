/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-nastaliq': ['Noto Nastaliq Urdu', 'serif'],
        'noto-sans': ['Noto Sans', 'sans-serif']
      }
    }
  },
  plugins: []
}