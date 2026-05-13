/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        glass: "0 24px 80px rgba(44, 68, 132, 0.18)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(255,255,255,0.95), transparent 30%), radial-gradient(circle at top right, rgba(95, 225, 211, 0.30), transparent 22%), radial-gradient(circle at bottom left, rgba(255, 196, 113, 0.35), transparent 20%), linear-gradient(135deg, #f7fbff 0%, #eef5ff 35%, #f9f4ff 100%)",
      },
      colors: {
        brand: {
          navy: "#163A70",
          blue: "#3478F6",
          cyan: "#48D9C8",
          peach: "#FFB56B",
          pink: "#FF6FAE",
          lavender: "#8B7CFF",
          paper: "#F7FAFF",
          ink: "#12213F",
        },
      },
    },
  },
  plugins: [],
};
