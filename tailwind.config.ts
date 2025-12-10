import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        border: "rgb(var(--foreground) / 0.12)",
        muted: "rgb(var(--foreground) / 0.08)",
      },
      borderColor: {
        DEFAULT: "rgb(var(--foreground) / 0.12)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          "2xl": "1200px",
        },
      },
      boxShadow: {
        card: "0 20px 25px -15px rgb(15 23 42 / 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
