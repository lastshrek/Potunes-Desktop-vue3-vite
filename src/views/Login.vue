<template>
	<div class="h-screen w-screen flex items-center justify-center bg-black">
		<Card class="w-[420px] border border-gray-800/50 bg-black/95 backdrop-blur-xl">
			<CardHeader class="pb-4">
				<CardTitle class="text-2xl font-bold text-white text-center">PoTunes</CardTitle>
				<CardDescription class="text-gray-400 text-center">
					{{ activeTab === 'login' ? 'Sign in to your account' : activeTab === 'register' ? 'Create a new account' : 'Reset your password' }}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<!-- Tabs -->
				<div class="flex border-b border-gray-800 mb-6">
					<button
						v-for="tab in tabs"
						:key="tab.key"
						class="flex-1 pb-2 text-sm font-medium transition-colors"
						:class="activeTab === tab.key ? 'text-[#da5597] border-b-2 border-[#da5597]' : 'text-gray-500 hover:text-gray-300'"
						@click="activeTab = tab.key"
					>
						{{ tab.label }}
					</button>
				</div>

				<!-- Error -->
				<div v-if="error" class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
					{{ error }}
				</div>

				<!-- Login form -->
				<form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
					<div class="space-y-4">
						<div>
							<Label class="text-gray-200 text-sm">Username or phone</Label>
							<Input
								v-model="loginForm.account"
								placeholder="Enter username or phone"
								class="mt-1 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
							/>
						</div>
						<div>
							<Label class="text-gray-200 text-sm">Password</Label>
							<Input
								v-model="loginForm.password"
								type="password"
								placeholder="Enter password"
								class="mt-1 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
							/>
						</div>
						<Button class="w-full bg-[#da5597] hover:bg-[#da5597]/90 text-white" type="submit" :disabled="isLoading">
							<Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
							{{ isLoading ? 'Signing in...' : 'Sign in' }}
						</Button>
					</div>
				</form>

				<!-- Register form -->
				<form v-if="activeTab === 'register'" @submit.prevent="handleRegister">
					<div class="space-y-4">
						<div>
							<Label class="text-gray-200 text-sm">Username</Label>
							<Input
								v-model="registerForm.username"
								placeholder="4-20 characters"
								class="mt-1 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
							/>
						</div>
						<div>
							<Label class="text-gray-200 text-sm">Password</Label>
							<Input
								v-model="registerForm.password"
								type="password"
								placeholder="At least 6 characters"
								class="mt-1 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
							/>
						</div>
						<div>
							<Label class="text-gray-200 text-sm">Confirm password</Label>
							<Input
								v-model="registerForm.confirmPassword"
								type="password"
								placeholder="Repeat password"
								class="mt-1 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
							/>
						</div>
						<div class="flex items-center gap-2">
							<input
								id="bindPhone"
								type="checkbox"
								v-model="registerForm.bindPhone"
								class="rounded border-gray-700 bg-gray-900 text-[#da5597] focus:ring-[#da5597]"
							/>
							<Label for="bindPhone" class="text-gray-400 text-sm cursor-pointer">Bind existing phone number</Label>
						</div>
						<div v-if="registerForm.bindPhone">
							<Label class="text-gray-200 text-sm">Old phone number</Label>
							<Input
								v-model="registerForm.oldPhone"
								placeholder="Enter phone number"
								class="mt-1 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
							/>
						</div>
						<Button class="w-full bg-[#da5597] hover:bg-[#da5597]/90 text-white" type="submit" :disabled="isLoading">
							<Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
							{{ isLoading ? 'Creating account...' : 'Create account' }}
						</Button>
					</div>
				</form>

				<!-- Forgot password form -->
				<form v-if="activeTab === 'forgot'" @submit.prevent="handleResetPassword">
					<div class="space-y-4">
						<div>
							<Label class="text-gray-200 text-sm">Phone number</Label>
							<Input
								v-model="forgotForm.phone"
								placeholder="Enter registered phone number"
								class="mt-1 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
							/>
						</div>
						<div>
							<Label class="text-gray-200 text-sm">New password</Label>
							<Input
								v-model="forgotForm.password"
								type="password"
								placeholder="At least 6 characters"
								class="mt-1 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
							/>
						</div>
						<div>
							<Label class="text-gray-200 text-sm">Confirm new password</Label>
							<Input
								v-model="forgotForm.confirmPassword"
								type="password"
								placeholder="Repeat new password"
								class="mt-1 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
							/>
						</div>
						<Button class="w-full bg-[#da5597] hover:bg-[#da5597]/90 text-white" type="submit" :disabled="isLoading">
							<Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
							{{ isLoading ? 'Resetting...' : 'Reset password' }}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { resetPassword } from '@/api'
import { useAuthStore } from '@/store/modules/auth'
import { sha256 } from '@/utils/crypto'

const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const tabs = [
	{ key: 'login', label: 'Sign in' },
	{ key: 'register', label: 'Sign up' },
	{ key: 'forgot', label: 'Reset' },
]
const activeTab = ref('login')
const isLoading = ref(false)
const error = ref('')

const loginForm = reactive({ account: '', password: '' })
const registerForm = reactive({ username: '', password: '', confirmPassword: '', bindPhone: false, oldPhone: '' })
const forgotForm = reactive({ phone: '', password: '', confirmPassword: '' })

const handleLogin = async () => {
	error.value = ''
	const { account, password } = loginForm
	if (!account) { error.value = 'Please enter username or phone'; return }
	if (!password) { error.value = 'Please enter password'; return }
	isLoading.value = true
	try {
		await auth.login(account, password)
		toast.success('Welcome back!')
		router.push('/')
	} catch (e: any) {
		error.value = e?.message || 'Login failed'
	} finally {
		isLoading.value = false
	}
}

const handleRegister = async () => {
	error.value = ''
	const { username, password, confirmPassword, bindPhone, oldPhone } = registerForm
	if (!username || username.length < 4 || username.length > 20) {
		error.value = 'Username must be 4-20 characters'; return
	}
	if (password.length < 6) { error.value = 'Password must be at least 6 characters'; return }
	if (password !== confirmPassword) { error.value = 'Passwords do not match'; return }
	if (bindPhone && !oldPhone) { error.value = 'Please enter your phone number'; return }
	isLoading.value = true
	try {
		await auth.register(username, password, bindPhone ? oldPhone : undefined)
		toast.success('Account created!')
		router.push('/')
	} catch (e: any) {
		error.value = e?.message || 'Registration failed'
	} finally {
		isLoading.value = false
	}
}

const handleResetPassword = async () => {
	error.value = ''
	const { phone, password, confirmPassword } = forgotForm
	if (!phone) { error.value = 'Please enter your phone number'; return }
	if (password.length < 6) { error.value = 'Password must be at least 6 characters'; return }
	if (password !== confirmPassword) { error.value = 'Passwords do not match'; return }
	isLoading.value = true
	try {
		const hashed = await sha256(password)
		await resetPassword(phone, hashed)
		toast.success('Password reset successfully. Please sign in.')
		activeTab.value = 'login'
		forgotForm.password = ''
		forgotForm.confirmPassword = ''
	} catch (e: any) {
		error.value = e?.message || 'Reset failed'
	} finally {
		isLoading.value = false
	}
}
</script>
