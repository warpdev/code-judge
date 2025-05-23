const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./style/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./constants/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          950: "#121212",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        slideDown: {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideInTop: {
          from: { transform: "translateY(-4px)", opacity: 0.4 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        slideInLeft: {
          from: { transform: "translateX(-4px)", opacity: 0.4 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        slideInRight: {
          from: { transform: "translateX(4px)", opacity: 0.4 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        slideInBottom: {
          from: { transform: "translateY(4px)", opacity: 0.4 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        pulse:
          "pulse 2s alternate-reverse cubic-bezier(0.4, 0, 0.6, 1) infinite",
        slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        fadeIn: "fadeIn 300ms ease-out forwards",
        slideInTop: "slideInTop 170ms ease-out forwards",
        slideInLeft: "slideInLeft 170ms ease-out forwards",
        slideInRight: "slideInRight 170ms ease-out forwards",
        slideInBottom: "slideInBottom 170ms ease-out forwards",
      },
      brightness: {
        85: ".85",
        80: ".8",
      },
      height: {
        "content-screen": "calc(100vh - 9rem)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar")({ nocompatible: true }),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        },
      );
    }),
  ],
};
