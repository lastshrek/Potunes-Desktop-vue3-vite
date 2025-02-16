<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-01 21:16:34
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-02-04 13:13:04
 * @FilePath     : /src/components/navbar/NavBar.vue
 * @Description  : 
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-01 21:16:34
-->
<template>
	<div
		class="fixed top-0 left-0 w-full h-16 z-50 bg-black shadow-md"
		style="-webkit-app-region: drag"
		@mousedown="handleNavbarDrag"
	>
		<div class="container mx-auto flex items-center justify-between px-4 h-full">
			<!-- navigator button -->
			<div class="flex items-center pl-20 space-x-2" style="-webkit-app-region: no-drag">
				<Button variant="link" size="icon" @click="go('back')">
					<ChevronLeft class="w-6 h-6" />
				</Button>
				<Button variant="link" size="icon" @click="go('forward')">
					<ChevronRight class="w-6 h-6" />
				</Button>
			</div>

			<!-- middle navigator -->
			<div class="w-full max-w-md mx-auto absolute left-1/2 -translate-x-1/2" style="-webkit-app-region: no-drag">
				<div class="relative w-full">
					<!-- 搜索输入框 -->
					<div class="relative" ref="searchContainer">
						<div
							class="w-full h-9 rounded-full bg-[#1A1A1A] transition-shadow duration-200"
							:class="{ 'ring-1 ring-[#da5597]': showDropdown }"
						>
							<div class="w-full h-full pl-9 pr-4 flex items-center gap-2 overflow-x-auto">
								<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 shrink-0" />

								<!-- 已选择的标签 -->
								<div
									v-for="(tag, index) in selectedTags"
									:key="index"
									class="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full shrink-0"
								>
									<component :is="tag.icon" class="h-3 w-3 text-gray-400" />
									<span class="text-xs text-gray-300 player-text">{{ tag.label }}</span>
									<button @click.stop="removeTag(index)" class="hover:text-white ml-1">
										<X class="h-3 w-3" />
									</button>
								</div>

								<!-- 搜索输入框 -->
								<input
									type="text"
									:placeholder="selectedTags.length > 0 ? '' : 'Search by artists, songs or albums『暂不可用』'"
									v-model="searchQuery"
									@click="handleInputClick"
									@keydown.backspace="handleBackspace"
									@keydown.esc="handleEsc"
									class="flex-1 min-w-[100px] bg-transparent border-none text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-0 player-text"
								/>
							</div>
						</div>

						<!-- 下拉菜单 -->
						<div
							v-if="showDropdown"
							class="absolute w-full mt-2 py-2 bg-[#1A1A1A] rounded-lg shadow-lg border border-gray-800"
						>
							<div class="px-3 py-1.5 text-xs font-medium text-gray-400 player-text">Suggestions</div>
							<div class="mt-1">
								<button
									v-for="(item, index) in availableSuggestions"
									:key="index"
									@mousedown="handleSelect(item)"
									class="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/5 text-left"
								>
									<component :is="item.icon" class="h-4 w-4 text-gray-400" />
									<span class="text-sm text-gray-300 player-text">{{ item.label }}</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- user profile -->
			<div class="relative z-10" style="-webkit-app-region: no-drag">
				<div class="flex items-center space-x-4">
					<!-- 下载客户端按钮 -->
					<Button
						v-if="!isElectron"
						variant="link"
						class="text-white hover:text-[#da5597] flex items-center gap-2"
						@click="downloadClient"
					>
						<Download class="w-4 h-4" />
						下载客户端
					</Button>

					<!-- 未登录时显示登录按钮 -->
					<Button
						v-if="!isUserExist"
						variant="link"
						class="text-white hover:text-[#da5597]"
						@click="router.push('/login')"
					>
						Login
					</Button>

					<!-- 已登录时显示用户菜单 -->
					<DropdownMenu v-else>
						<DropdownMenuTrigger
							class="flex items-center justify-end cursor-pointer hover:text-white group px-2 py-1 rounded-md hover:bg-white/5"
						>
							<div class="w-8 h-8 rounded-full overflow-hidden mr-2 border border-gray-800">
								<template v-if="userData.avatar">
									<img
										:src="userData.avatar"
										:key="Date.now()"
										alt="Avatar"
										class="w-full h-full object-cover"
										@error="handleAvatarError"
									/>
								</template>
								<template v-else>
									<div class="w-full h-full bg-black/50 flex items-center justify-center">
										<UserCircle2 class="w-5 h-5 text-gray-500" />
									</div>
								</template>
							</div>

							<div class="flex flex-col items-end" v-if="isUserExist">
								<p class="text-xs font-semibold text-right text-white album-title">
									{{
										userData.nickname
											? userData.nickname
											: isNeteaseLogin
											? neteaseUser.nickname
											: '欢迎你 ' + formatPhone(userPhone)
									}}
								</p>
								<p
									v-if="userData.intro || (isNeteaseLogin && !userData.intro)"
									class="text-xs text-gray-400 text-right truncate max-w-[150px] player-text"
								>
									{{ userData.intro || (isNeteaseLogin ? neteaseUser.signature : '') }}
								</p>
							</div>
							<ChevronDown
								class="h-4 w-4 text-gray-400 transition-transform duration-200 ml-2"
								:class="{ 'rotate-180': showUserMenu }"
							/>
						</DropdownMenuTrigger>

						<DropdownMenuContent class="w-48 bg-[#1A1A1A] border-gray-800">
							<!-- 网易云账号信息 -->
							<DropdownMenuLabel v-if="isNeteaseLogin" class="border-b border-gray-800">
								<div class="flex items-center gap-2 text-gray-400">
									<img :src="NeteaseIcon" alt="网易云账号" class="h-4 w-4" />
									<span class="text-sm text-gray-300">{{ neteaseUser.nickname }}</span>
								</div>
							</DropdownMenuLabel>

							<!-- 菜单项 -->
							<DropdownMenuItem
								v-if="!isNeteaseLogin"
								class="text-gray-300 hover:bg-white/5 cursor-pointer"
								@click="handleNeteaseClick"
							>
								<Link class="h-4 w-4 mr-2" />
								<span>Link Netease</span>
							</DropdownMenuItem>

							<DropdownMenuItem class="text-gray-300 hover:bg-white/5 cursor-pointer" @click="handleEditProfile">
								<User class="h-4 w-4 mr-2" />
								<span>Edit Profile</span>
							</DropdownMenuItem>

							<DropdownMenuItem class="text-gray-300 hover:bg-white/5 cursor-pointer" @click="handleLogout">
								<LogOut class="h-4 w-4 mr-2" />
								<span>Log Out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	</div>

	<!-- 添加确认对话框 -->
	<AlertDialog :open="showLogoutConfirm">
		<AlertDialogContent class="sm:max-w-[425px] bg-[#1A1A1A] border-gray-800 text-white">
			<AlertDialogHeader>
				<AlertDialogTitle class="text-lg font-semibold">确认退出</AlertDialogTitle>
				<AlertDialogDescription class="text-sm text-gray-400">
					您确定要退出登录吗？退出后需要重新登录才能使用完整功能。
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter class="gap-2">
				<AlertDialogCancel
					class="bg-transparent border border-gray-700 hover:bg-white/5 hover:text-white text-gray-300"
					@click="showLogoutConfirm = false"
				>
					取消
				</AlertDialogCancel>
				<AlertDialogAction class="bg-[#da5597] hover:bg-[#da5597]/90 text-white border-0" @click="confirmLogout">
					确认退出
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
	ChevronRight,
	ChevronLeft,
	ChevronDown,
	Music,
	User,
	Disc,
	Search,
	X,
	Link,
	LogOut,
	UserCircle2,
	Download,
} from 'lucide-vue-next'
import { toast } from '@/components/ui/toast'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import NeteaseIcon from '@/assets/images/netease.png'
import { emitter } from '@/utils/mitt'
import { isElectron as checkIsElectron } from '@/utils/platform'

