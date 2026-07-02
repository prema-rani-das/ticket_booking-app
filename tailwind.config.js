/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ডার্ক মোড ক্লাস দিয়ে নিয়ন্ত্রিত হবে
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e8f5ee",
          100: "#c8e6d4",
          200: "#9ed3b4",
          300: "#6fbf92",
          400: "#3fa96f",
          500: "#0f9d58",   // মূল সবুজ
          600: "#0b7d46",
          700: "#085e35",   // গাঢ় সবুজ (navbar/footer)
          800: "#064428",
          900: "#04301d",
        },
        accent: {
          400: "#f4515f",
          500: "#e11d2e",   // পতাকার লাল
          600: "#c11224",
        },
        surface: "#f6faf7",
        // ---------- ডার্ক মোডের রং ----------
        dark: {
          bg:     "#0a1410",  // গাঢ় সবুজাভ-কালো ব্যাকগ্রাউন্ড
          card:   "#122019",  // কার্ডের ব্যাকগ্রাউন্ড
          border: "#1e3328",  // বর্ডার
          text:   "#d9e8df",  // মূল লেখা
          muted:  "#8fa89a",  // হালকা লেখা
        },
      },
      fontFamily: {
        bangla: ['"Hind Siliguri"', "sans-serif"],
        sans: ["Inter", '"Hind Siliguri"', "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(8, 94, 53, 0.10)",
        cardDark: "0 4px 20px rgba(0, 0, 0, 0.45)",
        ticket: "0 8px 30px rgba(0, 0, 0, 0.15)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};