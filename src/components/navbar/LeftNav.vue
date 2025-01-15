<!--
 * @Author       : lastshrek
 * @Date         : 2025-01-05 20:09:28
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-15 17:05:38
 * @FilePath     : /src/components/navbar/LeftNav.vue
 * @Description  : LeftNav
 * Copyright 2025 lastshrek, All Rights Reserved.
 * 2025-01-05 20:09:28
-->
<template>
	<div class="sticky top-16 h-[calc(100vh-4rem)] left-0 w-44 bg-black pl-2">
		<div class="space-y-4">
			<!-- 主导航 -->
			<div class="space-y-2">
				<!-- Home 展开菜单 -->
				<Button
					variant="ghost"
					:class="[
						'w-full justify-start pl-4',
						route.path === '/'
							? 'text-[#da5597] hover:text-[#da5597] hover:bg-transparent'
							: 'text-gray-400 hover:text-white hover:bg-gray-800/50',
					]"
					@click="router.push('/')"
				>
					<ListMusic class="mr-2 h-4 w-4" />
					Home
				</Button>

				<!-- 子菜单 -->
				<div class="space-y-1">
					<Button
						variant="ghost"
						:class="[
							'w-full justify-start pl-4',
							route.path === '/albums/collections'
								? 'text-[#da5597] hover:text-[#da5597] hover:bg-transparent'
								: 'text-gray-400 hover:text-white hover:bg-gray-800/50',
						]"
						@click="router.push('/albums/collections')"
					>
						<ListMusic class="mr-2 h-4 w-4" />
						Collections
					</Button>
					<Button
						variant="ghost"
						:class="[
							'w-full justify-start pl-4',
							route.path === '/albums/finals'
								? 'text-[#da5597] hover:text-[#da5597] hover:bg-transparent'
								: 'text-gray-400 hover:text-white hover:bg-gray-800/50',
						]"
						@click="router.push('/albums/finals')"
					>
						<ListMusic class="mr-2 h-4 w-4" />
						Finals
					</Button>
					<Button
						variant="ghost"
						:class="[
							'w-full justify-start pl-4',
							route.path === '/albums/albums'
								? 'text-[#da5597] hover:text-[#da5597] hover:bg-transparent'
								: 'text-gray-400 hover:text-white hover:bg-gray-800/50',
						]"
						@click="router.push('/albums/albums')"
					>
						<ListMusic class="mr-2 h-4 w-4" />
						Albums
					</Button>
				</div>

				<!-- 其他菜单项 -->
				<Button
					variant="ghost"
					:class="[
						'w-full justify-start pl-4',
						route.path === '/trends'
							? 'text-[#da5597] hover:text-[#da5597] hover:bg-transparent'
							: 'text-gray-400 hover:text-white hover:bg-gray-800/50',
					]"
					@click="router.push('/trends')"
				>
					<BarChart3 class="mr-2 h-4 w-4" />
					Trends
				</Button>
				<Button
					variant="ghost"
					class="w-full justify-start pl-4 text-gray-400 hover:text-white hover:bg-gray-800/50"
					@click="router.push('/feature')"
				>
					<MessageSquare class="mr-2 h-4 w-4" />
					Suggestions
				</Button>
			</div>

			<!-- 个人收藏区 -->
			<div class="space-y-1">
				<h2 class="px-4 text-lg font-semibold tracking-tight text-white">My Music</h2>
				<Button variant="ghost" class="w-full justify-start pl-4 text-gray-400 hover:text-white hover:bg-gray-800/50">
					<Heart class="mr-2 h-4 w-4" />
					Favourites
				</Button>
				<Button variant="ghost" class="w-full justify-start pl-4 text-gray-400 hover:text-white hover:bg-gray-800/50">
					<History class="mr-2 h-4 w-4" />
					History
				</Button>
			</div>

			<!-- 播放列表 -->
			<div class="space-y-1">
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
import { ListMusic, BarChart3, Heart, History, MessageSquare } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// 模拟数据
const playlists = ref([
	{ id: 1, name: 'Metalcore', color: 'bg-red-500' },
	{ id: 2, name: 'Electro', color: 'bg-green-500' },
	{ id: 3, name: 'Funk', color: 'bg-yellow-500' },
	{ id: 4, name: 'Disco', color: 'bg-purple-500' },
])
</script>

<style scoped>
/* 添加展开/收起动画 */
.rotate-90 {
	transform: rotate(90deg);
}
</style>
