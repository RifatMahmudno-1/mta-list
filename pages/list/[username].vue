<template>
	<main class="px-2">
		<div class="grid grid-cols-[1fr_auto] gap-4 bg-theme-color-300 p-2 rounded items-center">
			<div class="flex gap-x-4 max-[550px]:flex-col gap-y-2">
				<div class="flex items-center gap-2">
					<span>Sort:</span>
					<Select :selectables="sortSelectables" :selected="sortSelected" @select="e => (sortSelected = e)" v-if="!pending" class="z-[2]" />
					<span class="!bg-theme-color-500 loading w-28 rounded" v-else>&nbsp;</span>
				</div>
				<div class="flex items-center gap-2">
					<span>Filter:</span>
					<Select :selectables="filterSelectables" :selected="filterSelected" @select="e => (filterSelected = e)" v-if="!pending" />
					<span class="!bg-theme-color-500 loading w-28 rounded" v-else>&nbsp;</span>
				</div>
			</div>
			<button class="rounded flex items-center gap-2 px-2 py-1 bg-theme-color-500 max-[550px]:aspect-square" @click="copyLinkFn">
				<span class="max-[550px]:hidden">Share</span>
				<IconShare />
			</button>
		</div>
		<div v-if="pending" class="p-2 flex flex-col gap-2">
			<div v-for="_ in ([].length = 4)" class="bg-theme-color-100 loading">
				<h2 class="bg-theme-color-300 px-2 py-1 rounded">&nbsp;</h2>
				<div class="p-2 grid gap-1">
					<div class="rounded bg-theme-color-300 p-1">&nbsp;</div>
					<div v-for="_ in ([].length = 5)" class="grid grid-cols-[3rem_1fr] rounded bg-theme-color-200 p-1">
						<p class="w-full aspect-square">&nbsp;</p>
						<p>&nbsp;</p>
					</div>
				</div>
			</div>
		</div>
		<div class="p-2 flex flex-col gap-2" v-else-if="Object.keys(data?.list || {}).length">
			<slot v-for="(typeVal, typeKey) in parseObject(data.list)">
				<div class="bg-theme-color-100 rounded [&~div#lorem]:hidden" v-if="filterSelected === 'none' || filterSelected === typeKey || filterSelected === 'favourite'">
					<h2 class="bg-theme-color-300 px-2 py-1 rounded">{{ filterSelectables[typeKey] }}</h2>
					<div class="p-2 grid gap-1">
						<div class="grid gap-2 grid-cols-[3rem_1fr_3rem_4rem] rounded items-center justify-items-center font-semibold bg-theme-color-300 p-1">
							<p>&nbsp;</p>
							<p class="justify-self-start">Title</p>
							<p>Score</p>
							<p>Type</p>
						</div>
						<div class="grid gap-2 grid-cols-[3rem_1fr_3rem_4rem] rounded items-center justify-items-center bg-theme-color-200 p-1 hover:bg-theme-color-300 transition-colors relative hover:shadow-sm" v-for="each in fnTypeValFS(typeVal)" v-if="filterSelected !== 'favourite' || (filterSelected === 'favourite' && typeVal.filter(e => e.favourite).length)">
							<div class="w-full aspect-square rounded relative [&:hover+div]:block [&:hover>div]:grid cursor-pointer">
								<IconNoimage class="w-full h-full bg-theme-color-300 rounded" v-if="!each.poster" />
								<img v-else loading="lazy" :src="each.poster" class="object-cover object-center w-full h-full rounded" />

								<div class="hidden absolute bg-black bg-opacity-50 w-full h-full top-0 left-0 rounded justify-items-center items-center"></div>
							</div>
							<div class="hidden max-[550px]:!hidden absolute w-[6rem] aspect-[2/3] top-1/2 -translate-y-1/2 right-0 rounded overflow-hidden bg-theme-color-300 shadow-md z-10">
								<IconNoimage class="w-full h-full" v-if="!each.poster" />
								<img v-else loading="lazy" :src="each.poster" class="object-cover object-center w-full h-full" />
							</div>
							<NuxtLink :href="`/${each.type}/id/${each.id}`" class="line-clamp-2 justify-self-start font-semibold break-words">{{ each.title }}</NuxtLink>
							<p>{{ each.score }}</p>
							<p>{{ typeFix[each.type] || each.type }}</p>
						</div>
						<div class="bg-theme-color-200 p-2 rounded text-center" v-else>
							Nothing matched your selected filter: <strong>{{ filterSelectables[filterSelected] }}</strong>
						</div>
					</div>
				</div>
			</slot>
			<div class="bg-theme-color-200 p-2 rounded text-center" id="lorem">
				Nothing matched your selected filter: <strong>{{ filterSelectables[filterSelected] }}</strong>
			</div>
		</div>
		<div class="p-2" v-else>
			<div class="bg-theme-color-200 p-2 rounded text-center">This user haven't added anything in his list</div>
		</div>
	</main>
</template>

<script setup>
	definePageMeta({
		middleware: [
			to => {
				if (to.params.username.length < 4) return abortNavigation({ statusCode: 404, message: `Page Not Found: ${to.fullPath}` })
			}
		]
	})

	const route = useRoute()
	const username = route.params.username
	useHead({
		title: `List of ${username}`,
		meta: [
			{ name: 'description', content: `Movies, TV shows and Animes list of ${username}` },
			{ property: 'og:title', content: `List of ${username}` },
			{ property: 'og:description', content: `Movies, TV shows and Animes list of ${username}` },
			{ name: 'twitter:title', content: `List of ${username}` },
			{ name: 'twitter:description', content: `Movies, TV shows and Animes list of ${username}` }
		]
	})
	const sortSelectables = ref({
		none: 'None',
		title: 'Title',
		score: 'Score',
		lastModified: 'Last Modified'
	})
	const sortSelected = ref('none')

	const filterSelectables = ref({
		none: 'None',
		completed: 'Completed',
		watching: 'Watching',
		planning: 'Plan to Watch',
		dropped: 'Dropped',
		favourite: 'Favourite'
	})
	const filterSelected = ref('none')

	const typeFix = ref({ movie: 'Movie', tv: 'TV', anime: 'Anime' })

	const { pending, data, error } = await cLazyFetch('/api/list/other_user', { responseType: 'json', query: { username }, maxAge: 60 })

	watchEffect(() => {
		if (data.value?.hasOwnProperty?.('data')) data.value = data.value.data
	})

	watchEffect(() => {
		if (error.value) showError(error.value)
	})

	function parseObject(listObj) {
		const obj = {}

		Object.keys(listObj).forEach(key => {
			const val = listObj[key]
			if (!obj[val.status]) obj[val.status] = []

			const [type, id] = key.split('_')
			obj[val.status].push({ ...val, type, id: parseInt(id) })
		})

		return obj
	}

	function fnTypeValFS(data) {
		if (filterSelected.value === 'favourite') data = data.filter(e => e.favourite)

		if (sortSelected.value === 'title') data.sort((a, b) => a.title.localeCompare(b.title))
		else if (sortSelected.value === 'score') data.sort((a, b) => b.score - a.score)
		else if (sortSelected.value === 'lastModified') data.sort((a, b) => b.lastModified - a.lastModified)

		return data
	}

	function copyLinkFn() {
		const url = useRequestURL()
		try {
			globalThis.navigator.clipboard.writeText(url.origin + '/list/' + route.params.username)
			setNoti('Link copied to your clipboard.')
		} catch {
			setNoti('Share this link: ' + url.origin + '/list/' + route.params.username)
		}
	}
</script>
