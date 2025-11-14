/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable dark mode using a CSS class
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        text: 'var(--color-text)',
        accent: 'var(--color-accent)',
        'accent-dark': 'var(--color-accent-dark)',
        border: 'var(--color-border)',
      },
    },
  },
  plugins: [],
};
