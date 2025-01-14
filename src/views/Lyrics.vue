<!--
 * @Author       : lastshrek
 * @Date         : 2025-01-04 12:48:57
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-14 21:23:07
 * @FilePath     : /src/views/Lyrics.vue
 * @Description  : Lyrics
 * Copyright 2025 lastshrek, All Rights Reserved.
 * 2025-01-04 12:48:57
-->
<template>
	<div
		class="fixed inset-0 h-screen w-screen z-50 transform"
		:style="{
			backgroundColor: `rgb(${dominantColor.join(',')})`,
			backdropFilter: 'blur(30px)',
			WebkitBackdropFilter: 'blur(30px)',
			transition: 'all 0.3s ease-in-out',
		}"
	>
		<!-- 添加一个半透明遮罩层 -->
		<div class="absolute inset-0 bg-black/20"></div>
		<!-- 原有内容，添加相对定位确保在遮罩层上层 -->
		<div class="relative z-10">
			<!-- 添加关闭按钮 -->
			<Button
				variant="link"
				size="icon"
				class="absolute top-4 right-4 text-white z-50"
				style="-webkit-app-region: no-drag"
				@click="$emit('close')"
			>
				<X class="h-6 w-6" />
			</Button>
			<div class="fixed inset-x-0 bottom-0 h-screen">
				<!-- 主要内容区域 -->
				<div
					class="flex h-full"
					:style="{
						backgroundColor: `rgb(${dominantColor.join(',')})`,
						transition: 'background-color 0.5s ease-in-out',
					}"
				>
					<!-- 左侧：封面和控制区域 -->
					<div
						:class="[
							'h-full p-8 flex flex-col justify-center items-center space-y-8 transition-all duration-300',
							{ 'w-full': shouldCenter, 'w-1/2': !shouldCenter },
						]"
					>
						<!-- 封面 -->
						<div class="w-96 h-96 rounded-lg overflow-hidden">
							<img :src="currentTrack?.cover_url" class="w-full h-full object-cover" />
						</div>

						<!-- 歌曲信息 -->
						<div class="text-center space-y-2">
							<h2 class="text-2xl font-bold text-white">{{ currentTrack?.name }}</h2>
							<p class="text-white">{{ currentTrack?.artist }}</p>
						</div>

						<!-- 进度条 -->
						<div class="w-full max-w-md" style="-webkit-app-region: no-drag">
							<vue-slider
								v-model="value"
								:min="0"
								:max="100"
								:interval="0.01"
								:drag-on-click="true"
								:duration="0"
								:dot-size="12"
								:height="3"
								:tooltip="'none'"
								:lazy="true"
								@drag-end="dragEnd"
								contain
								class="my-4"
								:process-style="{
									backgroundColor: `rgb(${secondaryColor.join(',')})`,
								}"
								:rail-style="{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }"
								:dot-style="{
									backgroundColor: `rgb(${secondaryColor.join(',')})`,
								}"
							></vue-slider>
							<div class="flex justify-between text-sm text-white">
								<span>{{ formatCurrentTime(currentTime) }}</span>
								<span>{{ formatTime(currentTrack?.duration || 0) }}</span>
							</div>
						</div>

						<!-- 播放控制 -->
						<div class="flex items-center justify-center space-x-8" style="-webkit-app-region: no-drag">
							<!-- 循环 -->
							<Button variant="link" size="icon" @click="repeatMode">
								<svg
									t="1691598118430"
									v-if="playMode.playMode === 0 || playMode.playMode === 2"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="7057"
									width="24"
									height="24"
								>
									<path
										d="M361.5 727.8c-119.1 0-215.9-96.9-215.9-215.9 0-119.1 96.9-215.9 215.9-215.9 2.3 0 4.6-0.2 6.8-0.6v58.3c0 12.3 14 19.4 23.9 12.1l132.6-97.6c8.1-6 8.1-18.2 0-24.2l-132.6-97.6c-9.9-7.3-23.9-0.2-23.9 12.1v58.1c-2.2-0.4-4.5-0.6-6.8-0.6-39.8 0-78.5 7.9-115 23.4-35.2 15-66.8 36.3-94 63.5s-48.6 58.8-63.5 94c-15.5 36.5-23.4 75.2-23.4 115s7.9 78.5 23.4 115c15 35.2 36.3 66.8 63.5 94s58.8 48.6 94 63.5c36.5 15.5 75.2 23.4 115 23.4 22.1 0 40-17.9 40-40s-17.9-40-40-40zM938.2 396.9c-15-35.2-36.3-66.8-63.5-94s-58.8-48.6-94-63.5c-36.5-15.5-75.2-23.4-115-23.4-22.1 0-40 17.9-40 40s17.9 40 40 40c119.1 0 215.9 96.9 215.9 215.9 0 119.1-96.9 215.9-215.9 215.9-4.1 0-8.1 0.6-11.8 1.8v-60.8c0-12.3-14-19.4-23.9-12.1l-132.6 97.6c-8.1 6-8.1 18.2 0 24.2L629.9 876c9.9 7.3 23.9 0.2 23.9-12.1V806c3.7 1.2 7.7 1.8 11.8 1.8 39.8 0 78.5-7.9 115-23.4 35.2-15 66.8-36.3 94-63.5s48.6-58.8 63.5-94c15.5-36.5 23.4-75.2 23.4-115s-7.8-78.5-23.3-115z"
										p-id="7058"
										fill="#ffffff"
									></path>
								</svg>
								<svg
									t="1691598177672"
									v-else
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="7323"
									width="24"
									height="24"
								>
									<path
										d="M361.5 727.8c-119.1 0-215.9-96.9-215.9-215.9 0-119.1 96.9-215.9 215.9-215.9 2.3 0 4.6-0.2 6.8-0.6v58.3c0 12.3 14 19.4 23.9 12.1l132.6-97.6c8.1-6 8.1-18.2 0-24.2l-132.6-97.6c-9.9-7.3-23.9-0.2-23.9 12.1v58.1c-2.2-0.4-4.5-0.6-6.8-0.6-39.8 0-78.5 7.9-115 23.4-35.2 15-66.8 36.3-94 63.5s-48.6 58.8-63.5 94c-15.5 36.5-23.4 75.2-23.4 115s7.9 78.5 23.4 115c15 35.2 36.3 66.8 63.5 94s58.8 48.6 94 63.5c36.5 15.5 75.2 23.4 115 23.4 22.1 0 40-17.9 40-40s-17.9-40-40-40zM938.2 396.9c-15-35.2-36.3-66.8-63.5-94s-58.8-48.6-94-63.5c-36.5-15.5-75.2-23.4-115-23.4-22.1 0-40 17.9-40 40s17.9 40 40 40c119.1 0 215.9 96.9 215.9 215.9 0 119.1-96.9 215.9-215.9 215.9-4.1 0-8.1 0.6-11.8 1.8v-60.8c0-12.3-14-19.4-23.9-12.1l-132.6 97.6c-8.1 6-8.1 18.2 0 24.2L629.9 876c9.9 7.3 23.9 0.2 23.9-12.1V806c3.7 1.2 7.7 1.8 11.8 1.8 39.8 0 78.5-7.9 115-23.4 35.2-15 66.8-36.3 94-63.5s48.6-58.8 63.5-94c15.5-36.5 23.4-75.2 23.4-115s-7.8-78.5-23.3-115z"
										p-id="7324"
										fill="#ffffff"
									></path>
									<path
										d="M512.8 660.6c22.1-0.1 39.9-18.1 39.8-40.2l-1.2-214.1c-0.1-22-18-39.8-40-39.8h-0.2c-22.1 0.1-39.9 18.1-39.8 40.2l1.2 214.1c0.1 22 18 39.8 40 39.8h0.2z"
										p-id="7325"
										fill="#ffffff"
									></path>
								</svg>
							</Button>
							<!-- 上一首 -->
							<Button variant="link" size="icon" @click="prev">
								<svg
									t="1691598810697"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="2975"
									width="24"
									height="24"
								>
									<path
										d="M364.302083 465.602819L687.954365 218.588294c38.416414-29.327534 93.791393-1.929039 93.791392 46.396277v494.029051c0 48.325316-55.374979 75.725617-93.791392 46.398084L364.302083 558.397181c-30.600916-23.357989-30.600916-69.436372 0-92.794362zM238.945254 780.798397V451.684117v-164.562559c0-19.628152-5.904521-60.475733 17.057907-75.841215 25.523642-17.068744 59.747828 1.210165 59.747828 31.919454v493.676839c0 19.628152 5.915358 60.473927-17.047069 75.841215-25.53448 17.068744-59.758666-1.211971-59.758666-31.919454z"
										fill="#ffffff"
										p-id="2976"
									></path>
								</svg>
							</Button>
							<!-- 暂停/播放 -->
							<Button variant="link" size="icon" class="h-12 w-12" @click="togglePlay">
								<svg
									t="1691599025349"
									v-if="!isPlaying"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="3841"
									width="24"
									height="24"
								>
									<path
										d="M732.502883 465.602819c-107.883492-82.3454-215.772403-164.681769-323.652282-247.014525-38.414608-29.327534-93.780555-1.929039-93.780555 46.396277v494.029051c0 48.325316 55.365948 75.725617 93.780555 46.398084 107.87988-82.332757 215.76879-164.669126 323.652282-247.014525 30.61356-23.357989 30.61356-69.436372 0-92.794362z"
										fill="#ffffff"
										p-id="3842"
									></path>
								</svg>
								<svg
									t="1691599172430"
									v-else
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="6673"
									width="24"
									height="24"
								>
									<path
										d="M320 128A64 64 0 0 0 256 192v640a64 64 0 0 0 128 0v-640A64 64 0 0 0 320 128z m384 0A64 64 0 0 0 640 192v640a64 64 0 0 0 128 0v-640A64 64 0 0 0 704 128z"
										fill="#ffffff"
										p-id="6674"
									></path>
								</svg>
							</Button>
							<!-- 下一首 -->
							<Button variant="link" size="icon" @click="next">
								<svg
									t="1691598713799"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="14070"
									id="mx_n_1691598713799"
									width="24"
									height="24"
								>
									<path
										d="M655.706179 465.602819L332.053897 218.588294c-38.414608-29.327534-93.791393-1.929039-93.791392 46.396277v494.029051c0 48.325316 55.376785 75.725617 93.791392 46.398084l323.652282-247.014525c30.602722-23.357989 30.602722-69.436372 0-92.794362zM781.064814 780.798397V451.684117v-164.562559c0-19.628152 5.904521-60.475733-17.057907-75.841215-25.523642-17.068744-59.747828 1.210165-59.747828 31.919454v493.676839c0 19.628152-5.915358 60.473927 17.047069 75.841215 25.532673 17.068744 59.758666-1.211971 59.758666-31.919454z"
										fill="#ffffff"
										p-id="14071"
									></path>
								</svg>
							</Button>
							<!-- 随机 -->
							<Button variant="link" size="icon" @click="shuffle">
								<svg
									class="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 18"
								>
									<path
										:stroke="playMode.playMode === 2 ? '#da5597' : '#ffffff'"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11.484 6.166 13 4h6m0 0-3-3m3 3-3 3M1 14h5l1.577-2.253M1 4h5l7 10h6m0 0-3 3m3-3-3-3"
									/>
								</svg>
							</Button>
						</div>
					</div>

					<!-- 右侧：歌词区域 -->
					<div
						v-if="!lyricsStore.loading && !lyricsStore.error && parsedLyrics.length"
						class="w-1/2 h-full py-20 relative"
					>
						<!-- 歌词内容 -->
						<div
							class="h-full overflow-y-auto overflow-x-hidden relative"
							style="-webkit-app-region: no-drag"
							ref="lyricsContainer"
							@mouseenter="pauseAutoScroll"
							@mouseleave="resumeAutoScroll"
							@blur="resumeAutoScroll"
						>
							<div v-if="lyricsStore.loading" class="text-center py-4">加载中...</div>
							<div v-else-if="lyricsStore.error" class="text-center text-red-500 py-4">
								{{ lyricsStore.error }}
							</div>
							<ul v-else class="space-y-6 pb-[50vh]">
								<li class="h-[50vh]"></li>
								<li
									v-for="(item, index) in parsedLyrics"
									:key="index"
									:class="{
										'transform transition-all duration-300': true,
										'active scale-110 opacity-100': isCurrentLyric(item, index),
										'opacity-50 scale-100': !isCurrentLyric(item, index),
									}"
									:ref="el => (lyricRefs[index] = el as HTMLElement)"
									class="transition-all duration-300 px-4 py-2 cursor-pointer hover:opacity-100 w-full"
									@click="seekToTime(item.time)"
								>
									<p
										class="mb-1 text-center text-lg text-white break-words whitespace-pre-wrap max-w-full"
										:class="{
											'font-bold': isCurrentLyric(item, index),
										}"
									>
										{{ item.lrc }}
									</p>
									<p
										v-if="item.translation && item.translation !== 'unwritten'"
										class="text-sm text-center text-white break-words whitespace-pre-wrap max-w-full"
										:class="{
											'font-bold': isCurrentLyric(item, index),
										}"
									>
										{{ item.translation }}
									</p>
								</li>
								<li class="h-[50vh]"></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { X, Play, Pause, SkipBack, SkipForward } from 'lucide-vue-next'
