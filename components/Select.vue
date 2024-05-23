<template>
	<ul class="relative bg-theme-color-500 rounded px-2 py-0.5 select-none cursor-pointer w-fit inline-block" @click="() => (selectShowing = !selectShowing)" :class="disabled ? 'opacity-70' : ''">
		<li class="flex items-center gap-2">
			{{ props.selectables[props.selected] || '' }}
			<IconDown v-if="selectShowing" />
			<IconRight v-else />
		</li>
		<li class="absolute mt-2 bg-theme-color-500 rounded overflow-hidden shadow-md" :class="props.position === 'right' ? 'right-0' : 'left-0'" v-if="selectShowing">
			<ul>
				<li v-for="(v, k) in selectables" @click="() => (disabled ? null : emit('select', k))" class="px-2 hover:bg-theme-color-100 text-nowrap">
					{{ v }}
				</li>
			</ul>
		</li>
	</ul>
</template>

<script setup>
	const emit = defineEmits(['select'])

	const props = defineProps({
		selectables: { type: Object, required: true },
		selected: { required: true },
		disabled: { type: Boolean, default: false },
		position: { type: String, default: 'left' }
	})

	const { selectables } = toRefs(props)
	const selectShowing = ref(false)
</script>
