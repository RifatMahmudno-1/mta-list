<template>
	<form class="w-full max-w-[50rem]" @submit.prevent="submit">
		<button :disabled="pending || sending" type="button" class="bg-red-600 px-4 py-2 rounded shadow-sm hover:shadow-md" @click="() => (stat = 1)" v-if="stat === 0">Delete Account</button>
		<div class="grid gap-2 items-center bg-theme-color-200 rounded p-4" v-if="stat === 1 || stat === 2">
			<slot v-if="stat === 1">
				<p>Do you really want to delete your account? Your all data will be deleted and can't be recovered</p>
				<div class="flex gap-2 mx-auto">
					<button :disabled="sending" type="button" class="bg-red-600 px-2 rounded shadow-sm hover:shadow-md" @click="() => (stat = 2)">Yes</button>
					<button :disabled="sending" type="button" class="bg-theme-color-500 px-2 rounded shadow-sm hover:shadow-md" @click="() => (stat = 0)">No</button>
				</div>
			</slot>
			<slot v-if="stat === 2">
				<p>Enter your current password and press delete to delete this account.</p>
				<div class="grid gap-2 grid-cols-[auto_1fr] max-[350px]:grid-cols-1">
					<label for="d_pass">Current password:</label>
					<input :disabled="sending" type="password" id="d_pass" required minlength="6" class="w-full rounded focus:shadow-md px-1 bg-white" placeholder="Enter your current password" v-model="pass" />
				</div>
				<div class="flex gap-2 mx-auto">
					<button :disabled="sending" type="submit" class="bg-red-600 px-2 rounded shadow-sm hover:shadow-md">Delete</button>
					<button :disabled="sending" type="button" class="bg-theme-color-500 px-2 rounded shadow-sm hover:shadow-md" @click="() => (stat = 0)">Cancel</button>
				</div>
			</slot>
		</div>
	</form>
</template>

<script setup>
	const router = useRouter()
	const props = defineProps(['sending', 'pending'])
	const emit = defineEmits(['toggleSending'])
	const { sending, pending } = toRefs(props)

	const pass = ref('')
	const stat = ref(0)

	async function submit() {
		if (sending.value) return
		emit('toggleSending')

		try {
			const got = await $fetch('/api/profile/delete', { method: 'DELETE', responseType: 'json', body: { pass: pass.value } })
			if (got.status === 'wrongPass') setNoti('Wrong password provided.')
			else if (got.status === 'success') {
				setNoti('We will miss you.')
				router.push('/')
			} else throw 'Invalid Response'
			emit('toggleSending')
		} catch (e) {
			showError(e)
		}
	}

	watch(stat, () => (pass.value = ''))
</script>
