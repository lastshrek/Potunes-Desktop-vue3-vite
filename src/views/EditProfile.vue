<template>
	<div class="min-h-screen w-full bg-[#121212] overflow-auto pt-16 pb-16">
		<div class="max-w-2xl mx-auto p-8">
			<div class="bg-[#1A1A1A] rounded-lg shadow-lg border border-gray-800 p-8">
				<div class="mb-8">
					<h1 class="text-2xl font-semibold text-white">编辑个人资料</h1>
					<p class="text-gray-400 mt-2">更新您的个人信息</p>
				</div>

				<form @submit.prevent="handleSubmit" class="space-y-6">
					<!-- 头像上传 -->
					<div class="space-y-2">
						<Label class="text-gray-200">头像</Label>
						<div class="flex items-center gap-4">
							<div
								class="relative w-24 h-24 rounded-full overflow-hidden border border-gray-800 cursor-pointer group"
								@click="triggerFileInput"
							>
								<template v-if="form.avatar">
									<img :src="form.avatar" alt="Avatar" class="w-full h-full object-cover" />
								</template>
								<template v-else>
									<div class="w-full h-full bg-black/50 flex items-center justify-center">
										<UserCircle2 class="w-6 h-6 text-gray-500" />
									</div>
								</template>
								<div
									class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
								>
									<Upload class="w-5 h-5 text-white" />
								</div>
							</div>
							<p class="text-sm text-gray-400">点击头像更换图片</p>
						</div>
						<input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
					</div>

					<!-- 手机号 -->
					<div class="space-y-2">
						<Label for="phone" class="text-gray-200">手机号码</Label>
						<Input id="phone" v-model="form.phone" disabled class="bg-black border-gray-800 text-gray-400" />
						<p class="text-xs text-gray-500">手机号码不可修改</p>
					</div>

					<!-- 昵称 -->
					<div class="space-y-2">
						<Label for="nickname" class="text-gray-200">昵称</Label>
						<Input
							id="nickname"
							v-model="form.nickname"
							placeholder="请输入昵称"
							class="bg-black border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597]"
						/>
					</div>

					<!-- 性别 -->
					<div class="space-y-2">
						<Label class="text-gray-200">性别</Label>
						<Select v-model="form.gender">
							<SelectTrigger
								class="w-full bg-black border-gray-800 text-white focus:ring-[#da5597] focus:ring-offset-0"
							>
								<SelectValue :placeholder="form.gender ? genderMap[form.gender] : '请选择性别'" />
							</SelectTrigger>
							<SelectContent class="bg-black border-gray-800">
								<SelectGroup>
									<SelectItem value="male" class="text-white hover:bg-white/5 focus:bg-white/5 focus:text-white">
										男
									</SelectItem>
									<SelectItem value="female" class="text-white hover:bg-white/5 focus:bg-white/5 focus:text-white">
										女
									</SelectItem>
									<SelectItem value="other" class="text-white hover:bg-white/5 focus:bg-white/5 focus:text-white">
										其他
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<!-- 个性签名 -->
					<div class="space-y-2">
						<Label for="bio" class="text-gray-200">个性签名</Label>
						<Textarea
							id="bio"
							v-model="form.intro"
							placeholder="写点什么介绍一下自己吧"
							class="bg-black border-gray-800 text-white placeholder:text-gray-500 focus:border-[#da5597] focus:ring-[#da5597] min-h-[100px]"
						/>
					</div>

					<div class="flex justify-end space-x-4 pt-4">
						<Button
							type="button"
							variant="outline"
							class="border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white"
							@click="router.back()"
						>
							取消
						</Button>
						<Button type="submit" class="bg-[#da5597] hover:bg-[#da5597]/90 text-white" :disabled="isLoading">
							<Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
							{{ isLoading ? '保存中...' : '保存修改' }}
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>

	<!-- 裁剪对话框 -->
	<Dialog :open="showCropper" @update:open="showCropper = false">
		<DialogContent class="sm:max-w-[500px] bg-[#1A1A1A] border-gray-800">
			<DialogHeader>
				<DialogTitle class="text-white">裁剪头像</DialogTitle>
				<DialogDescription class="text-gray-400">调整图片大小和位置，完成后点击确认</DialogDescription>
			</DialogHeader>

			<div class="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
				<Cropper
					v-show="imageUrl"
					ref="cropperRef"
					class="cropper"
					:src="imageUrl"
					:stencil-props="{
						aspectRatio: 1,
					}"
					:resize-image="{
						touch: true,
						wheel: true,
					}"
					:default-size="{
						width: '80%',
						height: '80%',
					}"
					:default-position="{
						x: '50%',
						y: '50%',
					}"
					:transitions="true"
					:auto-zoom="true"
					:background="true"
					:adjust-stencil="true"
					:scaling="true"
					:stretching="false"
					:zoom-speed="3"
					default-boundaries="fit"
					default-visible-area="fit"
					image-restriction="fit-area"
					:stencil-component="CircleStencil"
					@change="handleCropChange"
					@ready="handleCropperReady"
				/>
			</div>

			<DialogFooter class="gap-2">
				<Button
					variant="outline"
					class="bg-transparent border border-gray-700 hover:bg-white/5 hover:text-white text-gray-300"
					@click="showCropper = false"
					:disabled="isUpdatingAvatar"
				>
					取消
				</Button>
				<Button
					class="bg-[#da5597] hover:bg-[#da5597]/90 text-white border-0"
					@click="handleCropComplete"
					:disabled="isUpdatingAvatar"
				>
					<Loader2 v-if="isUpdatingAvatar" class="mr-2 h-4 w-4 animate-spin" />
					{{ isUpdatingAvatar ? '更新中...' : '确认' }}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>

	<!-- 添加预览区域 -->
	<div v-if="previewBase64" class="fixed bottom-4 right-4 p-2 bg-black/80 rounded-lg shadow-lg z-50">
		<div class="text-xs text-gray-400 mb-2">裁剪预览</div>
		<div class="w-20 h-20 rounded-full overflow-hidden border border-gray-700">
			<img :src="previewBase64" alt="Preview" class="w-full h-full object-cover" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, Upload, UserCircle2 } from 'lucide-vue-next'
