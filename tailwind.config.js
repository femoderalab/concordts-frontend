/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      /* =========================
         LOGO-BASED COLOR SYSTEM
         ========================= */
      colors: {
        primary: {
          50:  '#fdecee',
          100: '#f8cfd3',
          200: '#f0a0a7',
          300: '#e86f79',
          400: '#dc3f4d',
          500: '#8b1e24', // LOGO MAROON (MAIN)
          600: '#7a1a20',
          700: '#65151a',
          800: '#4f1014',
          900: '#390b0e',
        },

        secondary: {
          50:  '#f1f2fb',
          100: '#dde0f7',
          200: '#b9bff0',
          300: '#949ce6',
          400: '#6f78dc',
          500: '#2b2f83', // LOGO ROYAL BLUE
          600: '#25296f',
          700: '#1f225b',
          800: '#191c47',
          900: '#121533',
        },

        accent: {
          50:  '#fdf9ef',
          100: '#f8efcf',
          200: '#f0df9e',
          300: '#e6c96a',
          400: '#dbb238',
          500: '#c9a24d', // LOGO GOLD
          600: '#b08f43',
          700: '#8e7336',
          800: '#6c5829',
          900: '#4a3d1d',
        },

        success: {
          500: '#1f7a3e', // LOGO GREEN
        },

        neutral: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f1f1f', // LOGO CHARCOAL
          900: '#0f0f0f',
        },
      },

      /* =========================
         TYPOGRAPHY
         ========================= */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },

      /* =========================
         ANIMATIONS
         ========================= */
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      /* =========================
         SHADOWS (LOGO MAROON BASE)
         ========================= */
      boxShadow: {
        soft:   '0 2px 8px rgba(139, 30, 36, 0.12)',
        medium: '0 6px 18px rgba(139, 30, 36, 0.18)',
        strong: '0 10px 28px rgba(139, 30, 36, 0.25)',
      },

    },
  },
  plugins: [],
}
