/** @type {import('tailwindcss').Config} */
export default {
	content: ['**/*.vue'],
	theme: {
		extend: {
			colors: {
				'theme-color-50': 'var(--theme-color-50)',
				'theme-color-100': 'var(--theme-color-100)',
				'theme-color-200': 'var(--theme-color-200)',
				'theme-color-300': 'var(--theme-color-300)',
				'theme-color-400': 'var(--theme-color-400)',
				'theme-color-500': 'var(--theme-color-500)',
				'theme-color-600': 'var(--theme-color-600)',
				'theme-color-700': 'var(--theme-color-700)',
				'theme-color-800': 'var(--theme-color-800)',
				'theme-color-900': 'var(--theme-color-900)',
				'theme-color-950': 'var(--theme-color-950)'
			}
		}
	},
	plugins: [],
	safelist: ['cont', 'loading']
}
