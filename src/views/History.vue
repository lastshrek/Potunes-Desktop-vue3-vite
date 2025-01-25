<!--
 * @Author       : lastshrek
 * @Date         : 2025-01-18 22:36:46
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-25 21:34:18
 * @FilePath     : /src/views/History.vue
 * @Description  : 播放历史
 * Copyright 2025 lastshrek, All Rights Reserved.
 * 2025-01-18 22:36:46
-->
<template>
	<div class="w-full">
		<div class="bg-black w-full pt-16 pb-20 h-screen">
			<!-- 悬浮标题 -->
			<div class="fixed top-16 left-44 right-0 z-10 bg-black/90 backdrop-blur-sm border-b border-gray-800">
				<div class="px-4 py-4 flex justify-between items-center">
					<h1 class="text-white text-2xl font-bold album-title">History - 播放历史({{ playHistory.length }} tracks)</h1>
					<button
						v-if="playHistory.length > 0"
						class="bg-[#da5597] text-white px-4 py-2 rounded-full hover:bg-[#da5597]/90 flex items-center justify-center space-x-2 player-text"
						@click="playAll"
					>
						<svg
							t="1691599025349"
							class="icon w-5 h-5"
							viewBox="0 0 1024 1024"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							p-id="3841"
						>
							<path
								d="M732.502883 465.602819c-107.883492-82.3454-215.772403-164.681769-323.652282-247.014525-38.414608-29.327534-93.780555-1.929039-93.780555 46.396277v494.029051c0 48.325316 55.365948 75.725617 93.780555 46.398084 107.87988-82.332757 215.76879-164.669126 323.652282-247.014525 30.61356-23.357989 30.61356-69.436372 0-92.794362z"
								fill="currentColor"
							></path>
						</svg>
						<span class="player-text">Play</span>
					</button>
				</div>
			</div>
			<div class="h-full overflow-y-scroll flex flex-col text-white px-6 pt-20">
				<!-- 歌曲列表 -->
				<div class="w-full">
					<div v-if="playHistory.length > 0">
						<div
							v-for="(track, index) in playHistory"
							:key="`${track.id}-${index}`"
							class="grid grid-cols-12 items-center py-3 px-4 rounded-lg group player-text"
							:class="{
								'bg-[#da5597] text-white': isCurrentTrack(track),
								'hover:bg-gray-800/50': !isCurrentTrack(track),
							}"
							@click="playTrack(track)"
						>
							<!-- index -->
							<div class="col-span-1 text-sm">{{ index + 1 }}</div>
							<!-- cover & meta -->
							<div class="col-span-5 flex items-center space-x-3">
								<img v-lazy="track.cover_url" class="w-10 h-10 rounded" />
								<div>
									<p class="text-sm font-medium">{{ track.name }}</p>
									<div
										class="flex text-xs mt-1"
										:class="{
											'text-gray-400': !isCurrentTrack(track),
										}"
									>
										<div
											v-for="(artist, index) in track.ar"
											:key="'artist' + artist.id + index"
											@click.stop="handleArtistClick(artist.id)"
										>
											<span class="cursor-pointer hover:underline">
												{{ artist.name }}
											</span>
											<span v-if="index < track.ar.length - 1 && track.ar.length > 1" class="mx-1">/</span>
										</div>
									</div>
								</div>
							</div>
							<!-- album -->
							<div
								class="col-span-4 text-sm"
								:class="{
									'text-gray-400': !isCurrentTrack(track),
								}"
							>
								{{ track.album || '-' }}
							</div>
							<!-- duration -->
							<div class="col-span-2 flex items-center justify-end space-x-4">
								<span
									class="text-sm"
									:class="{
										'text-gray-400': !isCurrentTrack(track),
									}"
								>
									{{ formatTime(track.duration) }}
								</span>
							</div>
						</div>
					</div>
					<div v-else class="text-center text-gray-400 mt-8">暂无播放历史</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGlobalQueueStore } from '@/store/modules/globalQueue'
import { useCurrentIndexStore } from '@/store/modules/currentIndex'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'
import { formatTime } from '@/utils/index'
import { useRouter } from 'vue-router'

const HISTORY_STORAGE_KEY = 'playHistory'
const playHistory = ref<Track[]>([])
const globalQueueStore = useGlobalQueueStore()
const currentIndexStore = useCurrentIndexStore()
const currentTrack = useCurrentTrackStore()
const router = useRouter()

// 判断是否是当前播放的歌曲
const isCurrentTrack = (track: Track) => {
	return currentTrack.type == 'netease' ? currentTrack.nId == track.nId : currentTrack.id == track.id
}

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

// 播放全部
const playAll = () => {
	if (playHistory.value.length === 0) return
	globalQueueStore.setGlobalQueue(playHistory.value, 0)
}

// 处理歌手点击
const handleArtistClick = (artistId: number) => {
	router.push({
		path: `/artist/${artistId}`,
	})
}

onMounted(() => {
	getPlayHistory()
})
</script>

<style scoped>
.album-title {
	font-family: 'Outfit', sans-serif;
}

.player-text {
	font-family: 'Inter', sans-serif;
}
</style>
