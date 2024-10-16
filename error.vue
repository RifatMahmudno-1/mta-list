<template>
	<NuxtPwaManifest />

	<div class="grid grid-rows-[auto_1fr_auto] min-h-[100dvh] gap-2">
		<Navigation />
		<main class="cont grid items-center justify-items-center">
			<div class="flex items-center flex-col gap-2" v-if="netError">
				<h1 class="text-center text-2xl">No internet connection.</h1>
				<IconNoInternet class="w-[12rem] h-[12rem]" />
				<div class="flex gap-2">
					<NuxtLink href="/" class="border-2 border-theme-color-500 rounded px-3 py-1 text-lg">Home</NuxtLink>
					<button @click="router.go()" class="bg-theme-color-500 rounded px-3 py-1 text-lg">Refresh</button>
				</div>
			</div>

			<div v-else-if="error.statusCode === 401"></div>

			<div class="flex items-center flex-col gap-2" v-else-if="error.statusCode === 404">
				<h1 class="text-center text-2xl">Page not found.</h1>
				<Icon404 class="w-[12rem] h-[12rem]" />
				<div class="flex gap-2">
					<NuxtLink href="/" class="border-2 border-theme-color-500 rounded px-3 py-1 text-lg">Home</NuxtLink>
					<button @click="router.go()" class="bg-theme-color-500 rounded px-3 py-1 text-lg">Refresh</button>
				</div>
			</div>

			<div class="flex items-center flex-col gap-2" v-else>
				<h1 class="text-center text-2xl">Some errors have occured.</h1>
				<IconError class="w-[12rem] h-[12rem]" />
				<div class="flex gap-2">
					<NuxtLink href="/" class="border-2 border-theme-color-500 rounded px-3 py-1 text-lg">Home</NuxtLink>
					<button @click="router.go()" class="bg-theme-color-500 rounded px-3 py-1 text-lg">Refresh</button>
				</div>
			</div>
		</main>
		<Notification />
		<Footer />
	</div>
</template>

<script setup>
	const { error } = defineProps(['error'])

	const route = useRoute()
	const router = useRouter()
	const netError = ref(false)

	watchEffect(() => {
		if (!route.matched.length) useHead({ htmlAttrs: { theme: '' } })
		else if (route.path.startsWith('/list')) useHead({ htmlAttrs: { theme: 'list' } })
		else if (route.params.type === 'tv') useHead({ htmlAttrs: { theme: 'tv' } })
		else if (route.params.type === 'movie') useHead({ htmlAttrs: { theme: 'movie' } })
		else if (route.params.type === 'anime') useHead({ htmlAttrs: { theme: 'anime' } })
		else return useHead({ htmlAttrs: { theme: '' } })
	})

	if (process.client && !globalThis.navigator?.onLine) netError.value = true
	else if (error.statusCode === 401) navigateTo('/unauthorized')

	const url = useRequestURL().origin
	useHead({
		title: netError.value ? 'No Internet' : error.statusCode === 404 ? 'Not Found' : 'Error',
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