import { toast } from '@/components/ui/toast'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { handlePromise } from '@/utils'
import { updateUserAvatar, updateUserInfo } from '@/api'

const router = useRouter()
const isLoading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const showCropper = ref(false)
const imageUrl = ref('')
const cropResult = ref<any>(null)

const form = ref({
	phone: '',
	nickname: '',
	intro: '',
	gender: '',
	avatar: '',
})

const cropperRef = ref<any>(null)

// 添加头像更新状态
const isUpdatingAvatar = ref(false)

// 添加预览状态
const previewBase64 = ref('')

// 触发文件选择
const triggerFileInput = () => {
	fileInput.value?.click()
}

// 处理文件选择
const handleFileChange = async (event: Event) => {
	const input = event.target as HTMLInputElement
	if (input.files && input.files[0]) {
		try {
			isUpdatingAvatar.value = true
			const file = input.files[0]

			// 创建图片元素
			const img = new Image()
			img.src = URL.createObjectURL(file)

			// 等待图片加载
			await new Promise((resolve, reject) => {
				img.onload = resolve
				img.onerror = reject
			})

			// 创建 canvas
			const canvas = document.createElement('canvas')
			canvas.width = 200
			canvas.height = 200

			const ctx = canvas.getContext('2d')
			if (!ctx) {
				throw new Error('创建画布失败')
			}

			// 填充黑色背景
			ctx.fillStyle = '#000000'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			// 计算绘制位置和尺寸
			const scale = Math.min(200 / img.width, 200 / img.height)
			const width = img.width * scale
			const height = img.height * scale
			const x = (200 - width) / 2
			const y = (200 - height) / 2

			// 绘制图片
			ctx.drawImage(img, x, y, width, height)

			// 转换为 base64
			const base64 = canvas.toDataURL('image/jpeg', 0.95)

			// 调用更新头像接口
			const [res, error] = await handlePromise(updateUserAvatar(base64))
			if (error) {
				throw error
			}
			if (!res) {
				throw new Error('更新头像失败')
			}

			// 更新本地存储
			const userData = JSON.parse(localStorage.getItem('user') || '{}')
			userData.avatar = base64
			localStorage.setItem('user', JSON.stringify(userData))

			// 更新表单
			form.value = {
				...form.value,
				avatar: base64,
			}

			// 触发更新事件
			window.dispatchEvent(
				new CustomEvent('user-updated', {
					detail: {
						avatar: base64,
					},
				})
			)

			// 显示成功提示
			toast({
				title: '更新成功',
				description: '头像已更新',
			})
		} catch (error) {
			console.error('Error processing image:', error)
			toast({
				variant: 'destructive',
				title: '更新失败',
				description: error instanceof Error ? error.message : '头像更新失败，请重试',
			})
		} finally {
			isUpdatingAvatar.value = false
			input.value = '' // 清空 input
		}
	}
}

