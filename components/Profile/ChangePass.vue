<template>
	<form class="bg-theme-color-200 p-4 rounded w-full max-w-[50rem]" @submit.prevent="submit">
		<h2 class="text-lg font-semibold border-b-2 border-theme-color-500 px-2 py-1 w-fit mx-auto mb-2">Change Password</h2>
		<div class="grid grid-cols-[auto_1fr] gap-2">
			<label for="n_pass">New password:</label>
			<input type="password" id="n_pass" required minlength="6" class="w-full rounded focus:shadow-md px-1 bg-white" placeholder="Enter new password" :disabled="sending || !editing" v-model="new_pass" />
			<label for="re_n_pass">&nbsp;</label>
			<input type="password" id="re_n_pass" required minlength="6" class="w-full rounded focus:shadow-md px-1 bg-white" placeholder="Retype that new password" :disabled="sending || !editing" v-model="re_new_pass" @change="comparePass" />
			<label for="pass_c_p" v-if="editing">Current Password:</label>
			<input type="password" id="pass_c_p" required minlength="6" class="w-full rounded focus:shadow-md px-1 bg-white" placeholder="Enter your current password" :disabled="sending" v-model="pass" v-if="editing" />
			<div class="col-[1/-1] flex gap-2 items-center m-auto">
				<button type="button" class="bg-theme-color-500 px-2 rounded shadow-sm hover:shadow-md" v-if="!editing" @click="() => (editing = !editing)" :disabled="pending">Change</button>
				<button type="submit" class="bg-theme-color-500 px-2 rounded shadow-sm hover:shadow-md" v-if="editing" :disabled="sending">Save</button>
				<button type="button" class="bg-red-600 px-2 rounded shadow-sm hover:shadow-md" v-if="editing" :disabled="sending" @click="reset">Cancel</button>
			</div>
		</div>
	</form>
</template>

<script setup>
	const props = defineProps(['sending', 'pending'])
	const emit = defineEmits(['toggleSending', 'data'])
	const { sending, pending } = toRefs(props)

	const editing = ref(false)
	const new_pass = ref('')
	const re_new_pass = ref('')
	const pass = ref('')

	async function submit() {
		if (sending.value) return
		emit('toggleSending')

		try {
			const got = await $fetch('/api/profile/password', {
				body: {
					new_pass: new_pass.value,
					pass: pass.value
				},
				method: 'POST',
				responseType: 'json'
			})

			if (got.status === 'wrongPass') {
				setNoti('Provided password is wrong.')
			} else if (got.status === 'success') {
				setNoti('Changed password successfully')
				emit('data', { modifiedAt: got.modifiedAt })
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
		new_pass.value = ''
		re_new_pass.value = ''
		pass.value = ''
	}
	function comparePass(e) {
		if (new_pass.value !== re_new_pass.value) e.target.setCustomValidity("Passwords didn't match")
		else e.target.setCustomValidity('')
	}
</script>
