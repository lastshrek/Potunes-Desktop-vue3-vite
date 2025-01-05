<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-01 21:16:34
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-05 14:28:59
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
					v-if="!isUserExist && !isNeteaseLogin"
				>
					Log In
				</button>
				<button
					class="hover:bg-albumcardhover text-white py-2 px-4 rounded text-sm"
					@click="go('login')"
					v-else-if="isUserExist && !isNeteaseLogin"
				>
					Log In Netease
				</button>
				<div v-else>
					<div class="flex justify-end pr-4 mt-2">
						<p class="text-xs font-semibold text-right text-white" @click="showProfile">
							欢迎你，{{ neteaseUser.nickname }}
						</p>
						<svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<p class="text-xs font-semibold text-right text-white0">{{ neteaseUser.signature }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft, Music, User, Disc, Search, X } from 'lucide-vue-next'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

const router = useRouter()
const route = useRoute()
const neteaseUser = ref({}) as any
const isUserExist = ref(false)
const isNeteaseLogin = ref(false)
const currentTab = ref('home')
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedTags = ref<Array<{ label: string; icon: any }>>([])

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
			router.push({ name: where })
			break
		default:
			break
	}
}

const showProfile = () => {
	console.log('show profile')
}

// 添加搜索相关逻辑
const handleSearch = (query: string) => {
	// 处理搜索逻辑
	console.log('Searching for:', query)
}

// 修改点击处理函数
const handleInputClick = (event: MouseEvent) => {
	event.stopPropagation() // 阻止事件冒泡
	showDropdown.value = !showDropdown.value
}

// 修改点击外部处理函数
const handleClickOutside = (event: MouseEvent) => {
	const target = event.target as HTMLElement
	// 如果点击的是输入框，不处理
	if (target.tagName.toLowerCase() === 'input') {
		return
	}
	// 如果点击在搜索容器外部，关闭下拉菜单
	if (searchContainer.value && !searchContainer.value.contains(target)) {
		showDropdown.value = false
	}
}

// 修改拖动处理函数
const handleNavbarDrag = (event: MouseEvent) => {
	const target = event.target as HTMLElement
	if (!target.closest('[style*="-webkit-app-region: no-drag"]')) {
		// 直接关闭，不需要延时
		showDropdown.value = false
	}
}

// 修改生命周期钩子
onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
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

// 添加搜索框引用
const searchContainer = ref<HTMLElement | null>(null)
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
</style>
