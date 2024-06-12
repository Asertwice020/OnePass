// /** @type {import('tailwindcss').Config} */
// import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xxs: "50px",
      base: "355px",
      xs: "520px",
      sm: "640px",
      md: "768px",
      md2: "880px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        color: {
          1: "#FF6464",
          2: "#545974",
          3: "#FFFFFF",
          4: "#F1F1F1",
          5: "#BABABA",
          6: "#ff646458",
          7: "#ff545468",
          8: "#ffcd7660",
          9: "#D6F3E1",
        },
      },
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      letterSpacing: {
        tagline: ".15em",
      },
      spacing: {
        0.25: "0.0625rem",
        7.5: "1.875rem",
        15: "3.75rem",
      },
      opacity: {
        15: ".15",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        DEFAULT: "linear",
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
      borderWidth: {
        DEFAULT: "0.0625rem",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
        "conic-gradient":
          "conic-gradient(from 225deg, #FFC876, #79FFF7, #9F53FF, #FF98E2, #FFC876)",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".navSvg": {
          "@apply cursor-pointer aspect-square w-6 xs:w-[1.625rem] sm:w-7 lg:w-[1.875rem]":
            {},
        },
        ".activePageIndictor": {
          "@apply h-[0.1875rem] bg-color-2 w-[0.5625rem] rounded-full lg:h-1 lg:w-[0.625rem]":
            {},
        },
        ".addButton": {
          "@apply relative bottom-4 cursor-pointer w-15 h-15 p-[1.125rem] rounded-full aspect-square bg-color-1 lg:w-16 lg:h-16":
            {},
        },
        ".main-with-header": {
          "@apply bg-color-3 min-h-[calc(100vh-5rem)]": {},
        },
        ".thirdButton": {
          "@apply text-color-1 font-semibold text-[0.95rem] font-poppins mb-8 py-1 text-nowrap flex items-center max-w-fit sm:text-base md:text-lg":
            {},
        },
        ".filledButton": {
          "@apply py-2 px-4 rounded-[10px] bg-color-1 text-lg font-bebas border-2 border-transparent duration-300 text-white md:py-[10px] text-xl xl:py-[11px] text-[19px]  focus:bg-color-3 focus:text-color-1 focus:border-color-1 lg:hover:bg-color-3 lg:hover:text-color-1 lg:hover:border-color-1":
            {},
        },
        ".outlinedButton": {
          "@apply py-2 px-4 border-2 rounded-[10px] text-lg border-color-1 font-bebas duration-300 text-color-1 md:py-[10px] text-xl xl:py-[11px] text-[19px] focus:bg-color-1 focus:text-color-3 lg:hover:bg-color-1 lg:hover:text-color-3":
            {},
        },
        ".para": {
          "@apply text-xs text-color-5": {},
        },
        ".container": {
          "@apply max-w-[77.5rem] mx-auto px-5 md:px-10 lg:px-15 xl:max-w-[87.5rem]":
            {},
        },
        ".h1": {
          "@apply pt-5 font-bebas text-[4rem] text-color-2 leading-[3.25rem] sm:leading-[3.5rem] md:leading-[3.75rem] lg:text-[4.6rem] xl:text-[5.5rem]":
            {},
        },
        ".p": {
          "@apply text-[0.875rem] leading-[2rem] font-poppins text-color-5 sm:leading-[2.5rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.1rem]":
            {},
        },
        ".p-bebas": {
          "@apply text-[0.875rem] leading-[2.5rem] font-bebas text-color-5 md:text-[1rem] md:leading-[2.5rem] lg:text-[1.1rem] lg:leading-[2.7rem] xl:leading-tight":
            {},
        },
        ".input": {
          "@apply w-full px-3 py-2 rounded-[0.625rem] text-base border-2 border-color-4 font-poppins focus:border-color-4 leading-none outline-none focus:border-2 focus:border-color-1 duration-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 sm:py-[0.6rem]":
            {},
        },
        ".label": {
          "@apply text-color-2 text-[0.75rem] leading-none font-bebas ml-3 -mb-1.5 sm:text-[0.8rem]":
            {},
        },
        ".avatar": {
          "@apply w-20 aspect-square rounded-2xl shadow-xl border-2 border-color-1 mx-auto font-bebas text-white text-xl sm:w-[5.5rem] sm:text-2xl":
            {},
        },
        ".h3": {
          "@apply text-[2rem] leading-normal md:text-[2.5rem]": {},
        },
        ".body-1": {
          "@apply text-[0.875rem] leading-[1.5rem] md:text-[1rem] md:leading-[1.75rem] lg:text-[1.25rem] lg:leading-8":
            {},
        },
      });
    }),
  ],
};