const router = useRouter()
const route = useRoute()
const neteaseUser = ref({}) as any
const isUserExist = ref(false)
const isNeteaseLogin = ref(false)
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedTags = ref<Array<{ label: string; icon: any }>>([])
const searchContainer = ref<HTMLElement | null>(null)
const userPhone = ref('')
const showUserMenu = ref(false)
const showQRCode = ref(false)

const suggestions = [
	{ label: 'Songs', icon: Music },
	{ label: 'Artists', icon: User },
	{ label: 'Albums', icon: Disc },
]

// 计算可用的建议（排除已选择的）
const availableSuggestions = computed(() => {
	return suggestions.filter(suggestion => !selectedTags.value.some(tag => tag.label === suggestion.label))
})

// 返回前进按钮
const go = (where: string) => {
	if (where === route.path) return

	switch (where) {
		case 'back':
			router.go(-1)
			break
		case 'forward':
			router.go(1)
			break
		case 'login':
			if (isUserExist.value) {
				// 如果已登录，显示二维码
				showQRCode.value = true
			} else {
				// 未登录，跳转到登录页
				router.push({ name: where })
			}
			break
		default:
			break
	}
}

// 添加点击外部关闭下拉菜单的处理
const handleClickOutside = (event: MouseEvent) => {
	const target = event.target as HTMLElement
	if (searchContainer.value && !searchContainer.value.contains(target)) {
		showDropdown.value = false
	}
}

