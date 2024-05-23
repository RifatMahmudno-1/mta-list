<template>
	<main>
		<slot v-if="sType === 'trending'">
			<ConTiles title="Trending" :api="`/api/${type}/trending`" :additionalQuery="{ time: 'week' }" v-if="type === 'tv' || type === 'movie'" />
			<ConTiles title="Trending" :api="`/api/${type}/trending`" v-else />
		</slot>

		<slot v-if="sType === 'top'">
			<ConTiles title="Top" :api="`/api/${type}/top`" />
		</slot>

		<slot v-if="sType === 'popular'">
			<ConTiles title="Popular" :api="`/api/${type}/popular`" />
		</slot>

		<slot v-if="sType === 'airing'">
			<ConTiles title="Airing" :api="`/api/${type}/airing`" :additionalQuery="{ status: 'airing_today' }" v-if="type === 'tv'" />
			<ConTiles title="Airing" :api="`/api/${type}/airing`" :additionalQuery="{ status: 'now_playing' }" v-else-if="type === 'movie'" />
			<ConTiles title="Airing" :api="`/api/${type}/airing`" v-else />
		</slot>

		<slot v-if="sType === 'upcoming'">
			<ConTiles title="Upcoming" :api="`/api/${type}/upcoming`" v-if="type === 'movie' || type === 'anime'" />
		</slot>
	</main>
</template>

<script setup>
	definePageMeta({
		middleware: [
			'is-type-valid',
			to => {
				if (to.params.type === 'tv' && to.params.sType === 'upcoming') return abortNavigation({ statusCode: 404, message: `Page Not Found: ${to.fullPath}` })

				if (!['trending', 'top', 'upcoming', 'popular', 'airing'].includes(to.params.sType)) return abortNavigation({ statusCode: 404, message: `Page Not Found: ${to.fullPath}` })
			}
		]
	})

	const route = useRoute()
	const type = route.params.type
	const sType = route.params.sType

	const useHeadType = {
		tv: 'TV and Seasons',
		movie: 'Movies',
		anime: 'Animes'
	}

	useHead({
		title: `Browse ${sType[0].toLocaleUpperCase() + sType.slice(1)} ${useHeadType[type]}`,
		meta: [
			{ name: 'description', content: `Browse ${sType[0].toLocaleUpperCase() + sType.slice(1)} ${useHeadType[type]}` },
			{ property: 'og:title', content: `Browse ${sType[0].toLocaleUpperCase() + sType.slice(1)} ${useHeadType[type]}` },
			{ property: 'og:description', content: `Browse ${sType[0].toLocaleUpperCase() + sType.slice(1)} ${useHeadType[type]}` },
			{ name: 'twitter:title', content: `Browse ${sType[0].toLocaleUpperCase() + sType.slice(1)} ${useHeadType[type]}` },
			{ name: 'twitter:description', content: `Browse ${sType[0].toLocaleUpperCase() + sType.slice(1)} ${useHeadType[type]}` }
		]
	})
</script>
