import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, register as registerApi, registerWithBind } from '@/api'
import { sha256 } from '@/utils/crypto'
import { emitter } from '@/utils/mitt'
import type { User, LoginResponse } from '@/interfaces/user'

function loadStoredUser(): User | null {
	try {
		const raw = localStorage.getItem('user')
		return raw ? JSON.parse(raw) : null
	} catch { return null }
}

export const useAuthStore = defineStore('auth', () => {
	const token = ref(localStorage.getItem('token') || '')
	const user = ref<User | null>(loadStoredUser())

	const isLoggedIn = computed(() => !!token.value)
	const userId = computed(() => user.value?.id || 0)
	const nickname = computed(() => user.value?.nickname || user.value?.username || '')
	const avatar = computed(() => user.value?.avatar || '')

	function persist() {
		if (token.value) {
			localStorage.setItem('token', token.value)
		} else {
			localStorage.removeItem('token')
		}
		if (user.value) {
			localStorage.setItem('user', JSON.stringify(user.value))
		} else {
			localStorage.removeItem('user')
		}
	}

	async function login(account: string, password: string) {
		const hashed = await sha256(password)
		const res = await loginApi(account, hashed) as LoginResponse
		const data = res
		token.value = data.token
		user.value = data.user
		persist()
		emitter.emit('login-success', data.user)
		window.dispatchEvent(new CustomEvent('user-login', { detail: { user: data.user } }))
	}

	async function register(username: string, password: string, oldPhone?: string) {
		const hashed = await sha256(password)
		const res = oldPhone
			? await registerWithBind(username, hashed, oldPhone) as LoginResponse
			: await registerApi(username, hashed) as LoginResponse
		const data = res
		token.value = data.token
		user.value = data.user
		persist()
		emitter.emit('login-success', data.user)
		window.dispatchEvent(new CustomEvent('user-login', { detail: { user: data.user } }))
	}

	function logout() {
		token.value = ''
		user.value = null
		persist()
		emitter.emit('logout')
	}

	function setUser(data: User) {
		user.value = data
		persist()
	}

	return { token, user, isLoggedIn, userId, nickname, avatar, login, register, logout, setUser }
})
