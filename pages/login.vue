<template>
	<main class="grid items-center justify-items-center p-2">
		<form @submit.prevent="submit" class="w-full max-w-[35rem] bg-theme-color-300 p-4 rounded border-theme-color-500 border-2 grid gap-2 shadow-md grid-cols-[auto_1fr] items-center">
			<h1 class="w-fit mx-auto px-4 pb-1 border-b-2 border-theme-color-500 text-lg font-semibold col-[1/-1]">Login</h1>
			<label for="email">Email:</label>
			<input type="email" id="email" class="px-1 rounded transition-shadow focus:shadow-md" placeholder="Enter your email address" required minlength="8" v-model="emailInp" :disabled="sending" />
			<label for="pass">Password:</label>
			<input type="password" id="pass" class="px-1 rounded transition-shadow focus:shadow-md" placeholder="Enter your password" required minlength="6" v-model="passInp" :disabled="sending" />
			<input type="checkbox" v-model="stayInp" class="justify-self-end accent-theme-color-500" id="stay" />
			<label for="stay" class="select-none">Stay logged in</label>
			<button class="bg-theme-color-500 w-fit mx-auto col-[1/-1] px-2 py-1 rounded hover:shadow-md transition-shadow" :disabled="sending">Login</button>
			<p class="col-[1/-1] text-center">Don't have an account? <NuxtLink href="/register" class="text-theme-color-800 underline">Register Now</NuxtLink></p>
		</form>
	</main>
</template>

<script setup>
	useHead({
		title: 'Login',
		meta: [
			{ name: 'description', content: 'Login to your account to create and modify list.' },
			{ property: 'og:title', content: 'Login' },
			{ property: 'og:description', content: 'Login to your account to create and modify list.' },
			{ name: 'twitter:title', content: 'Login' },
			{ name: 'twitter:description', content: 'Login to your account to create and modify list.' }
		]
	})

	const router = useRouter()

	const emailInp = ref('')
	const passInp = ref('')
	const stayInp = ref(false)

	const sending = ref(false)
	async function submit() {
		if (sending.value) return
		sending.value = true

		try {
			const got = await $fetch('/api/login', {
				method: 'POST',
				responseType: 'json',
				body: {
					email: emailInp.value,
					pass: passInp.value,
					stay: stayInp.value
				}
			})

			if (got.status === 'wrongPass') setNoti(`You've provided wrong password.`)
			else if (got.status === 'notRegistered') setNoti(`You don't have an account with that email. Register now.`)
			else if (got.status === 'success') {
				setNoti('Login successful')
				router.push({ path: '/list' })
			} else showError({ statusCode: 500, message: 'Invalid response.' })
		} catch (e) {
			showError(e)
		}
		sending.value = false
	}
</script>
