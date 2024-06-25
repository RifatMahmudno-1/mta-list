<template>
	<form @submit.prevent="submit" class="bg-theme-color-200 p-4 rounded w-full max-w-[50rem]">
		<h2 class="text-lg font-semibold border-b-2 border-theme-color-500 px-2 py-1 w-fit mx-auto mb-2">Email</h2>
		<div class="grid grid-cols-[auto_1fr] gap-2">
			<label>Current Email:</label>
			<input type="email" :value="data?.email || 'Loading...'" disabled class="w-full rounded focus:shadow-md px-1 bg-white" />

			<label for="new_email" v-if="editing">New Email:</label>
			<input type="email" id="new_email" required minlength="8" class="w-full rounded focus:shadow-md px-1 bg-white" placeholder="Enter new email" :disabled="sending || stat !== 1" v-model="new_email" v-if="editing" />

			<label for="pass_c_e" v-if="editing">Current Password:</label>
			<input type="password" id="pass_c_e" required minlength="6" class="w-full rounded focus:shadow-md px-1 bg-white" placeholder="Enter your current password" :disabled="sending" v-model="pass" v-if="editing" />

			<p v-if="editing && stat === 2" class="text-sm col-[1/-1]">Enter the verification code sent to your new email address.</p>
			<label for="code" v-if="editing && stat === 2">Verification Code:</label>
			<input type="text" id="code" required minlength="8" class="w-full rounded focus:shadow-md px-1 bg-white" placeholder="Enter new email" :disabled="sending" v-model="code" v-if="editing && stat === 2" />

			<div class="col-[1/-1] flex gap-2 items-center m-auto">
				<button type="button" class="bg-theme-color-500 px-2 rounded shadow-sm hover:shadow-md" @click="() => (editing = true)" v-if="!editing" :disabled="pending">Change</button>
				<button type="submit" class="bg-theme-color-500 px-2 rounded shadow-sm hover:shadow-md" :disabled="sending" v-if="editing">{{ stat === 1 ? 'Save' : 'Verify' }}</button>
				<button type="button" class="bg-red-600 px-2 rounded shadow-sm hover:shadow-md" :disabled="sending" v-if="editing" @click="() => (stat === 1 ? reset() : cancel())">Cancel</button>
			</div>
		</div>
	</form>
</template>

<script setup>
	const props = defineProps(['sending', 'data', 'pending'])
	const emit = defineEmits(['toggleSending', 'data'])
	const { sending, pending, data } = toRefs(props)

	const editing = ref(false)
	const new_email = ref('')
	const pass = ref('')
	const code = ref('')
	const stat = ref(1)

	async function submit() {
		if (sending.value) return
		emit('toggleSending')

		if (new_email.value === data.value.email) {
			setNoti('New and old emails are same.')
			emit('toggleSending')
			reset()
			return
		}

		try {
			const got = await $fetch('/api/profile/change_email', {
				body: {
					new_email: new_email.value,
					pass: pass.value,
					code: code.value || undefined
				},
				method: 'POST',
				responseType: 'json'
			})

			if (got.status === 'wrongPass') {
				setNoti('Provided password is wrong.')
			} else if (got.status === 'emailInUse') {
				setNoti('The email address you entered is being used in another account')
				emit('data', { new_email: undefined })
				await nextTick()
				stat.value = 1
			} else if (got.status === 'sentCode') {
				setNoti(`Sent you a ${got.expired ? 'new' : ''} code in your new email. Use that code to verify. ${got.expired ? 'Previous code has expired.' : ''}`)
				emit('data', { new_email: new_email.value })
				await nextTick()
				stat.value = 2
			} else if (got.status === 'invalidCode') {
				setNoti('The code you entered is invalid')
				stat.value = 2
			} else if (got.status === 'success') {
				setNoti('Changed email successfully')
				emit('data', { email: new_email.value, new_email: undefined, modifiedAt: got.modifiedAt })
				await nextTick()
				reset()
			} else if (got.status === 'askCode') {
				setNoti('Enter the code sent to your new email')
				stat.value = 2
			} else throw 'Invalid data'
			emit('toggleSending')
		} catch (e) {
			showError(e)
		}
	}

	function reset() {
		editing.value = false
		new_email.value = data.value.new_email || ''
		pass.value = ''
		stat.value = 1
	}

	async function cancel() {
		if (sending.value) return
		emit('toggleSending')

		try {
			const got = await $fetch('/api/profile/change_email', { method: 'DELETE', responseType: 'json' })
			if (got.status === 'success') {
				setNoti('Canceled changing email')
				emit('data', { new_email: undefined })
				await nextTick()
				reset()
			} else throw 'Invalid response'
			emit('toggleSending')
		} catch (e) {
			showError(e)
		}
	}

	watch(
		pending,
		() => {
			if (pending.value) return
			new_email.value = data.value.new_email || ''
			if (new_email.value) stat.value = 2
		},
		{ immediate: true }
	)
	watch(stat, () => {
		code.value = ''
	})
</script>
