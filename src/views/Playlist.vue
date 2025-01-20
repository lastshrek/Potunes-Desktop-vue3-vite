<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-03 00:14:23
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-20 16:06:21
 * @FilePath     : /src/views/Playlist.vue
 * @Description  : Playlist
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-03 00:14:23
-->
<template>
	<div class="w-full">
		<div class="bg-black w-full pt-16 pb-20 h-screen">
			<div class="h-full overflow-y-scroll flex flex-col text-white px-6 pt-8">
				<!-- title card -->
				<template v-if="!isLoading">
					<div class="flex flex-col w-full" v-if="!isDailyTracks && playlistType !== 'trends'">
						<!-- 顶部信息区域 -->
						<div class="flex items-start space-x-6 w-full">
							<!-- 封面图片 -->
							<div
								class="flex-shrink-0"
								:class="playlistType === 'collection' ? 'aspect-[32/15] h-36' : 'aspect-square w-64'"
							>
								<img v-lazy="playlist.cover" class="w-full h-full object-cover rounded-lg" />
							</div>
							<!-- 右侧信息 -->
							<div class="flex flex-col flex-grow w-full">
								<h1 class="text-3xl font-bold mb-2 album-title">{{ playlist.title }}</h1>
								<!-- 专辑时展示歌手 -->
								<div
									class="text-sm font-medium mb-4 flex items-center player-text"
									v-if="playlistType == 'netease-album'"
								>
									<div
										v-for="(artist, index) in playlist.artists"
										:key="artist.id"
										@click.stop="handleArtistClick(artist.id)"
									>
										<span class="cursor-pointer hover:underline">
											{{ artist.name }}
										</span>
										<span v-if="index < playlist.artists.length - 1 && playlist.artists.length > 1" class="mx-1">
											/
										</span>
									</div>
								</div>
								<!-- 专辑时改成发行时间 -->
								<p class="text-sm text-gray-400 mb-4 player-text">
									{{ playlistType == 'netease-album' ? '发行时间：' : '最后更新于' }}{{ updateTime }}·
									{{ playlist.count || playlist.tracks.length }}首歌
								</p>
								<!-- 描述 -->
								<p class="text-sm text-gray-400 mb-4 line-clamp-3 player-text" v-html="playlist.content"></p>
								<div v-if="description.length > 80" class="mb-4">
									<button @click="toggleShowMore" class="text-blue-500 text-sm player-text">查看更多</button>
								</div>
								<!-- 操作按钮 -->
								<div class="flex items-center space-x-4">
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
										<span class="player-text">播放</span>
									</button>
									<button
										class="bg-[#da5597] text-white px-8 py-2 rounded-full hover:bg-[#da5597]/90 flex items-center justify-center space-x-2 player-text"
										@click="playRandom"
									>
										<svg
											t="1691599262562"
											class="icon w-5 h-5"
											viewBox="0 0 1024 1024"
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											p-id="7775"
										>
											<path
												d="M768.863 325.733c-48.775 0-170.409 121.182-259.229 207.077-134.661 130.244-261.862 256.802-363.67 256.802h-62.62C57.75 789.612 37 768.828 37 743.223c0-25.604 20.749-46.387 46.342-46.387h62.622c64.335 0 194.592-129.518 299.256-230.745 127.382-123.198 237.392-233.135 323.643-233.135h59.769l-63.418-61.55c-18.113-18.088-18.142-45.665-0.062-63.788 18.08-18.128 47.422-18.164 65.535-0.07l142.708 142.495A46.306 46.306 0 0 1 987 282.83c0 12.308-4.893 24.06-13.604 32.759l-142.71 142.4c-9.043 9.032-20.89 13.328-32.735 13.328-11.875 0-23.749-4.977-32.799-14.05-18.08-18.121-18.05-48.358 0.062-66.445l63.417-65.09h-59.768z m61.824 238.627c-18.113-18.095-47.456-18.066-65.535 0.062-18.08 18.121-18.05 49.237 0.062 67.323l63.417 65.09h-59.768c-38.06 0-101.643-56.357-164.685-115.353-18.69-17.493-48.021-17.394-65.495 1.306-17.486 18.7-16.507 49.382 2.183 66.87 96.042 89.898 160.826 139.952 227.997 139.952h59.769l-63.418 61.549c-18.113 18.087-18.142 46.552-0.062 64.674 9.051 9.072 20.924 13.167 32.799 13.167 11.845 0 23.692-4.74 32.736-13.773l142.708-142.619c8.71-8.7 13.604-20.56 13.604-32.87a46.44 46.44 0 0 0-13.604-32.842L830.687 564.36zM83.342 325.733h62.622c48.84 0 121.646 62.22 179.612 114.893 8.88 8.065 20.026 12.923 31.147 12.923 12.604 0 25.172-4.677 34.315-14.75 17.208-18.954 15.8-49.839-3.146-67.055-90.646-82.365-166.477-138.787-241.928-138.787H83.342C57.749 232.957 37 253.743 37 279.346s20.75 46.387 46.342 46.387z"
												fill="currentColor"
											></path>
										</svg>
										<span class="player-text">随机播放</span>
									</button>
								</div>
							</div>
						</div>

						<!-- 歌曲列表 -->
						<div class="mt-8">
							<!-- 列表头部 -->
							<div class="grid grid-cols-12 text-gray-400 text-sm py-2 px-4 border-b border-gray-800 player-text">
								<div class="col-span-1">#</div>
								<div class="col-span-5">标题</div>
								<div class="col-span-4">专辑</div>
								<div class="col-span-2 text-right">时长</div>
							</div>
							<!-- 歌曲列表 -->
							<div
								v-for="(item, index) in playlist.tracks"
								:key="'index' + index"
								class="grid grid-cols-12 items-center py-3 px-4 rounded-lg group player-text"
								:class="{
									'bg-[#da5597] text-white':
										currentTrack.type == 'netease' ? currentTrack.nId == item.nId : currentTrack.id == item.id,
									'hover:bg-gray-800/50': !(currentTrack.type == 'netease'
										? currentTrack.nId == item.nId
										: currentTrack.id == item.id),
								}"
								@click="selectTrack(index)"
							>
								<div
									class="col-span-1 text-sm"
									:class="{
										'text-gray-400': !(currentTrack.type == 'netease'
											? currentTrack.nId == item.nId
											: currentTrack.id == item.id),
									}"
								>
									{{ index + 1 }}
								</div>
								<div class="col-span-5 flex items-center space-x-3">
									<img v-lazy="item.cover_url" class="w-10 h-10 rounded" />
									<div>
										<p class="text-sm font-medium album-title">{{ item.name }}</p>
										<div
											class="flex text-xs mt-1"
											:class="{
												'text-gray-400': !(currentTrack.type == 'netease'
													? currentTrack.nId == item.nId
													: currentTrack.id == item.id),
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
								<div
									class="col-span-4 text-sm"
									:class="{
										'text-gray-400': !(currentTrack.type == 'netease'
											? currentTrack.nId == item.nId
											: currentTrack.id == item.id),
									}"
								>
									{{ item.album || '-' }}
								</div>
								<div
									class="col-span-2 flex items-center justify-end space-x-4"
									:class="{
										'text-gray-400': !(currentTrack.type == 'netease'
											? currentTrack.nId == item.nId
											: currentTrack.id == item.id),
									}"
								>
									<span class="text-sm">{{ formatTime(item.duration) }}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- 日推 card -->
					<div v-else-if="isDailyTracks" class="flex flex-col">
						<!-- 顶部信息区域 -->
						<div class="flex items-start space-x-6">
							<!-- 封面图片 -->
							<div class="w-64 h-64 flex-shrink-0 relative">
								<img :src="dailyImageSrc" class="w-full h-full object-cover rounded-lg" />
								<div class="absolute inset-0 flex items-center justify-center">
									<p class="text-gray-800 text-4xl font-bold album-title">{{ today }}</p>
								</div>
							</div>
							<!-- 右侧信息 -->
							<div class="flex flex-col flex-grow">
								<h1 class="text-3xl font-bold mb-2 album-title">每日歌曲推荐</h1>
								<p class="text-sm text-gray-400 mb-4 player-text">根据你的口味生成，每天6:00更新</p>
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
										<span class="player-text">播放</span>
									</button>
									<button
										class="bg-[#da5597] text-white px-8 py-2 rounded-full hover:bg-[#da5597]/90 flex items-center justify-center space-x-2 player-text"
										@click="playRandom"
									>
										<svg
											t="1691599262562"
											class="icon w-5 h-5"
											viewBox="0 0 1024 1024"
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											p-id="7775"
										>
											<path
												d="M768.863 325.733c-48.775 0-170.409 121.182-259.229 207.077-134.661 130.244-261.862 256.802-363.67 256.802h-62.62C57.75 789.612 37 768.828 37 743.223c0-25.604 20.749-46.387 46.342-46.387h62.622c64.335 0 194.592-129.518 299.256-230.745 127.382-123.198 237.392-233.135 323.643-233.135h59.769l-63.418-61.55c-18.113-18.088-18.142-45.665-0.062-63.788 18.08-18.128 47.422-18.164 65.535-0.07l142.708 142.495A46.306 46.306 0 0 1 987 282.83c0 12.308-4.893 24.06-13.604 32.759l-142.71 142.4c-9.043 9.032-20.89 13.328-32.735 13.328-11.875 0-23.749-4.977-32.799-14.05-18.08-18.121-18.05-48.358 0.062-66.445l63.417-65.09h-59.768z m61.824 238.627c-18.113-18.095-47.456-18.066-65.535 0.062-18.08 18.121-18.05 49.237 0.062 67.323l63.417 65.09h-59.768c-38.06 0-101.643-56.357-164.685-115.353-18.69-17.493-48.021-17.394-65.495 1.306-17.486 18.7-16.507 49.382 2.183 66.87 96.042 89.898 160.826 139.952 227.997 139.952h59.769l-63.418 61.549c-18.113 18.087-18.142 46.552-0.062 64.674 9.051 9.072 20.924 13.167 32.799 13.167 11.845 0 23.692-4.74 32.736-13.773l142.708-142.619c8.71-8.7 13.604-20.56 13.604-32.87a46.44 46.44 0 0 0-13.604-32.842L830.687 564.36zM83.342 325.733h62.622c48.84 0 121.646 62.22 179.612 114.893 8.88 8.065 20.026 12.923 31.147 12.923 12.604 0 25.172-4.677 34.315-14.75 17.208-18.954 15.8-49.839-3.146-67.055-90.646-82.365-166.477-138.787-241.928-138.787H83.342C57.749 232.957 37 253.743 37 279.346s20.75 46.387 46.342 46.387z"
												fill="currentColor"
											></path>
										</svg>
										<span class="player-text">随机播放</span>
									</button>
								</div>
							</div>
						</div>

						<!-- 歌曲列表部分与上面相同 -->
						<div class="mt-8">
							<!-- 列表头部 -->
							<div class="grid grid-cols-12 text-gray-400 text-sm py-2 px-4 border-b border-gray-800 player-text">
								<div class="col-span-1">#</div>
								<div class="col-span-5">标题</div>
								<div class="col-span-4">专辑</div>
								<div class="col-span-2 text-right">时长</div>
							</div>
							<!-- 歌曲列表 -->
							<div
								v-for="(item, index) in playlist.tracks"
								:key="'index' + index"
								class="grid grid-cols-12 items-center py-3 px-4 rounded-lg group player-text"
								:class="{
									'bg-[#da5597] text-white':
										currentTrack.type == 'netease' ? currentTrack.nId == item.nId : currentTrack.id == item.id,
									'hover:bg-gray-800/50': !(currentTrack.type == 'netease'
										? currentTrack.nId == item.nId
										: currentTrack.id == item.id),
								}"
								@click="selectTrack(index)"
							>
								<div
									class="col-span-1 text-sm"
									:class="{
										'text-gray-400': !(currentTrack.type == 'netease'
											? currentTrack.nId == item.nId
											: currentTrack.id == item.id),
									}"
								>
									{{ index + 1 }}
								</div>
								<div class="col-span-5 flex items-center space-x-3">
									<img v-lazy="item.cover_url" class="w-10 h-10 rounded" />
									<div>
										<p class="text-sm font-medium album-title">{{ item.name }}</p>
										<div
											class="flex text-xs mt-1"
											:class="{
												'text-gray-400': !(currentTrack.type == 'netease'
													? currentTrack.nId == item.nId
													: currentTrack.id == item.id),
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
								<div
									class="col-span-4 text-sm"
									:class="{
										'text-gray-400': !(currentTrack.type == 'netease'
											? currentTrack.nId == item.nId
											: currentTrack.id == item.id),
									}"
								>
									{{ item.album || '-' }}
								</div>
								<div
									class="col-span-2 flex items-center justify-end space-x-4"
									:class="{
										'text-gray-400': !(currentTrack.type == 'netease'
											? currentTrack.nId == item.nId
											: currentTrack.id == item.id),
									}"
								>
									<span class="text-sm">{{ formatTime(item.duration) }}</span>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else>
					<!-- Skeleton Loading -->
					<div class="flex flex-col w-full">
						<div class="flex items-start space-x-6 w-full">
							<!-- 封面图片 skeleton -->
							<div class="w-64 aspect-square bg-gray-800/50 animate-pulse rounded-lg"></div>
							<!-- 右侧信息 skeleton -->
							<div class="flex flex-col flex-grow w-full">
								<div class="h-8 w-64 bg-gray-800/50 animate-pulse rounded mb-4"></div>
								<div class="h-4 w-48 bg-gray-800/50 animate-pulse rounded mb-4"></div>
								<div class="h-4 w-96 bg-gray-800/50 animate-pulse rounded mb-4"></div>
								<div class="flex items-center space-x-4">
									<div class="h-10 w-24 bg-gray-800/50 animate-pulse rounded-full"></div>
									<div class="h-10 w-24 bg-gray-800/50 animate-pulse rounded-full"></div>
								</div>
							</div>
						</div>

						<!-- 列表 skeleton -->
						<div class="mt-8">
							<div class="grid grid-cols-12 text-gray-400 text-sm py-2 px-4 border-b border-gray-800">
								<div class="col-span-1">#</div>
								<div class="col-span-5">标题</div>
								<div class="col-span-4">专辑</div>
								<div class="col-span-2 text-right">时长</div>
							</div>
							<div v-for="n in 10" :key="n" class="grid grid-cols-12 items-center py-3 px-4 rounded-lg">
								<div class="col-span-1">
									<div class="h-4 w-4 bg-gray-800/50 animate-pulse rounded"></div>
								</div>
								<div class="col-span-5 flex items-center space-x-3">
									<div class="w-10 h-10 bg-gray-800/50 animate-pulse rounded"></div>
									<div class="flex-1">
										<div class="h-4 w-48 bg-gray-800/50 animate-pulse rounded mb-2"></div>
										<div class="h-3 w-32 bg-gray-800/50 animate-pulse rounded"></div>
									</div>
								</div>
								<div class="col-span-4">
									<div class="h-4 w-32 bg-gray-800/50 animate-pulse rounded"></div>
								</div>
								<div class="col-span-2 flex justify-end">
									<div class="h-4 w-16 bg-gray-800/50 animate-pulse rounded"></div>
								</div>
							</div>
						</div>
					</div>
				</template>

				<!-- 模态框 -->
				<transition name="fade" mode="out-in">
					<div class="fixed top-14 bottom-14 flex items-center justify-center z-40" :class="{ hidden: !isModalOpen }">
						<div class="absolute inset-0 bg-black/50 backdrop-blur-md" @click="toggleShowMore"></div>
						<div class="bg-white/90 rounded-lg p-4 w-full h-full z-10 overflow-scroll" @click="toggleShowMore">
							<div class="flex justify-end items-center w-full">
								<button
									class="text-black text-center px-4 py-2 rounded hover:bg-blue-600 player-text"
									@click.stop="toggleShowMore"
								>
									x
								</button>
							</div>
							<p class="my-2 text-black player-text">{{ description }}</p>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
	tracks,
	neteasePlaylist,
	neteaseAlbum,
	neteaseDailyTracks,
	weeklyTrends,
	neteasePlaylistDetail,
} from '@/api/index'
import { formatTime, handlePromise, showError, getCurrentDate } from '@/utils/index'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'
import { Artist } from '@/interfaces/artist'
import { useGlobalQueueStore } from '@/store/modules/globalQueue'
import { useIsPlayingStore } from '@/store/modules/isPlaying'
import dailyImageSrc from '@/assets/images/daily.png'
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
// 路由
const route = useRoute()
const router = useRouter()
// 加载中
const isLoading = ref(true)
// 是否是网易日推
const isDailyTracks = ref(false)
// 模态框
const isModalOpen = ref(false)
// 歌单类型
const playlistType = ref('')
// 描述
const description = ref('')
// 更新时间
const updateTime = ref('')
// 当前播放歌曲索引
const active_el = ref(-1)
// 今天
const today = getCurrentDate()
// 当前歌曲
const currentTrack = useCurrentTrackStore()
// 播放队列
const globalQueue = useGlobalQueueStore()
const isPlaying = useIsPlayingStore()
onMounted(async () => {
	const url = route.fullPath
	const id = route.params.id as string
	try {
		// 站内歌单/专辑
		if (url.indexOf('netease') === -1 && url.indexOf('trends') === -1) {
			const [res] = await handlePromise(tracks(id))
			// 把res.playlist的内容拷贝给playlist
			Object.assign(playlist, res.playlist)
			playlist.tracks = res.tracks
			description.value = playlist.content
			// 设置类型
			playlistType.value = res.playlist.type || ''
			return
		}
		// 网易歌单
		if (url.indexOf('netease-playlist') !== -1) {
			// 网易歌单
			playlistType.value = 'netease-playlist'
			const [res, err] = await handlePromise(neteasePlaylist(id))
			if (err) showError('获取歌单详情失败')
			Object.assign(playlist, res.playlist)
			playlist.tracks = res.tracks
			description.value = playlist.content
			return
		}
		// 网易专辑
		if (url.indexOf('netease-album') !== -1) {
			// 网易专辑
			playlistType.value = 'netease-album'
			const [res, err] = await handlePromise(neteaseAlbum(id))
			if (err) showError('获取歌单详情失败')
			Object.assign(playlist, res.playlist)
			playlist.tracks = res.tracks
			description.value = playlist.content
			return
		}
		// 网易日推
		if (url.indexOf('netease-daily-tracks') !== -1) {
			isDailyTracks.value = true
			playlistType.value = 'netease-daily-tracks'
			const cookie = localStorage.getItem('netease-cookie')
			if (!cookie) return
			const [res] = await handlePromise(
				neteaseDailyTracks({
					cookie,
				})
			)
			console.log('res', res)
			if (!res) return
			Object.assign(playlist, res)
			playlist.tracks = res
			return
		}
		// 周榜
		if (url.indexOf('trends') !== -1) {
			playlistType.value = 'trends'
			const [res] = await handlePromise(weeklyTrends())
			if (!res) return
			Object.assign(playlist, res.playlist)
			playlist.tracks = res.tracks
			return
		}
		// 网易日推歌单
		playlistType.value = 'netease-daily'
		const [res, err] = await handlePromise(neteasePlaylistDetail(id))
		if (err) showError('获取歌单详情失败')
		playlist = res.playlist
		playlist.tracks = res.tracks
	} catch (error: any) {
		showError(error.message)
	} finally {
		isLoading.value = false
	}
})
const getActiveTrack = (tracks: Track[]) => {
	if (tracks.length == 0) return
	for (let index = 0; index < tracks.length; index++) {
		const element = tracks[index]
		if (element.id === currentTrack.id) {
			active_el.value = currentTrack.id
			console.log('active_el', active_el.value)
			break
		}
	}
}
const toggleShowMore = () => {
	isModalOpen.value = !isModalOpen.value
}
const handleArtistClick = (artistId: number) => {
	router.push({
		path: `/artist/${artistId}`,
	})
}
const selectTrack = (index: number) => {
	playlist.currentIndex = index
	globalQueue.setGlobalQueue(playlist.tracks, index)
	active_el.value = playlist.tracks[index].id
	isPlaying.setIsPlaying(true)
}
watch(
	() => playlist,
	newValue => {
		// 格式化时间
		const updateAt = new Date(newValue.updated_at).getTime()
		const time = new Date(updateAt)
		updateTime.value = time.getFullYear() + '年' + `${time.getMonth() + 1}` + '月' + time.getDate() + '日'
	},
	{ deep: true }
)
watch(
	() => globalQueue,
	() => {
		getActiveTrack(playlist.tracks)
	},
	{ deep: true }
)
// 播放全部
const playAll = () => {
	if (playlist.tracks.length === 0) return
	globalQueue.setGlobalQueue(playlist.tracks, 0)
}
// 随机播放
const playRandom = () => {
	if (playlist.tracks.length === 0) return
	const randomIndex = Math.floor(Math.random() * playlist.tracks.length)
	globalQueue.setGlobalQueue(playlist.tracks, randomIndex)
}
</script>

<style scoped lang="scss">
.active {
	border-radius: 5px;
	background: #da5597;
	color: white !important;
}

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
</style>
