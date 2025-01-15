<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:30:59
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-15 09:33:31
 * @FilePath     : /src/views/Suggestion.vue
 * @Description  : Suggestions
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:30:59
-->
<template>
	<div class="min-h-screen pt-16 pb-24 w-full bg-black">
		<!-- 头部 -->
		<div class="container mx-auto px-6">
			<div class="h-96 w-full">
				<div class="flex items-center gap-6">
					<div class="w-2/3 flex items-center gap-6 justify-between">
						<h2 class="text-lg font-semibold text-white">New Collections</h2>
						<!-- path: '/albums/:type', -->
						<Button variant="link" class="text-[#da5597] text-xs" @click="router.push('/albums/collections')">
							See all
						</Button>
					</div>
					<div class="w-1/3 flex items-center gap-6 justify-between">
						<h2 class="text-lg font-semibold text-white">New Final</h2>
						<Button variant="link" class="text-[#da5597] text-xs" @click="router.push('/albums/finals')">
							See all
						</Button>
					</div>
				</div>
				<div class="flex gap-6 h-[calc(100%-2rem)]">
					<div class="w-2/3 rounded-lg overflow-hidden">
						<div class="relative w-full h-full">
							<template v-if="lastestCollections?.length">
								<div
									v-for="(collection, index) in lastestCollections"
									:key="collection.id"
									class="absolute inset-0 transition-opacity duration-500"
									:class="{ 'opacity-0': currentIndex !== index }"
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
										@click="toPlaylist(collection.id, '')"
									/>
								</div>

								<!-- 右下角缩略图 -->
								<div class="absolute bottom-6 right-6 flex gap-2 z-10">
									<div
										v-for="(collection, index) in nextCollections"
										:key="collection.id"
										class="w-32 aspect-[32/15] rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#da5597]/90 transition-all"
										@click="toPlaylist(collection.id, '')"
									>
										<img v-lazy="collection.cover" :alt="collection.title" class="w-full h-full object-cover" />
									</div>
								</div>
							</template>
							<template v-else>
								<AlbumCardSkeleton :imageRatio="'wide'" />
							</template>
						</div>
					</div>
					<div class="w-1/3 rounded-lg overflow-hidden">
						<template v-if="finalLatest">
							<AlbumCard
								:cover_url="finalLatest?.cover"
								:name="finalLatest?.title"
								:id="finalLatest?.id"
								max_width="w-full"
								:showPlayButton="true"
								:centerText="true"
								:titleSize="'text-xl'"
								imageRatio="square"
								:useColorThief="false"
							/>
						</template>
						<template v-else>
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
						type="netease"
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
import { ref, onMounted, nextTick, Ref, computed, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
	latestCollection,
	latestFinal,
	neteaseToplist,
	latestInnerAlbum,
	neteaseTopAlbum,
	neteaseRecommendDaily,
} from '@/api'
import { formatPlaylistUpdateTime, formatPlaylistDurationToHourStr } from '@/utils'
import { useRouter } from 'vue-router'
import { handlePromise, getCurrentDate } from '@/utils'
import { Playlist } from '@/interfaces/collection'
import { NeteaseAlbum } from '@/interfaces/netease_album'
import dailyIcon from '@/assets/images/daily.png'
import AlbumCard from '@/components/albumcard/AlbumCard.vue'
import AlbumCardSkeleton from '@/components/albumcard/AlbumCardSkeleton.vue'

// 是否在加载中
const isLoading = ref(false)
// 初始化时也触发动画
onMounted(() => {
	nextTick(async () => {
		try {
			isLoading.value = true
			await getLatestCollection()
			await getLatestFinal()
			await getLatestInnerAlbum()
			await getNeteaseTopCharts()
			await getNeteaseTopAlbum()
			// 检查网易云登录状态
			const neteaseCookie = localStorage.getItem('netease-cookie')
			if (neteaseCookie) {
				isNeteaseLogin.value = true
				await getNeteaseRecommendDaily()
			}
		} finally {
			isLoading.value = false
		}
	})
})
/**
 * @description: 获取最新的一个月度精选集
 */
const lastestCollections: Ref<Playlist[]> = ref([])
const getLatestCollection = async () => {
	const [res] = await handlePromise(latestCollection())
	if (!res) return
	console.log('Latest collections:', res) // 添加日志查看数据
	// 确保数据的一致性
	lastestCollections.value = Array.isArray(res)
		? res.map(item => ({
				...item,
				id: item.id,
				cover: item.cover,
				title: item.title,
		  }))
		: [res].map(item => ({
				...item,
				id: item.id,
				cover: item.cover,
				title: item.title,
		  }))
}
/**
 * @description: 获取最新的年度精选集
 */
