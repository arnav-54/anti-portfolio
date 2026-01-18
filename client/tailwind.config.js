/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#f97316", // Orange 500 - Vibrant Orange
                secondary: "#c2410c", // Orange 700 - Deep Orange/Rust
                accent: "#fed7aa", // Orange 200 - Soft Orange Highlight
                dark: "#431407", // Dark Brown/Black for text
                darker: "#290b05", // Deepest Brown
                light: "#fff7ed", // Orange 50 (Cream)
                cream: "#fffdd0", // Classic Cream
                "glass": "rgba(255, 255, 255, 0.4)", // Frosted glass for light theme
                "glass-border": "rgba(249, 115, 22, 0.1)", // Subtle orange border
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Calistoga', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
