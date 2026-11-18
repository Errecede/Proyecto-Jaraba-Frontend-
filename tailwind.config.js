/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'aero-blue': '#00a8e8',
        'aero-green': '#00c853',
        'aero-sky': '#e0f7fa',
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ["esmerald", "aqua", "winter"],
    defaultTheme: "emerald",
  },
}

