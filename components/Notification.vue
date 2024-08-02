<template>
	<div class="fixed right-8 z-50 top-[15%] grid gap-4">
		<div v-for="each in arr" :key="each.key" class="grid grid-cols-[1fr_auto] border-2 border-theme-color-500 items-center gap-2 px-2 py-1 rounded shadow-md bg-theme-color-300 w-[30rem] max-[550px]:w-[25rem] max-[420px]:w-[20rem] max-[350px]:w-[17rem] justify-between animate-[notificationSlideInOut_8s_linear_forwards]">
			<p>{{ each.text }}</p>
			<button @click="() => remove(each.key)" class="bg-theme-color-500 h-8 w-8 rounded text-lg grid items-center justify-items-center">
				<IconClose />
			</button>
		</div>
	</div>
</template>

<script setup>
	const arr = getNoti()
	function remove(key) {
		const ind = arr.value.findIndex(el => el.key === key)
		if (ind < 0) return
		arr.value.splice(ind, 1)
	}
</script>
