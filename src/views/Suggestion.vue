<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:30:59
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-25 21:24:09
 * @FilePath     : /src/views/Suggestion.vue
 * @Description  : Suggestions
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:30:59
-->
<template>
	<div class="min-h-screen pt-16 pb-24 w-full bg-black">
		<!-- 悬浮标题 -->
		<div class="fixed top-16 left-44 right-0 z-10 bg-black/90 backdrop-blur-sm border-b border-gray-800">
			<div class="px-4 py-4">
				<h1 class="text-white text-2xl font-bold album-title">Advices - 建议反馈</h1>
			</div>
		</div>
		<div class="container mx-auto px-6 pt-20 flex flex-col items-center">
			<form @submit.prevent="handleSubmit" class="w-full max-w-2xl">
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-400 mb-2 player-text">Your Advices</label>
						<textarea
							v-model="suggestion"
							rows="6"
							class="w-full rounded-lg bg-gray-800 border-gray-700 text-white resize-none p-3 focus:ring-[#da5597] focus:border-[#da5597] player-text"
							placeholder="Please enter your suggestions or feedback..."
						></textarea>
					</div>
					<div class="flex justify-end">
						<button
							type="submit"
							:disabled="isSubmitting || !suggestion.trim()"
							class="bg-[#da5597] text-white px-6 py-2 rounded-full hover:bg-[#da5597]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 player-text"
						>
							<span v-if="isSubmitting">Submitting...</span>
							<span v-else>Submit</span>
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const suggestion = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
	if (!suggestion.value.trim()) return

	isSubmitting.value = true
	try {
		// TODO: 实现提交建议的 API 调用
		await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟 API 调用
		toast.success('感谢您的建议！')
		suggestion.value = ''
	} catch (error) {
		toast.error('提交失败，请稍后重试')
	} finally {
		isSubmitting.value = false
	}
}
</script>

<style scoped>
.album-title {
	font-family: 'Outfit', sans-serif;
}

.player-text {
	font-family: 'Inter', sans-serif;
}
</style>
