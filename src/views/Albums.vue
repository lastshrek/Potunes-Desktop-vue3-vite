<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:26:25
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-25 21:25:51
 * @FilePath     : /src/views/Albums.vue
 * @Description  : Albums
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:26:25
-->
<template>
	<div class="overflow-y-scroll pt-36 pb-24 container mx-auto bg-black min-h-screen">
		<!-- 悬浮标题 -->
		<div class="fixed top-16 left-44 right-0 z-10 bg-black/90 backdrop-blur-sm border-b border-gray-800">
			<div class="px-4 py-4">
				<h1 class="text-white text-2xl font-bold">
					{{ typeTitle }}
				</h1>
			</div>
		</div>

		<div v-if="!isLoading" class="flex-row flex-wrap grid grid-cols-4 gap-4 w-full px-4">
			<div v-for="album in albums" :key="album.id">
				<router-link :to="{ name: 'playlist', params: { id: album.id } }">
					<AlbumCard
						:name="album.title"
						:cover_url="album.cover"
						max_width="md:max-w-md"
						@click="selectItem(album.id)"
						:useColorThief="false"
						:showPlayButton="true"
						:image-ratio="type === 'collections' ? '' : 'square'"
					></AlbumCard>
				</router-link>
			</div>
		</div>

		<div v-else class="flex-row flex-wrap grid grid-cols-4 gap-4 w-full px-4">
			<div v-for="n in 12" :key="n" class="flex flex-col">
				<div
					:class="[
						'bg-gray-800/50 animate-pulse rounded-lg mb-3',
						type === 'collections' ? 'aspect-[32/15]' : 'aspect-square',
					]"
				></div>
				<div class="h-4 bg-gray-800/50 animate-pulse rounded w-3/4 mb-2"></div>
				<div class="h-3 bg-gray-800/50 animate-pulse rounded w-1/2"></div>
			</div>
		</div>

		<router-view></router-view>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { playlists, finals, innerAlbums } from '@/api/index'
import { handlePromise, showError } from '@/utils/index'
import AlbumCard from '@/components/albumcard/AlbumCard.vue'
// TODO: add type
const albums = ref([] as any[])
const isLoading = ref(true)
const router = useRouter()
const route = useRoute()
const type = ref('collections')

// 根据type计算显示的标题
const typeTitle = computed(() => {
	switch (type.value) {
		case 'collections':
			return 'Collections - 月度精选'
		case 'finals':
			return 'Finals - 年终精选'
		case 'albums':
			return 'Albums - 专辑'
		default:
			return 'Albums - 专辑'
	}
})

// 点击专辑
const selectItem = (id: string) => {
	router.push({ name: 'playlist', params: { id } })
}

// 获取数据的函数
const fetchData = async (albumType: string) => {
	isLoading.value = true
	try {
		switch (albumType) {
			case 'collections':
				const [pRes, pErr] = await handlePromise(playlists())
				if (pErr) return showError(pErr)
				albums.value = pRes
				break
			case 'finals':
				const [fRes, fErr] = await handlePromise(finals())
				if (fErr) return showError(fErr)
				albums.value = fRes
				break
			case 'albums':
				const [aRes, aErr] = await handlePromise(innerAlbums())
				if (aErr) return showError(aErr)
				albums.value = aRes
				break
			default:
				break
		}
	} finally {
		isLoading.value = false
	}
}

// 监听路由参数变化
watch(
	() => route.params.type,
	newType => {
		if (newType) {
			type.value = newType as string
			fetchData(type.value)
		}
	}
)

onMounted(async () => {
	type.value = route.params.type as string
	await fetchData(type.value)
})
</script>

<style scoped lang="scss">
/* 确保悬浮标题下方内容不被遮挡 */
.overflow-y-scroll {
	scroll-padding-top: 9rem;
}

/* 在小屏幕上调整标题位置 */
@media (max-width: 768px) {
	.fixed {
		left: 0;
	}

	.overflow-y-scroll {
		padding-top: 8rem;
	}
}
</style>
