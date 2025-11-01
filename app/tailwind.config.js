import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans]
      },
      colors: {
        brand: {
          DEFAULT: "#4338ca",
          foreground: "#f9fafb"
        }
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