// 处理裁剪变化
const handleCropChange = (data: any) => {
	cropResult.value = data
}

// 修改裁剪器就绪处理函数
const handleCropperReady = () => {
	if (cropperRef.value) {
		// 强制更新裁剪区域并设置初始缩放
		cropperRef.value.refresh()
		cropperRef.value.zoom(1) // 设置初始缩放比例
		cropperRef.value.moveToCenter() // 移动到中心
	}
}

// 处理裁剪完成
const handleCropComplete = async () => {
	try {
		isUpdatingAvatar.value = true

		if (!cropperRef.value) {
			throw new Error('裁剪器未初始化')
		}

		// 获取裁剪结果和实际图片尺寸
		const { coordinates } = cropperRef.value.getResult()
		const imageSize = cropperRef.value.getImageSize()

		if (!coordinates || !imageSize) {
			throw new Error('获取裁剪结果失败')
		}

		// 创建 canvas
		const canvas = document.createElement('canvas')
		canvas.width = 200
		canvas.height = 200
		const ctx = canvas.getContext('2d')

		if (!ctx) {
			throw new Error('创建画布失败')
		}

		// 创建图片元素
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.src = imageUrl.value

		// 等待图片加载
		await new Promise((resolve, reject) => {
			img.onload = () => {
				try {
					// 计算实际的裁剪坐标和尺寸
					const scaleX = img.naturalWidth / imageSize.width
					const scaleY = img.naturalHeight / imageSize.height

					// 计算裁剪区域
					const cropX = coordinates.left * scaleX
					const cropY = coordinates.top * scaleY
					const cropWidth = coordinates.width * scaleX
					const cropHeight = coordinates.height * scaleY

					// 清除画布
					ctx.clearRect(0, 0, canvas.width, canvas.height)

					// 绘制裁剪后的图像
					ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height)

					resolve(true)
				} catch (error) {
					reject(error)
				}
			}
			img.onerror = () => reject(new Error('图片加载失败'))
		})

		// 转换为 base64
		const base64 = canvas.toDataURL('image/jpeg', 0.95)

		// 验证 base64 数据
		if (!base64.startsWith('data:image/')) {
			throw new Error('生成的图片数据无效')
		}

		// 预览裁剪结果
		previewBase64.value = base64
		// 调用更新头像接口
		const [res, error] = await handlePromise(updateUserAvatar(base64))
		if (error) {
			throw error
		}
		if (!res) {
			throw new Error('更新头像失败')
		}

		// 更新本地存储
		const userData = JSON.parse(localStorage.getItem('user') || '{}')
		userData.avatar = base64 // 先使用本地 base64，等服务器返回 URL 后再更新
		localStorage.setItem('user', JSON.stringify(userData))

		// 更新表单
		form.value = {
			...form.value,
			avatar: base64,
		}
		// 更新存储后触发事件
		window.dispatchEvent(
			new CustomEvent('user-updated', {
				detail: {
					avatar: base64,
				},
			})
		)

		// 关闭对话框
		showCropper.value = false
		imageUrl.value = ''

		// 显示成功提示
		toast({
			title: '更新成功',
			description: '头像已更新',
		})

		// 清除预览
		setTimeout(() => {
			previewBase64.value = ''
		}, 3000)
	} catch (error) {
		console.error('Error processing image:', error)
		toast({
			variant: 'destructive',
			title: '更新失败',
			description: error instanceof Error ? error.message : '头像更新失败，请重试',
		})
	} finally {
		isUpdatingAvatar.value = false
	}
}

