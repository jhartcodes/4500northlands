import type {Config} from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./app/**/*.{ts,tsx}', './sanity/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['ff-meta-web-pro', 'sans-serif'],
        body: ['ff-meta-correspondence-web-p', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
} satisfies Config
