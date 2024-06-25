<template>
	<form @submit.prevent="submit" class="bg-theme-color-200 p-4 rounded w-full max-w-[50rem]">
		<h2 class="text-lg font-semibold border-b-2 border-theme-color-500 px-2 py-1 w-fit mx-auto mb-2">Profile Info</h2>
		<div class="grid grid-cols-[auto_1fr] gap-2">
			<label for="name">Name:</label>
			<input type="text" id="name" required minlength="4" class="w-full rounded focus:shadow-md px-1 bg-white" placeholder="Enter your fullname" :disabled="sending || !editing" v-model="name" />
			<label for="username">Userame:</label>
			<input type="text" id="username" required minlength="4" class="w-full rounded focus:shadow-md px-1 bg-white" placeholder="Enter your fullname" :disabled="sending || !editing" v-model="username" @change="validateUsername" />
			<p class="text-sm col-[1/-1]" v-if="editing && changedUsername">Your list link/url will also be changed if you change username.</p>
			<label for="pass_n_u" v-if="editing">Current Password:</label>
			<input type="password" id="pass_n_u" required minlength="6" class="w-full rounded focus:shadow-md px-1 bg-white" placeholder="Enter your current password" :disabled="sending" v-model="pass" v-if="editing" />
			<div class="col-[1/-1] flex gap-2 items-center m-auto">
				<button type="button" class="bg-theme-color-500 px-2 rounded shadow-sm hover:shadow-md" @click="() => (editing = true)" v-if="!editing" :disabled="pending">Edit</button>
				<button type="submit" class="bg-theme-color-500 px-2 rounded shadow-sm hover:shadow-md" :disabled="sending" v-if="editing">Save</button>
				<button type="button" class="bg-red-600 px-2 rounded shadow-sm hover:shadow-md" :disabled="sending" v-if="editing" @click="reset">Cancel</button>
			</div>
		</div>
	</form>
</template>

<script setup>
	const props = defineProps(['sending', 'data', 'pending'])
	const emit = defineEmits(['toggleSending', 'data'])
	const { sending, pending, data } = toRefs(props)

	const editing = ref(false)
	const name = ref('Loading...')
	const username = ref('Loading...')
	const pass = ref('')

	const changedUsername = computed(() => data.value.username !== username.value)

	async function submit() {
		if (sending.value) return
		emit('toggleSending')

		if (name.value === data.value.name && username.value === data.value.username) {
			setNoti('Updated successfully')
			emit('toggleSending')
			reset()
			return
		}

		try {
			const got = await $fetch('/api/profile/data', {
				body: {
					name: data.value.name === name.value ? undefined : name.value,
					username: data.value.username === username.value ? undefined : username.value,
					pass: pass.value
				},
				method: 'POST',
				responseType: 'json'
			})

			if (got.status === 'wrongPass') {
				setNoti('Provided password is wrong.')
			} else if (got.status === 'usernameTaken') {
				setNoti('Username is already taken. Try another.')
			} else if (got.status === 'success') {
				setNoti('Updated successfully')
				emit('data', { name: name.value, username: username.value, modifiedAt: got.modifiedAt })
				await nextTick()
				reset()
			} else throw 'Invalid data'
			emit('toggleSending')
		} catch (e) {
			showError(e)
		}
	}

	function reset() {
		editing.value = false
		name.value = data.value.name
		username.value = data.value.username
		pass.value = ''
	}

	watch(
		pending,
		() => {
			if (pending.value) return
			name.value = data.value.name
			username.value = data.value.username
		},
		{ immediate: true }
	)

	function validateUsername(e) {
		if (!username.value.match(/^[a-z0-9_.-]+$/)) e.target.setCustomValidity('Username can only include a-z, 0-9, underscore (_), fullstop (.) and hyphen (-) ')
		else e.target.setCustomValidity('')
	}
</script>
