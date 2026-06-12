import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#18181b', // zinc-900
          raised: '#27272a',  // zinc-800
          overlay: '#3f3f46', // zinc-700
        },
      },
    },
  },
} satisfies Config
