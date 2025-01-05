<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:30:59
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-05 16:31:53
 * @FilePath     : /src/views/Suggestion.vue
 * @Description  : Suggestions
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:30:59
-->
<template>
	<div class="h-screen bg-black pt-16 pb-20">
		<div class="container mx-auto px-4">
			<!-- 三栏布局 -->
			<div class="grid grid-cols-[240px,1fr,300px] gap-6">
				<!-- 左侧栏 -->
				<div class="sticky top-16 h-[calc(100vh-4rem)]">
					<div class="space-y-4">
						<!-- 主导航 -->
						<div class="space-y-2">
							<Button variant="ghost" class="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50">
								<ListMusic class="mr-2 h-4 w-4" />
								Feed
							</Button>
							<Button variant="ghost" class="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50">
								<ListMusic class="mr-2 h-4 w-4" />
								Playlists
							</Button>
							<Button variant="ghost" class="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50">
								<BarChart3 class="mr-2 h-4 w-4" />
								Statistics
							</Button>
						</div>

						<!-- 个人收藏区 -->
						<div class="space-y-1">
							<h2 class="px-4 text-lg font-semibold tracking-tight text-white">Your Music</h2>
							<Button variant="ghost" class="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50">
								<Heart class="mr-2 h-4 w-4" />
								Favourites
							</Button>
							<Button variant="ghost" class="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50">
								<Clock class="mr-2 h-4 w-4" />
								Listen Later
							</Button>
							<Button variant="ghost" class="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50">
								<History class="mr-2 h-4 w-4" />
								History
							</Button>
						</div>

						<!-- 播放列表 -->
						<div class="space-y-1">
							<h2 class="px-4 text-lg font-semibold tracking-tight text-white">Your Playlists</h2>
							<ScrollArea class="h-[300px] px-1">
								<div class="space-y-1">
									<Button
										v-for="playlist in playlists"
										:key="playlist.id"
										variant="ghost"
										class="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50"
									>
										<span class="w-2 h-2 rounded-full mr-2" :class="playlist.color" />
										{{ playlist.name }}
									</Button>
								</div>
							</ScrollArea>
						</div>
					</div>
				</div>

				<!-- 中间内容区域 -->
				<div class="h-[calc(100vh-4rem)] overflow-hidden">
					<div class="sticky z-10 bg-black pb-4">
						<!-- 当前播放区域 -->
						<div class="relative aspect-[32/15] rounded-lg overflow-hidden">
							<img :src="lastCollection?.cover" class="absolute inset-0 w-full h-full object-cover" alt="Album cover" />
							<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
							<div class="absolute bottom-0 left-0 p-6 w-full">
								<h2 class="text-2xl font-bold text-white mb-2">{{ lastCollection?.title }}</h2>
								<p class="text-gray-300">
									{{ formatPlaylistDurationToHourStr(lastCollection?.duration || 0) }} •
									{{ formatPlaylistUpdateTime(lastCollection?.updated_at || '') }} • {{ lastCollection?.count }}首歌
								</p>
								<div class="mt-4 flex items-center gap-2">
									<Button class="bg-[#da5597] hover:bg-[#da5597]/90 text-white rounded-full">
										<Play class="h-4 w-4" />
										Play
									</Button>
									<Button variant="ghost" class="text-white hover:bg-white/10 rounded-full">
										<Heart class="h-4 w-4" />
									</Button>
									<Button variant="ghost" class="text-white hover:bg-white/10 rounded-full">
										<MoreHorizontal class="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>

						<!-- 播放列表标签页 -->
						<div class="border-b border-gray-800 mt-6">
							<nav class="flex gap-4 relative">
								<!-- 滑动的下划线 -->
								<div
									class="absolute bottom-0 h-0.5 transition-all duration-300 ease-out"
									:style="{
										left: `${activeTabLeft}px`,
										width: `${activeTabWidth}px`,
									}"
								>
									<!-- 添加内部展开的下划线 -->
									<div
										class="h-full bg-[#da5597] transform-origin-center"
										:class="{ 'animate-tab-select': shouldAnimate }"
									></div>
								</div>

								<button
									v-for="tab in tabs"
									:key="tab.id"
									ref="tabRefs"
									class="px-4 py-2 text-sm transition-colors relative"
									:class="[currentTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white']"
									@click="handleTabClick(tab.id, $event)"
								>
									{{ tab.name }}
								</button>
							</nav>
						</div>
					</div>

					<!-- 播放列表内容 -->
					<div class="overflow-y-auto pb-20" style="height: calc(100vh - 26rem)">
						<div
							v-if="currentTab === 'collections'"
							v-for="collection in allCollectionsArr"
							:key="collection.id"
							class="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800/50 group"
						>
							<img :src="collection.cover" class="w-20 h-auto rounded object-cover aspect-[32/15]" />
							<div class="flex-1">
								<h3 class="text-white font-medium">{{ collection.title }}</h3>
								<p class="text-sm text-gray-400">
									{{ collection.count }} tracks {{ collection.duration ? '•' : '' }}
									{{ formatPlaylistDurationToHourStr(collection.duration || 0) }}
								</p>
							</div>
							<Button variant="ghost" class="opacity-0 group-hover:opacity-100 transition-opacity">
								<Play class="h-4 w-4" />
							</Button>
							<Button variant="ghost" class="opacity-0 group-hover:opacity-100 transition-opacity">
								<MoreVertical class="h-4 w-4" />
							</Button>
						</div>

						<div
							v-if="currentTab === 'finals'"
							v-for="final in allFinalsArr"
							:key="final.id"
							class="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800/50 group"
						>
							<img :src="final.cover" class="h-12 w-12 rounded object-cover" />
							<div class="flex-1">
								<h3 class="text-white font-medium">{{ final.title }}</h3>
								<p class="text-sm text-gray-400">
									{{ final.count }} tracks {{ final.duration ? '•' : '' }}
									{{ formatPlaylistDurationToHourStr(final.duration || 0) }}
								</p>
							</div>
							<Button variant="ghost" class="opacity-0 group-hover:opacity-100 transition-opacity">
								<Play class="h-4 w-4" />
							</Button>
							<Button variant="ghost" class="opacity-0 group-hover:opacity-100 transition-opacity">
								<MoreVertical class="h-4 w-4" />
							</Button>
						</div>

						<div
							v-if="currentTab === 'albums'"
							v-for="album in allInnerAlbumsArr"
							:key="album.id"
							class="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800/50 group"
						>
							<img :src="album.cover" class="h-12 w-12 rounded object-cover" />
							<div class="flex-1">
								<h3 class="text-white font-medium">{{ album.title }}</h3>
								<p class="text-sm text-gray-400">
									{{ album.count }} tracks {{ album.duration ? '•' : '' }}
									{{ formatPlaylistDurationToHourStr(album.duration || 0) }}
								</p>
							</div>
							<Button variant="ghost" class="opacity-0 group-hover:opacity-100 transition-opacity">
								<Play class="h-4 w-4" />
							</Button>
							<Button variant="ghost" class="opacity-0 group-hover:opacity-100 transition-opacity">
								<MoreVertical class="h-4 w-4" />
							</Button>
						</div>

						<!-- 网易云榜单 -->
						<div v-if="currentTab === 'topcharts'" class="grid grid-cols-4 gap-4 w-full px-4 mb-20">
							<AlbumCard
								v-for="topchart in neteaseTopChartsArr"
								:key="topchart.id"
								:name="topchart.title"
								:cover_url="topchart.cover"
								class="w-full"
							></AlbumCard>
						</div>
					</div>
				</div>

				<!-- 右侧栏 -->
				<div class="sticky top-16 h-[calc(100vh-4rem)]">
					<div class="space-y-6">
						<!-- New Releases 部分 -->
						<div class="space-y-1">
							<div class="flex items-center justify-between">
								<h2 class="text-lg font-semibold tracking-tight text-white">New Releases</h2>
								<Button variant="link" class="text-[#da5597] text-xs">See all</Button>
							</div>
							<ScrollArea class="h-[240px]">
								<div class="space-y-4 pr-4">
									<Card v-for="release in newReleases" :key="release.id" class="bg-gray-900/50 border-gray-800">
										<CardContent class="p-4 flex items-center space-x-4">
											<img :src="release.cover" class="w-12 h-12 rounded" />
											<div class="flex-1">
												<h3 class="font-medium text-white">{{ release.name }}</h3>
												<p class="text-sm text-gray-400">{{ release.artist }}</p>
											</div>
											<Button variant="ghost" class="h-8 w-8 p-0">
												<Heart
													class="h-4 w-4"
													:class="release.liked ? 'fill-[#da5597] text-[#da5597]' : 'text-gray-400'"
												/>
											</Button>
										</CardContent>
									</Card>
								</div>
							</ScrollArea>
						</div>

						<!-- Favourite Artists 部分 -->
						<div class="space-y-1">
							<div class="flex items-center justify-between">
								<h2 class="text-lg font-semibold tracking-tight text-white">Favourite Artists</h2>
								<Button variant="link" class="text-[#da5597] text-xs">See all</Button>
							</div>
							<ScrollArea class="h-[calc(100vh-480px)]">
								<div class="space-y-4 pr-4">
									<div
										v-for="(artist, index) in favouriteArtists"
										:key="artist.id"
										class="flex items-center gap-4 relative hover:bg-white/5 rounded-lg p-2 group"
									>
										<!-- 序号和头像容器 -->
										<div class="relative pl-10 flex items-center">
											<!-- 序号 -->
											<span
												class="absolute -left-1 top-1/2 -translate-y-[45%] text-[2.5rem] font-black leading-none z-10 number-rank"
											>
												{{ index + 1 }}
											</span>
											<!-- 头像 -->
											<Avatar class="h-12 w-12 relative -ml-6 z-20">
												<AvatarImage :src="artist.avatar" />
											</Avatar>
										</div>
										<!-- 文本内容 -->
										<div class="flex-1 min-w-0 flex flex-col justify-center">
											<h3 class="font-medium text-white truncate">{{ artist.name }}</h3>
											<p class="text-sm text-gray-400">{{ artist.subscribers }}</p>
										</div>
										<!-- 箭头图标 -->
										<div class="flex items-center">
											<ChevronRight
												class="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
											/>
										</div>
									</div>
								</div>
							</ScrollArea>
						</div>
					</div>
				</div>
			</div>
		</div>
		<loading
			:active="isLoading"
			:can-cancel="true"
			:is-full-page="false"
			background-color="rgba(0, 0, 0, 0.5)"
			color="#EC4899"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, Ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/composables/useToast'
