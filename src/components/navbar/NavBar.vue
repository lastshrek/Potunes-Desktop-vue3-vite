<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-01 21:16:34
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-13 14:50:39
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
									<span class="text-xs text-gray-300">{{ tag.label }}</span>
									<button @click.stop="removeTag(index)" class="hover:text-white ml-1">
										<X class="h-3 w-3" />
									</button>
								</div>

								<!-- 搜索输入框 -->
								<input
									type="text"
									:placeholder="selectedTags.length > 0 ? '' : 'Search by artists, songs or albums'"
									v-model="searchQuery"
									@click="handleInputClick"
									@keydown.backspace="handleBackspace"
									class="flex-1 min-w-[100px] bg-transparent border-none text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-0"
								/>
							</div>
						</div>

						<!-- 下拉菜单 -->
						<div
							v-if="showDropdown"
							class="absolute w-full mt-2 py-2 bg-[#1A1A1A] rounded-lg shadow-lg border border-gray-800"
						>
							<div class="px-3 py-1.5 text-xs font-medium text-gray-400">Suggestions</div>
							<div class="mt-1">
								<button
									v-for="(item, index) in availableSuggestions"
									:key="index"
									@mousedown="handleSelect(item)"
									class="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/5 text-left"
								>
									<component :is="item.icon" class="h-4 w-4 text-gray-400" />
									<span class="text-sm text-gray-300">{{ item.label }}</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- user profile -->
			<div class="relative z-10" style="-webkit-app-region: no-drag">
				<button
					class="hover:bg-albumcardhover text-white py-2 px-4 rounded text-sm"
					@click="go('login')"
					v-if="!isUserExist"
				>
					Log In
				</button>
				<div v-if="isUserExist" class="relative user-menu">
					<div
						class="flex items-center justify-end cursor-pointer hover:text-white group px-2 py-1 rounded-md hover:bg-white/5"
						@mouseenter="handleMouseEnter"
						@mouseleave="handleMouseLeave"
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

						<div class="flex flex-col items-end">
							<p class="text-xs font-semibold text-right text-white">
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
								class="text-xs text-gray-400 text-right truncate max-w-[150px]"
							>
								{{ userData.intro || (isNeteaseLogin ? neteaseUser.signature : '') }}
							</p>
						</div>
						<ChevronDown
							class="h-4 w-4 text-gray-400 transition-transform duration-200 ml-2"
							:class="{ 'rotate-180': showUserMenu }"
						/>
					</div>

					<!-- 统一的用户菜单 -->
					<div
						v-if="showUserMenu"
						class="absolute right-0 mt-1 w-48 bg-[#1A1A1A] rounded-lg shadow-lg border border-gray-800 py-1 z-50"
						@mouseenter="handleMenuEnter"
						@mouseleave="handleMenuLeave"
					>
						<!-- 添加网易云账号信息 -->
						<div v-if="isNeteaseLogin" class="px-4 py-2 border-b border-gray-800">
							<div class="flex items-center gap-2 text-gray-400">
								<img :src="NeteaseIcon" alt="网易云账号" class="h-4 w-4" />
								<span class="text-sm text-gray-300">{{ neteaseUser.nickname }}</span>
							</div>
						</div>

						<div class="flex flex-col">
							<button
								v-if="!isNeteaseLogin"
								type="button"
								class="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-white/5 flex items-center gap-2"
								@click.prevent="handleNeteaseClick"
								@mousedown.stop="handleNeteaseMouseDown"
							>
								<Link class="h-4 w-4" />
								<span>Link Netease</span>
							</button>
							<button
								type="button"
								class="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-white/5 flex items-center gap-2"
								@click.prevent="handleEditProfile"
								@mousedown.stop="handleNeteaseMouseDown"
							>
								<User class="h-4 w-4" />
								<span>Edit Profile</span>
							</button>
							<button
								type="button"
								class="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-white/5 flex items-center gap-2"
								@click.prevent="handleLogout"
								@mousedown.stop="handleNeteaseMouseDown"
							>
								<LogOut class="h-4 w-4" />
								<span>Log Out</span>
							</button>
						</div>
					</div>
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
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'
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
import NeteaseIcon from '@/assets/images/netease.png'

const router = useRouter()
const route = useRoute()
const neteaseUser = ref({}) as any
const isUserExist = ref(false)
const isNeteaseLogin = ref(false)
const currentTab = ref('home')
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedTags = ref<Array<{ label: string; icon: any }>>([])
const searchContainer = ref<HTMLElement | null>(null)
const userPhone = ref(localStorage.getItem('phone') || '')
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

