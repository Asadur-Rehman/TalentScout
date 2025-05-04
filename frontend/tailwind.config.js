export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Make sure Tailwind scans all files
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.6)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '0.5' },
          '100%': { transform: 'scale(1.04)', opacity: '0' },
        }
      },
      animation: {
        'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
      animationDelay: {
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
      }
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const animationDelayUtilities = Object.entries(theme('animationDelay', {})).map(
        ([key, value]) => {
          return {
            [`.animation-delay-${key}`]: { animationDelay: value },
          };
        }
      );
      addUtilities(animationDelayUtilities, ['responsive']);
    },
  ],
};

