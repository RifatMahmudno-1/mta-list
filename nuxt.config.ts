// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	typescript: { shim: true },
	css: ['~/assets/css/global.css'],
	postcss: {
		plugins: {
			tailwindcss: {}
		}
	},
	vite: { build: { assetsInlineLimit: 0 } },
	// nitro: { publicAssets: [{ baseURL: 'logos', dir: 'public/logos', maxAge: 86400 }] },
	app: {
		head: {
			title: 'MTA List',
			htmlAttrs: { lang: 'en' },
			noscript: [{ children: 'Javascript is required to run this website' }],
			meta: [
				{ name: 'referrer', content: 'no-referrer' },
				{ name: 'author', content: 'Rifat Mahmud' },
				{ name: 'creator', content: 'Rifat Mahmud' },
				{ name: 'application-name', content: 'MTA List' },
				{ name: 'mobile-web-app-capable', content: 'yes' },
				{ name: 'apple-mobile-web-app-capable', content: 'yes' },
				{ name: 'apple-mobile-web-app-title', content: 'MTA List' },
				{ name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
				{ property: 'og:site:name', content: 'MTA List' },
				{ property: 'og:type', content: 'website' }
			],
			link: [
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/logos/logo_16.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/logos/logo_32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '48x48', href: '/logos/logo_48.png' },
				{ rel: 'icon', type: 'image/png', sizes: '64x64', href: '/logos/logo_64.png' },
				{ rel: 'icon', type: 'image/png', sizes: '180x180', href: '/logos/logo_180.png' },
				{ rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', href: '/logos/logo_180.png' }
			]
		}
	},
	router: { options: { sensitive: true } },
	modules: ['@vite-pwa/nuxt'],
	pwa: {
		registerType: 'autoUpdate',
		workbox: {
			globPatterns: ['**/*.{js,css,html,png,svg,jpg,ttf}'],
			navigateFallback: '/?csr=1',
			additionalManifestEntries: [{ url: '/?csr=1', revision: new Date().getTime().toString() }],
			cleanupOutdatedCaches: true
		},
		manifest: {
			name: 'MTA List',
			short_name: 'MTA List',
			description: 'A beautiful and modern website to keep track of Movies, TV shows & seasons and animes.',
			theme_color: '#ffffff',
			background_color: '#ffffff',
			display: 'standalone',
			id: '/',
			icons: [
				{ src: '/logos/logo_192.png', sizes: '192x192', type: 'image/png' },
				{ src: '/logos/logo_512.png', sizes: '512x512', type: 'image/png' }
			]
		}
	}
})
