/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        page: "#f8f6ed",
        "page-soft": "#fbfaf4",
        surface: "#ffffff",
        border: "#e8e3d8",
        "border-strong": "#d9d4ca",
        text: "#111411",
        "text-soft": "#30342f",
        muted: "#666b62",
        "muted-light": "#8b9088",
        "green-950": "#003013",
        "green-800": "#064f2a",
        "green-accent": "#18a957",
        "green-soft": "#effeee",
        "green-band": "#e3efdc",
        cta: "#00692B",
        "cta-hover": "#005a24",
      },
      fontFamily: {
        heading: ["Geist", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(38, 45, 35, 0.08)",
        card: "0 8px 28px rgba(38, 45, 35, 0.06)",
      },
    },
  },
  plugins: [],
};
