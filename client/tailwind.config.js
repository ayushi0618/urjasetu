/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFFBF3",
        leaf: "#2F7D4F",
        leafdark: "#1B4D2E",
        leafdeep: "#123822",
        amberwarm: "#D97706",
        amberglow: "#F59E0B",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27, 77, 46, 0.05), 0 8px 24px -12px rgba(27, 77, 46, 0.18)",
        lift: "0 2px 4px rgba(27, 77, 46, 0.06), 0 16px 40px -16px rgba(27, 77, 46, 0.28)",
        glow: "0 0 0 4px rgba(217, 119, 6, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.4s ease both",
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "pulse-soft": "pulse-soft 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
