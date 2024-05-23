<template>
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

	const titleDesc = {
		title: 'MTA List',
		description: 'A beautiful and modern website to keep track of Movies, TV shows & seasons and animes.'
	}

	if (netError.value) titleDesc.title = 'No Internet'
	else if (error.statusCode === 404) titleDesc.title = 'Not found'
	else titleDesc.title = 'Error'

	const url = useRequestURL().origin
	useHead({
		title: titleDesc.title,
		meta: [
			{ name: 'description', content: titleDesc.description },

			{ property: 'og:title', content: titleDesc.title },
			{ property: 'og:description', content: titleDesc.description },

			{ name: 'twitter:title', content: titleDesc.title },
			{ name: 'twitter:description', content: titleDesc.description },

			{ property: 'og:url', content: url },
			{ property: 'og:image', content: `${url}/logos/logo_512.png` },
			{ property: 'twitter:image', content: `${url}/logos/logo_512.png` }
		]
	})
</script>
