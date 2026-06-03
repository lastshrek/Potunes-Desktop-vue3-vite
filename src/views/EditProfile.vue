<template>
	<div class="min-h-screen w-full bg-[#121212] flex items-center justify-center p-6">
		<div class="w-full max-w-lg mx-auto">
			<!-- 主卡片 -->
			<div class="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
				<!-- 顶部装饰区域 -->
				<div class="h-24 bg-gradient-to-r from-[#da5597]/20 via-[#da5597]/10 to-transparent relative">
					<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(218,85,151,0.08),transparent_70%)]" />
				</div>

				<div class="px-8 pb-8">
					<!-- 头像 -->
					<div class="flex justify-center -mt-12 mb-8">
						<div
							class="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#1A1A1A] cursor-pointer group"
							@click="triggerFileInput"
						>
							<template v-if="form.avatar">
								<img :src="form.avatar" alt="Avatar" class="w-full h-full object-cover" />
							</template>
							<template v-else>
								<div class="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
									<UserCircle2 class="w-10 h-10 text-gray-500" />
								</div>
							</template>
							<div
								class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
							>
								<Camera class="w-6 h-6 text-white" />
							</div>
						</div>
					</div>

					<form @submit.prevent="handleSubmit" class="space-y-6">
						<!-- 昵称 -->
						<div class="space-y-1.5">
							<Label class="text-xs font-medium text-gray-400 uppercase tracking-wider">昵称</Label>
							<Input
								v-model="form.nickname"
								placeholder="请输入昵称"
								class="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#da5597] focus:ring-[#da5597] h-11 rounded-xl"
							/>
						</div>

						<!-- 手机号 + 性别 双栏 -->
						<div class="grid grid-cols-2 gap-4">
							<div class="space-y-1.5">
								<Label class="text-xs font-medium text-gray-400 uppercase tracking-wider">手机号</Label>
								<Input
									v-model="form.phone"
									disabled
									class="bg-white/5 border-white/10 text-gray-500 h-11 rounded-xl"
								/>
							</div>
							<div class="space-y-1.5">
								<Label class="text-xs font-medium text-gray-400 uppercase tracking-wider">性别</Label>
								<Select v-model="form.gender">
									<SelectTrigger
										class="w-full bg-white/5 border-white/10 text-white h-11 rounded-xl focus:ring-[#da5597] focus:ring-offset-0"
									>
										<SelectValue :placeholder="form.gender ? genderMap[form.gender] : '请选择'" />
									</SelectTrigger>
									<SelectContent class="bg-[#1A1A1A] border-white/10">
										<SelectGroup>
											<SelectItem
												v-for="item in genderOptions"
												:key="item.value"
												:value="item.value"
												class="text-white hover:bg-white/5 focus:bg-white/5 focus:text-white"
											>
												{{ item.label }}
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>

						<!-- 个性签名 -->
						<div class="space-y-1.5">
							<Label class="text-xs font-medium text-gray-400 uppercase tracking-wider">个性签名</Label>
							<Textarea
								v-model="form.intro"
								placeholder="写点什么介绍一下自己吧"
								class="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#da5597] focus:ring-[#da5597] min-h-[100px] rounded-xl resize-none"
							/>
						</div>

						<!-- 保存按钮 -->
						<div class="pt-2">
							<Button
								type="submit"
								class="w-full bg-[#da5597] hover:bg-[#da5597]/90 text-white h-11 rounded-xl transition-all duration-300 shadow-lg shadow-[#da5597]/20"
								:disabled="isLoading"
							>
								<Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
								{{ isLoading ? '保存中...' : '保存' }}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

	<!-- 裁剪对话框 -->
	<Dialog :open="showCropper" @update:open="showCropper = false">
		<DialogContent class="sm:max-w-[500px] bg-[#1A1A1A] border-white/10">
			<DialogHeader>
				<DialogTitle class="text-white text-lg">裁剪头像</DialogTitle>
				<DialogDescription class="text-gray-400 text-sm">调整图片大小和位置，完成后点击确认</DialogDescription>
			</DialogHeader>

			<div class="relative w-full aspect-square bg-black rounded-xl overflow-hidden">
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

			<DialogFooter class="gap-2 pt-2">
				<Button
					variant="outline"
					class="flex-1 bg-transparent border border-white/10 hover:bg-white/5 hover:text-white text-gray-400 rounded-xl"
					@click="showCropper = false"
					:disabled="isUpdatingAvatar"
				>
					取消
				</Button>
				<Button
					class="flex-1 bg-[#da5597] hover:bg-[#da5597]/90 text-white border-0 rounded-xl shadow-lg shadow-[#da5597]/20"
					@click="handleCropComplete"
					:disabled="isUpdatingAvatar"
				>
					<Loader2 v-if="isUpdatingAvatar" class="mr-2 h-4 w-4 animate-spin" />
					{{ isUpdatingAvatar ? '更新中...' : '确认' }}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>

	<!-- 裁剪预览 -->
	<div
		v-if="previewBase64"
		class="fixed bottom-6 right-6 p-3 bg-[#1A1A1A]/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl z-50 transition-all duration-300"
	>
		<div class="text-xs text-gray-400 mb-2 text-center">预览</div>
		<div class="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#da5597]/50 mx-auto">
			<img :src="previewBase64" alt="Preview" class="w-full h-full object-cover" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Camera, Loader2, UserCircle2 } from 'lucide-vue-next'
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
import { toast } from '@/components/ui/toast'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { handlePromise } from '@/utils'
import { updateUserAvatar, updateUserInfo } from '@/api'
import { useAuthStore } from '@/store/modules/auth'

