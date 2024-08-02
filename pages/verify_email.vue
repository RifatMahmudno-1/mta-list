<template>
	<main class="grid items-center justify-items-center p-2">
		<form class="w-full max-w-[35rem] bg-theme-color-300 p-4 rounded border-theme-color-500 border-2 grid gap-2 shadow-md grid-cols-[auto_1fr] items-center" spellcheck="false" @submit.prevent="submit">
			<h1 class="w-fit mx-auto px-4 pb-1 border-b-2 border-theme-color-500 text-lg font-semibold col-[1/-1]">Verify Email</h1>
			<p class="col-[1/-1] text-center" v-if="gotEmail">Enter the code sent to your email</p>
			<label for="email">Email:</label>
			<div class="flex gap-2">
				<input type="email" id="email" class="w-full px-1 rounded transition-shadow focus:shadow-md" placeholder="Enter your email address" required minlength="8" v-model="emailInp" :disabled="gotEmail || sending" />
				<button v-if="gotEmail" type="button" :disabled="sending" class="bg-theme-color-500 rounded px-1" @click="editMail"><IconEdit /></button>
			</div>
			<button v-if="!gotEmail" type="submit" class="bg-theme-color-500 w-fit mx-auto col-[1/-1] px-2 py-1 rounded hover:shadow-md transition-shadow" :disabled="sending">Send Code</button>
			<slot v-else>
				<label for="code">Code:</label>
				<input type="text" autocomplete="off" id="code" class="w-full px-1 rounded transition-shadow focus:shadow-md" placeholder="Enter code form email" required minlength="8" maxlength="8" v-model="codeInp" :disabled="sending" />
				<button type="submit" class="bg-theme-color-500 w-fit mx-auto col-[1/-1] px-2 py-1 rounded hover:shadow-md transition-shadow" :disabled="sending">Verify</button>
			</slot>
			<div class="col-[1/-1] text-center flex gap-2 justify-center">
				<NuxtLink href="/login" class="text-theme-color-800 underline">Login</NuxtLink>
				<NuxtLink href="/register" class="text-theme-color-800 underline">Register</NuxtLink>
			</div>
		</form>
	</main>
</template>

<script setup>
	useHead({
		title: 'Verify Email',
		meta: [
			{ name: 'description', content: 'Verify Email to complete registration process' },
			{ property: 'og:title', content: 'Verify Email' },
			{ property: 'og:description', content: 'Verify Email to complete registration process' },
			{ name: 'twitter:title', content: 'Verify Email' },
			{ name: 'twitter:description', content: 'Verify Email to complete registration process' }
		]
	})

	const router = useRouter()
	const gotEmail = ref(false)
	const emailInp = ref('')
	const codeInp = ref('')
	const sending = ref(false)

	function editMail() {
		gotEmail.value = false
		codeInp.value = ''
		sending.value = false
	}

	async function submit() {
		if (sending.value) return
		sending.value = true

		try {
			const got = await $fetch('/api/verify_email', {
				method: 'POST',
				body: { email: emailInp.value, code: codeInp.value || undefined }
			})

			if (got.status === 'notVerified') {
				if (!gotEmail.value) gotEmail.value = true

				if (got.refreshed) setNoti('Sent you a new code in your email. Check your email and enter that code.')
				else if (!got.noCode) setNoti('Your provided code is wrong')

				sending.value = false
				return
			}
			if (got.status === 'notRegistered') {
				setNoti(`You don't have an account with that email. Register now.`)
				return router.push({ path: '/register' })
			}
			if (got.status === 'alreadyVerified') {
				setNoti(`Your email is already verified. Login now.`)
				return router.push({ path: '/login' })
			}
			if (got.status === 'success') {
				setNoti('Successfully verified. Please login.')
				return router.push({ path: '/login' })
			}

			return showError({ statusCode: 500, message: 'Invalid response.' })
		} catch (e) {
			return showError(e)
		}
	}
</script>
