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
				{ name: 'author', content: 'Rifat Mahmud' },
				{ name: 'creator', content: 'Rifat Mahmud' },
				{ property: 'og:type', content: 'website' }
			],
			link: [{ type: 'image/png', rel: 'icon', href: '/logos/logo_256.png' }]
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
			id: '/',
			icons: [
				{ src: '/logos/logo_72.png', sizes: '72x72', type: 'image/png' },
				{ src: '/logos/logo_96.png', sizes: '96x96', type: 'image/png' },
				{ src: '/logos/logo_128.png', sizes: '128x128', type: 'image/png' },
				{ src: '/logos/logo_144.png', sizes: '144x144', type: 'image/png' },
				{ src: '/logos/logo_152.png', sizes: '152x152', type: 'image/png' },
				{ src: '/logos/logo_192.png', sizes: '192x192', type: 'image/png' },
				{ src: '/logos/logo_256.png', sizes: '256x256', type: 'image/png' },
				{ src: '/logos/logo_384.png', sizes: '384x384', type: 'image/png' },
				{ src: '/logos/logo_512.png', sizes: '512x512', type: 'image/png' }
			]
		}
	}
})