import VueSlider from 'vue-slider-component'
import { useRouter } from 'vue-router'
import { useIsPlayingStore } from '@/store/modules/isPlaying'
import { useCurrentTimeStore } from '@/store/modules/currentTime'
import { useCurrentProgressStore } from '@/store/modules/currentProgress'
import { formatTime, formatCurrentTime } from '@/utils'
import { useLyricsStore } from '@/store/modules/lyrics'
import { emitter } from '@/utils/mitt'
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'
import { PlayMode, usePlayModeStore } from '@/store/modules/playMode'
import ColorThief from 'colorthief'

interface LyricItem {
	time: number
	lrc: string
	translation: string
}

const router = useRouter()
defineEmits(['close'])
const currentTrack = useCurrentTrackStore()
const isPlaying = useIsPlayingStore().isPlaying
const currentTimeStore = useCurrentTimeStore()
const currentTime = computed(() => {
	return currentTimeStore.currentTime
})
const lyricsStore = useLyricsStore()
const currentProgress = useCurrentProgressStore()
const playMode = usePlayModeStore()

// 解析歌词
const parsedLyrics = computed<LyricItem[]>(() => {
	const lrcMap = new Map()

	// 解析原文歌词
	const lrcLines = lyricsStore.lrc.split('\n')
	lrcLines.forEach(line => {
		const match = line.match(/\[(\d{2}):(\d{2})\.(\d{1,3})\](.*)/)
		if (match) {
			const minutes = parseInt(match[1])
			const seconds = parseInt(match[2])
			const milliseconds = parseInt(match[3])
			const time = minutes * 60 + seconds + milliseconds / 1000
			const text = match[4].trim()
			lrcMap.set(time, { time, lrc: text, translation: '' })
		}
	})

	// 解析翻译歌词
	if (lyricsStore.lrc_cn) {
		const lrcCnLines = lyricsStore.lrc_cn.split('\n')
		lrcCnLines.forEach(line => {
			const match = line.match(/\[(\d{2}):(\d{2})\.(\d{1,3})\](.*)/)
			if (match) {
				const minutes = parseInt(match[1])
				const seconds = parseInt(match[2])
				const milliseconds = parseInt(match[3])
				const time = minutes * 60 + seconds + milliseconds / 1000
				const text = match[4].trim()
				if (lrcMap.has(time)) {
					lrcMap.get(time).translation = text
				}
			}
		})
	}

	// 过滤掉没有歌词的时间点并排序
	return Array.from(lrcMap.values())
		.filter(item => item.lrc || item.translation)
		.sort((a, b) => a.time - b.time)
})