import { latestCollection, allCollections, allFinals, allInnerAlbums, neteaseToplist } from '@/api'
import { formatPlaylistUpdateTime, formatPlaylistDurationToHourStr } from '@/utils'
import Loading from 'vue-loading-overlay'
import {
	ListMusic,
	BarChart3,
	Heart,
	Clock,
	History,
	Play,
	MoreHorizontal,
	MoreVertical,
	ChevronRight,
} from 'lucide-vue-next'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { handlePromise } from '@/utils'
import AlbumCard from '@/components/albumcard/AlbumCard.vue'
const toast = useToast()
// 模拟数据
const playlists = ref([
	{ id: 1, name: 'Metalcore', color: 'bg-red-500' },
	{ id: 2, name: 'Electro', color: 'bg-green-500' },
	{ id: 3, name: 'Funk', color: 'bg-yellow-500' },
	{ id: 4, name: 'Disco', color: 'bg-purple-500' },
])
// 添加收藏艺术家数据
const favouriteArtists = ref([
	{
		id: 1,
		name: 'Ice Nine Kills',
		subscribers: '432k subscribers',
		avatar: 'https://p2.music.126.net/4hgbsRnS1oHRL-g1mtIOXA==/109951170182644527.jpg',
	},
	{
		id: 2,
		name: 'Bloodywood',
		subscribers: '311k subscribers',
		avatar: 'https://p2.music.126.net/4hgbsRnS1oHRL-g1mtIOXA==/109951170182644527.jpg',
	},
	{
		id: 3,
		name: 'Bad Omens',
		subscribers: '183k subscribers',
		avatar: 'https://p2.music.126.net/4hgbsRnS1oHRL-g1mtIOXA==/109951170182644527.jpg',
	},
	{
		id: 4,
		name: 'Lorna Shore',
		subscribers: '108k subscribers',
		avatar: 'https://p2.music.126.net/4hgbsRnS1oHRL-g1mtIOXA==/109951170182644527.jpg',
	},
	{
		id: 5,
		name: 'Annisokay',
		subscribers: '79k subscribers',
		avatar: 'https://p2.music.126.net/4hgbsRnS1oHRL-g1mtIOXA==/109951170182644527.jpg',
	},
])

