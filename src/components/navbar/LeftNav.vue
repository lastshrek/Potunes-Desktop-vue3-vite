<!--
 * @Author       : lastshrek
 * @Date         : 2025-01-05 20:09:28
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-02-04 12:48:23
 * @FilePath     : /src/components/navbar/LeftNav.vue
 * @Description  : LeftNav
 * Copyright 2025 lastshrek, All Rights Reserved.
 * 2025-01-05 20:09:28
-->
<template>
	<div class="sticky top-16 h-[calc(100vh-4rem)] left-0 w-44 bg-black pl-2">
		<div class="space-y-4">
			<!-- 主导航 -->
			<div class="space-y-1">
				<!-- 导航按钮 -->
				<Button
					v-for="item in navItems"
					:key="item.path"
					variant="ghost"
					:class="[
						'w-full justify-start pl-4',
						isActive(item.path)
							? 'text-[#da5597] hover:text-[#da5597] hover:bg-transparent'
							: 'text-gray-400 hover:text-white hover:bg-gray-800/50',
					]"
					@click="handleNavigation(item)"
				>
					<component :is="item.icon" class="mr-2 h-4 w-4" />
					{{ item.name }}
				</Button>
			</div>

			<!-- 个人收藏区 -->
			<div class="space-y-4">
				<div class="flex items-center justify-between px-4">
					<h2 class="text-lg font-semibold tracking-tight text-white whitespace-nowrap">My Music</h2>
				</div>
				<div class="space-y-1">
					<Button
						variant="ghost"
						class="w-full justify-start pl-4 text-gray-400 hover:text-white hover:bg-gray-800/50"
						@click="handleFavouritesClick"
					>
						<Heart class="mr-2 h-4 w-4" />
						Favourites
					</Button>
					<Button
						variant="ghost"
						class="w-full justify-start pl-4 text-gray-400 hover:text-white hover:bg-gray-800/50"
						@click="router.push('/history')"
					>
						<History class="mr-2 h-4 w-4" />
						History
					</Button>
				</div>
			</div>

			<!-- 播放列表 -->
			<div class="space-y-4">
				<div class="flex items-center justify-between px-4">
					<h2 class="text-lg font-semibold tracking-tight text-white whitespace-nowrap">My Playlists</h2>
					<Button
						variant="ghost"
						size="icon"
						class="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800/50 ml-2"
						@click="handleCreatePlaylist"
					>
						<Plus class="h-4 w-4" />
					</Button>
				</div>
				<ScrollArea class="h-[300px] px-1">
					<div class="space-y-1">
						<Button
							v-for="playlist in playlists"
							:key="playlist.id"
							variant="ghost"
							class="w-full justify-start pl-4 text-gray-400 hover:text-white hover:bg-gray-800/50"
							@click="router.push(`/user-playlist/${playlist.id}`)"
						>
							<Music class="w-3.5 h-3.5 mr-2 shrink-0" />
							<span class="truncate">{{ playlist.title }}</span>
						</Button>
						<div v-if="playlists.length === 0 && auth.isLoggedIn" class="text-xs text-gray-500 px-4 py-2">
							No playlists yet
						</div>
					</div>
				</ScrollArea>

				<!-- 创建歌单对话框 -->
				<Dialog :open="showCreateDialog" @update:open="showCreateDialog = false">
					<DialogContent class="sm:max-w-sm bg-[#1A1A1A] border-gray-800 text-white">
						<DialogHeader>
							<DialogTitle class="text-base font-medium">New Playlist</DialogTitle>
						</DialogHeader>
						<input
							v-model="newPlaylistTitle"
							type="text"
							placeholder="Playlist name"
							class="w-full h-10 px-4 rounded-lg bg-[#111] text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#da5597] player-text"
							@keydown.enter="confirmCreatePlaylist"
						/>
						<div class="flex justify-end gap-2 mt-2">
							<Button variant="ghost" class="text-gray-400 hover:text-white" @click="showCreateDialog = false">
								Cancel
							</Button>
							<Button
								class="bg-[#da5597] hover:bg-[#da5597]/90 text-white"
								:disabled="!newPlaylistTitle.trim()"
								@click="confirmCreatePlaylist"
							>
								Create
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	BarChart3,
	Heart,
	History,
	MessageSquare,
	HandMetal,
	House,
	Car,
	Disc3,
	Plus,
	Music,
} from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { getUserPlaylists, createPlaylist } from '@/api'
import { emitter } from '@/utils/mitt'

