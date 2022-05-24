const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./views/**/*.ejs'],
	theme: {
		container: {
			center: true,
			padding: '5rem',
		},

		extend: {
			fontFamily: {
				heading: ["'Cinzel'", ...defaultTheme.fontFamily.serif],
				body: ["'Montserrat'", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [],
};
