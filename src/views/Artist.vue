<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:32:07
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-04 14:13:07
 * @FilePath     : /src/views/Artist.vue
 * @Description  : Artist Page
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:32:07
-->
<template>
	<div class="bg-black overflow-y-scroll pt-14 pb-16 h-screen container mx-auto">
		<div class="w-full mt-4 h-full overflow-y-scroll flex flex-col text-white px-4">
			<!-- artist info -->
			<div class="flex flex-wrap lg:flex-no-wrap">
				<!-- Left side image, take 1/3 of the width on larger screens -->
				<div class="w-full md:w-1/3">
					<img v-if="artist.avatar" v-lazy="artist.avatar" alt="Image" class="w-full h-auto rounded-lg" />
				</div>
				<!-- Right side text -->
				<div class="w-full md:w-2/3 md:flex md:flex-col justify-end px-4">
					<p class="text-4xl font-semibold mb-2">{{ artist.name }}</p>
					<!-- <p class="text-gray-600" v-html="artist.briefDesc"></p> -->
					<p class="mb-4 custom-truncate text-gray-400 max-h-16" v-html="artist.briefDesc"></p>
					<div v-if="description.length > 80">
						<button @click="toggleShowMore" class="text-blue-500">查看更多</button>
					</div>
				</div>
			</div>
			<!-- albums -->
			<HeaderTitle title="最新专辑"></HeaderTitle>
			<div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-6">
				<AlbumCard
					v-for="album in albums"
					:key="album.id"
					:name="album.name"
					:cover_url="album.picUrl"
					@click.native="selectAlbum(album.id)"
				></AlbumCard>
			</div>
			<!-- hot tracks -->
			<HeaderTitle title="热门单曲" :showmore="false"></HeaderTitle>
			<div class="w-full mt-2">
				<div
					v-for="(item, index) in hotSongs"
					:key="index"
					class="h-14 w-full flex justify-between md:justify-around items-center md:space-x-4 space-x-1 rounded-lg shadow-md mb-4"
					:class="{
						active:
							currentTrack.type == 'netease'
								? currentTrack.nId == item.nId
								: !currentTrack.type
								? false
								: currentTrack.id == item.id,
					}"
					@click="selectTrack(index)"
				>
					<!-- index -->
					<div class="m-2 md:m-4 text-xs w-2">
						{{ index + 1 }}
					</div>
					<!-- cover -->
					<div class="w-10 h-10 rounded overflow-hidden">
						<img v-lazy="item.cover_url" />
					</div>
					<!-- meta -->
					<div class="flex-1 flex-col justify-end space-y-1">
						<p class="text-xs font-semibold">{{ item.name }}</p>
						<p class="text-xs font-semibold">{{ item.album }}</p>
					</div>
					<div class="flex justify-center items-center space-x-4 px-4">
						<!-- duration -->
						<p class="text-xs font-semibold text-gray-50">
							{{ formatTime(item.duration) }}
						</p>
						<!-- <button class="px-4 py-2 bg-blue-500 text-white rounded">按钮</button> -->
					</div>
					<!-- <div class="flex justify-around items-center space-x-4">

          </div> -->
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
					<p class="my-2 text-black">{{ artist.briefDesc }}</p>
				</div>
			</div>
		</transition>
		<!-- loading -->
		<loading
			:active="isLoading"
			:can-cancel="true"
			background-color="rgba(0, 0, 0, 0.5)"
			color="#ec4899"
			:is-full-page="false"
		></loading>
	</div>
</template>

<script setup lang="ts">
import { Artist } from '@/interfaces/artist'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { neteaseArtist, neteaseArtistAlbum, neteaseArtistHotSongs } from '@/api/index'
import { formatTime, handlePromise, showError } from '@/utils/index'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'
import HeaderTitle from '@/components/headertitle/HeaderTitle.vue'
import AlbumCard from '@/components/albumcard/AlbumCard.vue'
import Loading from 'vue-loading-overlay'
import { useGlobalQueueStore } from '@/store/modules/globalQueue'
const isLoading = ref(true)
const description = ref('')
const artist_id = ref('')
const active_el = ref(-1)
const isModalOpen = ref(false)
const currentTrack = useCurrentTrackStore()
// 播放队列
const globalQueue = useGlobalQueueStore()
let artist = reactive({} as Artist)
// TODO album类型
const albums = ref([] as any[])
const hotSongs = ref([] as Track[])
const router = useRouter()
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
	artist_id.value = useRoute().params.id as string
	await getArtistInfo()
	await getArtistAlbums()
	await getArtistHotSongs()
	isLoading.value = false
})
// 获取歌手信息
const getArtistInfo = async () => {
	const [res, err] = await handlePromise(neteaseArtist(artist_id.value))
	if (err) return showError('获取歌手信息失败')
	artist = res.data as Artist
	if (artist.briefDesc) {
		description.value = artist.briefDesc
	}
}
// 获取歌手热门专辑
const getArtistAlbums = async () => {
	const [res, err] = await handlePromise(neteaseArtistAlbum(artist_id.value, '5', '0'))
	if (err) return showError('获取歌手专辑失败')
	albums.value = res.data
}
// 获取歌手热门歌曲
const getArtistHotSongs = async () => {
	const [res, err] = await handlePromise(neteaseArtistHotSongs(artist_id.value))
	if (err) return showError('获取歌手热门歌曲失败')
	hotSongs.value = res.data
	playlist.tracks = res.data
}
// 展示歌手介绍
const toggleShowMore = () => {
	isModalOpen.value = !isModalOpen.value
}
// 点击歌曲
const selectTrack = (index: number) => {
	playlist.currentIndex = index
	globalQueue.setGlobalQueue(playlist.tracks, index)
	active_el.value = playlist.tracks[index].id
	// TODO update play counts
}
// 点击专辑
const selectAlbum = (albumId: string) => {
	router.push({
		path: `/netease-album/${albumId}`,
	})
}
</script>

<style lang="scss" scoped>
.active {
	border-radius: 5px;
	background: #ec4899;
	color: white !important;
}

.custom-truncate {
	display: -webkit-box;
	-webkit-line-clamp: 4;
	line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
