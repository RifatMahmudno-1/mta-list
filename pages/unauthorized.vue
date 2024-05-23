<template>
	<main class="grid items-center justify-items-center">
		<div class="flex items-center flex-col gap-2">
			<h1 class="text-center text-2xl">You aren't authorized. <br />Login now.</h1>
			<IconNoLog class="w-[12rem] h-[12rem]" />
			<div class="flex gap-2">
				<NuxtLink href="/" class="border-2 border-theme-color-500 rounded px-3 py-1 text-lg">Home</NuxtLink>
				<NuxtLink href="/login" class="bg-theme-color-500 rounded px-3 py-1 text-lg">Login</NuxtLink>
			</div>
		</div>
	</main>
</template>

<script setup>
	useHead({
		title: 'Unauthorized',
		meta: [
			{ property: 'og:title', content: 'Unauthorized' },
			{ name: 'twitter:title', content: 'Unauthorized' }
		]
	})
</script>