// 添加延迟状态
const shouldCenter = ref<boolean>(false)
let timer: NodeJS.Timeout | null = null

// 处理延迟居中
const handleCenterDelay = () => {
	if (timer) clearTimeout(timer)

	if (!lyricsStore.loading && !lyricsStore.error && parsedLyrics.value.length) {
		shouldCenter.value = false
		return
	}

	timer = setTimeout(() => {
		shouldCenter.value = !!(lyricsStore.loading || lyricsStore.error || !parsedLyrics.value.length)
	}, 5000)
}

// 监听歌词状态变化
watch([() => lyricsStore.loading, () => lyricsStore.error, () => parsedLyrics.value.length], handleCenterDelay, {
	immediate: true,
})

// 组件卸载时清理定时器
onUnmounted(() => {
	if (timer) clearTimeout(timer)
})

const value = ref(0)
const lyricsContainer = ref<HTMLElement | null>(null)
const lyricRefs = ref<HTMLElement[]>([])
const audio = ref<HTMLAudioElement | null>(null)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

// 添加主色调状态
const dominantColor = ref<number[]>([0, 0, 0])
const secondaryColor = ref<number[]>([0, 0, 0])

// 添加自动滚动控制
const isAutoScrollPaused = ref(false)

// 暂停自动滚动
const pauseAutoScroll = () => {
	isAutoScrollPaused.value = true
}

