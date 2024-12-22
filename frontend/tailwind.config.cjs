/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{html,js,jsx}",
        // Add any additional directories or file types you want Tailwind to scan
    ],
    mode: "jit",
    theme: {
        extend: {
            colors: {
                primary: "#F14445",
                secondary: "#f6f6f6",
                white: "#ffffff",
                heading: "#181818",
                normal: "#666",
                success: '#3ACC48',
                warning: '#F1A144',
                danger: '#F14445',
                hover: 'rgba(241, 68, 69, 0.08)',
                blue: '#0570DE',
                dark: '#f9f9fa',
            },
            backgroundColor: {
                primary: "#F14445",
                primaryLight: "#fdecec",
            },
            fontFamily: {
                gilroy: ["Gilroy", "sans-serif"],
                gilroyMedium: ["Gilroy-Medium", "sans-serif"],
                gilroyBold: ["Gilroy-Bold", "sans-serif"],
            },
        },
        screens: {
            xx: "375px",
            xs: "480px",
            ss: "620px",
            sm: "768px",
            md: "900px",
            lg: "1200px",
            xl: "1700px",
        },
    },
    plugins: [],
};