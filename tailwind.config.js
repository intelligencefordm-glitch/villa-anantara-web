/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f1f0f",   // deep elegant green
        accent: "#c8d6c0",    // soft pastel green
      },
      fontFamily: {
        // Your custom fonts
        futura: ["var(--font-futura)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],

        // Your existing ones
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
