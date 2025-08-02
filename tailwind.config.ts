
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      maxWidth: {
        container: "1280px",
      },
      fontFamily: {
        sans: ["Editorial New", "Aeonik", "system-ui", "-apple-system", "sans-serif"],
        editorial: ["Editorial New", "system-ui", "-apple-system", "sans-serif"],
        aeonik: ["Aeonik", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(222, 84%, 5%)", // #0f172a - Navy
          foreground: "hsl(0, 0%, 100%)", // White
        },
        secondary: {
          DEFAULT: "hsl(0, 0%, 100%)", // White
          foreground: "hsl(222, 84%, 5%)", // Navy
        },
        accent: {
          DEFAULT: "hsl(37, 92%, 50%)", // #f59e0b - Legal Gold
          foreground: "hsl(222, 84%, 5%)", // Navy
        },
        success: {
          DEFAULT: "hsl(142, 76%, 36%)", // #10b981
          foreground: "hsl(0, 0%, 100%)",
        },
        warning: {
          DEFAULT: "hsl(25, 95%, 53%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "text-primary": "hsl(215, 28%, 17%)", // #1f2937
        "text-secondary": "hsl(215, 20%, 65%)", // #64748b
        "legal-navy": "hsl(222, 84%, 5%)", // #0f172a
        "legal-navy-light": "hsl(215, 25%, 27%)", // #1e293b
        "legal-gold": "hsl(37, 92%, 50%)", // #f59e0b
        "legal-gold-light": "hsl(45, 93%, 47%)", // #d97706
        "neutral-50": "hsl(210, 40%, 98%)", // #f8fafc
        "neutral-100": "hsl(220, 14%, 96%)", // #f1f5f9
        "neutral-200": "hsl(220, 13%, 91%)", // #e2e8f0
        "neutral-300": "hsl(216, 12%, 84%)", // #cbd5e1
        "neutral-400": "hsl(218, 11%, 65%)", // #94a3b8
        "neutral-500": "hsl(220, 9%, 46%)", // #64748b
        "neutral-600": "hsl(215, 14%, 34%)", // #475569
        "neutral-700": "hsl(215, 25%, 27%)", // #334155
        "neutral-800": "hsl(217, 33%, 17%)", // #1e293b
        "neutral-900": "hsl(222, 84%, 5%)", // #0f172a
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: 'marquee var(--duration) linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
