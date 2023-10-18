import { type Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        task: "#4bade8",
        story: "#68bc3c",
        bug: "#e84c3c",
        epic: "#984ce4",
        inprogress: "#0854cc",
        done: "#08845c",
        todo: "#d4d4d8",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("tailwindcss-animate"),
  ],
} satisfies Config;