import { useAuthStore } from '@/store/modules/auth'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const auth = useAuthStore()

const playlists = ref<any[]>([])
const showCreateDialog = ref(false)
const newPlaylistTitle = ref('')

const isActive = (path: string) => {
	if (path === '/') {
		return route.path === '/'
	}
	return route.path === path || route.path.startsWith(path)
}

const navItems = [
	{
		name: 'Home',
		path: '/',
		routeName: 'home',
		icon: House,
	},
	{
		name: 'Collections',
		path: '/albums/collections',
		routeName: 'albums',
		params: { type: 'collections' },
		icon: HandMetal,
	},
	{
		name: 'Finals',
		path: '/albums/finals',
		routeName: 'albums',
		params: { type: 'finals' },
		icon: Car,
	},
	{
		name: 'Albums',
		path: '/albums/albums',
		routeName: 'albums',
		params: { type: 'albums' },
		icon: Disc3,
	},
	{
		name: 'Trends',
		path: '/trends',
		routeName: 'trends',
		icon: BarChart3,
	},
	{
		name: 'Suggestions',
		path: '/feature',
		routeName: 'feature',
		icon: MessageSquare,
	},
]

const handleNavigation = (item: (typeof navItems)[0]) => {
	if (item.routeName === 'albums') {
		router
			.push({
				name: item.routeName,
				params: item.params,
			})
			.catch(err => {
				if (err.name !== 'NavigationDuplicated') {
					console.error('Navigation error:', err)
				}
			})
	} else {
		router
			.push({
				name: item.routeName,
			})
			.catch(err => {
				if (err.name !== 'NavigationDuplicated') {
					console.error('Navigation error:', err)
				}
			})
	}
}

const handleFavouritesClick = () => {
	if (!auth.isLoggedIn) {
		toast.info('Please login first')
		return
	}
	router.push('/favourites')
}

const loadPlaylists = async () => {
	if (!auth.isLoggedIn) return
	try {
		const data = await getUserPlaylists() as any[]
		playlists.value = Array.isArray(data) ? data : []
	} catch {
		// silent
	}
}

const handleCreatePlaylist = () => {
	if (!auth.isLoggedIn) {
		toast.info('Please login first')
		return
	}
	showCreateDialog.value = true
}

const confirmCreatePlaylist = async () => {
	const title = newPlaylistTitle.value.trim()
	if (!title) return
	try {
		await createPlaylist(title)
		toast.success(`Playlist "${title}" created`)
		showCreateDialog.value = false
		newPlaylistTitle.value = ''
		loadPlaylists()
	} catch {
		toast.error('Failed to create playlist')
	}
}

onMounted(() => {
	loadPlaylists()
	window.addEventListener('user-login', loadPlaylists as any)
	window.addEventListener('user-updated', loadPlaylists as any)
	emitter.on('playlist-changed', loadPlaylists)
	emitter.on('logout', () => { playlists.value = [] })
})

onUnmounted(() => {
	window.removeEventListener('user-login', loadPlaylists as any)
	window.removeEventListener('user-updated', loadPlaylists as any)
	emitter.off('playlist-changed', loadPlaylists)
	emitter.off('logout')
})
</script>

<style scoped>
/* 添加展开/收起动画 */
.rotate-90 {
	transform: rotate(90deg);
}
</style>
