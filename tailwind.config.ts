import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Palette de marque Solayia — à ajuster avec ta charte graphique
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd2ff",
          300: "#8eb4ff",
          400: "#598bff",
          500: "#3563f5",
          600: "#1f44d6",
          700: "#1a36ad",
          800: "#1b318a",
          900: "#1c2f6e",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