// 监听 currentTab 的变化
watch(currentTab, newValue => {
	if (
		newValue === 'playlist' ||
		newValue === 'albums' ||
		newValue === 'collections' ||
		newValue === 'finals' ||
		newValue === 'album-details' ||
		newValue === 'netease-playlist' ||
		newValue === 'netease-album' ||
		newValue === 'netease-daily'
	) {
		return
	}
	console.log('Tab changed to:', newValue)
	router.push({ name: newValue }).catch(err => {
		console.error('Navigation failed:', err)
	})
})

// 监听路由变化
watch(
	() => route.name,
	newName => {
		if (typeof newName === 'string') {
			if (
				newName === 'playlist' ||
				newName === 'albums' ||
				newName === 'collections' ||
				newName === 'finals' ||
				newName === 'album-details' ||
				newName === 'netease-playlist' ||
				newName === 'netease-album' ||
				newName === 'netease-daily'
			) {
				currentTab.value = 'home'
				return
			}
			currentTab.value = newName.toLowerCase()
		}
	},
	{ immediate: true }
)

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

// 修改点击处理函数
const handleInputClick = (event: MouseEvent) => {
	event.stopPropagation() // 阻止事件冒泡
	showDropdown.value = !showDropdown.value
}

// 修改点击外部处理函数
const handleClickOutside = (event: MouseEvent) => {
	const target = event.target as HTMLElement
	const userMenu = document.querySelector('.user-menu')

	// 如果点击的是菜单按钮，不处理
	if (target.closest('button')) {
		return
	}

	// 处理搜索框点击
	if (searchContainer.value && !searchContainer.value.contains(target)) {
		showDropdown.value = false
	}

	// 如果点击在菜单外部，关闭所有菜单
	if (userMenu && !userMenu.contains(target)) {
		showUserMenu.value = false
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
	const user = JSON.parse(localStorage.getItem('user') || '{}')
	const neteaseCookie = localStorage.getItem('netease-cookie')

	if (user.phone) {
		isUserExist.value = true
		userPhone.value = user.phone
	}

	if (neteaseCookie) {
		isNeteaseLogin.value = true
		neteaseUser.value = JSON.parse(localStorage.getItem('netease-user') || '{}')
	}

	// 添加用户登录事件监听
	window.addEventListener('user-login', ((event: CustomEvent) => {
		const { user } = event.detail
		isUserExist.value = true
		userPhone.value = user.phone
	}) as EventListener)

	// 添加网易云登录事件监听
	window.addEventListener('netease-login', ((event: CustomEvent) => {
		const { user } = event.detail
		isNeteaseLogin.value = true
		neteaseUser.value = user
	}) as EventListener)

	console.log('Current route:', route.fullPath)

	// 添加存储变化监听
	window.addEventListener('storage', updateUserData)

	// 添加自定义事件监听
	window.addEventListener('user-updated', updateUserData)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
	// 移除事件监听
	window.removeEventListener('user-login', (() => {}) as EventListener)
	window.removeEventListener('netease-login', (() => {}) as EventListener)
	window.removeEventListener('storage', updateUserData)
	window.removeEventListener('user-updated', updateUserData)
})

// 恢复标签相关的处理函数
const handleSelect = (item: { label: string; icon: any }) => {
	selectedTags.value.push(item)
	showDropdown.value = false
	searchQuery.value = ''
}

const removeTag = (index: number) => {
	selectedTags.value.splice(index, 1)
}

const handleBackspace = (event: KeyboardEvent) => {
	if (searchQuery.value === '' && selectedTags.value.length > 0) {
		event.preventDefault()
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
	if (isNeteaseLogin.value) {
		localStorage.removeItem('netease-cookie')
		localStorage.removeItem('netease-user')
	}

	// 重置状态
	isUserExist.value = false
	isNeteaseLogin.value = false
	userPhone.value = ''
	neteaseUser.value = {}
	showUserMenu.value = false
	showLogoutConfirm.value = false

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
	console.log('Mouse down on netease link')
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
const userData = ref(JSON.parse(localStorage.getItem('user') || '{}'))

// 添加监听器以更新用户数据
const updateUserData = () => {
	const newUserData = JSON.parse(localStorage.getItem('user') || '{}')
	console.log('Updating user data:', newUserData) // 添加日志
	userData.value = newUserData
}

// 添加头像加载错误处理
const handleAvatarError = (e: any) => {
	console.error('Avatar load error:', e)
	const target = e.target as HTMLImageElement
	target.src = '' // 清空源，显示默认头像
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
