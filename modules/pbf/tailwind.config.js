/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#2E56FF",
        secondary: "#040404",
        tetriary: "#292E42",
        danger: "#FF0000",
        fontPrimary: "#1A202C",
        fontSecondary: "#2D3748",
        success: "#19A463",
        stroke: "#CBD5E0",
        lightGray: "#EDF2F7",
        darkGray: "#A0AEC0",
        pink: {
          50: "#F7E5EE",
        },
        green: {
          50: "#E6F8EF",
        },
        yellow: {
          10: "#FF972E",
          50: "#FAF2C7",
        },
        gray: {
          50: "#E8EFF9",
        },
        blue: {
          10: "#2EB2FF",
        },
        red: {
          10: "#F85956",
        },
        purple: {
          10: "#6F4CC3",
        },
        borderColor: "#D0D7E3",
        symptomsBG: "#F5F8FB",
      },
      padding: {
        sm: "14px",
        md: "16px",
        lg: "18px",
      },
      margin: {
        sm: "14px",
        md: "16px",
        lg: "18px",
      },
      spacing: {
        48.5: "12.5rem",
        "1/8": "12.5%",
        "2/8": "25%",
        "3/8": "37.5%",
        "4/8": "50%",
        "5/8": "62.5%",
        "6/8": "75%",
        "7/8": "87.5%",
        "8/8": "100%",
      },
      borderRadius: {
        md: "9px",
      },
    },
  },
  variants: {
    extend: {
      borderStyle: ["last"],
      backgroundColor: ["checked", "active"],
      borderColor: ["checked"],
      brightness: ["hover", "active"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
