/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#0037b0",
        "primary-container": "#1d4ed8",
        "on-primary": "#ffffff",
        "secondary": "#4059aa",
        "tertiary": "#004f35",
        "tertiary-fixed": "#6ffbbe",
        "tertiary-container": "#006a48",
        "on-tertiary-fixed": "#002113",
        "on-tertiary-container": "#60eeb1",
        "surface": "#f9f9ff",
        "surface-bright": "#f9f9ff",
        "surface-container": "#e7eefe",
        "surface-container-low": "#f0f3ff",
        "on-surface": "#151c27",
        "on-surface-variant": "#434655",
        "outline": "#747686",
        "outline-variant": "#c4c5d7",
        "background": "#f9f9ff"
      },
      borderRadius: {
        "xl": "0.75rem",
        "2xl": "18px",
        "full": "9999px"
      },
      spacing: {
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
        "2xl": "48px",
        "3xl": "64px",
        "gutter": "24px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      maxWidth: {
        "container-max": "1280px"
      },
      fontSize: {
        "headline-lg": ["2rem", { lineHeight: "2.5rem" }],
        "headline-md": ["1.5rem", { lineHeight: "2rem" }],
        "body-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "label-md": ["0.875rem", { lineHeight: "1.25rem" }],
        "label-sm": ["0.75rem", { lineHeight: "1rem" }]
      },
      fontWeight: {
        "headline-lg": "700",
        "headline-md": "600",
        "label-md": "500",
        "label-sm": "500"
      }
    },
  },
  plugins: [],
}
