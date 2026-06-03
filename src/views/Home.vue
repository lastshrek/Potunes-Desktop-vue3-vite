<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-01 21:16:34
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-20 16:51:35
 * @FilePath     : /src/views/Home.vue
 * @Description  : Home
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-01 21:16:34
-->
<template>
	<div class="min-h-screen pt-16 pb-24 w-full bg-black">
		<!-- 更新提示对话框 -->
		<Dialog :open="showUpdateDialog" @update:open="showUpdateDialog = $event">
			<DialogContent class="bg-[#111111] border border-gray-800">
				<DialogHeader>
					<DialogTitle class="text-white">发现新版本 {{ newVersion }}</DialogTitle>
					<DialogDescription>
						<div class="text-gray-300 whitespace-pre-line">{{ updateText }}</div>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						class="bg-[#1a1a1a] border-gray-700 text-gray-300 hover:bg-transparent hover:text-white"
						@click="showUpdateDialog = false"
					>
						取消
					</Button>
					<Button class="bg-[#da5597] hover:bg-[#c94884] text-white" @click="handleUpdate">前往下载</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		<!-- 头部 -->
		<div class="container mx-auto px-6">
			<div class="h-76 w-full">
				<div class="flex items-center gap-6">
					<div class="w-1/2 flex items-center gap-6 justify-between">
						<h2 class="text-lg font-semibold text-white">New Collections</h2>
						<Button variant="link" class="text-[#da5597] text-xs" @click="router.push('/albums/collections')">
							See all
						</Button>
					</div>
					<div class="w-1/4 flex items-center gap-6 justify-between">
						<h2 class="text-lg font-semibold text-white">New Final</h2>
						<Button variant="link" class="text-[#da5597] text-xs" @click="router.push('/albums/finals')">
							See all
						</Button>
					</div>
					<div class="w-1/4 flex items-center gap-6 justify-between"></div>
				</div>
				<div class="flex gap-6 h-[calc(100%-2rem)]">
					<div class="w-1/2 rounded-lg overflow-hidden">
						<div class="relative w-full h-full">
							<template v-if="!isLoading && lastestCollections?.length">
								<div
									v-for="(collection, index) in lastestCollections"
									:key="collection.id"
									class="absolute inset-0 transition-opacity duration-500"
									:class="{ 'opacity-0': currentIndex !== index, 'z-10': currentIndex === index }"
									:data-playlist-id="collection.id"
								>
									<AlbumCard
										:cover_url="collection.cover"
										:name="collection.title"
										:id="collection.id"
										:info="`${formatPlaylistUpdateTime(collection.updated_at || '')} · ${
											collection.count || 0
										}首歌 · ${formatPlaylistDurationToHourStr(collection.duration || 0)}`"
										max_width="w-full"
										:showPlayButton="false"
										:showControls="true"
										:showInfo="true"
										:titleSize="'text-2xl'"
										:useColorThief="false"
									/>
								</div>

								<!-- 右下角缩略图 -->
								<div class="absolute bottom-6 right-6 flex gap-2 z-10">
									<div
										v-for="collection in nextCollections"
										:key="collection.id"
										class="w-32 aspect-[32/15] rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#da5597]/90 transition-all"
										@click="toPlaylist(collection.id, '')"
									>
										<img v-lazy="collection.cover" :alt="collection.title" class="w-full h-full object-cover" />
									</div>
								</div>
							</template>
							<template v-if="isLoading">
								<AlbumCardSkeleton :imageRatio="'wide'" />
							</template>
						</div>
					</div>
					<div class="w-1/4 rounded-lg overflow-hidden">
						<template v-if="!isLoading && finalLatest">
							<AlbumCard
								:cover_url="finalLatest?.cover"
								:name="finalLatest?.title"
								:id="finalLatest?.id"
								max_width="w-full"
								:showPlayButton="true"
								:centerText="true"
								:titleSize="'text-base'"
								imageRatio="square"
								:useColorThief="false"
							/>
						</template>
						<template v-if="isLoading">
							<AlbumCardSkeleton :imageRatio="'square'" />
						</template>
					</div>
					<div class="w-1/4 rounded-lg overflow-hidden">
						<template v-if="!isLoading && finalLatest">
							<AlbumCard
								name="电台"
								:cover_url="radioIcon"
								:showPlayButton="true"
								:showControls="false"
								:showInfo="false"
								:imagePadding="true"
								:image-ratio="'square'"
								:titleSize="'text-base'"
								type="fm"
								:useColorThief="false"
							/>
						</template>
						<template v-if="isLoading">
							<AlbumCardSkeleton :imageRatio="'square'" />
						</template>
					</div>
				</div>
			</div>
		</div>
		<!-- 网易每日推荐歌单 -->
		<div class="container mx-auto px-6 mt-8" v-if="isNeteaseLogin && neteaseDailyRecommendArr?.length">
			<div class="flex items-center gap-6 justify-between">
				<h2 class="text-lg font-semibold text-white">Netease Daily</h2>
			</div>
			<div class="mt-4 flex flex-wrap gap-4" v-if="neteaseDailyRecommendArr?.length">
				<AlbumCard
					name="每日歌曲推荐"
					:cover_url="dailyIcon"
					:showPlayButton="true"
					:showControls="false"
					:showInfo="false"
					:image-ratio="'square'"
					:centerNumber="getCurrentDate()"
					:useColorThief="false"
					:imagePadding="true"
					type="netease-daily-tracks"
				/>
				<AlbumCard
					v-for="playlist in neteaseDailyRecommendArr"
					:key="playlist.id"
					:name="playlist.title"
					:cover_url="playlist.cover"
					:id="playlist.id"
					:showPlayButton="true"
					:showControls="false"
					:showInfo="false"
					:image-ratio="'square'"
					type="netease-daily"
				/>
			</div>
		</div>
		<!-- 站内专辑 -->
		<div class="container mx-auto px-6 mt-8">
			<div class="flex items-center gap-6 justify-between">
				<h2 class="text-lg font-semibold text-white">New Albums</h2>
				<Button variant="link" class="text-[#da5597] text-xs" @click="router.push('/albums/albums')">See all</Button>
			</div>
			<div class="mt-4 flex gap-4">
				<template v-if="latestInnerAlbums?.length">
					<AlbumCard
						v-for="album in latestInnerAlbums"
						:key="album.id"
						:name="album.title"
						:cover_url="album.cover"
						:id="album.id"
						:showPlayButton="true"
						:showControls="false"
						:showInfo="false"
						max_width="w-1/5"
						:image-ratio="'square'"
					></AlbumCard>
				</template>
				<template v-else>
					<AlbumCardSkeleton v-for="n in 5" :key="n" />
				</template>
			</div>
		</div>
		<!-- 网易榜单 -->
		<div class="container mx-auto px-6 mt-8">
			<div class="flex items-center gap-6 justify-between">
				<h2 class="text-lg font-semibold text-white">Netease TopCharts</h2>
			</div>
			<div class="mt-4 flex flex-wrap gap-4">
				<template v-if="neteaseTopChartsArr?.length">
					<AlbumCard
						v-for="album in neteaseTopChartsArr"
						:key="album.id"
						:name="album.title"
						:cover_url="album.cover"
						:id="album.nId"
						:showPlayButton="true"
						:showControls="false"
						:showInfo="false"
						:image-ratio="'square'"
						type="netease-playlist"
					></AlbumCard>
				</template>
				<template v-else>
					<AlbumCardSkeleton v-for="n in 7" :key="n" />
				</template>
			</div>
		</div>
		<!-- 网易新碟 -->
		<div class="container mx-auto px-6 mt-8">
			<div class="flex items-center gap-6 justify-between">
				<h2 class="text-lg font-semibold text-white">Netease TopAlbums</h2>
			</div>
			<div class="mt-4 flex flex-wrap gap-4">
				<template v-if="neteaseTopAlbumArr.length">
					<AlbumCard
						v-for="album in neteaseTopAlbumArr"
						:key="album.id"
						:name="album.name"
						:cover_url="album.picUrl"
						:id="album.id"
						:artist="album.artist?.name"
						:showPlayButton="true"
						:showControls="false"
						:showInfo="false"
						:image-ratio="'square'"
						type="netease-album"
					></AlbumCard>
				</template>
				<template v-else>
					<AlbumCardSkeleton v-for="n in 10" :key="n" :showArtist="true" />
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, computed, onUnmounted, onActivated } from 'vue'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	latestCollection,
	latestFinal,
	neteaseToplist,
	latestInnerAlbum,
	neteaseTopAlbum,
	neteaseRecommendDaily,
	newVersion as checkNewVersion,
} from '@/api'
import { formatPlaylistUpdateTime, formatPlaylistDurationToHourStr } from '@/utils'
import { useRouter } from 'vue-router'
import { handlePromise, getCurrentDate, compareVersions } from '@/utils'
import { Playlist } from '@/interfaces/collection'
import { NeteaseAlbum } from '@/interfaces/netease_album'
import AlbumCard from '@/components/albumcard/AlbumCard.vue'
import AlbumCardSkeleton from '@/components/albumcard/AlbumCardSkeleton.vue'
import dailyIcon from '@/assets/images/daily.png'
import radioIcon from '@/assets/images/radio.png'

// 是否在加载中
const isLoading = ref(true)

// 数据获取
const lastestCollections: Ref<Playlist[]> = ref([])
const finalLatest: Ref<Playlist | null> = ref(null)
const latestInnerAlbums: Ref<Playlist[] | null> = ref([])
const neteaseTopChartsArr: Ref<Playlist[] | null> = ref([])
const neteaseTopAlbumArr: Ref<NeteaseAlbum[]> = ref([])
const isNeteaseLogin = ref(false)
const neteaseDailyRecommendArr: Ref<Playlist[] | null> = ref([])

const getLatestCollection = async () => {
	const [res] = await handlePromise(latestCollection())
	if (!res) return
	lastestCollections.value = Array.isArray(res)
		? res.map(item => ({ ...item }))
		: [{ ...res }]
}

const getLatestFinal = async () => {
	const [res] = await handlePromise(latestFinal())
	if (!res) return
	finalLatest.value = res
}

const getLatestInnerAlbum = async () => {
	const [res] = await handlePromise(latestInnerAlbum())
	if (!res) return
	latestInnerAlbums.value = Array.isArray(res) ? res : [res]
}

const getNeteaseTopCharts = async () => {
	const [res] = await handlePromise(neteaseToplist())
	if (!res) return
	neteaseTopChartsArr.value = res
}

const getNeteaseTopAlbum = async () => {
	const [res] = await handlePromise(neteaseTopAlbum())
	if (!res) return
	neteaseTopAlbumArr.value = res
}

const getNeteaseRecommendDaily = async () => {
	const cookie = localStorage.getItem('netease-cookie')
	if (!cookie) return
	const [res] = await handlePromise(neteaseRecommendDaily({ cookie }))
	if (!res) return
	neteaseDailyRecommendArr.value = res
}

onMounted(async () => {
	isLoading.value = true
	await Promise.all([
		getLatestCollection(),
		getLatestFinal(),
		getLatestInnerAlbum(),
		getNeteaseTopCharts(),
		getNeteaseTopAlbum(),
	])
	// 检查网易云登录状态
	const neteaseCookie = localStorage.getItem('netease-cookie')
	if (neteaseCookie) {
		isNeteaseLogin.value = true
		await getNeteaseRecommendDaily()
	}
	// 检查更新
	await checkForUpdates()
	isLoading.value = false
	resetAutoplay()
})

const router = useRouter()

const toPlaylist = (id: number, _type: string) => {
	if (_type === '') {
		router.push({ name: 'playlist', params: { id: id.toString() } })
	}
}

// 轮播
const currentIndex = ref(0)
const autoplayInterval = ref<number | null>(null)

const nextCollections = computed(() => {
	if (!lastestCollections.value?.length) return []
	const next1 = getNextIndex(currentIndex.value + 1)
	const next2 = getNextIndex(currentIndex.value + 2)
	return [lastestCollections.value[next1], lastestCollections.value[next2]]
})

const getNextIndex = (index: number) => {
	if (!lastestCollections.value?.length) return 0
	const length = lastestCollections.value.length
	return ((index % length) + length) % length
}

const resetAutoplay = () => {
	if (autoplayInterval.value) {
		clearInterval(autoplayInterval.value)
	}
	if (lastestCollections.value?.length) {
		autoplayInterval.value = window.setInterval(() => {
			currentIndex.value = getNextIndex(currentIndex.value + 1)
		}, 5000)
	}
}

onActivated(() => {
	resetAutoplay()
})

onUnmounted(() => {
	if (autoplayInterval.value) {
		clearInterval(autoplayInterval.value)
	}
})

// 网易云登录事件
const handleNeteaseLogin = () => {
	isNeteaseLogin.value = true
	getNeteaseRecommendDaily()
}

const handleNeteaseLogout = () => {
	isNeteaseLogin.value = false
	neteaseDailyRecommendArr.value = []
}

window.addEventListener('netease-login', handleNeteaseLogin)
window.addEventListener('netease-logout', handleNeteaseLogout)

onUnmounted(() => {
	window.removeEventListener('netease-login', handleNeteaseLogin)
	window.removeEventListener('netease-logout', handleNeteaseLogout)
})

// 版本更新
const showUpdateDialog = ref(false)
const newVersion = ref('')
const currentVersion = ref(__APP_VERSION__)
const updateUrl = ref('')
const updateText = ref('')

const checkForUpdates = async () => {
	try {
		const platform = window.electron.platform === 'darwin' ? 'MacOS' : 'Windows'
		const [res] = await handlePromise(checkNewVersion(platform))
		if (!res) return
		if (compareVersions(res.a_version, currentVersion.value) > 0) {
			newVersion.value = res.a_version
			updateUrl.value = res.a_url
			updateText.value = res.updateText || '是否前往下载？'
			showUpdateDialog.value = true
		}
	} catch (error) {
		console.error('检查更新失败:', error)
	}
}

const handleUpdate = () => {
	// @ts-ignore
	window.electron.openInBrowser(updateUrl.value)
	showUpdateDialog.value = false
}
</script>
