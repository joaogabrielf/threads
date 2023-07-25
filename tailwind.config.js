/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        '1.5xl': '1.375rem',
      },
      colors: {
        gray: {
          50: 'hsl(220deg 2% 66%)',
          100: 'hsl(0deg 0% 72%)',
          200: 'hsl(0deg 0% 65%)',
          500: 'hsl(0deg 0% 24%)',
          600: 'hsl(0deg 0% 15%)',
          800: 'hsl(0deg 0% 7%)',
          900: 'hsl(0deg 0% 4%)',
        },
        blue: {
          600: 'hsl(204deg 100% 34%)',
        },
      },
    },
  },
  plugins: [],
}
