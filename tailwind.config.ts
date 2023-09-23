import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'neutral-color-300': '#F9F9FF',
        'neutral-headings-black': '#5D5A88',
        'neutral-text-gray': '#9795B5',
      },
      fontFamily: {
        gupter: ['Gupter', 'serif'],
        dmsans: ['DM Sans', 'sans-serif']

      },
      textColor: {
        'neutral-headings-black': '#5D5A88',
        'neutral-text-gray': '#9795B5',
      },
      height: {
        '1/8': '12.5%',
        '1/16': '6.25%',
        '70': '70%',
      },
      width: {
        '1/8': '12.5%',
        '1/16': '6.25%',
      },
      colors: {
        'neutral-headings-black': '#5D5A88',
      }

    },
  },
  plugins: [],
}
export default config
