<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:24:18
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-25 21:33:13
 * @FilePath     : /src/views/Favourites.vue
 * @Description  : Favrourites
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:24:18
-->
<template>
	<div class="w-full">
		<div class="bg-black w-full pt-16 pb-20 h-screen">
			<!-- 悬浮标题 -->
			<div class="fixed top-16 left-44 right-0 z-10 bg-black/90 backdrop-blur-sm border-b border-gray-800">
				<div class="px-4 py-4 flex justify-between items-center">
					<h1 class="text-white text-2xl font-bold album-title">
						Favourites - 我的收藏({{ fav_tracks.length }} tracks)
					</h1>
					<button
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
				<template v-if="!isLoading">
					<!-- tracklist -->
					<div
						v-for="(item, index) in fav_tracks"
						:key="'index' + index"
						class="grid grid-cols-12 items-center py-3 px-4 rounded-lg group player-text"
						:class="{
							'bg-[#da5597] text-white hover:bg-[#da5597]':
								currentTrack.type == 'netease' ? currentTrack.nId == item.nId : currentTrack.id == item.id,
							'hover:bg-gray-800/50':
								currentTrack.type == 'netease' ? currentTrack.nId != item.nId : currentTrack.id != item.id,
						}"
						@click="selectTrack(index)"
					>
						<!-- index -->
						<div class="col-span-1 text-sm">{{ index + 1 }}</div>
						<!-- cover & meta -->
						<div class="col-span-5 flex items-center space-x-3">
							<img v-lazy="item.cover_url" class="w-10 h-10 rounded" />
							<div>
								<p class="text-sm font-medium">{{ item.name }}</p>
								<div
									class="flex text-xs mt-1"
									:class="{
										'text-white':
											currentTrack.type == 'netease' ? currentTrack.nId == item.nId : currentTrack.id == item.id,
										'text-gray-400':
											currentTrack.type == 'netease' ? currentTrack.nId != item.nId : currentTrack.id != item.id,
									}"
								>
									<div
										v-for="(artist, index) in item.ar"
										:key="'artist' + artist.id + index"
										@click.stop="handleArtistClick(artist.id)"
									>
										<span class="cursor-pointer hover:underline">{{ artist.name }}</span>
										<span v-if="index < item.ar.length - 1 && item.ar.length > 1" class="mx-1">/</span>
									</div>
								</div>
							</div>
						</div>
						<!-- album -->
						<div
							class="col-span-4 text-sm"
							:class="{
								'text-white':
									currentTrack.type == 'netease' ? currentTrack.nId == item.nId : currentTrack.id == item.id,
								'text-gray-400':
									currentTrack.type == 'netease' ? currentTrack.nId != item.nId : currentTrack.id != item.id,
							}"
						>
							{{ item.album || '-' }}
						</div>
						<!-- duration -->
						<div class="col-span-2 flex items-center justify-end space-x-4">
							<span
								class="text-sm"
								:class="{
									'text-white':
										currentTrack.type == 'netease' ? currentTrack.nId == item.nId : currentTrack.id == item.id,
									'text-gray-400':
										currentTrack.type == 'netease' ? currentTrack.nId != item.nId : currentTrack.id != item.id,
								}"
							>
								{{ formatTime(item.duration) }}
							</span>
						</div>
					</div>
				</template>
				<template v-else>
					<!-- Skeleton Loading -->
					<div class="flex flex-col w-full animate-pulse">
						<!-- 顶部信息区域 skeleton -->
						<div class="flex items-start space-x-6">
							<div class="w-64 h-64 bg-gray-800 rounded-lg flex-shrink-0"></div>
							<div class="flex flex-col flex-grow">
								<div class="h-8 bg-gray-800 rounded w-1/3 mb-2"></div>
								<div class="h-4 bg-gray-800 rounded w-1/4 mb-4"></div>
								<div class="h-10 bg-gray-800 rounded w-32 mt-4"></div>
							</div>
						</div>

						<!-- 列表 skeleton -->
						<div class="mt-8">
							<div class="grid grid-cols-12 text-gray-400 text-sm py-2 px-4 border-b border-gray-800"></div>
							<div v-for="i in 10" :key="i" class="grid grid-cols-12 items-center py-3 px-4">
								<div class="col-span-1">
									<div class="h-4 bg-gray-800 rounded w-4"></div>
								</div>
								<div class="col-span-5 flex items-center space-x-3">
									<div class="w-10 h-10 bg-gray-800 rounded"></div>
									<div class="flex-grow">
										<div class="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
										<div class="h-3 bg-gray-800 rounded w-1/2"></div>
									</div>
								</div>
								<div class="col-span-4">
									<div class="h-4 bg-gray-800 rounded w-2/3"></div>
								</div>
								<div class="col-span-2 flex justify-end">
									<div class="h-4 bg-gray-800 rounded w-16"></div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import heartSrc from '@/assets/images/heart.png'
import { formatTime, handlePromise, showError, getCurrentDate } from '@/utils/index'
import { useGlobalQueueStore } from '@/store/modules/globalQueue'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getFavouriteTracks } from '@/api/index'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'

const router = useRouter()
const globalQueue = useGlobalQueueStore()
// 当前歌曲
const currentTrack = useCurrentTrackStore()
const fav_tracks: any = ref([])
const isLoading = ref(true)

// 播放全部
const playAll = () => {
	if (fav_tracks.value.length === 0) return
	globalQueue.setGlobalQueue(fav_tracks.value, 0)
}

// 处理歌手点击
const handleArtistClick = (artistId: number) => {
	router.push({
		path: `/artist/${artistId}`,
	})
}

onMounted(async () => {
	isLoading.value = true
	try {
		const [res] = await handlePromise(getFavouriteTracks())
		if (!res) return
		console.log(res)
		fav_tracks.value = res
	} catch (error) {
		console.error('获取收藏歌曲失败:', error)
	} finally {
		isLoading.value = false
	}
})

const selectTrack = (index: number) => {
	globalQueue.setGlobalQueue(fav_tracks.value, index)
}
</script>

<style scoped>
.album-title {
	font-family: 'Outfit', sans-serif;
}

.player-text {
	font-family: 'Inter', sans-serif;
}
</style>
