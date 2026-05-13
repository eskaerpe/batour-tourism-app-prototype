export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			colors: {
				brand: "#ec5b13",
				brandSoft: "#fff1e8",
				surface: "#f8fafc",
			},
			boxShadow: {
				phone: "0 20px 60px rgba(15, 23, 42, 0.15)",
				soft: "0 10px 30px rgba(236, 91, 19, 0.14)",
			},
			fontFamily: {
				sans: ['"Public Sans"', "system-ui", "sans-serif"],
			},
			backgroundImage: {
				"hero-overlay": "linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.1) 40%, rgba(15, 23, 42, 0.92) 100%)",
			},
		},
	},
	plugins: [],
};
