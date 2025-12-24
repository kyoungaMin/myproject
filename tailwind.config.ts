import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // 주식 관련 색상
        stock: {
          up: '#10b981',      // 녹색 (상승)
          down: '#ef4444',    // 빨간색 (하락)
          neutral: '#6b7280', // 회색 (보합)
        },
        // 다크 모드 색상
        dark: {
          bg: '#0a0e27',
          card: '#1a1f3a',
          border: '#2d3561',
        },
        // 라이트 모드 색상
        light: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        }
      },
    },
  },
  plugins: [],
};

export default config;