const router = useRouter()
const auth = useAuthStore()
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
const isUpdatingAvatar = ref(false)
const previewBase64 = ref('')

const genderOptions = [
	{ value: 'male', label: '男' },
	{ value: 'female', label: '女' },
	{ value: 'other', label: '其他' },
]

const genderMap: Record<string, string> = {
	male: '男',
	female: '女',
	other: '其他',
}

const triggerFileInput = () => {
	fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
	const input = event.target as HTMLInputElement
	if (input.files && input.files[0]) {
		try {
			isUpdatingAvatar.value = true
			const file = input.files[0]

			const img = new Image()
			img.src = URL.createObjectURL(file)
			await new Promise((resolve, reject) => {
				img.onload = resolve
				img.onerror = reject
			})

			const canvas = document.createElement('canvas')
			canvas.width = 200
			canvas.height = 200
			const ctx = canvas.getContext('2d')
			if (!ctx) throw new Error('创建画布失败')

			ctx.fillStyle = '#000000'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			const scale = Math.min(200 / img.width, 200 / img.height)
			const width = img.width * scale
			const height = img.height * scale
			const x = (200 - width) / 2
			const y = (200 - height) / 2
			ctx.drawImage(img, x, y, width, height)

			const base64 = canvas.toDataURL('image/jpeg', 0.95)
			const [res, error] = await handlePromise(updateUserAvatar(base64))
			if (error) throw error
			if (!res) throw new Error('更新头像失败')

			const userData = JSON.parse(localStorage.getItem('user') || '{}')
			userData.avatar = base64
			localStorage.setItem('user', JSON.stringify(userData))

			form.value = { ...form.value, avatar: base64 }

			window.dispatchEvent(new CustomEvent('user-updated', { detail: { avatar: base64 } }))

			toast({ title: '更新成功', description: '头像已更新' })
		} catch (error) {
			toast({
				variant: 'destructive',
				title: '更新失败',
				description: error instanceof Error ? error.message : '头像更新失败，请重试',
			})
		} finally {
			isUpdatingAvatar.value = false
			input.value = ''
		}
	}
}

const handleCropChange = (data: any) => {
	cropResult.value = data
}

const handleCropperReady = () => {
	if (cropperRef.value) {
		cropperRef.value.refresh()
		cropperRef.value.zoom(1)
		cropperRef.value.moveToCenter()
	}
}