onMounted(() => {
	// 加载用户数据
	const userData = JSON.parse(localStorage.getItem('user') || '{}')
	form.value = {
		phone: userData.phone || '',
		nickname: userData.nickname || '',
		intro: userData.intro || '',
		gender: userData.gender || '',
		avatar: userData.avatar || '',
	}
})

const handleSubmit = async () => {
	isLoading.value = true
	try {
		await new Promise(resolve => setTimeout(resolve, 1000))

		const userData = JSON.parse(localStorage.getItem('user') || '{}')
		const updatedUser = {
			...userData,
			nickname: form.value.nickname,
			intro: form.value.intro,
			gender: form.value.gender,
			avatar: form.value.avatar,
		}
		localStorage.setItem('user', JSON.stringify(updatedUser))
		const [ures] = await handlePromise(updateUserInfo(updatedUser))
		if (!ures) return
		toast({
			title: '保存成功',
			description: '个人资料已更新',
		})

		router.back()
	} catch (error) {
		toast({
			variant: 'destructive',
			title: '保存失败',
			description: '请稍后重试',
		})
	} finally {
		isLoading.value = false
	}
}

// 添加性别映射
const genderMap: Record<string, string> = {
	male: '男',
	female: '女',
	other: '其他',
}
</script>

<style scoped>
/* 修改下拉菜单样式 */
:deep(.select-content) {
	@apply bg-black border-gray-800;
}

:deep(.select-item) {
	@apply text-white hover:bg-white/5 focus:bg-white/5;
}

:deep(.select-trigger) {
	@apply bg-black border-gray-800 text-white;
}

:deep(.select-trigger:focus) {
	@apply ring-[#da5597] ring-offset-0;
}

/* 添加输入框和文本域的黑色背景 */
:deep(.input),
:deep(.textarea) {
	@apply bg-black;
}

/* 添加滚动条样式 */
.overflow-auto {
	scrollbar-width: thin;
	scrollbar-color: #333 transparent;
	-webkit-overflow-scrolling: touch;
}

.overflow-auto::-webkit-scrollbar {
	width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
	background: transparent;
}

.overflow-auto::-webkit-scrollbar-thumb {
	background-color: #333;
	border-radius: 3px;
}

/* 修改裁剪器样式 */
.cropper {
	width: 100%;
	height: 100%;
	background: #000;
}

:deep(.vue-advanced-cropper) {
	background: #000;
	display: flex;
	align-items: center;
	justify-content: center;
}

:deep(.vue-advanced-cropper__foreground) {
	border-radius: 50%;
}

:deep(.vue-advanced-cropper__boundary) {
	border-radius: 50%;
}

:deep(.vue-advanced-cropper__image) {
	max-width: 100% !important;
	max-height: 100% !important;
	width: auto !important;
	height: auto !important;
	object-fit: contain !important;
	position: relative !important;
	transform: none !important;
}

:deep(.vue-advanced-cropper__background) {
	background: #000 !important;
}

:deep(.vue-advanced-cropper__stretcher) {
	aspect-ratio: 1 !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
}

/* 添加预览区域过渡效果 */
.fixed {
	transition: all 0.3s ease-in-out;
}
</style>
