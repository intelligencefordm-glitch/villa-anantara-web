/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f1f0f",
        accent: "#c8d6c0",
        ink: "#1d2a1d",
        sand: "#f6efe3",
        cream: "#fffaf1",
        clay: "#b5714a",
      },
      fontFamily: {
        futura: ["var(--font-futura)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
