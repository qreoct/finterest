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
      fontFamily: {
        gupter: ['Gupter', 'serif'],
        dmsans: ['DM Sans', 'sans-serif']
      },
      // textColor: {
      //   'neutral-headings-black': '#5D5A88',
      //   'neutral-text-gray': '#9795B5',
      // },
    colors: {
      'firecracker': {
        100: '#ffbaba',
        500: '#dd4126',
        900: '#a41703',
      },
      'pine': {
        100: '#dee387',
        500: '#50a020',
        900: '#24564b',
      },
      'gold': {
        100: '#ffeba4',
        500: '#f0ae00',
        900: '#bd7100',
      },
      'sapphire': {
        100: '#d8edff',
        500: '#829bde',
        900: '#5666b7',
      },
      'rose': {
        100: '#ffd6ee',
        500: '#eb9cc2',
        900: '#af3b65',
      },
    },
    backgroundColor: {
      'firecracker': {
        100: '#ffbaba',
        500: '#dd4126',
        900: '#a41703',
      },
      'pine': {
        100: '#dee387',
        500: '#50a020',
        900: '#24564b',
      },
      'gold': {
        100: '#ffeba4',
        500: '#f0ae00',
        900: '#bd7100',
      },
      'sapphire': {
        100: '#d8edff',
        500: '#829bde',
        900: '#5666b7',
      },
      'rose': {
        100: '#ffd6ee',
        500: '#eb9cc2',
        900: '#af3b65',
      },
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
    },
  },
  plugins: [],
}

export default config;
