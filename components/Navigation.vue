<template>
	<nav class="sticky top-0 bg-theme-color-300 z-40 shadow-md">
		<div class="cont grid p-2 gap-x-4 gap-y-2" :class="`max-[700px]:grid-cols-[1fr_auto] ${shouldShow ? 'grid-cols-[auto_auto_1fr_auto]' : 'grid-cols-[auto_1fr_auto]'}`">
			<NuxtLink href="/" class="flex items-center gap-2">
				<img src="/logos/logo_256.png" class="h-6 inline-block" />
				<span>MTA List</span>
			</NuxtLink>
			<Select class="max-[700px]:hidden" v-if="shouldShow" :selected="selected" :selectables="selectables" @select="e => router.push(query ? { path: '/' + e + '/search', query: { query } } : { path: '/' + e })" />

			<form @submit.prevent="search" class="justify-self-center w-full max-w-[40rem] grid gap-2 grid-cols-[1fr_auto] items-center max-[700px]:hidden" v-if="shouldShow">
				<input type="search" class="w-full rounded px-1" placeholder="Search here ..." required v-model="query" spellcheck="false" />
				<button type="submit">
					<IconSearch class="text-2xl" />
				</button>
			</form>
			<div v-else class="justify-self-center flex gap-4 max-[700px]:hidden">
				<NuxtLink class="bg-theme-color-500 px-2 py-0.5 rounded shadow-sm hover:shadow-md transition-shadow" v-for="(val, key) in selectables" :href="'/' + key">{{ val }}</NuxtLink>
			</div>

			<div class="flex gap-2 [&>a:hover]:shadow-md [&>a]:transition-shadow">
				<NuxtLink v-if="route.meta.user" href="/list" class="bg-theme-color-500 px-2 py-0.5 flex items-center rounded"> <IconList />My list</NuxtLink>
				<NuxtLink v-if="route.meta.user" href="/profile" class="bg-theme-color-500 px-2 py-0.5 flex items-center rounded"> <IconProfile /></NuxtLink>
				<NuxtLink href="/login" class="bg-theme-color-500 px-2 py-0.5 flex items-center rounded"> <IconLogin :class="route.meta.user ? 'rotate-180' : ''" /> {{ route.meta.user ? '' : 'Login' }} </NuxtLink>
			</div>

			<div class="col-[1/-1] hidden max-[700px]:grid grid-cols-[auto_1fr] gap-2">
				<slot v-if="shouldShow">
					<Select :selected="selected" :selectables="selectables" @select="e => router.push(query ? { path: '/' + e + '/search', query: { query } } : { path: '/' + e })" />
					<form @submit.prevent="search" class="justify-self-center w-full grid gap-2 grid-cols-[1fr_auto] items-center">
						<input type="search" class="w-full rounded px-1" placeholder="Search here ..." required v-model="query" spellcheck="false" />
						<button type="submit">
							<IconSearch class="text-2xl" />
						</button>
					</form>
				</slot>
				<div v-else class="col-[1/-1] justify-self-center flex gap-4">
					<NuxtLink class="bg-theme-color-500 px-2 py-0.5 rounded shadow-sm hover:shadow-md transition-shadow" v-for="(val, key) in selectables" :href="'/' + key">{{ val }}</NuxtLink>
				</div>
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
