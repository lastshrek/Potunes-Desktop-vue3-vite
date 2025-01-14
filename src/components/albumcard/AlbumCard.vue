<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-02 18:27:16
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-14 21:37:48
 * @FilePath     : /src/components/albumcard/AlbumCard.vue
 * @Description  : album card
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 18:27:16
-->
<template>
	<div
		class="relative w-full h-full text-gray-50 cursor-pointer group p-4 rounded-lg shadow-lg transition-all duration-200 flex-shrink-0 basis-[calc(20%-16px)] hover:brightness-110 backdrop-blur-md bg-opacity-60"
		:class="[max_width == 'md:w-full' ? 'md:w-full' : max_width]"
		:style="{
			backgroundColor: dominantColorWithOpacity,
			backdropFilter: 'blur(16px)',
			WebkitBackdropFilter: 'blur(16px)',
			'--hover-brightness': dominantColor === '#121212' ? '1.2' : '1.3',
		}"
		@click="handleClick"
	>
		<div class="relative w-full mb-2" :class="imageRatio === 'square' ? 'aspect-square' : 'aspect-[32/15]'">
			<img
				:src="getImageSrc(cover_url)"
				class="w-full h-full object-cover rounded-lg"
				:key="typeof cover_url === 'string' ? cover_url : 'local'"
				@load="handleImageLoad(getImageSrc(cover_url))"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg"></div>
			<div v-if="centerNumber" class="absolute inset-0 flex items-center justify-center">
				<span class="text-gray-800 text-3xl font-semibold mt-2">{{ centerNumber }}</span>
			</div>
			<div
				v-if="showPlayButton"
				class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
			>
				<Button
					class="bg-[#da5597] hover:bg-[#da5597]/90 text-white rounded-full w-12 h-12 flex items-center justify-center"
					@click.stop="handlePlay"
				>
					<svg
						t="1691599025349"
						class="icon h-6 w-6"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="3841"
					>
						<path
							d="M732.502883 465.602819c-107.883492-82.3454-215.772403-164.681769-323.652282-247.014525-38.414608-29.327534-93.780555-1.929039-93.780555 46.396277v494.029051c0 48.325316 55.365948 75.725617 93.780555 46.398084 107.87988-82.332757 215.76879-164.669126 323.652282-247.014525 30.61356-23.357989 30.61356-69.436372 0-92.794362z"
							fill="#ffffff"
							p-id="3842"
						></path>
					</svg>
				</Button>
			</div>
			<div v-if="showInfo" class="absolute bottom-0 left-0 p-6 w-full">
				<p class="text-gray-300 text-xs font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">
					{{ info }}
				</p>
				<div v-if="showControls" class="mt-4 flex items-center gap-2">
					<Button class="bg-[#da5597] hover:bg-[#da5597]/90 text-white rounded-full">
						<svg
							t="1691599025349"
							class="icon h-4 w-4"
							viewBox="0 0 1024 1024"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							p-id="3841"
						>
							<path
								d="M732.502883 465.602819c-107.883492-82.3454-215.772403-164.681769-323.652282-247.014525-38.414608-29.327534-93.780555-1.929039-93.780555 46.396277v494.029051c0 48.325316 55.365948 75.725617 93.780555 46.398084 107.87988-82.332757 215.76879-164.669126 323.652282-247.014525 30.61356-23.357989 30.61356-69.436372 0-92.794362z"
								fill="#ffffff"
								p-id="3842"
							></path>
						</svg>
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
		<div :class="{ 'text-center': centerText }">
			<h2 :class="['font-bold text-white overflow-hidden line-clamp-1 min-h-[1.25em]', titleSize]">
				{{ name }}
			</h2>
			<p v-if="artist" class="text-gray-400 text-xs mt-1 line-clamp-1 overflow-hidden">{{ artist }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Heart, MoreHorizontal } from 'lucide-vue-next'
import { PropType, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ColorThief from 'colorthief'

const router = useRouter()
const emit = defineEmits(['play'])
const dominantColor = ref<string>('#121212')
const dominantColorWithOpacity = computed(() => {
	if (dominantColor.value === '#121212') {
		return 'rgba(18, 18, 18, 0.8)'
	}
	// 如果是 rgb 格式，转换为 rgba
	return dominantColor.value.replace('rgb', 'rgba').replace(')', ', 0.8)')
})

interface ImportMetaImage {
	default: string
}

const props = defineProps({
	cover_url: {
		type: [String, Object] as PropType<string | ImportMetaImage>,
		required: true,
	},
	name: String,
	artist: String,
	info: String,
	id: {
		type: [String, Number],
		default: '',
	},
	type: {
		type: String,
		default: 'potunes', // 'potunes' | 'netease'
	},
	max_width: {
		type: String,
		default: 'md:max-w-xs',
	},
	showPlayButton: {
		type: Boolean,
		default: false,
	},
	showControls: {
		type: Boolean,
		default: false,
	},
	showInfo: {
		type: Boolean,
		default: false,
	},
	centerText: {
		type: Boolean,
		default: false,
	},
	titleSize: {
		type: String,
		default: 'text-xs',
	},
	imageRatio: {
		type: String,
		default: 'wide', // 'wide' | 'square'
	},
	centerNumber: {
		type: [Number, String],
		default: null,
	},
	useColorThief: {
		type: Boolean,
		default: true,
	},
})

const getImageSrc = (url: string | ImportMetaImage): string => {
	if (typeof url === 'string') return url
	return url.default
}

const handleClick = () => {
	const id = props.id
	const type = props.type
	console.log('type', type)

	if (type === 'netease') return router.push(`/netease-playlist/${id}`)
	if (type === 'netease-album') return router.push(`/netease-album/${id}`)
	if (type === 'netease-daily-tracks') return router.push(`/netease-daily-tracks`)
	if (type === 'netease-daily') return router.push(`/netease-daily/${id}`)
	router.push(`/playlist/${id}`)
}

const handlePlay = (e: Event) => {
	e.stopPropagation()
	emit('play')
}

// 获取图片主色调
const getDominantColor = async (imageUrl: string) => {
	try {
		const img = new Image()
		img.crossOrigin = 'Anonymous'
		img.src = imageUrl

		await new Promise((resolve, reject) => {
			img.onload = resolve
			img.onerror = reject
		})

		const colorThief = new ColorThief()
		const color = colorThief.getColor(img)
		// 将主色调变深，将每个RGB分量减少40%，使其更暗一些
		const darkColor = color.map(c => Math.max(0, Math.floor(c * 0.6)))
		dominantColor.value = `rgb(${darkColor.join(',')})`
	} catch (error) {
		console.error('获取图片颜色失败:', error)
		dominantColor.value = '#121212'
	}
}

// 图片加载完成后获取主色调
const handleImageLoad = (url: string) => {
	if (props.useColorThief) {
		getDominantColor(url)
	}
}
</script>

<style scoped>
.line-clamp-1 {
	display: -webkit-box;
	-webkit-line-clamp: 1;
	line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* 添加 hover 效果 */
.hover\:brightness-110:hover {
	filter: brightness(var(--hover-brightness, 1.1));
}

/* 确保颜色过渡平滑 */
div {
	transition: background-color 0.2s ease-in-out, filter 0.2s ease-in-out;
}
</style>