// 修改拖动处理函数
const handleNavbarDrag = (event: MouseEvent) => {
	const target = event.target as HTMLElement
	if (!target.closest('[style*="-webkit-app-region: no-drag"]')) {
		showDropdown.value = false
		showUserMenu.value = false
	}
}

// 修改生命周期钩子
onMounted(() => {
	document.addEventListener('click', handleClickOutside)
	// 检查用户登录状态
	const token = localStorage.getItem('token')
	const user = token ? JSON.parse(localStorage.getItem('user') || '{}') : null
	if (user && token) {
		isUserExist.value = true
		userPhone.value = user.phone
		userData.value = user
	}

	if (localStorage.getItem('netease-cookie')) {
		isNeteaseLogin.value = true
		neteaseUser.value = JSON.parse(localStorage.getItem('netease-user') || '{}')
	}

	// 添加用户登录事件监听
	window.addEventListener('user-login', ((event: CustomEvent) => {
		const { user } = event.detail
		console.log(user)
		isUserExist.value = true
		userPhone.value = user.phone
		userData.value = user
	}) as EventListener)

	// 添加网易云登录事件监听
	window.addEventListener('netease-login', ((event: CustomEvent) => {
		const { user } = event.detail
		isNeteaseLogin.value = true
		neteaseUser.value = user
	}) as EventListener)

	// 添加存储变化监听
	window.addEventListener('storage', updateUserData)

	// 添加自定义事件监听
	window.addEventListener('user-updated', updateUserData)

	// 添加登录成功事件监听
	emitter.on('login-success', (user: any) => {
		console.log('login-success', user)
		userData.value = user
		isUserExist.value = true
		userPhone.value = user.phone
	})
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
	// 移除事件监听
	window.removeEventListener('user-login', (() => {}) as EventListener)
	window.removeEventListener('netease-login', (() => {}) as EventListener)
	window.removeEventListener('storage', updateUserData)
	window.removeEventListener('user-updated', updateUserData)
	emitter.off('login-success')
})

// 修改输入框点击处理函数
const handleInputClick = () => {
	showDropdown.value = true
}

// 修改选择建议项的处理函数
const handleSelect = (item: any) => {
	selectedTags.value.push(item)
	searchQuery.value = ''
	showDropdown.value = false
}

// 修改删除标签的处理函数
const removeTag = (index: number) => {
	selectedTags.value.splice(index, 1)
}

// 修改退格键处理函数
const handleBackspace = (event: KeyboardEvent) => {
	if (searchQuery.value === '' && selectedTags.value.length > 0 && event.key === 'Backspace') {
		selectedTags.value.pop()
	}
}

// 添加格式化手机号的函数
const formatPhone = (phone: string) => {
	if (!phone) return ''
	return `${phone.slice(-4)}`
}

// 修改确认对话框状态
const showLogoutConfirm = ref(false)

// 修改退出登录处理函数
const handleLogout = (event?: MouseEvent) => {
	event?.preventDefault()
	event?.stopPropagation()
	console.log('Opening logout confirm dialog')
	showLogoutConfirm.value = true
	showUserMenu.value = false
}

// 修改确认退出处理函数
const confirmLogout = () => {
	console.log('Confirming logout...')

	// 清除所有存储的用户信息
	localStorage.removeItem('user')
	localStorage.removeItem('userId')
	localStorage.removeItem('token')
	if (isNeteaseLogin.value) {
		localStorage.removeItem('netease-cookie')
		localStorage.removeItem('netease-user')
	}

	// 重置状态
	isUserExist.value = false
	isNeteaseLogin.value = false
	userPhone.value = ''
	neteaseUser.value = {}
	userData.value = {}
	showUserMenu.value = false
	showLogoutConfirm.value = false

	// 触发登出事件
	emitter.emit('logout')

	// 显示提示
	toast({
		title: '退出成功',
		description: '您已成功退出登录',
	})

	// 导航到首页
	router.push('/')
}

