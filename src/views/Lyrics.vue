<!--
 * @Author       : lastshrek
 * @Date         : 2025-01-04 12:48:57
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-05 10:57:25
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
					variant="ghost"
					size="icon"
					@click="$emit('close')"
					class="h-10 w-10 mr-2 rounded-lg hover:bg-gray-800/50 hover:text-white"
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
								:model-value="currentProgress.currentProgress"
								@update:model-value="handleSliderChange"
								:min="0"
								:max="100"
								:interval="0.01"
								:duration="0"
								:dot-size="12"
								:height="3"
								:tooltip="'none'"
								class="my-4"
							></vue-slider>
							<div class="flex justify-between text-sm text-gray-400">
								<span>{{ formatCurrentTime(currentTime) }}</span>
								<span>{{ formatTime(currentTrack?.duration || 0) }}</span>
							</div>
						</div>

						<!-- 播放控制 -->
						<div class="flex items-center justify-center space-x-8" style="-webkit-app-region: no-drag">
							<Button variant="ghost" size="icon" @click="prev">
								<SkipBack class="h-6 w-6" />
							</Button>
							<Button variant="ghost" size="icon" class="h-12 w-12" @click="togglePlay">
								<Play v-if="!isPlaying" class="h-8 w-8" />
								<Pause v-else class="h-8 w-8" />
							</Button>
							<Button variant="ghost" size="icon" @click="next">
								<SkipForward class="h-6 w-6" />
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

defineEmits(['close'])
const currentTrack = useCurrentTrackStore()
const isPlaying = useIsPlayingStore().isPlaying
const currentTimeStore = useCurrentTimeStore()
const currentTime = computed(() => {
	return currentTimeStore.currentTime
})
const lyricsStore = useLyricsStore()
const currentProgress = useCurrentProgressStore()

// 更新进度条显示
const handleSliderChange = (value: number) => {
	if (!currentTrack.duration) return
	const newTime = (value / 100) * currentTrack.duration
	currentTimeStore.setCurrentTime(newTime)
	emitter.emit('showLyrics', newTime)
}

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

	if (currentIndex > -1 && lyricRefs.value[currentIndex] && lyricsContainer.value) {
		const lyricEl = lyricRefs.value[currentIndex]
		const containerHeight = lyricsContainer.value.clientHeight

		// 计算滚动位置，使当前歌词位于容器中央
		const scrollTop = lyricEl.offsetTop - containerHeight / 2 + lyricEl.clientHeight / 2

		lyricsContainer.value.scrollTo({
			top: scrollTop,
			behavior: currentIndex === 0 ? 'auto' : 'smooth', // 第一行直接跳转，避免开始时的滚动动画
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
	}, 50)
}

// 更新监听器
watch(currentTime, newTime => {
	debouncedScroll(newTime)
})

// 组件挂载后初始化歌词位置
onMounted(() => {
	scrollToCurrentLyric(currentTime.value)
})

// 判断是否是当前播放的歌词
const isCurrentLyric = (item: any, index: number) => {
	return currentTime.value >= item.time && currentTime.value < (parsedLyrics.value[index + 1]?.time || Infinity)
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