// 修改 newReleases 数据，添加 liked 属性
const newReleases = ref([
	{
		id: 1,
		name: 'Calamity',
		artist: 'Annisokay',
		cover: 'https://p2.music.126.net/4hgbsRnS1oHRL-g1mtIOXA==/109951170182644527.jpg',
		liked: true,
	},
	// ... 更多新发布
])

// 标签页数据
const tabs = [
	{ id: 'collections', name: 'Collections' },
	{ id: 'finals', name: 'Finals' },
	{ id: 'albums', name: 'Albums' },
	{ id: 'topcharts', name: 'Top Charts' },
]

// 当前选中的标签
const currentTab = ref('collections')

// 添加标签页位置管理
const tabRefs = ref<HTMLElement[]>([])
const activeTabLeft = ref(0)
const activeTabWidth = ref(0)

const shouldAnimate = ref(false)

// 修改处理标签点击函数
const handleTabClick = (tabId: string, event: MouseEvent) => {
	const target = event.currentTarget as HTMLElement
	shouldAnimate.value = false

	// 使用 nextTick 确保动画重置
	nextTick(() => {
		activeTabLeft.value = target.offsetLeft
		activeTabWidth.value = target.offsetWidth
		currentTab.value = tabId
		shouldAnimate.value = true
	})
}

