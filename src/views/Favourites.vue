<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:24:18
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-20 15:09:26
 * @FilePath     : /src/views/Favourites.vue
 * @Description  : Favrourites
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:24:18
-->
<template>
	<div class="w-full">
		<div class="bg-black w-full pt-16 pb-20 h-screen">
			<div class="h-full overflow-y-scroll flex flex-col text-white px-6 pt-8">
				<template v-if="!isLoading">
					<!-- 周榜card -->
					<div class="flex flex-col w-full">
						<!-- 顶部信息区域 -->
						<div class="flex items-start space-x-6">
							<!-- 左侧图片 -->
							<div class="w-64 h-64 flex-shrink-0">
								<img :src="heartSrc" class="w-full h-auto rounded-lg mr-4 border border-gray-800" />
							</div>
							<!-- 右侧三段 -->
							<div class="flex flex-col flex-grow">
								<h1 class="text-3xl font-bold mb-2 album-title">我的收藏</h1>
								<p class="text-sm text-gray-400 mb-4 player-text">{{ fav_tracks.length }}首歌</p>
								<!-- 操作按钮 -->
								<div class="flex items-center space-x-4 mt-4">
									<button
										class="bg-[#da5597] text-white px-8 py-2 rounded-full hover:bg-[#da5597]/90 flex items-center justify-center space-x-2 player-text"
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
										<span class="player-text">播放全部</span>
									</button>
								</div>
							</div>
						</div>
					</div>
					<!-- tracklist -->
					<div class="mt-8">
						<!-- 列表头部 -->
						<div class="grid grid-cols-12 text-gray-400 text-sm py-2 px-4 border-b border-gray-800 player-text">
							<div class="col-span-1">#</div>
							<div class="col-span-5">标题</div>
							<div class="col-span-4">专辑</div>
							<div class="col-span-2 text-right">时长</div>
						</div>
						<div
							v-for="(item, index) in fav_tracks"
							:key="'index' + index"
							class="grid grid-cols-12 items-center py-3 px-4 rounded-lg group player-text hover:bg-gray-800/50"
							:class="{
								'bg-[#da5597] text-white':
									currentTrack.type == 'netease' ? currentTrack.nId == item.nId : currentTrack.id == item.id,
							}"
							@click="selectTrack(item.id, index)"
						>
							<!-- index -->
							<div class="col-span-1 text-sm">{{ index + 1 }}</div>
							<!-- cover & meta -->
							<div class="col-span-5 flex items-center space-x-3">
								<img v-lazy="item.cover_url" class="w-10 h-10 rounded" />
								<div>
									<p class="text-sm font-medium">{{ item.name }}</p>
									<div class="flex text-xs mt-1 text-gray-400">
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
							<div class="col-span-4 text-sm text-gray-400">
								{{ item.album || '-' }}
							</div>
							<!-- duration -->
							<div class="col-span-2 flex items-center justify-end space-x-4">
								<span class="text-sm text-gray-400">{{ formatTime(item.duration) }}</span>
							</div>
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

const selectTrack = (id: number, index: number) => {}
</script>

<style scoped>
.album-title {
	font-family: 'Outfit', sans-serif;
}

.player-text {
	font-family: 'Inter', sans-serif;
}
</style>
