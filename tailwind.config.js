/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          light: '#fdfcf9',
          DEFAULT: '#faf6ee',
          dark: '#f0e7d5',
          border: '#dcd2be',
        },
        ledger: {
          ink: '#2c2825',
          stampRed: '#b91c1c',
          stampGreen: '#15803d',
          stampBlue: '#1d4ed8',
        }
      },
      fontFamily: {
        sans: ['var(--font-sarabun)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
}
