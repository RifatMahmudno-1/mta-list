<template>
	<main>
		<!-- Trending -->
		<ConTiles title="Trending" :compact="true" :api="`/api/${type}/trending`" :additionalQuery="{ time: 'week' }" v-if="type === 'tv' || type === 'movie'" />
		<ConTiles title="Trending" :compact="true" :api="`/api/${type}/trending`" v-else />

		<!-- Top -->
		<ConTiles title="Top" :compact="true" :api="`/api/${type}/top`" />

		<!-- Popular -->
		<ConTiles title="Popular" :compact="true" :api="`/api/${type}/popular`" />

		<!-- Airing -->
		<ConTiles title="Airing" :compact="true" :api="`/api/${type}/airing`" :additionalQuery="{ status: 'airing_today' }" v-if="type === 'tv'" />
		<ConTiles title="Airing" :compact="true" :api="`/api/${type}/airing`" :additionalQuery="{ status: 'now_playing' }" v-else-if="type === 'movie'" />
		<ConTiles title="Airing" :compact="true" :api="`/api/${type}/airing`" v-else />

		<!-- Upcoming -->
		<ConTiles title="Upcoming" :compact="true" :api="`/api/${type}/upcoming`" v-if="type === 'movie' || type === 'anime'" />
	</main>
</template>

<script setup>
	definePageMeta({ middleware: 'is-type-valid' })

	const route = useRoute()
	const type = route.params.type

	const useHeadType = {
		tv: 'TV and Seasons',
		movie: 'Movies',
		anime: 'Animes'
	}

	useHead({
		title: `Browse ${useHeadType[type]}`,
		meta: [
			{ name: 'description', content: `Browse trending, top, popular, airing and upcoming ${useHeadType[type]}` },
			{ property: 'og:title', content: `Browse ${useHeadType[type]}` },
			{ property: 'og:description', content: `Browse trending, top, popular, airing and upcoming ${useHeadType[type]}` },
			{ name: 'twitter:title', content: `Browse ${useHeadType[type]}` },
			{ name: 'twitter:description', content: `Browse trending, top, popular, airing and upcoming ${useHeadType[type]}` }
		]
	})
</script>
