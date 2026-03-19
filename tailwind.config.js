/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: '#0F172A',
                secondary: '#1E293B',
                accent: '#10B981',
                'accent-hover': '#059669',
                'accent-light': '#D1FAE5',
                danger: '#EF4444',
                warning: '#F59E0B',
                border: '#334155',
            },
        },
    },
    plugins: [],
}
