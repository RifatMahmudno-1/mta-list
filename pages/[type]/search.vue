<template>
	<main>
		<ConTiles :title="`Search: ${query}`" :api="`/api/${type}/search`" :additionalQuery="{ query }" :key="query" />
	</main>
</template>

<script setup>
	definePageMeta({
		middleware: [
			'is-type-valid',
			to => {
				if (!to.query.query) return abortNavigation({ statusCode: 404, message: `Page Not Found: ${to.fullPath}` })
			}
		]
	})
	const route = useRoute()

	const type = route.params.type
	const query = computed(() => route.query.query)

	watch(
		query,
		() => {
			useHead({
				title: `Search: ${query.value}`,
				meta: [
					{ name: 'description', content: `Search results for *${query.value}*` },
					{ property: 'og:title', content: `Search: ${query.value}` },
					{ property: 'og:description', content: `Search results for *${query.value}*` },
					{ name: 'twitter:title', content: `Search: ${query.value}` },
					{ name: 'twitter:description', content: `Search results for *${query.value}*` }
				]
			})
		},
		{ immediate: true }
	)
</script>
