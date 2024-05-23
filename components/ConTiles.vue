<template>
	<div>
		<div class="bg-theme-color-300 flex justify-between p-2 items-center rounded">
			<h2 class="font-semibold text-lg">{{ props.title }}</h2>
			<NuxtLink v-if="props.compact" :href="`/${type}/${props.title.toLowerCase()}`" class="bg-theme-color-500 rounded px-2 flex items-center">More <IconRight /></NuxtLink>
		</div>
		<div class="p-4 flex flex-wrap gap-x-2 gap-y-4 justify-evenly rounded">
			<!-- pending -->
			<div v-if="pending" v-for="e in ([].length = props.compact ? 10 : 20)" class="w-[10rem]">
				<div class="aspect-[2/3] rounded-lg mb-1 overflow-hidden loading">&nbsp;</div>
				<p class="px-2 loading w-[8rem] mx-auto rounded">&nbsp;</p>
			</div>

			<!-- loaded -->
			<div class="w-[10rem] relative [&:hover_.olwneoiu]:grid [&:hover_.ireuhghug]:block" v-else-if="data?.results?.length" v-for="each in props.compact ? data.results?.slice(0, 10) : data.results" :key="each.id">
				<NuxtLink :href="`/${type}/id/${each.id}`">
					<div class="aspect-[2/3] rounded-lg mb-1 overflow-hidden bg-theme-color-200 relative">
						<img v-if="each.poster" :src="each.poster" loading="lazy" class="w-full h-full object-cover object-center" />
						<IconNoimage v-else class="w-full h-full" />
						<div class="absolute w-full h-full top-0 left-0 bg-black bg-opacity-50 hidden ireuhghug"></div>
					</div>
					<p class="text-center line-clamp-1 px-2">{{ each.title }}</p>
				</NuxtLink>
				<button class="absolute bg-theme-color-500 rounded-full bottom-12 right-4 h-8 w-8 items-center justify-items-center hidden olwneoiu" @click="() => showListFn(each)">
					<IconList />
				</button>
			</div>

			<!-- empty data -->
			<div class="w-full rounded p-2 text-center bg-theme-color-300" v-else-if="!props.compact">Nothing Found</div>
		</div>
		<div class="flex gap-2 justify-center" v-if="!props.compact">
			<!-- pending -->
			<button class="loading py-0.5 px-2 rounded w-[8rem]" v-if="pending">&nbsp;</button>

			<!-- hasMore -->
			<slot v-else>
				<button class="bg-theme-color-500 py-0.5 px-2 rounded" v-if="page > 1" @click="() => router.push({ query: { ...route.query, page: Number(page) - 1 } })">Previous Page</button>
				<button class="bg-theme-color-500 py-0.5 px-2 rounded" v-if="data.hasNextPage" @click="() => router.push({ query: { ...route.query, page: Number(page) + 1 } })">Next Page</button>
			</slot>
		</div>

		<ListStatus v-if="!pending && showListStatus" @hideListStatus="hideListFn" :title="listData.title" :poster="listData.poster" :banner="listData.banner" :type="type" :id="listData.id" />
	</div>
</template>

<script setup>
	const route = useRoute()
	const router = useRouter()
	const props = defineProps({
		title: { type: String, required: true },
		api: { type: String, required: true },
		compact: { type: Boolean, default: false },
		additionalQuery: { type: Object, default: {} }
	})
	const showListStatus = ref(false)
	const listData = ref({ poster: '', title: '', banner: '', id: null })

	const type = route.params.type
	const page = computed(() => {
		const p = parseInt(route.query.page)

		if (p <= 0 || isNaN(p) || p != route.query.page) return '1'
		return p.toString()
	})

	const query = computed(() => ({ page, ...props.additionalQuery }))

	const { data, error, pending } = await cLazyFetch(props.api, { query: query.value, watch: [page], maxAge: 5 * 60 })

	watchEffect(() => {
		if (error.value) showError(error.value)
	})

	function showListFn(data) {
		if (!route.meta.user) return setNoti('Please login first to add this in your list')
		showListStatus.value = true
		listData.value.poster = data.poster
		listData.value.banner = data.banner
		listData.value.title = data.title
		listData.value.id = data.id
	}

	function hideListFn() {
		showListStatus.value = false
		listData.value.poster = ''
		listData.value.banner = ''
		listData.value.title = ''
	}
</script>
