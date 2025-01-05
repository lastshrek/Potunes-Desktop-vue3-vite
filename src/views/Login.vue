<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:33:34
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-05 12:09:22
 * @FilePath     : /src/views/Login.vue
 * @Description  : Login Page
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:33:34
-->
<template>
	<div class="h-screen w-screen flex items-center justify-center bg-black">
		<Card class="w-[380px] border border-gray-800/50 bg-black/95 backdrop-blur-xl">
			<CardHeader>
				<CardTitle class="text-2xl font-bold text-white">登录</CardTitle>
				<CardDescription class="text-gray-400">使用手机号码登录您的账号</CardDescription>
			</CardHeader>
			<CardContent>
				<form @submit.prevent="handleSubmit">
					<div class="grid w-full items-center gap-4">
						<!-- 手机号输入 -->
						<div class="flex flex-col space-y-1.5">
							<Label for="phone" class="text-gray-200">手机号码</Label>
							<div class="flex gap-2">
								<Input
									id="phone"
									v-model="phone"
									placeholder="请输入手机号码"
									class="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
									:class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.phone }"
								/>
							</div>
							<p class="text-sm text-red-500" v-if="errors.phone">
								{{ errors.phone }}
							</p>
						</div>

						<!-- 验证码输入 -->
						<div class="flex flex-col space-y-1.5">
							<Label for="code" class="text-gray-200">验证码</Label>
							<div class="flex gap-2">
								<Input
									id="code"
									v-model="code"
									placeholder="请输入验证码"
									class="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
									:class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.code }"
								/>
								<Button
									type="button"
									:variant="isCountingDown ? 'secondary' : 'outline'"
									:disabled="isCountingDown || !isPhoneValid"
									@click="handleGetCode"
									class="whitespace-nowrap border-gray-800 hover:bg-[#da5597] hover:text-white transition-colors"
									:class="{
										'bg-gray-900/50 text-gray-400': isCountingDown,
										'text-gray-200': !isCountingDown,
									}"
								>
									{{ countDownText }}
								</Button>
							</div>
							<p class="text-sm text-red-500" v-if="errors.code">
								{{ errors.code }}
							</p>
						</div>
					</div>

					<Button class="w-full mt-6 bg-[#da5597] hover:bg-[#da5597]/90 text-white" type="submit" :disabled="isLoading">
						<Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
						{{ isLoading ? '登录中...' : '登录' }}
					</Button>
				</form>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'

const router = useRouter()
const { toast } = useToast()

const phone = ref('')
const code = ref('')
const isLoading = ref(false)
const countdown = ref(0)
const errors = ref({
	phone: '',
	code: '',
})

// 验证手机号格式
const isPhoneValid = computed(() => {
	return /^1[3-9]\d{9}$/.test(phone.value)
})

// 倒计时文本
const countDownText = computed(() => {
	if (countdown.value === 0) return '获取验证码'
	return `${Math.floor(countdown.value / 60)}:${(countdown.value % 60).toString().padStart(2, '0')}`
})

// 是否在倒计时
const isCountingDown = computed(() => countdown.value > 0)

// 获取验证码
const handleGetCode = async () => {
	if (!isPhoneValid.value) {
		errors.value.phone = '请输入正确的手机号码'
		return
	}

	try {
		// TODO: 调用获取验证码 API
		toast({
			title: '验证码已发送',
			description: `验证码已发送至 ${phone.value}`,
		})

		// 开始倒计时 3分钟
		countdown.value = 180
		const timer = setInterval(() => {
			countdown.value--
			if (countdown.value === 0) {
				clearInterval(timer)
			}
		}, 1000)
	} catch (error) {
		toast({
			variant: 'destructive',
			title: '发送失败',
			description: '获取验证码失败，请稍后重试',
		})
	}
}

// 提交表单
const handleSubmit = async () => {
	// 重置错误
	errors.value = {
		phone: '',
		code: '',
	}

	// 表单验证
	if (!isPhoneValid.value) {
		errors.value.phone = '请输入正确的手机号码'
		return
	}
	if (!code.value) {
		errors.value.code = '请输入验证码'
		return
	}

	isLoading.value = true
	try {
		// TODO: 调用登录 API
		await new Promise(resolve => setTimeout(resolve, 1000))

		toast({
			title: '登录成功',
			description: '欢迎回来！',
		})

		router.push('/')
	} catch (error) {
		toast({
			variant: 'destructive',
			title: '登录失败',
			description: '手机号或验证码错误',
		})
	} finally {
		isLoading.value = false
	}
}
</script>

<style scoped>
/* 自定义输入框聚焦时的效果 */
:deep(.input:focus) {
	box-shadow: none;
	border-color: #da5597;
}

/* 自定义按钮禁用状态 */
:deep(.button:disabled) {
	opacity: 0.7;
	cursor: not-allowed;
}

/* 添加卡片悬停效果 */
:deep(.card) {
	transition: border-color 0.3s ease;
}

:deep(.card:hover) {
	border-color: #da5597/30;
}
</style>
