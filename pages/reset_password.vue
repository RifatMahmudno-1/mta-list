<template>
	<main class="grid items-center justify-items-center p-2">
		<form class="w-full max-w-[35rem] bg-theme-color-300 p-4 rounded border-theme-color-500 border-2 grid gap-2 shadow-md grid-cols-[auto_1fr] items-center" spellcheck="false" @submit.prevent="submit">
			<h1 class="w-fit mx-auto px-4 pb-1 border-b-2 border-theme-color-500 text-lg font-semibold col-[1/-1]">Reset Password</h1>
			<p class="col-[1/-1] text-center" v-if="gotEmail">Enter the code sent to your email</p>
			<label for="email">Email:</label>
			<div class="flex gap-2">
				<input type="email" id="email" class="w-full px-1 rounded transition-shadow focus:shadow-md" placeholder="Enter your email address" required minlength="8" v-model="emailInp" :disabled="gotEmail || sending" />
				<button v-if="gotEmail" type="button" :disabled="sending" class="bg-theme-color-500 rounded px-1" @click="editMail"><IconEdit /></button>
			</div>
			<button v-if="!gotEmail" type="submit" class="bg-theme-color-500 w-fit mx-auto col-[1/-1] px-2 py-1 rounded hover:shadow-md transition-shadow" :disabled="sending">Send Code</button>
			<slot v-else>
				<label for="code">Code:</label>
				<input type="text" autocomplete="off" id="code" class="px-1 rounded transition-shadow focus:shadow-md" placeholder="Enter code form email" required minlength="16" maxlength="16" v-model="codeInp" :disabled="sending" />
				<label for="pass">Password:</label>
				<input type="password" id="pass" class="px-1 rounded transition-shadow focus:shadow-md" placeholder="Enter new password" required minlength="6" v-model="passInp" :disabled="sending" />
				<label for="re_pass">&nbsp;</label>
				<input type="password" id="re_pass" class="px-1 rounded transition-shadow focus:shadow-md" placeholder="Retype that password" required minlength="6" v-model="re_passInp" @input="comparePass" :disabled="sending" />
				<button type="submit" class="bg-theme-color-500 w-fit mx-auto col-[1/-1] px-2 py-1 rounded hover:shadow-md transition-shadow" :disabled="sending">Change Password</button>
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
		title: 'Reset Password',
		meta: [
			{ name: 'description', content: 'Forgot your password? No problem. Reset your password here.' },
			{ property: 'og:title', content: 'Reset Password' },
			{ property: 'og:description', content: 'Forgot your password? No problem. Reset your password here.' },
			{ name: 'twitter:title', content: 'Reset Password' },
			{ name: 'twitter:description', content: 'Forgot your password? No problem. Reset your password here.' }
		]
	})

	const router = useRouter()
	const gotEmail = ref(false)
	const emailInp = ref('')
	const passInp = ref('')
	const re_passInp = ref('')
	const codeInp = ref('')
	const sending = ref(false)

	function editMail() {
		gotEmail.value = false
		passInp.value = ''
		re_passInp.value = ''
		codeInp.value = ''
		sending.value = false
	}

	async function submit() {
		if (sending.value) return
		sending.value = true

		try {
			const got = await $fetch('/api/reset_password', {
				method: 'POST',
				body: {
					email: emailInp.value,
					code: codeInp.value || undefined,
					pass: passInp.value || undefined
				}
			})

			if (got.status === 'notSuccess') {
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
			if (got.status === 'mailNotVerified') {
				setNoti(`Please verify your email address.`)
				return router.push({ path: '/verify_email' })
			}
			if (got.status === 'success') {
				setNoti('Successfully changed password. Login now with that new password.')
				return router.push({ path: '/login' })
			}

			return showError({ statusCode: 500, message: 'Invalid response.' })
		} catch (e) {
			return showError(e)
		}
	}

	function comparePass(e) {
		if (passInp.value !== re_passInp.value) e.target.setCustomValidity("Passwords didn't match")
		else e.target.setCustomValidity('')
	}
</script>
