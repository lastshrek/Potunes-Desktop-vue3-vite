<!--
 * @Author       : lastshrek
 * @Date         : 2025-01-05 20:09:28
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-20 14:45:13
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
				<h2 class="px-4 text-lg font-semibold tracking-tight text-white">My Music</h2>
				<div class="space-y-1">
					<Button
						variant="ghost"
						class="w-full justify-start pl-4 text-gray-400 hover:text-white hover:bg-gray-800/50"
						@click="router.push('/favourites')"
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
				<h2 class="px-4 text-lg font-semibold tracking-tight text-white">My Playlists</h2>
				<ScrollArea class="h-[300px] px-1">
					<div class="space-y-1">
						<Button
							v-for="playlist in playlists"
							:key="playlist.id"
							variant="ghost"
							class="w-full justify-start pl-4 text-gray-400 hover:text-white hover:bg-gray-800/50"
						>
							<span class="w-2 h-2 rounded-full mr-2" :class="playlist.color" />
							{{ playlist.name }}
						</Button>
					</div>
				</ScrollArea>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ListMusic, BarChart3, Heart, History, MessageSquare, HandMetal, House, Car, Disc3 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// 判断路由是否激活
const isActive = (path: string) => {
	if (path === '/') {
		return route.path === '/'
	}
	return route.path === path || route.path.startsWith(path)
}

// 导航配置
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

// 模拟数据
const playlists = ref([
	{ id: 1, name: 'Metalcore', color: 'bg-red-500' },
	{ id: 2, name: 'Electro', color: 'bg-green-500' },
	{ id: 3, name: 'Funk', color: 'bg-yellow-500' },
	{ id: 4, name: 'Disco', color: 'bg-purple-500' },
])

// 修改导航处理方法
const handleNavigation = (item: (typeof navItems)[0]) => {
	console.log('Navigating to:', item.path)
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
</script>

<style scoped>
/* 添加展开/收起动画 */
.rotate-90 {
	transform: rotate(90deg);
}
</style>