// 恢复自动滚动
const resumeAutoScroll = () => {
	setTimeout(() => {
		isAutoScrollPaused.value = false
		// 恢复时立即滚动到当前歌词
		if (currentTime.value > 0) {
			scrollToCurrentLyric(currentTime.value, true)
		}
	}, 2000)
}

// 修改 debouncedScroll 函数，添加自动滚动控制
const debouncedScroll = (time: number, immediate = false) => {
	if (scrollTimeout) {
		clearTimeout(scrollTimeout)
		scrollTimeout = null
	}
	// 只有在未暂停自动滚动时才执行滚动
	if (!isAutoScrollPaused.value) {
		scrollTimeout = setTimeout(
			() => {
				scrollToCurrentLyric(time, immediate)
			},
			immediate ? 0 : 100
		)
	}
}

// 获取图片主色调
const getImageColor = async (imageUrl: string) => {
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
		// 将主色调变深，将每个RGB分量减少30%
		dominantColor.value = color.map(c => Math.max(0, Math.floor(c * 0.7)))

		// 获取调色板并设置第二主色
		const palette = colorThief.getPalette(img, 3)
		// 使用第二个最显著的颜色，并提高亮度和饱和度
		secondaryColor.value = palette[1].map(c => Math.min(255, Math.floor(c * 1.5))) // 提高亮度50%
	} catch (error) {
		console.error('获取图片颜色失败:', error)
		// 设置默认颜色
		dominantColor.value = [18, 18, 18]
		secondaryColor.value = [255, 23, 68] // 使用更鲜艳的红色作为默认进度条颜色
	}
}

