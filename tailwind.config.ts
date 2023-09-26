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
      translate: {
        '1/8': '12.5%'
      },
      margin: {
        'minus-2': '-2%',
        'minus-15': '-15%',
        'minus-20': '-20%',
        'minus-30': '-30%',
        'minus-40': '-40%',
        'minus-50': '-50%',
        'minus-60': '-60%',
        'minus-80': '-80%',
        'minus-120': '-120%'
      },
      colors: {
        'neutral-headings-black': '#5D5A88',
        'finance-firecracker-100': '#FFBABA',
        'finance-firecracker-500': '#DD4126',
        'finance-firecracker-900': '#A41703',
        'prosperity-pine-100': '#DEE387',
        'prosperity-pine-500': '#50A020',
        'prosperity-pine-900': '#24564B',
        'growth-gold-100': '#FFEBA4',
        'growth-gold-500': '#F0AE00',
        'growth-gold-900': '#BD7100',
        'steady-sapphire-100': '#D8EDFF',
        'steady-sapphire-500': '#829BDE',
        'steady-sapphire-900': '#5666B7',
        'rising-rose-100': '#FFD6EE',
        'rising-rose-500': '#EB9CC2',
        'rising-rose-900': '#AF3B65',
        'finterest-solid': '#0F172A',
        'finterest-white': '#FFFFFF',
        'custom-gold-top': '#CD9500',
        'custom-gold-bottom': '#FBD85C'
      },
      screens: {
        xs: "480px",
      },

    },
  },
  plugins: [],
}
export default config
