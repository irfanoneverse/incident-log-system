import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Zinc-based palette — the cool gray used by Linear, Vercel, etc.
        surface: {
          DEFAULT: '#18181b', // zinc-900
          raised: '#27272a',  // zinc-800
          overlay: '#3f3f46', // zinc-700
        },
      },
    },
  },
} satisfies Config
