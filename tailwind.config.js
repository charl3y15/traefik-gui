module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './public/index.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ["light", "dark"], // Optional: Hier kannst du die Themes anpassen
  },
}