// 监听封面变化
watch(
	() => currentTrack.cover_url,
	async newUrl => {
		if (newUrl) {
			await getImageColor(newUrl)
		} else {
			// 当没有封面时也使用默认黑色背景
			dominantColor.value = [18, 18, 18]
		}
	},
	{ immediate: true }
)

// 滚动到当前歌词
const scrollToCurrentLyric = (time: number, immediate = false) => {
	const currentIndex = parsedLyrics.value.findIndex(
		(item: LyricItem, index: number) => time >= item.time && time < (parsedLyrics.value[index + 1]?.time || Infinity)
	)

	if (currentIndex === -1) return

	if (lyricRefs.value[currentIndex] && lyricsContainer.value) {
		const lyricEl = lyricRefs.value[currentIndex]
		const containerHeight = lyricsContainer.value.clientHeight
		const scrollTop = lyricEl.offsetTop - containerHeight / 2 + lyricEl.clientHeight / 2

		lyricsContainer.value.scrollTo({
			top: scrollTop,
			behavior: immediate ? 'auto' : 'smooth',
		})
	}
}

// 进度条拖动结束
const dragEnd = () => {
	if (!currentTrack.duration) return

	// 确保值在 0-100 之间
	const clampedValue = Math.max(0, Math.min(100, value.value))

	// 将毫秒转换为秒
	const durationInSeconds = currentTrack.duration / 1000
	const newTime = (clampedValue / 100) * durationInSeconds

	// 确保时间不超过总时长
	const clampedTime = Math.min(newTime, durationInSeconds)

	currentTimeStore.setCurrentTime(clampedTime)
	if (audio.value) {
		audio.value.currentTime = clampedTime
	}
}

