<!--
 * @Author       : lastshrek
 * @Date         : 2025-01-04 12:48:57
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-14 12:52:34
 * @FilePath     : /src/views/Lyrics.vue
 * @Description  : Lyrics
 * Copyright 2025 lastshrek, All Rights Reserved.
 * 2025-01-04 12:48:57
-->
<template>
	<div class="fixed inset-0 h-screen w-screen backdrop-blur-2xl z-50">
		<!-- 原有内容，添加相对定位确保在动画上层 -->
		<div class="relative z-10">
			<!-- 顶部拖动区域和关闭按钮 -->
			<div class="h-14 w-full flex justify-between items-center backdrop-blur-2xl" style="-webkit-app-region: drag">
				<div class="px-4"></div>
				<Button
					variant="link"
					size="icon"
					@click="$emit('close')"
					class="h-10 w-10 mr-2 rounded-lg hover:bg-gray-800/50"
					style="-webkit-app-region: no-drag"
				>
					<X class="h-5 w-5" />
				</Button>
			</div>

			<div class="fixed inset-x-0 bottom-0 h-[calc(100vh-3.5rem)] bg-black">
				<!-- 主要内容区域 -->
				<div class="flex h-full">
					<!-- 左侧：封面和控制区域 -->
					<div class="w-1/2 h-full p-8 flex flex-col justify-center items-center space-y-8">
						<!-- 封面 -->
						<div class="w-64 h-64 rounded-lg overflow-hidden">
							<img :src="currentTrack?.cover_url" class="w-full h-full object-cover" />
						</div>

						<!-- 歌曲信息 -->
						<div class="text-center space-y-2">
							<h2 class="text-2xl font-bold">{{ currentTrack?.name }}</h2>
							<p class="text-gray-400">{{ currentTrack?.artist }}</p>
						</div>

						<!-- 进度条 -->
						<div class="w-full max-w-md" style="-webkit-app-region: no-drag">
							<vue-slider
								v-model="value"
								:min="0"
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
							></vue-slider>
							<div class="flex justify-between text-sm text-gray-400">
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
					<div class="w-1/2 h-full relative">
						<!-- 歌词内容 -->
						<div class="h-full overflow-y-auto relative" style="-webkit-app-region: no-drag" ref="lyricsContainer">
							<div v-if="lyricsStore.loading" class="text-center py-4">加载中...</div>
							<div v-else-if="lyricsStore.error" class="text-center text-red-500 py-4">
								{{ lyricsStore.error }}
							</div>
							<ul v-else class="space-y-6 pt-[50vh]">
								<li
									v-for="(item, index) in parsedLyrics"
									:key="index"
									:class="{
										'transform transition-all duration-300': true,
										'active scale-110 opacity-100': isCurrentLyric(item, index),
										'opacity-50 scale-100': !isCurrentLyric(item, index),
									}"
									:ref="el => (lyricRefs[index] = el as HTMLElement)"
									class="transition-all duration-300 px-4 py-2"
								>
									<p
										class="mb-1 text-center text-lg"
										:class="{
											'text-white font-bold': isCurrentLyric(item, index),
											'text-gray-400': !isCurrentLyric(item, index),
										}"
									>
										{{ item.lrc }}
									</p>
									<p
										v-if="item.translation && item.translation !== 'unwritten'"
										class="text-sm text-center"
										:class="{
											'text-white font-bold': isCurrentLyric(item, index),
											'text-gray-400': !isCurrentLyric(item, index),
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
import { useIsPlayingStore } from '@/store/modules/isPlaying'
import { useCurrentTimeStore } from '@/store/modules/currentTime'
import { useCurrentProgressStore } from '@/store/modules/currentProgress'
import { formatTime, formatCurrentTime } from '@/utils'
import { useLyricsStore } from '@/store/modules/lyrics'
import { emitter } from '@/utils/mitt'
import { ref, computed, onMounted, watch } from 'vue'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'
import { PlayMode, usePlayModeStore } from '@/store/modules/playMode'

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

const value = ref(0)
const lyricsContainer = ref<HTMLElement | null>(null)
const lyricRefs = ref<HTMLElement[]>([])

// 解析歌词
const parsedLyrics = computed(() => {
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

// 滚动到当前歌词
const scrollToCurrentLyric = (time: number) => {
	const currentIndex = parsedLyrics.value.findIndex(
		(item, index) => time >= item.time && time < (parsedLyrics.value[index + 1]?.time || Infinity)
	)

	if (currentIndex === -1) return

	if (lyricRefs.value[currentIndex] && lyricsContainer.value) {
		const lyricEl = lyricRefs.value[currentIndex]
		const containerHeight = lyricsContainer.value.clientHeight
		const scrollTop = lyricEl.offsetTop - containerHeight / 2 + lyricEl.clientHeight / 2

		lyricsContainer.value.scrollTo({
			top: scrollTop,
			behavior: 'smooth',
		})
	}
}

// 添加防抖的滚动处理
let scrollTimeout: number | null = null
const debouncedScroll = (time: number) => {
	if (scrollTimeout) {
		window.clearTimeout(scrollTimeout)
	}
	scrollTimeout = window.setTimeout(() => {
		scrollToCurrentLyric(time)
	}, 100)
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

	emitter.emit('showLyrics', clampedTime)
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
		debouncedScroll(newTime)
	},
	{ immediate: true }
)

const togglePlay = () => {
	useIsPlayingStore().setIsPlaying(!isPlaying)
}

const prev = () => {
	// 实现上一首逻辑
	emitter.emit('prev')
}

const next = () => {
	// 实现下一首逻辑
	emitter.emit('next')
}

// 组件挂载后初始化歌词位置
onMounted(() => {
	if (currentTime.value > 0) {
		scrollToCurrentLyric(currentTime.value)
	}
})

// 判断是否是当前播放的歌词
const isCurrentLyric = (item: any, index: number) => {
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

/* 背景动画 */
.bg-gradient-animate {
	background-size: 400% 400% !important;
	animation: gradientFlow 15s ease infinite;
}

@keyframes gradientFlow {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

/* 添加玻璃拟态效果 */
.glass-morphism {
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
}

/* 添加内容区域的投影效果 */
.fixed.inset-x-0.bottom-0 {
	@apply glass-morphism;
	box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.2);
}

/* 优化歌词容器的视觉效果 */
.lyrics-container {
	@apply glass-morphism;
	mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
	-webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
	transform: translateZ(0);
	backface-visibility: hidden;
	perspective: 1000px;
}

.active {
	transform: scale(1.1);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	will-change: transform, opacity;
	font-weight: 600;
}

.floating-blob {
	position: absolute;
	width: var(--size);
	height: var(--size);
	background: var(--color);
	border-radius: 50%;
	filter: blur(60px);
	opacity: 0.5;
	mix-blend-mode: soft-light;
	animation: float var(--delay) ease-in-out infinite alternate;
	transform: translate(var(--x), var(--y));
}

@keyframes float {
	0% {
		transform: translate(var(--x), var(--y)) scale(1);
	}
	50% {
		transform: translate(calc(var(--x) + 10%), calc(var(--y) - 10%)) scale(1.1);
	}
	100% {
		transform: translate(var(--x), var(--y)) scale(1);
	}
}

/* 移除之前的动画相关样式 */
.bg-gradient-animate,
.liquid-container,
.liquid-blob {
	display: none;
}

.karaoke-text,
.karaoke-overlay {
	display: none;
}

/* 保持其他样式不变 */
.active {
	transform: scale(1.1);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	will-change: transform, opacity;
	font-weight: 600;
}

/* 优化不活跃状态的过渡 */
li:not(.active) {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
