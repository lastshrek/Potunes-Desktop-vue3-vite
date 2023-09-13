<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-03 00:14:23
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-13 14:50:00
 * @FilePath     : /src/views/Playlist.vue
 * @Description  : Playlist
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-03 00:14:23
-->
<template>
	<div class="bg-black w-full pt-14 pb-16 h-screen">
		<div class="container mx-auto h-full overflow-y-scroll flex flex-col text-white">
			<!-- title card -->
			<div class="rounded-lg shadow-md flex p-4" v-if="!isDailyTracks && playlistType !== 'trends'">
				<!-- 左侧图片 -->
				<div class="w-full md:w-1/3">
					<img v-lazy="playlist.cover" class="w-full h-auto rounded-lg mr-4 border border-gray-800" />
				</div>
				<!-- 右侧三段 -->
				<div class="w-full md:w-2/3 md:flex md:flex-col md:justify-end px-4">
					<div>
						<p class="text-lg font-semibold mb-2">
							{{ playlist.title }}
						</p>
						<!-- 专辑时展示歌手 -->
						<div class="text-xs font-semibold mb-2 flex" v-if="playlistType == 'netease-album'">
							<div
								v-for="(artist, index) in playlist.artists"
								:key="artist.id"
								@click.stop="handleArtistClick(artist.id)"
							>
								<span class="cursor-pointer hover:underline">
									{{ artist.name }}
								</span>
								<span v-if="index < playlist.artists.length - 1 && playlist.artists.length > 1" class="mx-1">/</span>
							</div>
						</div>
						<!-- 专辑时改成发行时间 -->
						<p class="text-gray-400 mb-2">
							{{ playlistType == 'netease-album' ? '发行时间：' : '最后更新于' }}{{ updateTime }}·
							{{ playlist.count || playlist.tracks.length }}首歌
						</p>
					</div>
					<!-- 专辑介绍 -->
					<!-- <p class="text-gray-50 custom-line-clamp" v-html="playlist.content"></p> -->
					<p class="mb-4 custom-truncate text-gray-400 max-h-16" v-html="playlist.content"></p>
					<div v-if="description.length > 80">
						<button @click="toggleShowMore" class="text-blue-500">查看更多</button>
					</div>
				</div>
			</div>
			<!-- 日推 card -->
			<div v-else-if="isDailyTracks" class="rounded-lg shadow-md flex p-4">
				<!-- 左侧图片 -->
				<div class="w-full md:w-40 relative text-center">
					<img :src="dailyImageSrc" class="w-full h-auto rounded-lg mr-4 border border-gray-800" />
					<div class="absolute inset-0 flex items-center justify-center">
						<p class="text-gray-800 text-center text-4xl font-semibold">
							{{ today }}
						</p>
					</div>
				</div>
				<!-- 右侧三段 -->
				<div class="w-full md:flex-1 md:flex md:flex-col justify-end px-4">
					<div>
						<p class="text-lg font-semibold mb-2">每日歌曲推荐</p>
					</div>
					<!-- 专辑介绍 -->
					<!-- <p class="text-gray-50 custom-line-clamp" v-html="playlist.content"></p> -->
					<p class="mb-4 custom-truncate text-gray-400 max-h-16">根据你的口味生成,每天6:00更新</p>
				</div>
			</div>
			<!-- 周榜card -->
			<div v-else class="rounded-lg shadow-md flex p-4">
				<!-- 左侧图片 -->
				<div class="w-full md:w-40 relative text-center">
					<img :src="dailyImageSrc" class="w-full h-auto rounded-lg mr-4 border border-gray-800" />
					<div class="absolute inset-0 flex items-center justify-center">
						<p class="text-gray-800 text-center text-4xl font-semibold">
							{{ today }}
						</p>
					</div>
				</div>
				<!-- 右侧三段 -->
				<div class="w-full md:flex-1 md:flex md:flex-col justify-end px-4">
					<div>
						<p class="text-lg font-semibold mb-2">
							{{ playlistType == 'trends' ? '大家最爱' : '每日歌曲推荐' }}
						</p>
					</div>
					<!-- 专辑介绍 -->
					<!-- <p class="text-gray-50 custom-line-clamp" v-html="playlist.content"></p> -->
					<p class="mb-4 custom-truncate text-gray-400 max-h-16">
						{{ playlistType == 'trends' ? '一周歌曲收听排行' : '根据你的口味生成,每天6:00更新' }}
					</p>
				</div>
			</div>
			<!-- tracklist -->
			<div class="w-full">
				<div
					v-for="(item, index) in playlist.tracks"
					:key="'index' + index"
					class="h-14 w-full flex justify-around items-center space-x-4 rounded-lg shadow-md mb-4"
					:class="{
						active: currentTrack.type == 'netease' ? currentTrack.nId == item.nId : currentTrack.id == item.id,
					}"
					@click="selectTrack(index)"
				>
					<!-- index -->
					<div class="mx-4 w-4">
						{{ index + 1 }}
					</div>
					<!-- cover -->
					<img v-lazy="item.cover_url" class="w-10 h-10 rounded" />
					<!-- meta -->
					<div class="flex-1 flex-col justify-end">
						<p class="text-xs font-semibold">{{ item.name }}</p>
						<div
							class="flex text-xs font-semibold text-gray-400 mt-0.5"
							:class="{
								active: currentTrack.type == 'netease' ? currentTrack.nId == item.nId : currentTrack.id == item.id,
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
					<div class="flex justify-center items-center space-x-4 px-4">
						<!-- duration -->
						<p class="text-xs font-semibold text-gray-50">
							{{ formatTime(item.duration) }}
						</p>
						<!-- <button class="px-4 py-2 bg-blue-500 text-white rounded">按钮</button> -->
					</div>
				</div>
			</div>
		</div>
		<!-- 模态框 -->
		<transition name="fade" mode="out-in">
			<div class="fixed top-14 bottom-14 flex items-center justify-center z-40" :class="{ hidden: !isModalOpen }">
				<!-- 背景遮罩 -->
				<div
					class="absolute inset-0 bg-black opacity-50 backdrop-filter backdrop-blur-md"
					@click="toggleShowMore"
				></div>

				<!-- 模态框内容 -->
				<div class="bg-white opacity-90 rounded-lg p-4 w-full h-full z-10 overflow-scroll" @click="toggleShowMore">
					<div class="flex justify-end items-center w-full">
						<button class="text-black text-center px-4 py-2 rounded hover:bg-blue-600" @click.stop="toggleShowMore">
							x
						</button>
					</div>
					<p class="my-2 text-black">{{ description }}</p>
				</div>
			</div>
		</transition>
		<loading
			:active.sync="isLoading"
			:can-cancel="true"
			background-color="rgba(0, 0, 0, 0.5)"
			color="#ec4899"
			:is-full-page="true"
		></loading>
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
import { useCurrentTrackStore } from '@/store/modules/currentTrack'
import { Artist } from '@/interfaces/artist'
import { useFullScreenStore } from '@/store/modules/fullScreen'
import { useGlobalQueueStore } from '@/store/modules/globalQueue'
import Loading from 'vue-loading-overlay'
import dailyImageSrc from '@/assets/images/daily.jpg'
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
onMounted(async () => {
	const url = route.fullPath
	const id = route.params.id as string
	try {
		// 站内歌单/专辑
		if (url.indexOf('netease') === -1 && url.indexOf('trends') === -1) {
			const [res, err] = await handlePromise(tracks(id))
			if (err) showError('获取歌单详情失败')
			// 把res.data.playlist的内容拷贝给playlist
			Object.assign(playlist, res.data.playlist)
			playlist.tracks = res.data.tracks
			description.value = playlist.content
			return
		}
		// 网易歌单
		if (url.indexOf('netease-playlist') === 1) {
			// 网易歌单
			playlistType.value = 'netease-playlist'
			const [res, err] = await handlePromise(neteasePlaylist(id))
			if (err) showError('获取歌单详情失败')
			Object.assign(playlist, res.data.playlist)
			playlist.tracks = res.data.tracks
			description.value = playlist.content
			return
		}
		// 网易专辑
		if (url.indexOf('netease-album') === 1) {
			// 网易专辑
			playlistType.value = 'netease-album'
			const [res, err] = await handlePromise(neteaseAlbum(id))
			if (err) showError('获取歌单详情失败')
			Object.assign(playlist, res.data.playlist)
			playlist.tracks = res.data.tracks
			description.value = playlist.content
			return
		}
		// 网易日推
		if (url.indexOf('netease-daily-tracks') === 1) {
			isDailyTracks.value = true
			playlistType.value = 'netease-daily-tracks'
			const cookie = localStorage.getItem('netease-cookie')
			if (!cookie) return
			const [res, err] = await handlePromise(
				neteaseDailyTracks({
					cookie,
				})
			)
			if (err) showError('获取歌单详情失败')
			Object.assign(playlist, res.data.playlist)
			playlist.tracks = res.data.tracks
			return
		}
		// 周榜
		if (url.indexOf('trends') === 1) {
			playlistType.value = 'trends'
			const [res, err] = await handlePromise(weeklyTrends())
			if (err) showError('获取歌单详情失败')
			Object.assign(playlist, res.data.playlist)
			playlist.tracks = res.data.tracks
			return
		}
		// 网易日推歌单
		playlistType.value = 'netease-daily'
		const [res, err] = await handlePromise(neteasePlaylistDetail(id))
		if (err) showError('获取歌单详情失败')
		playlist = res.data.playlist
		playlist.tracks = res.data.tracks
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
	useFullScreenStore().setIsFullScreen(false)
	playlist.currentIndex = index
	globalQueue.setGlobalQueue(playlist.tracks, index)
	active_el.value = playlist.tracks[index].id
	// TODO update play counts
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
</script>

<style scoped lang="scss">
.active {
	border-radius: 5px;
	background: #ec4899;
	color: white !important;
}

.custom-truncate {
	display: -webkit-box;
	-webkit-line-clamp: 4;
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
