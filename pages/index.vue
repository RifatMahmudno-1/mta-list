<template>
	<main class="flex flex-col gap-2 h-fit">
		<header class="bg-theme-color-300 min-h-[25rem] grid content-center rounded">
			<h1 class="text-3xl text-center px-4 py-16 drop-shadow-md">
				<span class="font-semibold">MTA List</span> is
				<br />
				an all in one platform that lets you
				<br />
				track, share and discover
				<br />
				<NuxtLink href="/movie" class="text-theme-color-400 font-semibold" theme="movie">Movies</NuxtLink>, <NuxtLink href="/tv" class="text-theme-color-400 font-semibold" theme="tv">TV Shows & Seasons</NuxtLink>, <NuxtLink href="/anime" class="text-theme-color-400 font-semibold" theme="anime">Anime</NuxtLink>
			</h1>
		</header>

		<div theme="movie" class="min-h-[20rem] grid content-center text-xl justify-items-center bg-theme-color-200 gap-4 px-4 rounded">
			<h2 class="text-2xl border-b-2 px-2 border-theme-color-400">Movies</h2>
			<div class="grid justify-items-center gap-2">
				<div class="flex gap-2">
					<NuxtLink href="/movie/trending" class="bg-theme-color-300 px-2 rounded">Trending Movies</NuxtLink>
					<NuxtLink href="/movie/top" class="bg-theme-color-300 px-2 rounded">Top Movies</NuxtLink>
					<NuxtLink href="/movie/popular" class="bg-theme-color-300 px-2 rounded">Popular Movies</NuxtLink>
				</div>
				<div class="flex gap-2">
					<NuxtLink href="/movie/airing" class="bg-theme-color-300 px-2 rounded">Airing Movies</NuxtLink>
					<NuxtLink href="/movie/upcoming" class="bg-theme-color-300 px-2 rounded">Upcoming Movies</NuxtLink>
				</div>
			</div>
			<NuxtLink href="/movie" class="bg-theme-color-400 px-8 rounded">Browse All</NuxtLink>
		</div>

		<div theme="tv" class="min-h-[20rem] grid content-center text-xl justify-items-center bg-theme-color-200 gap-4 px-4 rounded">
			<h2 class="text-2xl border-b-2 px-2 border-theme-color-400">TV Shows and Seasons</h2>
			<div class="grid justify-items-center gap-2">
				<div class="flex gap-2">
					<NuxtLink href="/tv/trending" class="bg-theme-color-300 px-2 rounded">Trending Shows</NuxtLink>
					<NuxtLink href="/tv/top" class="bg-theme-color-300 px-2 rounded">Top Shows</NuxtLink>
				</div>
				<div class="flex gap-2">
					<NuxtLink href="/tv/popular" class="bg-theme-color-300 px-2 rounded">Popular Shows</NuxtLink>
					<NuxtLink href="/tv/airing" class="bg-theme-color-300 px-2 rounded">Currently Airing Shows</NuxtLink>
				</div>
			</div>
			<NuxtLink href="/tv" class="bg-theme-color-400 px-8 rounded">Browse All</NuxtLink>
		</div>

		<div theme="anime" class="min-h-[20rem] grid content-center text-xl justify-items-center bg-theme-color-200 gap-4 px-4 rounded">
			<h2 class="text-2xl border-b-2 px-2 border-theme-color-400">Anime</h2>
			<div class="grid justify-items-center gap-2">
				<div class="flex gap-2">
					<NuxtLink href="/anime/trending" class="bg-theme-color-300 px-2 rounded">Trending Anime</NuxtLink>
					<NuxtLink href="/anime/top" class="bg-theme-color-300 px-2 rounded">Top Anime</NuxtLink>
					<NuxtLink href="/anime/popular" class="bg-theme-color-300 px-2 rounded">Popular Anime</NuxtLink>
				</div>
				<div class="flex gap-2">
					<NuxtLink href="/anime/airing" class="bg-theme-color-300 px-2 rounded">Airing Anime</NuxtLink>
					<NuxtLink href="/anime/upcoming" class="bg-theme-color-300 px-2 rounded">Upcoming Anime</NuxtLink>
				</div>
			</div>
			<NuxtLink href="/anime" class="bg-theme-color-400 px-8 rounded">Browse All</NuxtLink>
		</div>
	</main>
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
