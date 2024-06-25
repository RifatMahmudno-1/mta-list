<template>
	<nav class="sticky top-0 bg-theme-color-300 z-40 shadow-md">
		<div class="cont grid grid-cols-[auto_1fr_auto] p-2 gap-4 items-center">
			<div class="flex gap-2 items-center">
				<NuxtLink href="/" class="flex items-center gap-2">
					<img src="/logos/logo_256.png" class="h-6 inline-block" />
					<span v-if="!shouldShow">MTA List</span>
				</NuxtLink>
				<Select v-if="shouldShow" :selected="selected" :selectables="selectables" @select="e => router.push(query ? { path: '/' + e + '/search', query: { query } } : { path: '/' + e })" />
			</div>

			<form @submit.prevent="search" class="justify-self-center w-full max-w-[40rem] grid gap-2 grid-cols-[1fr_auto] items-center" v-if="shouldShow">
				<input type="search" class="w-full rounded px-1" placeholder="Search here ..." required v-model="query" spellcheck="false" />
				<button type="submit">
					<IconSearch class="text-2xl" />
				</button>
			</form>
			<div v-else class="justify-self-center flex gap-4">
				<NuxtLink class="bg-theme-color-500 px-2 py-0.5 rounded shadow-sm" v-for="(val, key) in selectables" :href="'/' + key">{{ val }}</NuxtLink>
			</div>

			<div class="flex gap-2">
				<NuxtLink v-if="route.meta.user" href="/list" class="bg-theme-color-500 px-2 py-0.5 flex items-center rounded"> <IconList /> My list </NuxtLink>
				<NuxtLink v-if="route.meta.user" href="/profile" class="bg-theme-color-500 px-2 py-0.5 flex items-center rounded"> <IconProfile /></NuxtLink>
				<NuxtLink href="/login" class="bg-theme-color-500 px-2 py-0.5 flex items-center rounded"> <IconLogin :class="route.meta.user ? 'rotate-180' : ''" /> {{ route.meta.user ? '' : 'Login' }} </NuxtLink>
			</div>
		</div>
	</nav>
</template>

<script setup>
	const router = useRouter()
	const route = useRoute()
	const selectables = ref({ movie: 'Movie', tv: 'TV', anime: 'Anime' })
	const selected = computed(() => route.params.type)
	const shouldShow = computed(() => (selectables.value[selected.value] ? true : false))

	const query = ref('')

	function search() {
		router.push({ path: `/${selected.value}/search`, query: { query: query.value } })
	}

	watch(
		shouldShow,
		() => {
			if (shouldShow.value) query.value = route.query.query || ''
			else query.value = ''
		},
		{ immediate: true }
	)
</script>
