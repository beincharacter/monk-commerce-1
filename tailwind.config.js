/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {    
    extend: {
      flex: {
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '5-8': 6.2,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
      },
      boxShadow: {
        c: '2px 2px 4px 0px #0000001A',
      },
      borderColor: {
        c: 'rgba(0, 0, 0, 0.3)',
      },

    },
  },
  plugins: [],
};