const finalLatest: Ref<Playlist | null> = ref(null)
const getLatestFinal = async () => {
	const [res] = await handlePromise(latestFinal())
	if (!res) return

	finalLatest.value = res
	console.log(res)
}

/**
 * @description: 获取最新的站内专辑
 */
const latestInnerAlbums: Ref<Playlist[] | null> = ref([])
const getLatestInnerAlbum = async () => {
	const [res] = await handlePromise(latestInnerAlbum())
	if (!res) return
	latestInnerAlbums.value = Array.isArray(res) ? res : [res]
}

/**
 * @description: 获取网易云热门榜单
 */
const neteaseTopChartsArr: Ref<Playlist[] | null> = ref([])
const getNeteaseTopCharts = async () => {
	const [res] = await handlePromise(neteaseToplist())
	if (!res) return
	neteaseTopChartsArr.value = res
}

/**
 * @description: 获取网易云音乐热门新碟
 */
const neteaseTopAlbumArr: Ref<NeteaseAlbum[]> = ref([])
const getNeteaseTopAlbum = async () => {
	const [res] = await handlePromise(neteaseTopAlbum())
	if (!res) return
	neteaseTopAlbumArr.value = res
}

const currentIndex = ref(0)
const autoplayInterval = ref<number | null>(null)

// 修改获取下一个要显示的合集的计算属性
const nextCollections = computed(() => {
	if (!lastestCollections.value?.length) return []

	const next1 = getNextIndex(currentIndex.value + 1)
	const next2 = getNextIndex(currentIndex.value + 2)
	const collections = [lastestCollections.value[next1], lastestCollections.value[next2]]
	console.log('Next collections:', collections) // 添加日志查看数据
	return collections
})

// 获取点击缩略图对应的索引
const getNextCollectionIndex = (thumbnailIndex: number) => {
	const nextIndex = getNextIndex(currentIndex.value + thumbnailIndex + 1)
	console.log('Next index:', nextIndex, 'Collection:', lastestCollections.value[nextIndex]) // 添加日志查看数据
	return nextIndex
}

// 获取下一个索引（循环）
const getNextIndex = (index: number) => {
	if (!lastestCollections.value?.length) return 0
	// 确保索引为正数
	const length = lastestCollections.value.length
	return ((index % length) + length) % length
}

// 重置自动播放
const resetAutoplay = () => {
	if (autoplayInterval.value) {
		clearInterval(autoplayInterval.value)
	}

	// 只有在有数据时才启动自动播放
	if (lastestCollections.value && lastestCollections.value.length > 0) {
		autoplayInterval.value = window.setInterval(() => {
			currentIndex.value = getNextIndex(currentIndex.value + 1)
		}, 5000)
	}
}

// 组件挂载时启动自动播放
onMounted(async () => {
	await getLatestCollection() // 先获取数据
	resetAutoplay() // 再启动自动播放
})

// 组件卸载时清理定时器
onUnmounted(() => {
	if (autoplayInterval.value) {
		clearInterval(autoplayInterval.value)
	}
})

const router = useRouter()

// 添加跳转方法
const toPlaylist = (id: number, type: string) => {
	if (type === '') {
		router.push({
			name: 'playlist',
			params: { id: id.toString() },
		})
		return
	}
}

// 添加网易云登录状态
const isNeteaseLogin = ref(false)
// 添加网易云每日推荐歌单数据
const neteaseDailyRecommendArr: Ref<Playlist[] | null> = ref([])

// 获取网易云每日推荐歌单
const getNeteaseRecommendDaily = async () => {
	const cookie = localStorage.getItem('netease-cookie')
	if (!cookie) return

	const [res] = await handlePromise(
		neteaseRecommendDaily({
			cookie,
		})
	)
	if (!res) return
	console.log({ res })
	neteaseDailyRecommendArr.value = res
	console.log({ neteaseDailyRecommendArr: neteaseDailyRecommendArr.value?.length })
}

// 添加网易云登录事件监听
window.addEventListener('netease-login', () => {
	isNeteaseLogin.value = true
	getNeteaseRecommendDaily()
})

// 添加网易云退出登录事件监听
window.addEventListener('netease-logout', () => {
	isNeteaseLogin.value = false
	neteaseDailyRecommendArr.value = []
})

onUnmounted(() => {
	window.removeEventListener('netease-login', () => {})
	window.removeEventListener('netease-logout', () => {})
})
</script>
