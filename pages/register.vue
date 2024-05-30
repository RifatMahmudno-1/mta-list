<template>
	<main class="grid items-center justify-items-center p-2">
		<form @submit.prevent="submit" class="w-full max-w-[35rem] bg-theme-color-300 p-4 rounded border-theme-color-500 border-2 grid gap-2 shadow-md grid-cols-[auto_1fr] items-center" spellcheck="false">
			<h1 class="w-fit mx-auto px-4 pb-1 border-b-2 border-theme-color-500 text-lg font-semibold col-[1/-1]">Register</h1>
			<label for="name">Name:</label>
			<input type="text" id="name" class="px-1 rounded transition-shadow focus:shadow-md" placeholder="Enter your fullname" required minlength="4" v-model="nameInp" :disabled="sending" />
			<label for="email">Email:</label>
			<input type="email" id="email" class="px-1 rounded transition-shadow focus:shadow-md" placeholder="Enter your email address" required minlength="8" v-model="emailInp" :disabled="sending" />
			<label for="pass">Password:</label>
			<input type="password" id="pass" class="px-1 rounded transition-shadow focus:shadow-md" placeholder="Enter new password" required minlength="6" v-model="passInp" :disabled="sending" />
			<label for="re_pass">&nbsp;</label>
			<input type="password" id="re_pass" class="px-1 rounded transition-shadow focus:shadow-md" placeholder="Retype that password" required minlength="6" v-model="re_passInp" @input="comparePass" :disabled="sending" />
			<button type="submit" class="bg-theme-color-500 w-fit mx-auto col-[1/-1] px-2 py-1 rounded hover:shadow-md transition-shadow" :disabled="sending">Register</button>
			<p class="col-[1/-1] text-center">Already have an account? <NuxtLink href="/login" class="text-theme-color-800 underline">Login Now</NuxtLink></p>
		</form>
	</main>
</template>

<script setup>
	useHead({
		title: 'Register',
		meta: [
			{ name: 'description', content: 'Register for an account to create and modify list' },
			{ property: 'og:title', content: 'Register' },
			{ property: 'og:description', content: 'Register for an account to create and modify list' },
			{ name: 'twitter:title', content: 'Register' },
			{ name: 'twitter:description', content: 'Register for an account to create and modify list' }
		]
	})

	const router = useRouter()

	const nameInp = ref('')
	const emailInp = ref('')
	const passInp = ref('')
	const re_passInp = ref('')

	const sending = ref(false)
	async function submit() {
		if (sending.value) return
		sending.value = true

		try {
			const got = await $fetch('/api/register', {
				method: 'POST',
				responseType: 'json',
				body: {
					name: nameInp.value,
					email: emailInp.value,
					pass: passInp.value
				}
			})

			if (got.status === 'alreadyRegistered') {
				setNoti(`You already have an account with that email. Please login.`)
				router.push({ path: '/login' })
			} else if (got.status === 'mailNotVerified') {
				setNoti(`Please verify your email address.`)
				router.push({ path: '/verify_email' })
			} else if (got.status === 'success') {
				setNoti('Successfully registered. Please verify your email address.')
				router.push({ path: '/verify_email' })
			} else showError({ statusCode: 500, message: 'Invalid response.' })
		} catch (e) {
			showError(e)
		}
		sending.value = false
	}

	function comparePass(e) {
		if (passInp.value !== re_passInp.value) e.target.setCustomValidity("Passwords didn't match")
		else e.target.setCustomValidity('')
	}
</script>
