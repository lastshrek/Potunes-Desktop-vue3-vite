<!--
 * @Author       : lastshrek
 * @Date         : 2025-01-18 22:36:46
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-18 22:41:05
 * @FilePath     : /src/views/History.vue
 * @Description  : 播放历史
 * Copyright 2025 lastshrek, All Rights Reserved.
 * 2025-01-18 22:36:46
-->
<template>
	<div class="min-h-screen pt-16 pb-24 w-full bg-black">
		<div class="container mx-auto px-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-semibold text-white">播放历史</h2>
			</div>
			<div class="w-full">
				<div v-if="playHistory.length > 0" class="space-y-2">
					<div
						v-for="(track, index) in playHistory"
						:key="`${track.id}-${index}`"
						class="flex items-center p-4 hover:bg-[#1a1a1a] rounded-lg transition-colors group"
						@click="playTrack(track)"
					>
						<div class="w-12 h-12 rounded overflow-hidden">
							<img :src="track.cover_url" class="w-full h-full object-cover" />
						</div>
						<div class="ml-4 flex-grow">
							<div class="text-white text-sm">{{ track.name }}</div>
							<div class="text-gray-400 text-xs">{{ track.artist }}</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							class="opacity-0 group-hover:opacity-100 transition-opacity"
							@click.stop="playTrack(track)"
						>
							<Play class="w-5 h-5 text-white" />
						</Button>
					</div>
				</div>
				<div v-else class="text-center text-gray-400 mt-8">暂无播放历史</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-vue-next'
import { useGlobalQueueStore } from '@/store/modules/globalQueue'
import { useCurrentIndexStore } from '@/store/modules/currentIndex'

const HISTORY_STORAGE_KEY = 'playHistory'
const playHistory = ref<Track[]>([])
const globalQueueStore = useGlobalQueueStore()
const currentIndexStore = useCurrentIndexStore()

// 获取播放历史
const getPlayHistory = () => {
	try {
		const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY)
		playHistory.value = historyJson ? JSON.parse(historyJson) : []
	} catch (error) {
		console.error('获取播放历史失败:', error)
		playHistory.value = []
	}
}

// 播放歌曲
const playTrack = (track: Track) => {
	// 将当前歌曲设置为播放队列中的唯一歌曲
	globalQueueStore.setGlobalQueue([track], 0)
	currentIndexStore.setCurrentIndex(0)
}

onMounted(() => {
	getPlayHistory()
})
</script>
