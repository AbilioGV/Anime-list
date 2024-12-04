import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        header: "#2B2D42",
        maintext: "#748899",
        secondtext: "#BCBEDC",
        button: "#3577FF"
      },
    },
  },
  plugins: [
  ],
} satisfies Config;
