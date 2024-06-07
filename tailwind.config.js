const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Se você deseja adicionar cores personalizadas ao TailwindCSS
        primary: "#DA002B",
        secondary: "#002447",
        background: "#030202",
        neutral: "#424041",
        lightNeutral: "#4F4E4F",
        white: "#FFFFFF",
        gray: "#CDCDCD",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              50: "#e6f1fe",
              100: "#cce3fd",
              200: "#99c7fb",
              300: "#66aaf9",
              400: "#338ef7",
              500: "#006FEE",
              600: "#005bc4",
              700: "#004493",
              800: "#002e62",
              900: "#001731",
              foreground: "#FFFFFF",
              DEFAULT: "#006FEE",
            },
          },
        },
        dark: {
          colors: {
            background: "#030202",
            foreground: "#FFFFFF",
            primary: {
              50: "#ffebec",
              100: "#ffcec8",
              200: "#ffa3a1",
              300: "#ff6e6f",
              400: "#ff5356",
              500: "#DA002B", // Primary color
              600: "#c0001b",
              700: "#a50014",
              800: "#8a000d",
              900: "#6f0007",
              foreground: "#FFFFFF",
              DEFAULT: "#DA002B",
            },
            secondary: {
              50: "#e4f1ff",
              100: "#badfff",
              200: "#85cbff",
              300: "#4db0ff",
              400: "#288eff",
              500: "#002447", // Secondary color
              600: "#001b3b",
              700: "#00132f",
              800: "#000a23",
              900: "#000317",
              foreground: "#FFFFFF",
              DEFAULT: "#002447",
            },
            neutral: {
              50: "#f5f5f5",
              100: "#e8e8e8",
              200: "#d1d1d1",
              300: "#bcbcbc",
              400: "#a6a6a6",
              500: "#8c8c8c",
              600: "#6f6f6f",
              700: "#545454",
              800: "#3a3a3a",
              900: "#2a2a2a",
              foreground: "#CDCDCD",
              DEFAULT: "#424041", // Neutral color
            },
          },
        },
      },
    }),
  ],
};
