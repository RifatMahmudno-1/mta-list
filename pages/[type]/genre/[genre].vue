<template>
	<main>
		<ConTiles :api="`/api/${type}/genre`" :title="`Genre: ${genre}`" :additionalQuery="{ genre }" />
	</main>
</template>

<script setup>
	definePageMeta({
		middleware: ['is-type-valid']
	})

	const route = useRoute()

	const type = route.params.type
	const genre = route.params.genre

	const useHeadType = {
		tv: 'TV and Seasons',
		movie: 'Movies',
		anime: 'Animes'
	}

	useHead({
		title: `${useHeadType[type]} Genre: ${genre}`,
		meta: [
			{ name: 'description', content: `${useHeadType[type]} Genre: ${genre}` },
			{ property: 'og:title', content: `${useHeadType[type]} Genre: ${genre}` },
			{ property: 'og:description', content: `${useHeadType[type]} Genre: ${genre}` },
			{ name: 'twitter:title', content: `${useHeadType[type]} Genre: ${genre}` },
			{ name: 'twitter:description', content: `${useHeadType[type]} Genre: ${genre}` }
		]
	})
</script>
