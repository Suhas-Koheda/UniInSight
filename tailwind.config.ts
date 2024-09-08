import type { Config } from "tailwindcss";

const config: Config = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'header':'#2301b0',
        'button-bg':'#b1c8e8',
      },
    },
  },
  plugins: [],
};
export default config;
