<template>
	<main>
		<div>
			<div class="w-full aspect-[3/1] bg-theme-color-50">
				<img v-if="!pending && data.banner" :src="data.banner" class="w-full h-full object-cover object-center" />
			</div>
			<div class="grid gap-4 px-8 grid-cols-[auto_1fr] bg-theme-color-300 pb-2">
				<div class="w-[10rem] aspect-[2/1.5] relative">
					<div class="w-full translate-y-[-50%] absolute aspect-[2/3] rounded overflow-hidden bg-theme-color-200" v-if="!pending">
						<img v-if="data.poster" :src="data.poster" class="w-full h-full object-cover object-center" />
						<IconNoimage class="w-full h-full" v-else />
					</div>
					<div class="w-full translate-y-[-50%] absolute aspect-[2/3] rounded overflow-hidden loading" v-else></div>
				</div>
				<div class="py-4">
					<slot v-if="!pending">
						<h1 class="text-2xl line-clamp-1 font-semibold">{{ data?.title }}</h1>
						<div v-html="data.description"></div>
					</slot>
					<slot v-else>
						<h1 class="text-2xl line-clamp-1 font-semibold w-1/4 rounded loading mb-1">&nbsp;</h1>
						<div class="rounded w-full loading">&nbsp;</div>
					</slot>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-[auto_1fr] gap-4 m-4">
			<!-- left column -->
			<div class="flex flex-col gap-2 [&>*:not(button)]:bg-theme-color-200 [&>*:not(button)]:px-2 [&>*:not(button)]:py-1 [&>*]:rounded min-w-[10rem]" v-if="!pending">
				<button class="bg-theme-color-500 py-1 px-2 flex items-center justify-center" @click="fnShowListStatus">
					<IconList />
					List Status
				</button>
				<div v-if="data?.genres?.length">
					<p>Genres:</p>
					<NuxtLink :href="`/${route.params.type}/genre/${encodeURIComponent(e)}`" class="block ml-4 bg-theme-color-50 px-2 rounded mb-1" v-for="e in data.genres">{{ e }}</NuxtLink>
				</div>
				<p>
					Popularity: <strong>{{ data.popularity }}</strong>
				</p>
				<p>
					Avarage Score: <strong>{{ data.averageScore }}</strong>
				</p>
			</div>
			<div class="flex flex-col gap-2 [&>*:not(button)]:bg-theme-color-200 [&>*:not(button)]:px-2 [&>*:not(button)]:py-1 [&>*]:rounded min-w-[10rem]" v-else>
				<button class="!bg-theme-color-500 py-1 px-2 flex items-center justify-center loading">&nbsp;</button>
				<div class="loading h-[8rem]">&nbsp;</div>
				<p class="w-full loading">&nbsp;</p>
				<p class="w-full loading">&nbsp;</p>
			</div>

			<!-- right column -->
			<div class="flex flex-col gap-2" v-if="!pending">
				<!-- Characters -->
				<div class="bg-theme-color-50 rounded" v-if="data?.characters?.length">
					<h2 class="text-center text-lg bg-theme-color-300 rounded">Characters</h2>
					<div class="gap-2 grid grid-cols-2 p-2 max-h-[15rem] overflow-auto">
						<div class="bg-theme-color-200 px-2 rounded grid gap-2 grid-cols-[auto_1fr] items-center" v-for="each in data.characters">
							<div class="w-[3rem] aspect-[2/3]">
								<img loading="lazy" v-if="each.poster" :src="each.poster" class="w-full h-full object-cover object-center" />
								<IconNoimage class="w-full h-full" v-else />
							</div>
							<div class="py-2">
								<p class="line-clamp-1">{{ each.name }}</p>
								<p class="line-clamp-1 text-[0.7rem]">{{ each.role }}</p>
							</div>
						</div>
					</div>
				</div>
				<!-- staffs -->
				<div class="bg-theme-color-50 rounded" v-if="data?.staffs?.length">
					<h2 class="text-center text-lg bg-theme-color-300 rounded">Staffs</h2>
					<div class="gap-2 grid grid-cols-2 p-2 max-h-[15rem] overflow-auto">
						<div class="bg-theme-color-200 px-2 rounded grid gap-2 grid-cols-[auto_1fr] items-center" v-for="each in data.staffs">
							<div class="w-[3rem] aspect-[2/3]">
								<img loading="lazy" v-if="each.poster" :src="each.poster" class="w-full h-full object-cover object-center" />
								<IconNoimage class="w-full h-full" v-else />
							</div>
							<div class="py-2">
								<p class="line-clamp-1">{{ each.name }}</p>
								<p class="line-clamp-1 text-[0.7rem]">{{ each.role }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-2" v-else>
				<div class="bg-theme-color-50 rounded" v-for="e in ([].length = 2)">
					<h2 class="text-center text-lg !bg-theme-color-300 rounded loading">&nbsp;</h2>
					<div class="gap-2 grid grid-cols-2 p-2 max-h-[15rem] overflow-auto">
						<div class="px-2 rounded grid gap-2 grid-cols-[auto_1fr] items-center loading" v-for="e in ([].length = 4)">
							<div class="w-[3rem] aspect-[2/3]"></div>
							<div class="py-2"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<ListStatus v-if="!pending && showListStatus" @hideListStatus="() => (showListStatus = false)" :title="data.title" :poster="data.poster" :banner="data.banner" :id="parseInt(route.params.id)" :type="route.params.type" />
	</main>
</template>

<script setup>
	definePageMeta({
		middleware: [
			'is-type-valid',
			to => {
				const id = parseInt(to.params.id)
				if (id <= 0 || isNaN(id) || id != to.params.id) return abortNavigation({ statusCode: 404, message: `Page Not Found: ${to.fullPath}` })
			}
		]
	})

	const route = useRoute()
	const showListStatus = ref(false)

	const useHeadType = {
		tv: 'TV or Season',
		movie: 'Movie',
		anime: 'Anime'
	}

	const { data, pending, error } = await cLazyFetch(`/api/${route.params.type}/id/${route.params.id}`, { maxAge: 5 * 60 })

	watchEffect(() => {
		if (error.value) return showError(error.value)
	})

	watchEffect(() => {
		if (!data.value) {
			useHead({
				title: `Specific ${useHeadType[route.params.type]}`,
				meta: [
					{ name: 'description', content: `Details of specific ${useHeadType[route.params.type]} & add it to your list` },
					{ property: 'og:title', content: `Specific ${useHeadType[route.params.type]}` },
					{ property: 'og:description', content: `Details of specific ${useHeadType[route.params.type]} & add it to your list` },
					{ name: 'twitter:title', content: `Specific ${useHeadType[route.params.type]}` },
					{ name: 'twitter:description', content: `Details of specific ${useHeadType[route.params.type]} & add it to your list` }
				]
			})
		} else {
			useHead({
				title: `${data.value.title}`,
				meta: [
					{ name: 'description', content: data.value.description || `Browse details of ${data.value.title} & add it to your list` },
					{ property: 'og:title', content: `${data.value.title}` },
					{ property: 'og:description', content: data.value.description || `Browse details of ${data.value.title} & add it to your list` },
					{ name: 'twitter:title', content: `${data.value.title}` },
					{ name: 'twitter:description', content: data.value.description || `Browse details of ${data.value.title} & add it to your list` }
				]
			})
		}
	})

	function fnShowListStatus() {
		if (route.meta.user) showListStatus.value = true
		else setNoti('Please login first to add this in your list')
	}
</script>
