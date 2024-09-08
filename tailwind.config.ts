import type { Config } from "tailwindcss";

const config: Config = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'header':'#2301b0',
        'button-bg':'#8eb2ec',
      },
      boxShadow: {
        'inner': 'inset 0 10px 30px -1px rgba(0, 100, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
export default config;
