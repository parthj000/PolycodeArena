/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{tsx,ts,js,jsx}"],
    theme: {
        extend: {
            colors: {
                bg: "var(--bg-color)",
                text: "var(--text-color)",
                text_2: "var(--text-2-color)",
                borders: "var(--borders-color)",
                code: "var(--code-color)",
                primary: {
                    black: '#111111',
                    purple: '#9333EA',
                },
                background: {
                    dark: '#111111',
                    card: '#ffffff0a',
                    cardHover: '#ffffff10',
                },
                border: {
                    light: '#ffffff20',
                    purple: '#9333EA30',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#94A3B8',
                    purple: {
                        light: '#D8B4FE',
                        DEFAULT: '#9333EA',
                        dark: '#6B21A8',
                    },
                },
                gradient: {
                    'purple-start': '#9333EA',
                    'purple-end': '#D8B4FE',
                    'card-start': '#ffffff0a',
                    'card-end': '#ffffff05',
                },
            },
            keyframes: {
                pulse: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.2)' },
                },
                rotate: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                move: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(20px)' },
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
            animation: {
                'pulse-rotate': 'pulse 8s infinite ease-in-out, rotate 15s infinite linear',
                'pulse-move': 'pulse 10s infinite ease-in-out, move 12s infinite alternate',
                'gradient-x': 'gradient-x 3s ease infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
                'gradient-card': 'linear-gradient(to right, #ffffff0a, #ffffff05)',
            },
            boxShadow: {
                'card': '0 8px 30px rgb(0,0,0,0.12)',
                'card-hover': '0 8px 30px rgba(147,51,234,0.1)',
            },
        },
    },
    plugins: [],
};