// 添加鼠标状态标记
let isMouseInMenu = false

// 鼠标事件处理函数
const handleMouseEnter = () => {
	showUserMenu.value = true
}

const handleMouseLeave = () => {
	setTimeout(() => {
		if (!isMouseInMenu) {
			showUserMenu.value = false
		}
	}, 100)
}

const handleMenuEnter = () => {
	isMouseInMenu = true
}

const handleMenuLeave = () => {
	isMouseInMenu = false
	showUserMenu.value = false
}

// 修改编辑个人资料处理函数
const handleEditProfile = () => {
	showUserMenu.value = false
	router.push('/edit-profile')
}

// 添加鼠标按下处理函数
const handleNeteaseMouseDown = (event: MouseEvent) => {
	event.stopPropagation()
}

// 修改导航函数
const handleNeteaseClick = (event: MouseEvent) => {
	event.preventDefault()
	event.stopPropagation()
	console.log('Netease link clicked')

	showUserMenu.value = false
	nextTick(() => {
		console.log('Attempting navigation')
		router.push('/netease-link')
	})
}

// 添加用户数据响应式引用
const userData: any = ref({})

// 获取用户信息
const userInfo = computed(() => {
	const token = localStorage.getItem('token')
	const user = localStorage.getItem('user')
	return token && user ? JSON.parse(user) : null
})

// 修改更新用户数据的函数
const updateUserData = () => {
	const token = localStorage.getItem('token')
	const user = localStorage.getItem('user')
	try {
		if (token && user) {
			const parsedUser = JSON.parse(user)
			userData.value = parsedUser
			isUserExist.value = true
			userPhone.value = parsedUser.phone
		} else {
			userData.value = {}
			isUserExist.value = false
			userPhone.value = ''
		}
	} catch (error) {
		console.error('Error updating user data:', error)
	}
}

// 添加头像加载错误处理
const handleAvatarError = (e: any) => {
	console.error('Avatar load error:', e)
	const target = e.target as HTMLImageElement
	target.src = '' // 清空源，显示默认头像
}

// 添加 ESC 键处理函数
const handleEsc = () => {
	showDropdown.value = false
}

// 监听用户信息变化
watch(userInfo, newValue => {
	if (!newValue) {
		userData.value = {}
		isUserExist.value = false
		userPhone.value = ''
	}
})

// 创建响应式的 electron 环境检测
const isElectron = ref(checkIsElectron())

// 下载客户端
const downloadClient = () => {
	window.open('https://poche.pink', '_blank')
}
</script>

<style scoped>
/* 更新搜索框样式 */
:deep(.command) {
	@apply border-none;
}

:deep(.command-input) {
	@apply bg-transparent;
}

:deep(.command-input input) {
	@apply placeholder:text-gray-500;
}

:deep(.command-list) {
	@apply bg-[#1A1A1A] border-t border-gray-800;
}

:deep(.command-group-heading) {
	@apply text-xs font-medium text-gray-400 px-2 py-2;
}

:deep(.command-item) {
	@apply px-2 py-1.5;
}

:deep(.command-item[data-selected='true']) {
	@apply bg-white/5;
}

:deep(.command-empty) {
	@apply p-4 text-sm text-gray-400;
}

/* 移除输入框的默认样式 */
input:focus {
	outline: none;
	box-shadow: none;
}

/* 添加过渡效果 */
.absolute {
	transition: all 0.2s ease;
}

/* 隐藏滚动条但保持功能 */
.overflow-x-auto {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
	display: none;
}

/* 添加过渡效果 */
.rotate-180 {
	transform: rotate(180deg);
}

/* 添加菜单过渡效果 */
.user-menu {
	@apply relative;
}

.rotate-180 {
	transform: rotate(180deg);
}

/* 确保菜单在其他元素之上 */
.z-50 {
	z-index: 50;
}

/* 添加头像过渡效果 */
.user-menu img {
	transition: all 0.2s ease-in-out;
}

.user-menu:hover img {
	transform: scale(1.05);
}
</style>
