<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:28:54
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-19 09:38:55
 * @FilePath     : /src/views/Trends.vue
 * @Description  : Trends
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:28:54
-->
<template>
	<div class="bg-black w-full h-screen pt-16 pb-20">
		<div class="container mx-auto h-full overflow-y-scroll flex flex-col text-white">
			<!-- 周榜card -->
			<div v-if="!isLoading" class="rounded-lg shadow-md flex p-4">
				<!-- 左侧图片 -->
				<div class="w-full md:w-40 relative text-center">
					<img :src="hotImageSrc" class="w-full h-auto rounded-lg mr-4 border border-gray-800" />
				</div>
				<!-- 右侧三段 -->
				<div class="w-full md:flex-1 md:flex md:flex-col justify-end px-4">
					<div>
						<p class="text-lg font-semibold mb-2">大家最爱</p>
					</div>
					<!-- 专辑介绍 -->
					<p class="mb-4 custom-truncate text-gray-400 max-h-16">一周歌曲收听排行『{{ weekago }} - {{ todayFull }}』</p>
				</div>
			</div>
			<div v-else class="rounded-lg shadow-md flex p-4 animate-pulse">
				<div class="w-full md:w-40 relative">
					<div class="w-full h-40 bg-gray-800 rounded-lg"></div>
				</div>
				<div class="w-full md:flex-1 md:flex md:flex-col justify-end px-4">
					<div class="h-6 bg-gray-800 rounded w-1/4 mb-2"></div>
					<div class="h-4 bg-gray-800 rounded w-3/4"></div>
				</div>
			</div>

			<!-- tracklist -->
			<div class="w-full">
				<!-- 列表头部 -->
				<div class="grid grid-cols-12 text-gray-400 text-sm py-2 px-4 border-b border-gray-800 player-text">
					<div class="col-span-1">#</div>
					<div class="col-span-5">标题</div>
					<div class="col-span-4">专辑</div>
					<div class="col-span-2 text-right">时长</div>
				</div>
				<template v-if="!isLoading">
					<div
						v-for="(item, index) in playlist.tracks"
						:key="'index' + index"
						class="grid grid-cols-12 items-center py-3 px-4 rounded-lg group player-text"
						:class="{
							'bg-[#da5597] text-white': isCurrentTrack(item),
							'hover:bg-gray-800/50': !isCurrentTrack(item),
						}"
						@click="selectTrack(index)"
					>
						<!-- index -->
						<div class="col-span-1 text-sm">
							{{ index + 1 }}
						</div>
						<!-- cover -->
						<div class="col-span-5 flex items-center space-x-3">
							<img v-lazy="item.cover_url" class="w-10 h-10 rounded" />
							<div>
								<p class="text-sm font-medium">{{ item.name }}</p>
								<div
									class="flex text-xs mt-1"
									:class="{
										'text-gray-400': !isCurrentTrack(item),
									}"
								>
									<div
										v-for="(artist, index) in item.ar"
										:key="'artist' + artist.id + index"
										@click.stop="handleArtistClick(artist.id)"
									>
										<span class="cursor-pointer hover:underline">
											{{ artist.name }}
										</span>
										<span v-if="index < item.ar.length - 1 && item.ar.length > 1" class="mx-1">/</span>
									</div>
								</div>
							</div>
						</div>
						<!-- album -->
						<div
							class="col-span-4 text-sm"
							:class="{
								'text-gray-400': !isCurrentTrack(item),
							}"
						>
							{{ item.album || '-' }}
						</div>
						<!-- duration -->
						<div class="col-span-2 flex items-center justify-end space-x-4">
							<!-- duration -->
							<span
								class="text-sm"
								:class="{
									'text-gray-400': !isCurrentTrack(item),
								}"
							>
								{{ formatTime(item.duration) }}
							</span>
						</div>
					</div>
				</template>
				<template v-else>
					<div
						v-for="i in 10"
						:key="i"
						class="grid grid-cols-12 items-center py-3 px-4 rounded-lg group player-text animate-pulse"
					>
						<div class="col-span-1 text-sm">
							{{ i }}
						</div>
						<div class="col-span-5">
							<div class="h-3 bg-gray-800 rounded w-1/4"></div>
						</div>
						<div class="col-span-4">
							<div class="h-2 bg-gray-800 rounded w-2/3"></div>
						</div>
						<div class="col-span-2 flex items-center justify-end space-x-4">
							<div class="h-2 bg-gray-800 rounded w-1/3"></div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'
import { Artist } from '@/interfaces/artist'
import { useGlobalQueueStore } from '@/store/modules/globalQueue'
import { useRouter } from 'vue-router'
import { formatTime, handlePromise, showError } from '@/utils/index'
import { weeklyTrends } from '@/api/index'
import hotImageSrc from '@/assets/images/hot.png'

const currentTrack = useCurrentTrackStore()
const todayFull = ref('')
const weekago = ref('')
const isLoading = ref(true)
// 当前播放歌曲索引
const active_el = ref(-1)
// 路由
const router = useRouter()
// 播放队列
const globalQueue = useGlobalQueueStore()
let playlist = reactive({
	title: '',
	cover: '',
	content: '',
	artists: [] as Artist[],
	count: 0,
	updated_at: '',
	currentIndex: -1,
	tracks: [] as Track[],
})

onMounted(async () => {
	// 获取今天日期
	const today = new Date()
	const year = today.getFullYear()
	const month = today.getMonth() + 1
	const day = today.getDate()
	todayFull.value = `${year}年${month}月${day}日`
	// 获取七天前的日期
	const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
	const sevenYear = sevenDaysAgo.getFullYear()
	const sevenMonth = sevenDaysAgo.getMonth() + 1
	const sevenDay = sevenDaysAgo.getDate()
	weekago.value = `${sevenYear}年${sevenMonth}月${sevenDay}日`
	// 获取周榜
	const [res, err] = await handlePromise(weeklyTrends())
	if (err) showError('获取歌单详情失败')
	playlist.tracks = res
	isLoading.value = false
})
// 点击歌曲
const selectTrack = (index: number) => {
	playlist.currentIndex = index
	globalQueue.setGlobalQueue(playlist.tracks, index)
	active_el.value = playlist.tracks[index].id
	// TODO update play counts
}

const handleArtistClick = (artistId: number) => {
	router.push({
		path: `/artist/${artistId}`,
	})
}

const handleAlbumClick = (albumId?: number) => {
	if (!albumId) return
	router.push({
		path: `/album/${albumId}`,
	})
}

const isCurrentTrack = (item: Track) => {
	return currentTrack.type == 'netease' ? currentTrack.nId == item.nId : currentTrack.id == item.id
}
</script>

<style scoped lang="scss">
.custom-truncate {
	display: -webkit-box;
	-webkit-line-clamp: 4;
	line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.7s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.album-title {
	font-family: 'Outfit', sans-serif;
}

.player-text {
	font-family: 'Inter', sans-serif;
}
</style>
