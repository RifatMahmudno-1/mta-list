<template>
	<NuxtPwaManifest />

	<div class="grid grid-rows-[auto_1fr_auto] min-h-[100dvh] gap-2">
		<Navigation />
		<NuxtPage class="cont" />
		<Notification />
		<Footer />
	</div>
</template>

<script setup>
	const route = useRoute()
	watchEffect(() => {
		if (!route.matched.length) useHead({ htmlAttrs: { theme: '' } })
		else if (route.path.startsWith('/list')) useHead({ htmlAttrs: { theme: 'list' } })
		else if (route.params.type === 'tv') useHead({ htmlAttrs: { theme: 'tv' } })
		else if (route.params.type === 'movie') useHead({ htmlAttrs: { theme: 'movie' } })
		else if (route.params.type === 'anime') useHead({ htmlAttrs: { theme: 'anime' } })
		else return useHead({ htmlAttrs: { theme: '' } })
	})

	const url = useRequestURL().origin
	useHead({
		title: 'MTA List',
		meta: [
			{ name: 'description', content: 'A beautiful and modern website to keep track of Movies, TV shows & seasons and animes.' },
			{ property: 'og:title', content: 'MTA List' },
			{ property: 'og:description', content: 'A beautiful and modern website to keep track of Movies, TV shows & seasons and animes.' },
			{ name: 'twitter:title', content: 'MTA List' },
			{ name: 'twitter:description', content: 'A beautiful and modern website to keep track of Movies, TV shows & seasons and animes.' },

			{ property: 'og:url', content: url },
			{ property: 'og:image', content: `${url}/logos/logo_512.png` },
			{ property: 'twitter:image', content: `${url}/logos/logo_512.png` }
		]
	})
</script>
