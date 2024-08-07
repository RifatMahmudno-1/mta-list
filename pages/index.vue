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
			<h2 class="text-2xl border-b-2 px-2 border-theme-color-400 font-semibold">Movies</h2>
			<div class="flex gap-2 flex-wrap justify-center max-w-[480px] [&>a:hover]:shadow-md shadow-sm [&>a]:transition-shadow">
				<NuxtLink href="/movie/trending" class="bg-theme-color-300 px-2 py-0.5 rounded">Trending Movies</NuxtLink>
				<NuxtLink href="/movie/top" class="bg-theme-color-300 px-2 py-0.5 rounded">Top Movies</NuxtLink>
				<NuxtLink href="/movie/popular" class="bg-theme-color-300 px-2 py-0.5 rounded">Popular Movies</NuxtLink>
				<NuxtLink href="/movie/airing" class="bg-theme-color-300 px-2 py-0.5 rounded">Airing Movies</NuxtLink>
				<NuxtLink href="/movie/upcoming" class="bg-theme-color-300 px-2 py-0.5 rounded">Upcoming Movies</NuxtLink>
			</div>
			<NuxtLink href="/movie" class="bg-theme-color-400 px-8 py-0.5 rounded hover:shadow-md shadow-sm transition-shadow">Browse All</NuxtLink>
		</div>

		<div theme="tv" class="min-h-[20rem] grid content-center text-xl justify-items-center bg-theme-color-200 gap-4 px-4 rounded">
			<h2 class="text-2xl border-b-2 px-2 border-theme-color-400 font-semibold">TV Shows and Seasons</h2>
			<div class="flex gap-2 flex-wrap justify-center max-w-[480px] [&>a:hover]:shadow-md shadow-sm [&>a]:transition-shadow">
				<NuxtLink href="/tv/trending" class="bg-theme-color-300 px-2 py-0.5 rounded">Trending Shows</NuxtLink>
				<NuxtLink href="/tv/top" class="bg-theme-color-300 px-2 py-0.5 rounded">Top Shows</NuxtLink>
				<NuxtLink href="/tv/popular" class="bg-theme-color-300 px-2 py-0.5 rounded">Popular Shows</NuxtLink>
				<NuxtLink href="/tv/airing" class="bg-theme-color-300 px-2 py-0.5 rounded">Currently Airing Shows</NuxtLink>
			</div>
			<NuxtLink href="/tv" class="bg-theme-color-400 px-8 py-0.5 rounded hover:shadow-md shadow-sm transition-shadow">Browse All</NuxtLink>
		</div>

		<div theme="anime" class="min-h-[20rem] grid content-center text-xl justify-items-center bg-theme-color-200 gap-4 px-4 rounded">
			<h2 class="text-2xl border-b-2 px-2 border-theme-color-400 font-semibold">Anime</h2>
			<div class="flex gap-2 flex-wrap justify-center max-w-[480px] [&>a:hover]:shadow-md shadow-sm [&>a]:transition-shadow">
				<NuxtLink href="/anime/trending" class="bg-theme-color-300 px-2 py-0.5 rounded">Trending Anime</NuxtLink>
				<NuxtLink href="/anime/top" class="bg-theme-color-300 px-2 py-0.5 rounded">Top Anime</NuxtLink>
				<NuxtLink href="/anime/popular" class="bg-theme-color-300 px-2 py-0.5 rounded">Popular Anime</NuxtLink>
				<NuxtLink href="/anime/airing" class="bg-theme-color-300 px-2 py-0.5 rounded">Airing Anime</NuxtLink>
				<NuxtLink href="/anime/upcoming" class="bg-theme-color-300 px-2 py-0.5 rounded">Upcoming Anime</NuxtLink>
			</div>
			<NuxtLink href="/anime" class="bg-theme-color-400 px-8 py-0.5 rounded hover:shadow-md shadow-sm transition-shadow">Browse All</NuxtLink>
		</div>

		<div class="bg-theme-color-300 p-4 rounded grid gap-2">
			<p class="font-semibold text-lg">Data providers:</p>
			<p>This website uses <a theme="tv" class="text-theme-color-400 font-semibold" href="https://www.themoviedb.org" target="_blank">TMDB</a> and the <a theme="movie" class="text-theme-color-400 font-semibold" href="https://developer.themoviedb.org" target="_blank">TBDB APIs</a> but is not endorsed, certified, or otherwise approved by <a theme="tv" class="text-theme-color-400 font-semibold" href="https://www.themoviedb.org" target="_blank">TMDB</a></p>
			<p>This website uses also uses <a theme="anime" class="text-theme-color-400 font-semibold" href="https://anilist.co" target="_blank">Anilist</a></p>
			<p>Thanks a lot to <a theme="tv" class="text-theme-color-400 font-semibold" href="https://www.themoviedb.org" target="_blank">TMDB</a> and <a theme="anime" class="text-theme-color-400 font-semibold" href="https://anilist.co" target="_blank">Anilist</a> for providing free API and data</p>
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
