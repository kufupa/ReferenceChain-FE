/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      width: {
        card: "42rem",
      },
      height: {
        card: "32rem",
      },
    },
  },
  plugins: [],
};
