<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:30:59
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-09 21:40:52
 * @FilePath     : /src/views/Suggestion.vue
 * @Description  : Suggestions
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:30:59
-->
<template>
	<div class="h-screen pt-16 pb-20 w-full">
		<div class="container mx-auto pl-10 pr-6">
			<div class="grid grid-cols-[1fr,300px] gap-12">
				<!-- 内容区域 -->
				<div class="h-[calc(100vh-4rem)] overflow-hidden">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold tracking-tight text-white">New Collections</h2>
						<Button variant="link" class="text-[#da5597] text-xs">See all</Button>
					</div>
					<div class="relative rounded-lg overflow-hidden aspect-[32/15]">
						<!-- 轮播图片 -->
						<div
							v-for="(collection, index) in lastestCollections"
							:key="index"
							class="absolute inset-0 transition-opacity duration-500 cursor-pointer"
							:class="{ 'opacity-0': currentIndex !== index }"
						>
							<img
								v-lazy="collection.cover"
								class="absolute inset-0 w-full h-full object-cover"
								:alt="collection.title"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
							<div class="absolute bottom-0 left-0 p-6 w-full">
								<h2 class="text-2xl font-bold text-white mb-2">{{ collection.title }}</h2>
								<p class="text-gray-300">
									{{ formatPlaylistDurationToHourStr(collection.duration || 0) }} •
									{{ formatPlaylistUpdateTime(collection.updated_at || '') }} • {{ collection.count }}首歌
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

						<!-- 右下角缩略图 -->
						<div class="absolute bottom-6 right-6 flex gap-2">
							<div
								v-for="(collection, index) in nextCollections"
								:key="collection.id"
								class="w-32 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#da5597]/90 transition-all aspect-[32/15]"
								@click="switchToCollection(getNextCollectionIndex(index))"
							>
								<img v-lazy="collection.cover" :alt="collection.title" class="w-full h-full object-cover" />
							</div>
						</div>
					</div>
				</div>

				<!-- 右侧 -->
				<div class="sticky top-16 h-[calc(100vh-4rem)]">
					<div class="space-y-6">
						<!-- New Final 部分 -->
						<div class="relative p-[1px]">
							<div class="flex items-center justify-between">
								<h2 class="text-lg font-semibold text-white">New Final</h2>
								<Button variant="link" class="text-[#da5597] text-xs">See all</Button>
							</div>
							<div class="w-full aspect-square z-10">
								<img v-lazy="finalLatest?.cover" class="w-full h-full rounded-lg" />
							</div>
							<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
							<div class="absolute bottom-0 left-0 pb-2 w-full flex items-center justify-between">
								<h2 class="text-2xl font-bold text-white w-full text-center">{{ finalLatest?.title }}</h2>
								<!-- <Button class="bg-[#da5597] hover:bg-[#da5597]/90 text-white rounded-full">
									<Play class="h-4 w-4" />
									Play
								</Button> -->
							</div>
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
import { ref, onMounted, nextTick, Ref, computed, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { latestCollection, latestFinal, allCollections, allFinals, allInnerAlbums, neteaseToplist } from '@/api'
import { formatPlaylistUpdateTime, formatPlaylistDurationToHourStr } from '@/utils'
import Loading from 'vue-loading-overlay'
import { Heart, Play, MoreHorizontal, MoreVertical, ChevronRight } from 'lucide-vue-next'

import { handlePromise } from '@/utils'
import AlbumCard from '@/components/albumcard/AlbumCard.vue'
import { Playlist } from '@/interfaces/collection'
import { useToast } from '@/components/ui/toast'

const toast = useToast()

// 添加收藏艺术家数据

// 当前选中的标签
const currentTab = ref('collections')

// 添加标签页位置管理
const tabRefs = ref<HTMLElement[]>([])
const activeTabLeft = ref(0)
const activeTabWidth = ref(0)

const shouldAnimate = ref(false)

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
			await getLatestFinal()
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
const lastestCollections: Ref<Playlist[] | null> = ref(null)
const getLatestCollection = async () => {
	const [res] = await handlePromise(latestCollection())
	if (!res) return
	lastestCollections.value = res
}

const finalLatest: Ref<Playlist | null> = ref(null)
const getLatestFinal = async () => {
	const [res] = await handlePromise(latestFinal())
	if (!res) return

	finalLatest.value = res
	console.log(res)
}
/**
 * @description: 获取所有的月度精选集
 */
const allCollectionsArr: Ref<Playlist[] | null> = ref([])
const getAllCollections = async () => {
	const [res] = await handlePromise(allCollections())
	if (!res) return
	allCollectionsArr.value = res
}
/**
 * @description: 获取所有年终精选集
 */
const allFinalsArr: Ref<Playlist[] | null> = ref([])
const getAllFinals = async () => {
	const [res] = await handlePromise(allFinals())
	if (!res) return

	allFinalsArr.value = res
}
/**
 * @description: 获取所有站内专辑
 */
const allInnerAlbumsArr: Ref<Playlist[] | null> = ref([])
const getAllInnerAlbums = async () => {
	const [res] = await handlePromise(allInnerAlbums())
	if (!res) return
	allInnerAlbumsArr.value = res
}

/**
 * @description: 获取网易云音乐热门新碟
 */
const neteaseTopChartsArr: Ref<Playlist[] | null> = ref([])
const getNeteaseTopCharts = async () => {
	const [res] = await handlePromise(neteaseToplist())
	if (!res) return
	neteaseTopChartsArr.value = res
}

const currentIndex = ref(0)
const autoplayInterval = ref<number | null>(null)

// 修改获取下一个要显示的合集的计算属性
const nextCollections = computed(() => {
	if (!lastestCollections.value?.length) return []

	const next1 = getNextIndex(currentIndex.value + 1)
	const next2 = getNextIndex(currentIndex.value + 2)
	return [lastestCollections.value[next1], lastestCollections.value[next2]]
})

// 获取点击缩略图对应的索引
const getNextCollectionIndex = (thumbnailIndex: number) => {
	return getNextIndex(currentIndex.value + thumbnailIndex + 1)
}

// 切换到指定合集
const switchToCollection = (index: number) => {
	currentIndex.value = index
	resetAutoplay()
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
</script>
