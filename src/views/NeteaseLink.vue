<template>
	<div class="grid place-items-center min-h-screen w-full">
		<div class="w-full max-w-md p-8 bg-[#1A1A1A] rounded-lg shadow-lg border border-gray-800">
			<h1 class="text-2xl font-semibold text-white text-center mb-4">扫码登录网易云</h1>
			<p class="text-gray-400 text-center mb-8">请使用网易云音乐 App 扫码登录</p>

			<div class="flex items-center justify-center">
				<div v-if="isLoading" class="flex items-center justify-center w-64 h-64">
					<Loader2 class="h-8 w-8 animate-spin text-[#da5597]" />
				</div>
				<div v-else class="w-64 h-64 bg-white p-4 rounded-lg">
					<img :src="qrCodeUrl" alt="QR Code" class="w-full h-full object-contain" />
				</div>
			</div>

			<div class="mt-8 flex justify-center">
				<Button variant="ghost" class="text-gray-400 hover:text-white hover:bg-white/10" @click="handleBack">
					返回
				</Button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'
import { neteaseQrCode, neteaseQrCodeStatus, neteaseLoginStatus } from '@/api'
import { handlePromise } from '@/utils'
import { toast } from '@/utils/toast'

const router = useRouter()
const isLoading = ref(true)
const qrCodeUrl = ref('')
const qrKey = ref('')
let checkStatusInterval: NodeJS.Timer | null = null

const loadQRCode = async () => {
	isLoading.value = true
	try {
		const [res] = await handlePromise(neteaseQrCode())
		if (!res) return
		qrCodeUrl.value = res.qrimg
		qrKey.value = res.key
		startStatusCheck()
	} catch (error) {
		console.error('Failed to load QR code:', error)
	} finally {
		isLoading.value = false
	}
}

const checkLoginStatus = async () => {
	if (!qrKey.value) return

	const [res] = await handlePromise(neteaseQrCodeStatus(qrKey.value))
	if (!res) return

	console.log('Login status:', res)

	switch (res.code) {
		case 800:
			// 二维码过期
			console.log('QR code expired')
			clearInterval(checkStatusInterval!)
			loadQRCode() // 重新加载二维码
			break
		case 803:
			// 登录成功
			console.log('Login successful')
			clearInterval(checkStatusInterval!)
			console.log('res.cookie', res.cookie)
			// 获取登录状态
			const [loginRes] = await handlePromise(neteaseLoginStatus(res.cookie))
			if (!loginRes) return
			console.log('Login response:', loginRes)

			try {
				// 保存用户信息和 cookie
				const user = loginRes.profile
				localStorage.setItem('netease-user', JSON.stringify(user))
				localStorage.setItem('netease-cookie', res.cookie)

				// 触发全局事件，通知 navbar 更新
				window.dispatchEvent(
					new CustomEvent('netease-login', {
						detail: {
							user,
							cookie: res.cookie,
						},
					})
				)

				// 显示成功提示
				toast({
					title: '网易云登录成功',
					description: '欢迎使用网易云音乐！',
				})

				// 确保清理定时器
				if (checkStatusInterval) {
					clearInterval(checkStatusInterval)
				}

				// 使用 nextTick 确保状态更新后再跳转
				nextTick(() => {
					router.replace('/') // 使用 replace 而不是 push，这样返回时不会回到登录页
				})
			} catch (error) {
				console.error('Error handling login success:', error)
				toast({
					variant: 'destructive',
					title: '登录失败',
					description: '处理登录信息时出错，请重试',
				})
			}
			break
	}
}

const startStatusCheck = () => {
	// 清除可能存在的旧定时器
	if (checkStatusInterval) {
		clearInterval(checkStatusInterval)
	}

	// 设置新的定时器，每秒检查一次
	checkStatusInterval = setInterval(checkLoginStatus, 1000)
}

const handleBack = () => {
	if (checkStatusInterval) {
		clearInterval(checkStatusInterval)
	}
	router.back()
}

onMounted(() => {
	qrCodeUrl.value = ''
	loadQRCode()
})

onUnmounted(() => {
	// 组件卸载时清除定时器
	if (checkStatusInterval) {
		clearInterval(checkStatusInterval)
	}
})
</script>
