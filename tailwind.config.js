/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text|border)-(cyan|purple|pink|green|yellow|blue|orange)-(300|400|500|900)(\/(5|10|20|30|50))?/,
      variants: ['hover', 'group-hover'],
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