// 监听播放进度变化来更新进度条
watch(
	() => currentProgress.currentProgress,
	newValue => {
		if (isNaN(newValue)) return
		// 确保进度值在 0-100 之间
		const clampedValue = Math.max(0, Math.min(100, newValue))
		value.value = clampedValue
	},
	{ immediate: true }
)

// 监听播放时间变化来更新歌词滚动
watch(
	currentTime,
	newTime => {
		if (!currentTrack.duration) return
		if (!isAutoScrollPaused.value) {
			debouncedScroll(newTime)
		}
	},
	{ immediate: true }
)

const togglePlay = () => {
	useIsPlayingStore().setIsPlaying(!isPlaying)
}

const prev = () => {
	if (currentTrack.url === '') return

	// 如果当前播放时间超过3秒，重新播放当前歌曲
	if (audio.value && audio.value.currentTime > 3) {
		currentTimeStore.setCurrentTime(0)
		audio.value.currentTime = 0
		return
	}

	// 否则播放上一首
	emitter.emit('prev')
}

const next = () => {
	// 实现下一首逻辑
	emitter.emit('next')
}

// 组件挂载后初始化歌词位置
onMounted(() => {
	if (currentTime.value > 0) {
		// 初始化时使用即时滚动
		debouncedScroll(currentTime.value, true)
	}
	audio.value = document.querySelector('audio')
})

// 判断是否是当前播放的歌词
const isCurrentLyric = (item: LyricItem, index: number) => {
	const time = currentTime.value
	return time >= item.time && time < (parsedLyrics.value[index + 1]?.time || Infinity)
}

// 添加循环模式切换方法
const repeatMode = () => {
	if (playMode.playMode == PlayMode.Sequence) {
		playMode.setPlayMode(PlayMode.Repeat)
		return
	}
	playMode.setPlayMode(PlayMode.Sequence)
}

// 添加随机播放方法
const shuffle = () => {
	if (playMode.playMode == PlayMode.Shuffle) {
		usePlayModeStore().setPlayMode(PlayMode.Sequence)
		return
	}
	usePlayModeStore().setPlayMode(PlayMode.Shuffle)
}

// 跳转到指定时间
const seekToTime = (time: number) => {
	if (!currentTrack.duration) return

	currentTimeStore.setCurrentTime(time)
	if (audio.value) {
		audio.value.currentTime = time
	}
}
</script>

<style scoped>
::-webkit-scrollbar {
	width: 4px;
}

::-webkit-scrollbar-track {
	background: transparent;
}

::-webkit-scrollbar-thumb {
	background: #4a4a4a;
	border-radius: 2px;
}

/* 添加文字描边效果 */
.text-stroke {
	color: white;
	text-shadow: -0.5px -0.5px 0 rgba(0, 0, 0, 0.3), 0.5px -0.5px 0 rgba(0, 0, 0, 0.3), -0.5px 0.5px 0 rgba(0, 0, 0, 0.3),
		0.5px 0.5px 0 rgba(0, 0, 0, 0.3);
}

/* 应用到所有文字元素 */
h2,
p,
span,
li {
	@apply text-stroke text-white;
}
</style>
