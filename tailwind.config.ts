import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "var(--color-navy-900)",
          800: "var(--color-navy-800)",
          700: "var(--color-navy-700)",
        },
        teal: {
          500: "var(--color-teal-500)",
        },
        ink: {
          900: "var(--color-ink-900)",
          500: "var(--color-ink-500)",
        },
        mute: {
          300: "var(--color-mute-300)",
          400: "var(--color-mute-400)",
          350: "var(--color-mute-350)",
        },
        panel: {
          100: "var(--color-panel-100)",
        },
        overlay: {
          "navy-20": "var(--overlay-navy-20)",
          "white-15": "var(--overlay-white-15)",
          "white-16": "var(--overlay-white-16)",
        },
        error: "var(--color-error)",
      },
      borderRadius: {
        6: "var(--radius-6)",
        15: "var(--radius-15)",
        20: "var(--radius-20)",
        30: "var(--radius-30)",
        40: "var(--radius-40)",
        50: "var(--radius-50)",
        80: "var(--radius-80)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        comparison: "var(--shadow-comparison)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        alt: ["var(--font-alt)", "sans-serif"],
      },
      fontSize: {
        hero: ["87px", { lineHeight: "90px", fontWeight: "300" }],
        display: ["65px", { lineHeight: "68px", fontWeight: "500" }],
        h2: ["35px", { lineHeight: "66px", fontWeight: "600" }],
        eyebrow: ["25px", { lineHeight: "40px", letterSpacing: "1.25px", fontWeight: "500" }],
        "body-lg": ["25px", { lineHeight: "40px", fontWeight: "400" }],
        button: ["20px", { lineHeight: "40px", fontWeight: "400" }],
        nav: ["17px", { lineHeight: "40px", letterSpacing: "0.85px", fontWeight: "400" }],
        "faq-q": ["25px", { lineHeight: "40px", fontWeight: "600" }],
        "faq-a": ["25px", { lineHeight: "40px", fontWeight: "400" }],
        "faq-toggle": ["33px", { lineHeight: "40px", fontWeight: "400" }],
        "alt-label": ["22px", { lineHeight: "40px", fontWeight: "400" }],
        "stat-label": ["18px", { lineHeight: "28px", fontWeight: "500" }],
        "stat-value": ["32px", { lineHeight: "40px", fontWeight: "500" }],
        "btn-lg": ["35px", { lineHeight: "40px", fontWeight: "400" }],
        "btn-eyebrow": ["20px", { lineHeight: "24px", fontWeight: "400" }],
        field: ["20px", { lineHeight: "30px", fontWeight: "400" }],
        "calc-heading": ["25px", { lineHeight: "40px", fontWeight: "500" }],
        "calc-helper": ["15px", { lineHeight: "23px", fontWeight: "400" }],
        "field-error": ["15px", { lineHeight: "22px", fontWeight: "400" }],
        "footer-tagline": ["23px", { lineHeight: "39px", fontWeight: "400" }],
        "footer-heading": [
          "25px",
          { lineHeight: "40px", letterSpacing: "1.25px", fontWeight: "500" },
        ],
        "footer-copy": ["20px", { lineHeight: "32px", fontWeight: "400" }],
      },
    },
  },
};

export default config;
