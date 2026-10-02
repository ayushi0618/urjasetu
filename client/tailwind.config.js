/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFFBF3",
        leaf: "#2F7D4F",
        leafdark: "#1F5C38",
        amberwarm: "#D97706",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
