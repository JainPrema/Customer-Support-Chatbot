/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // blue-600
        secondary: "#9333ea", // purple-600
        accent: "#f59e0b", // amber-500
      },
    },
  },
  plugins: [],
};