const handleCropComplete = async () => {
	try {
		isUpdatingAvatar.value = true
		if (!cropperRef.value) throw new Error('裁剪器未初始化')

		const { coordinates } = cropperRef.value.getResult()
		const imageSize = cropperRef.value.getImageSize()
		if (!coordinates || !imageSize) throw new Error('获取裁剪结果失败')

		const canvas = document.createElement('canvas')
		canvas.width = 200
		canvas.height = 200
		const ctx = canvas.getContext('2d')
		if (!ctx) throw new Error('创建画布失败')

		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.src = imageUrl.value

		await new Promise((resolve, reject) => {
			img.onload = () => {
				try {
					const scaleX = img.naturalWidth / imageSize.width
					const scaleY = img.naturalHeight / imageSize.height
					const cropX = coordinates.left * scaleX
					const cropY = coordinates.top * scaleY
					const cropWidth = coordinates.width * scaleX
					const cropHeight = coordinates.height * scaleY
					ctx.clearRect(0, 0, canvas.width, canvas.height)
					ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height)
					resolve(true)
				} catch (error) {
					reject(error)
				}
			}
			img.onerror = () => reject(new Error('图片加载失败'))
		})

		const base64 = canvas.toDataURL('image/jpeg', 0.95)
		if (!base64.startsWith('data:image/')) throw new Error('生成的图片数据无效')

		previewBase64.value = base64
		const [res, error] = await handlePromise(updateUserAvatar(base64))
		if (error) throw error
		if (!res) throw new Error('更新头像失败')

		const userData = { ...auth.user, avatar: base64 }
		auth.setUser(userData)
		form.value = { ...form.value, avatar: base64 }

		window.dispatchEvent(new CustomEvent('user-updated', { detail: { avatar: base64 } }))

		showCropper.value = false
		imageUrl.value = ''
		toast({ title: '更新成功', description: '头像已更新' })

		setTimeout(() => { previewBase64.value = '' }, 3000)
	} catch (error) {
		toast({
			variant: 'destructive',
			title: '更新失败',
			description: error instanceof Error ? error.message : '头像更新失败，请重试',
		})
	} finally {
		isUpdatingAvatar.value = false
	}
}

function normalizeAvatar(raw: string | undefined | null): string {
	if (!raw) return ''
	if (raw.includes('data:image') && !raw.startsWith('data:')) {
		const idx = raw.indexOf('data:image')
		return raw.slice(idx)
	}
	if (raw.startsWith('data:') || raw.startsWith('http://') || raw.startsWith('https://')) return raw
	return `data:image/png;base64,${raw}`
}

onMounted(() => {
	const user = auth.user || {}
	form.value = {
		phone: user.phone || '',
		nickname: user.nickname || '',
		intro: user.intro || '',
		gender: user.gender || '',
		avatar: normalizeAvatar(user.avatar),
	}
})

const handleSubmit = async () => {
	isLoading.value = true
	try {
		await new Promise(resolve => setTimeout(resolve, 1000))

		const userData = auth.user || {}
		const updatedUser = {
			...userData,
			nickname: form.value.nickname,
			intro: form.value.intro,
			gender: form.value.gender,
			avatar: form.value.avatar,
		}

		const [ures] = await handlePromise(updateUserInfo(updatedUser))
		if (!ures) throw new Error('更新用户信息失败')

		auth.setUser(updatedUser)
		window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }))

		toast({ title: '保存成功', description: '个人资料已更新' })

		await nextTick()
		router.back()
	} catch (error) {
		toast({
			title: '保存失败',
			description: error instanceof Error ? error.message : '请稍后重试',
			variant: 'destructive',
		})
	} finally {
		isLoading.value = false
	}
}
</script>

<style scoped>
:deep(.select-content) {
	@apply bg-[#1A1A1A] border-white/10;
}

:deep(.select-item) {
	@apply text-white hover:bg-white/5 focus:bg-white/5;
}

:deep(.select-trigger) {
	@apply bg-white/5 border-white/10 text-white;
}

:deep(.select-trigger:focus) {
	@apply ring-[#da5597] ring-offset-0;
}

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
</style>
