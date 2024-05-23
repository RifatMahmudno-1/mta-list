<template>
	<div class="flex flex-col gap-2">
		<NuxtLink to="/movie" class="px-2 rounded bg-theme-color-500 w-fit">Browse Movie</NuxtLink>
		<NuxtLink to="/tv" class="px-2 rounded bg-theme-color-500 w-fit">Browse TV series</NuxtLink>
		<NuxtLink to="/anime" class="px-2 rounded bg-theme-color-500 w-fit">Browse Anime</NuxtLink>
	</div>
</template>

<script setup>
	useHead({
		title: 'MTA List',
		meta: [
			{ name: 'description', content: 'A beautiful and modern website to keep track of Movies, TV shows & seasons and animes.' },
			{ property: 'og:title', content: 'MTA List' },
			{ property: 'og:description', content: 'A beautiful and modern website to keep track of Movies, TV shows & seasons and animes.' },
			{ name: 'twitter:title', content: 'MTA List' },
			{ name: 'twitter:description', content: 'A beautiful and modern website to keep track of Movies, TV shows & seasons and animes.' }
		]
	})
</script>
