<template>
	<div class="fixed top-0 left-0 w-[100dvw] h-[100dvh] grid justify-items-center items-center bg-black bg-opacity-50 p-4 overflow-auto z-10">
		<div class="bg-theme-color-200 w-full max-w-[50rem] rounded">
			<div>
				<!-- banner -->
				<div class="w-full aspect-[4/1] rounded-tl rounded-tr overflow-hidden">
					<img v-if="props.banner" :src="props.banner" class="w-full h-full object-cover object-center" />
				</div>
				<!-- poster and title -->
				<div class="bg-theme-color-300 px-8 grid gap-4 grid-cols-[auto_1fr] pb-2">
					<!-- poster -->
					<div class="w-[8rem] max-[550px]:w-[7rem] max-[450px]:w-[6rem] max-[300px]:w-[5rem] aspect-[2/1.5] relative">
						<div class="w-full translate-y-[-50%] absolute aspect-[2/3] rounded overflow-hidden bg-theme-color-200">
							<img v-if="props.poster" :src="props.poster" class="w-full h-full object-cover object-center" />
							<IconNoimage class="w-full h-full" v-else />
						</div>
					</div>
					<!-- title -->
					<div class="flex items-center">
						<h2 class="text-xl line-clamp-2 font-semibold">{{ props.title }}</h2>
					</div>
				</div>
			</div>
			<!-- List Status -->
			<form class="m-4 flex justify-evenly flex-wrap gap-2" @submit.prevent="submit" v-if="!pending">
				<div class="flex items-center gap-2">
					<span>Status:</span>
					<Select :selectables="statusSelectables" :selected="statusSelected" @select="e => (statusSelected = e)" :disabled="busy" />
				</div>
				<div class="flex items-center gap-2">
					<label for="score">Score:</label>
					<input type="number" min="0" max="10" inputmode="numeric" step="1" v-model="scoreVal" class="rounded bg-theme-color-500 text-center" id="score" :disabled="busy" />
				</div>
				<div class="flex items-center gap-2">
					<input type="checkbox" v-model="favVal" id="fav" class="accent-theme-color-500" :disabled="busy" />
					<label for="fav" class="select-none">Favourite</label>
				</div>
				<div class="w-full flex gap-2">
					<label for="textarea">Note:</label>
					<textarea id="textarea" class="flex-grow bg-theme-color-50 resize-none h-[5rem] rounded p-1" v-model="noteVal" maxlength="200" :disabled="busy"></textarea>
				</div>
				<p class="w-full text-[0.8rem]" v-if="busy">Please wait</p>
				<p class="w-full text-[0.8rem]" v-else-if="!data">* You haven't added it in your list</p>
				<p class="w-full text-[0.8rem]" v-else-if="data?.lastModified">Last modified at: {{ parseDate(data.lastModified) }}</p>
				<button type="submit" class="hidden" ref="submitBtn"></button>
			</form>
			<div v-else class="m-4 flex justify-evenly flex-wrap gap-y-2">
				<div class="w-1/4 !bg-theme-color-500 rounded loading">&nbsp;</div>
				<div class="w-1/4 !bg-theme-color-500 rounded loading">&nbsp;</div>
				<div class="w-1/4 !bg-theme-color-500 rounded loading">&nbsp;</div>
				<div class="w-full h-[5rem] !bg-theme-color-500 rounded loading">&nbsp;</div>
			</div>
			<!-- buttons -->
			<div class="m-4 flex gap-2 justify-center">
				<button v-if="!pending" class="rounded bg-theme-color-500 px-2" :disabled="busy" @click="() => submitBtn?.click()">Save</button>
				<button v-if="!pending && data" class="rounded bg-red-600 px-2" :disabled="busy" @click="deleteEntry">Delete</button>
				<button class="rounded px-2 border-theme-color-500 border-2" :disabled="busy" @click="() => emit('hideListStatus')">Close</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	const emit = defineEmits(['hideListStatus', 'dataUpdated'])
	const props = defineProps({
		poster: { type: [String, null], required: true },
		banner: { type: [String, null], required: true },
		title: { type: String, required: true },
		id: { type: Number, required: true },
		type: { type: String, required: true },
		additionalData: { type: Object, default: null }
	})

	const scrollPos = ref({ x: 0, y: 0 })
	const busy = ref(false)
	const submitBtn = ref(null)

	const statusSelectables = ref({
		completed: 'Completed',
		watching: 'Watching',
		planning: 'Plan to Watch',
		dropped: 'Dropped'
	})
	const statusSelected = ref('completed')
	const scoreVal = ref(0)
	const noteVal = ref('')
	const favVal = ref(false)

	function stopScroll() {
		globalThis.window.scroll(scrollPos.value.x, scrollPos.value.y)
	}

	onMounted(() => {
		scrollPos.value.x = globalThis.window.scrollX
		scrollPos.value.y = globalThis.window.scrollY
		globalThis.window.addEventListener('scroll', stopScroll)
	})

	onBeforeUnmount(() => globalThis.window.removeEventListener('scroll', stopScroll))

	const { pending, data, error } = props.additionalData
		? { pending: ref(false), data: computed(() => props.additionalData), error: ref(null) }
		: await cLazyFetch('/api/list/item', {
				query: { id: props.id, type: props.type },
				responseType: 'json'
		  })

	watchEffect(() => {
		if (error.value) showError(error.value)
	})

	watch(
		data,
		(to, from) => {
			if (from?.hasOwnProperty?.('data') && !to?.hasOwnProperty?.('data')) return

			if (pending.value) return
			if (data.value?.hasOwnProperty?.('data')) data.value = data.value.data

			if (data.value) {
				scoreVal.value = data.value.score
				statusSelected.value = data.value.status
				favVal.value = data.value.favourite
				noteVal.value = data.value.note
			} else {
				scoreVal.value = 0
				statusSelected.value = 'completed'
				favVal.value = false
				noteVal.value = ''
			}
		},
		{ immediate: props.additionalData ? true : false }
	)

	async function submit() {
		if (busy.value) return true
		busy.value = true

		try {
			const got = await $fetch('/api/list/item', {
				method: 'POST',
				body: {
					id: props.id,
					type: props.type,
					poster: props.poster || '',
					banner: props.banner || '',
					title: props.title,
					status: statusSelected.value,
					score: scoreVal.value || 0,
					note: noteVal.value || '',
					favourite: favVal.value
				},
				responseType: 'json'
			})

			if (got?.lastModified) {
				const obj = {
					poster: props.poster || '',
					banner: props.banner || '',
					title: props.title,
					status: statusSelected.value,
					score: scoreVal.value || 0,
					note: noteVal.value || '',
					favourite: favVal.value,
					lastModified: got.lastModified
				}
				if (!props.additionalData) data.value = obj
				else emit('dataUpdated', obj)
			} else showError({ statusCode: 500, message: 'Invalid response' })
		} catch (e) {
			showError(e)
		}

		busy.value = false
	}

	async function deleteEntry() {
		if (busy.value) return true
		busy.value = true

		try {
			const got = await $fetch('/api/list/item', {
				method: 'DELETE',
				body: {
					id: props.id,
					type: props.type
				},
				responseType: 'json'
			})

			if (got?.status === 'success') {
				if (!props.additionalData) data.value = null
				else emit('dataUpdated', null)
			} else showError({ statusCode: 500, message: 'Invalid response' })
		} catch (e) {
			showError(e)
		}

		busy.value = false
	}

	function parseDate(date) {
		if (!date) return 'Unknown'
		try {
			let d = new Date(parseInt(date))
			return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' at ' + d.toLocaleTimeString('en-US')
		} catch (e) {
			return 'Unknown'
		}
	}
</script>
