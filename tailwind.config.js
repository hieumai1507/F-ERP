// tailwind.config.js

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the app folder
    "./components/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the components folder]
  ],
  theme: {
    extend: {
      fontFamily: {
        rmono: ["sans-serif", "Roboto-Mono", "BeVietNam Pro", "OpenSans"],
        sans: [
          "BeVietnamPro_400Regular",
          "BeVietnamPro_600SemiBold",
          "BeVietnamPro_700Bold",
        ],
      },
      fontSize: {
        20: "20px",
        14: "14px",
        16: "16px",
        10: "10px",
      },
    },
  },
  plugins: [],
};