// 是否在加载中
const isLoading = ref(false)
// 初始化时也触发动画
onMounted(() => {
	nextTick(async () => {
		if (tabRefs.value[0]) {
			activeTabLeft.value = tabRefs.value[0].offsetLeft
			activeTabWidth.value = tabRefs.value[0].offsetWidth
			shouldAnimate.value = true
		}
		try {
			isLoading.value = true
			await getLatestCollection()
			await getAllCollections()
			await getAllFinals()
			await getAllInnerAlbums()
			await getNeteaseTopCharts()
		} finally {
			isLoading.value = false
		}
	})
})
/**
 * @description: 获取最新的一个月度精选集
 */
const lastCollection: Ref<Playlist | null> = ref(null)
const getLatestCollection = async () => {
	const [res, err] = await handlePromise(latestCollection())
	if (err) toast.error('获取最新月度精选集失败')
	lastCollection.value = res
}
/**
 * @description: 获取所有的月度精选集
 */
const allCollectionsArr: Ref<Playlist[] | null> = ref([])
const getAllCollections = async () => {
	const [res, err] = await handlePromise(allCollections())
	if (err) toast.error('获取所有月度精选集失败')

	allCollectionsArr.value = res
}
/**
 * @description: 获取所有年终精选集
 */
const allFinalsArr: Ref<Playlist[] | null> = ref([])
const getAllFinals = async () => {
	const [res, err] = await handlePromise(allFinals())
	if (err) toast.error('获取所有年终精选集失败')

	allFinalsArr.value = res
}
/**
 * @description: 获取所有站内专辑
 */
const allInnerAlbumsArr: Ref<Playlist[] | null> = ref([])
const getAllInnerAlbums = async () => {
	const [res, err] = await handlePromise(allInnerAlbums())
	if (err) toast.error('获取所有站内专辑失败')
	allInnerAlbumsArr.value = res
}

/**
 * @description: 获取网易云音乐热门新碟
 */
const neteaseTopChartsArr: Ref<Playlist[] | null> = ref([])
const getNeteaseTopCharts = async () => {
	const [res, err] = await handlePromise(neteaseToplist())
	if (err) toast.error('获取网易云音乐热门排行榜失败')
	neteaseTopChartsArr.value = res
}
</script>

<style scoped>
:deep(.button:hover) {
	background-color: rgba(255, 255, 255, 0.1);
}

:deep(.card) {
	transition: background-color 0.3s ease;
}

:deep(.scroll-area) {
	scrollbar-width: thin;
	scrollbar-color: #da5597 transparent;
}

:deep(.scroll-area::-webkit-scrollbar) {
	width: 6px;
}

:deep(.scroll-area::-webkit-scrollbar-track) {
	background: transparent;
}

:deep(.scroll-area::-webkit-scrollbar-thumb) {
	background-color: #da5597;
	border-radius: 3px;
}

/* 添加渐变背景效果 */
.bg-gradient {
	background: linear-gradient(45deg, #da5597 0%, #9f1239 100%);
}

/* 自定义搜索框样式 */
input[type='text'] {
	transition: all 0.3s ease;
}

input[type='text']:focus {
	box-shadow: 0 0 0 2px rgba(218, 85, 151, 0.1);
}

/* 添加播放列表项悬停效果 */
.playlist-item {
	transition: background-color 0.2s ease;
}

.playlist-item:hover {
	background-color: rgba(255, 255, 255, 0.05);
}

/* 添加图片悬停效果 */
img {
	transition: transform 0.3s ease;
}

.card:hover img {
	transform: scale(1.05);
}

/* 添加艺术家列表项悬停效果 */
.favourite-artist {
	transition: all 0.2s ease;
}

.favourite-artist:hover {
	background-color: rgba(255, 255, 255, 0.05);
	transform: translateX(4px);
}

/* 修改序号样式 */
.number-rank {
	color: #000;
	-webkit-text-stroke: 1px #fff;
	font-family: -apple-system, BlinkMacSystemFont, sans-serif;
	opacity: 0.7;
}

/* 添加标签页过渡效果 */
nav button {
	position: relative;
	overflow: hidden;
}

/* 移除之前的边框样式 */
nav button::after {
	display: none;
}

/* 添加平滑过渡效果 */
nav {
	isolation: isolate;
}

nav > div {
	transform-origin: left;
}

/* 添加从中间展开的动画 */
.transform-origin-center {
	transform-origin: center;
}

@keyframes tabSelect {
	0% {
		transform: scaleX(0);
	}
	100% {
		transform: scaleX(1);
	}
}

.animate-tab-select {
	animation: tabSelect 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
