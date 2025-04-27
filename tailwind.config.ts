import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	darkMode: 'class',
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				md: '2rem',
				lg: '2rem',
				xl: '2rem',
				'2xl': '2rem',
				'3xl': '3rem',
			},
			screens: {
				'xs': '100%',
				'sm': '640px',    // Small phones 
				'md': '768px',    // Large phones/Small tablets
				'lg': '1024px',   // Tablets/Small laptops
				'xl': '1280px',   // Laptops/Desktops
				'2xl': '1400px',  // Large desktops
				'3xl': '1600px',  // Extra large screens
				'4xl': '1920px',  // Full HD screens
				'5xl': '2560px',  // 2K screens
				'6xl': '3840px',  // 4K TVs and large displays
			}
		},
		extend: {
			backgroundImage: {
				'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['Playfair Display', 'serif'],
			},
			transitionDuration: {
				'400': '400ms',
				'2000': '2000ms',
			},
			transitionProperty: {
				'background': 'background-color, background-image',
				'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
				'theme': 'color, background-color, background-image, border-color, fill, stroke, opacity, box-shadow, transform',
			},
			transitionTimingFunction: {
				'theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#D4AF37',
					light: '#E5C158',
					dark: '#B8860B',
					50: '#FDF8E7',
					100: '#FBEFD0',
					200: '#F7DFA1',
					300: '#F3CF72',
					400: '#EFC043',
					500: '#D4AF37',
					600: '#B8860B',
					700: '#9C6F09',
					800: '#805807',
					900: '#644205',
					contrast: '#000000',
				},
				accent: {
					DEFAULT: '#1a1a1a',
					50: '#FDF8E7',
					100: '#FBEFD0',
					200: '#F7DFA1',
					300: '#F3CF72',
					400: '#EFC043',
					500: '#D4AF37',
					600: '#B8860B',
					700: '#9C6F09',
					800: '#805807',
					900: '#644205',
					foreground: '#FFFFFF',
				},
				secondary: {
					DEFAULT: '#1a1a1a',
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				blob: {
					'0%': {
						transform: 'translate(0px, 0px) scale(1)',
					},
					'33%': {
						transform: 'translate(30px, -50px) scale(1.1)',
					},
					'66%': {
						transform: 'translate(-20px, 20px) scale(0.9)',
					},
					'100%': {
						transform: 'translate(0px, 0px) scale(1)',
					},
				},
				'gradient-x': {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center',
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center',
					},
				},
				shimmer: {
					'100%': {
						transform: 'translateX(100%)',
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-up': 'fade-up 0.5s ease-out',
				'blob': 'blob 7s infinite',
				'gradient-x': 'gradient-x 15s ease infinite',
				'shimmer': 'shimmer 2s infinite',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
