 /** @type {import('tailwindcss').Config} */
/*export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
       colors: {
        border: "#e5e7eb", // your custom color},
  },
  plugins: [],
}}
}
