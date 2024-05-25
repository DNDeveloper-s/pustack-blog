import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "!./src/components/AdminEditor/JoditEditor.tsx",
    "./node_modules/@nextui-org/theme/dist/components/(button|ripple|spinner).js"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primaryText: "#3a6d78",
        primary: "#f8f5d7",
        activeText: "#0e29b5",
        secondary: "#e4e2d6",
        tertiary: "#66655d",
        appBlue: "#243bb5",
        appBlack: "#1f1d1a",
        lightPrimary: "#fcfae4",
        white: "#ffffff",
      },
    },
    fontFamily: {
      featureHeadline: [
        "FeatureFlatHeadline",
        "Times New Roman",
        "Times",
        "serif",
      ],
      featureRegular: [
        "FeatureFlatRegular",
        "Times New Roman",
        "Times",
        "serif",
      ],
      featureBold: ["FeatureFlatBold", "Times New Roman", "Times", "serif"],
      helvetica: ["Helvetica", "sans-serif"],
      larkenExtraBold: ["LarkenExtraBold", "sans-serif"],
    },
  },
  plugins: [nextui()],
};
export default config;
