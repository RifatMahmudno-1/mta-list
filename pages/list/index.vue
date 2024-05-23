<template>
	<main class="px-2">
		<div class="flex justify-between bg-theme-color-300 p-2 rounded gap-4">
			<div class="flex items-center gap-2">
				<span>Sort:</span>
				<Select :selectables="sortSelectables" :selected="sortSelected" @select="e => (sortSelected = e)" v-if="!pending" />
				<span class="!bg-theme-color-500 loading w-28 rounded" v-else>&nbsp;</span>
			</div>
			<div class="flex items-center gap-2">
				<span>Filter:</span>
				<Select :selectables="filterSelectables" :selected="filterSelected" @select="e => (filterSelected = e)" position="right" v-if="!pending" />
				<span class="!bg-theme-color-500 loading w-28 rounded" v-else>&nbsp;</span>
			</div>
		</div>
		<div v-if="pending" class="p-2 flex flex-col gap-2">
			<div v-for="_ in ([].length = 20)" class="grid grid-cols-[3rem_1fr] rounded loading overflow-hidden">
				<div class="w-full aspect-[2/3] bg-theme-color-300">&nbsp;</div>
				<div>&nbsp;</div>
			</div>
		</div>
		<div class="p-2 flex flex-col gap-2" v-else-if="Object.keys(data?.list || {}).length">
			<slot v-for="(typeVal, typeKey) in parseObject(data.list)">
				<h2 class="bg-theme-color-300 px-2 py-1 rounded">{{ filterSelectables[typeKey] }}</h2>
				<div class="bg-theme-color-200 rounded grid grid-cols-[3rem_1fr] items-center overflow-hidden" v-for="each in fnTypeValFS(typeVal)" v-if="fnTypeValShow(typeVal, typeKey)">
					<div class="w-full aspect-[2/3] bg-theme-color-300">
						<img loading="lazy" :src="each.poster" v-if="each.poster" />
						<IconNoimage class="w-full h-full" v-else />
					</div>
					<div class="p-2 grid items-center grid-cols-[1fr_auto]">
						<div>
							<p class="line-clamp-1">{{ each.title }}</p>
							<p>Score: {{ each.score }}</p>
						</div>
						<div class="grid gap-2">
							<button class="rounded bg-theme-color-300 px-2 flex items-center gap-2 justify-center" @click="() => showListFn(each)"><IconEdit /> Edit</button>
							<NuxtLink :href="`/${each.type}/id/${each.id}`" class="rounded bg-theme-color-300 px-2 flex items-center gap-2"><IconEye /> View</NuxtLink>
						</div>
					</div>
				</div>
				<div class="bg-theme-color-200 p-2 rounded text-center" v-else>
					Nothing matched your selected filter: <strong>{{ filterSelectables[filterSelected] }}</strong>
				</div>
			</slot>
		</div>
		<div class="p-2" v-else><div class="bg-theme-color-200 p-2 rounded text-center">You haven't added anything in your list</div></div>

		<ListStatus v-if="!pending && showListStatus" @hideListStatus="hideListFn" :title="listData.title" :poster="listData.poster" :banner="listData.banner" :type="listData.type" :id="listData.id" :additionalData="listData.additionalData" @dataUpdated="dataUpdated" />
	</main>
</template>

<script setup>
	useHead({
		title: 'List',
		meta: [
			{ name: 'description', content: 'Your personal Movies, TV shows and Animes list' },
			{ property: 'og:title', content: 'List' },
			{ property: 'og:description', content: 'Your personal Movies, TV shows and Animes list' },
			{ name: 'twitter:title', content: 'List' },
			{ name: 'twitter:description', content: 'Your personal Movies, TV shows and Animes list' }
		]
	})

	const showListStatus = ref(false)
	const listData = ref({ poster: '', title: '', banner: '', id: null, type: '', additionalData: null })
	function showListFn(data) {
		showListStatus.value = true
		listData.value = {
			poster: data.poster,
			banner: data.banner,
			title: data.title,
			id: data.id,
			type: data.type,
			additionalData: {
				poster: data.poster,
				banner: data.banner,
				title: data.title,
				status: data.status,
				score: data.score,
				note: data.note,
				favourite: data.favourite,
				lastModified: data.lastModified
			}
		}
	}
	function hideListFn() {
		showListStatus.value = false
		listData.value = { poster: '', title: '', banner: '', id: null, type: '', additionalData: null }
	}
	function dataUpdated(d) {
		const key = `${listData.value.type}_${listData.value.id}`
		if (d === null) {
			hideListFn()
			delete data.value.list[key]
		} else {
			data.value.list[key] = d
			showListFn({ ...d, type: listData.value.type, id: listData.value.id })
		}
	}

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

	const { pending, data, error } = await cLazyFetch('/api/list/all', { responseType: 'json' })

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

	function fnTypeValShow(val, key) {
		return filterSelected.value === 'none' || (filterSelected.value === 'favourite' && val.filter(e => e.favourite).length) || filterSelected.value === key
	}
</script>
