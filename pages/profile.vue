<template>
	<main class="p-2 flex flex-col gap-4 items-center">
		<h1 class="text-2xl font-semibold border-b-2 border-theme-color-500 px-2 py-1 w-fit">User Profile</h1>

		<ProfileNameUsername @toggle-sending="sending = !sending" @data="updateData" :sending="sending" :data="data" :pending="pending" />
		<ProfileChangeEmail @toggle-sending="sending = !sending" @data="updateData" :sending="sending" :data="data" :pending="pending" />
		<ProfileChangePass @toggle-sending="sending = !sending" @data="updateData" :sending="sending" :pending="pending" />
		<p v-if="!pending && data?.modifiedAt" class="text-sm">Last modified at: {{ parseDate(data.modifiedAt) }}</p>
		<ProfileDeleteAccount @toggle-sending="sending = !sending" :sending="sending" :pending="pending" />
	</main>
</template>

<script setup>
	useHead({
		title: 'Profile',
		meta: [
			{ name: 'description', content: 'Edit your MTA List profile and account here.' },
			{ property: 'og:title', content: 'Profile' },
			{ property: 'og:description', content: 'Edit your MTA List profile and account here.' },
			{ name: 'twitter:title', content: 'Profile' },
			{ name: 'twitter:description', content: 'Edit your MTA List profile and account here.' }
		]
	})

	const sending = ref(false)

	const { data, pending, error } = await cLazyFetch('/api/profile/data', { method: 'GET' })

	watchEffect(() => {
		if (error.value) showError(error.value)
	})

	function updateData(e) {
		data.value = { ...data.value, ...e }
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
