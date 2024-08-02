// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	typescript: { shim: true },
	modules: ['@nuxtjs/tailwindcss'],
	css: ['~/assets/css/global.css'],
	tailwindcss: { editorSupport: true },
	vite: { build: { assetsInlineLimit: 0 } },
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
	router: { options: { sensitive: true } }
})
