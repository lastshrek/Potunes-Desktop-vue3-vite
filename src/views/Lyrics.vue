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
		class="fixed inset-0 h-screen w-screen z-50 transform overflow-hidden"
		:class="[isOpen ? 'translate-y-0' : 'translate-y-full', 'transition-transform duration-500 ease-in-out']"
	>
		<!-- 全屏背景底色 -->
		<div class="absolute inset-0" :style="{ backgroundColor: `rgb(${dominantColor.join(',')})`, transition: 'background-color 0.8s ease-in-out' }"></div>
		<!-- Apple Music 液态背景：6 个有机运动色块 -->
		<div class="absolute inset-0 overflow-hidden" style="mix-blend-mode: screen;">
			<div
				v-for="(blob, i) in blobs"
				:key="i"
				:class="'lyric-blob blob-path-' + i"
				:style="{
					width: blob.size + 'vw',
					height: blob.size + 'vw',
					left: blob.x + 'vw',
					top: blob.y + 'vh',
					background: blob.color,
					animationDuration: blob.dur + 's',
					animationDelay: '-' + (blob.dur * 0.15 * i) + 's',
				}"
			></div>
		</div>
		<!-- 灰色蒙版，保证歌词可读 -->
		<div class="absolute inset-0 bg-black/25" style="pointer-events: none;"></div>
		<!-- 内容层 -->
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
				<div class="flex h-full">
					<!-- 左侧：封面和控制区域 -->
					<div
						:class="[
							'h-full p-8 flex flex-col justify-center items-center space-y-8 transition-all duration-300',
							{ 'w-full': shouldCenter, 'w-1/2': !shouldCenter },
						]"
					>
						<!-- 封面 -->
						<div class="w-96 h-96 rounded-lg overflow-hidden">
							<img :src="playerStore.currentTrack?.cover_url" class="w-full h-full object-cover" />
						</div>

						<!-- 歌曲信息 -->
						<div class="text-center space-y-2">
							<h2 class="text-2xl font-bold text-white">{{ playerStore.currentTrack?.name }}</h2>
							<p class="text-white">{{ playerStore.currentTrack?.artist }}</p>
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
								<span>{{ formatTime(playerStore.currentTrack?.duration || 0) }}</span>
							</div>
						</div>

						<!-- 播放控制 -->
						<div class="flex items-center justify-center space-x-8" style="-webkit-app-region: no-drag">
							<!-- 喜欢按钮 -->
							<Button v-if="isLoggedIn" variant="link" size="icon" @click="toggleLike">
								<svg
									v-if="isLiked"
									:class="`w-6 h-6 text-[rgb(${secondaryColor.join(',')})]`"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path
										d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
									/>
								</svg>
								<svg
									v-else
									class="w-6 h-6 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
									/>
								</svg>
							</Button>
							<!-- 循环 -->
							<Button variant="link" size="icon" @click="repeatMode">
								<svg
									t="1691598118430"
									v-if="playerStore.playMode === 0 || playerStore.playMode === 2"
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
							<Button variant="link" size="icon" @click="togglePlay">
								<svg
									t="1691599025349"
									v-if="!playerStore.isPlaying"
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
									p-id="4707"
									width="24"
									height="24"
								>
									<path
										d="M304.128 768V256c0-19.2 15.872-35.072 35.072-35.072h72.192c19.2 0 35.072 15.872 35.072 35.072v512c0 19.2-15.872 35.072-35.072 35.072H339.2c-19.2 0-35.072-15.872-35.072-35.072z m272.896 0V256c0-19.2 15.872-35.072 35.072-35.072h72.192c19.2 0 35.072 15.872 35.072 35.072v512c0 19.2-15.872 35.072-35.072 35.072h-72.192c-19.2 0-35.072-15.872-35.072-35.072z"
										fill="#ffffff"
										p-id="4708"
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
										:stroke="playerStore.playMode === 2 ? '#da5597' : '#ffffff'"
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
					class="w-1/2 h-full py-12 relative lyrics-container"
				>
					<!-- 歌词内容 -->
					<div
						class="h-full overflow-y-auto overflow-x-hidden relative lyrics-scroll-area"
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
						<ul v-else class="pb-[45vh]">
							<li class="h-[45vh]"></li>
							<li
								v-for="(item, index) in parsedLyrics"
								:key="index"
								class="px-6 py-3 cursor-pointer w-full break-words lyrics-text"
								:class="{ 'lyric-item-clicked': clickedLineIndex === index }"
								:ref="el => (lyricRefs[index] = el as HTMLElement)"
								@click="onLyricClick(item.time, index)"
							>
								<p
									class="text-center leading-relaxed select-none text-base"
									:class="{ 'font-bold': currentLyricIndex === index }"
									:style="getLyricStyle(index)"
								>
									{{ item.lrc }}
								</p>
								<p
									v-if="item.translation && item.translation !== 'unwritten'"
									class="text-center leading-snug select-none text-xs"
									:class="{ 'font-semibold': currentLyricIndex === index }"
									:style="getTranslationStyle(index)"
								>
									{{ item.translation }}
								</p>
							</li>
							<li class="h-[45vh]"></li>
						</ul>
					</div>
				</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { X, Play, Pause, SkipBack, SkipForward } from 'lucide-vue-next'
import VueSlider from 'vue-slider-component'
import { useRouter } from 'vue-router'
import { PlayMode, usePlayerStore } from '@/store/modules/player'
import { formatTime, formatCurrentTime } from '@/utils'
import { useLyricsStore } from '@/store/modules/lyrics'
import { emitter } from '@/utils/mitt'
import ColorThief from 'colorthief'
import { likeTrack } from '@/api'
import { handlePromise } from '@/utils'
import { useToast } from '@/composables/useToast'

// 定义 props
const props = defineProps<{
	isOpen: boolean
}>()

// 定义 emits
const emit = defineEmits<{
	(e: 'close'): void
}>()

interface LyricItem {
	time: number
	lrc: string
	translation: string
}

const router = useRouter()
const playerStore = usePlayerStore()
const currentTime = computed(() => {
	return playerStore.currentTime
})
const lyricsStore = useLyricsStore()
const toast = useToast()

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

// 封面居中 — 无歌词时立即居左
const shouldCenter = computed(() => {
	return !!(lyricsStore.loading || lyricsStore.error || !parsedLyrics.value.length)
})

// 当前歌词索引（只计算一次）
const currentLyricIndex = computed(() => {
	const time = currentTime.value
	return parsedLyrics.value.findIndex(
		(item: LyricItem, index: number) => time >= item.time && time < (parsedLyrics.value[index + 1]?.time || Infinity)
	)
})

// 歌词点击反馈
const clickedLineIndex = ref<number | null>(null)
let clickFeedbackTimer: ReturnType<typeof setTimeout> | null = null

const onLyricClick = (time: number, index: number) => {
	clickedLineIndex.value = index
	if (clickFeedbackTimer) clearTimeout(clickFeedbackTimer)
	clickFeedbackTimer = setTimeout(() => {
		clickedLineIndex.value = null
	}, 300)
	seekToTime(time)
}

// Apple Music 风格 — opacity + fontSize + fontWeight 渐变
const getLyricStyle = (index: number): Record<string, string | number> => {
	const dist = Math.abs(index - currentLyricIndex.value)
	if (dist === 0) return { opacity: 1, fontSize: '1.375rem', fontWeight: 700 }
	if (dist === 1) return { opacity: 0.55, fontSize: '1.125rem', fontWeight: 600 }
	const opacity = Math.max(0.15, 0.45 * Math.pow(0.6, dist - 2))
	return { opacity, fontSize: '1rem', fontWeight: 400 }
}

const getTranslationStyle = (index: number): Record<string, string | number> => {
	const dist = Math.abs(index - currentLyricIndex.value)
	if (dist === 0) return { opacity: 0.65, fontSize: '0.95rem' }
	if (dist === 1) return { opacity: 0.35, fontSize: '0.85rem' }
	const opacity = Math.max(0.12, 0.3 * Math.pow(0.6, dist - 2))
	return { opacity, fontSize: '0.75rem' }
}

const value = ref(0)
const lyricsContainer = ref<HTMLElement | null>(null)
const lyricRefs = ref<HTMLElement[]>([])
const audio = ref<HTMLAudioElement | null>(null)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null
let animationFrame: number | null = null

// 添加主色调状态
const dominantColor = ref<number[]>([0, 0, 0])
const secondaryColor = ref<number[]>([0, 0, 0])
// 漂移色块用的鲜艳原色
const blobPalette = ref<number[][]>([[200, 60, 60], [60, 120, 200], [160, 80, 180], [80, 180, 100], [180, 60, 120], [60, 160, 180]])

// Apple Music 液态背景：6 个色块
const blobs = computed(() => {
	const bright = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`
	const p = blobPalette.value
	return [
		{ size: 70, x: 5, y: -15,  color: bright(p[0]), dur: 18 },
		{ size: 60, x: 50, y: 10,   color: bright(p[1]), dur: 22 },
		{ size: 65, x: -10, y: 35,  color: bright(p[2]), dur: 20 },
		{ size: 55, x: 35, y: -20,  color: bright(p[3]), dur: 25 },
		{ size: 75, x: 60, y: 40,   color: bright(p[4]), dur: 19 },
		{ size: 50, x: 20, y: 25,   color: bright(p[5]), dur: 24 },
	]
})

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
	}, 800)
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
		dominantColor.value = color.map(c => Math.max(0, Math.floor(c * 0.85)))

		const palette = colorThief.getPalette(img, 3)
		secondaryColor.value = palette[1].map(c => Math.min(255, Math.floor(c * 1.5)))

		// 色块用原始鲜艳色，只微调亮度
		blobPalette.value = [
			color.map(c => Math.min(255, Math.floor(c * 1.1))),
			palette[1].map(c => Math.min(255, c)),
			palette[2] ? palette[2].map(c => Math.min(255, Math.floor(c * 0.95))) : color.map(c => Math.floor(c * 0.8)),
			[palette[0][1], Math.min(255, palette[0][2] * 1.2), palette[0][0]].map(c => Math.min(255, c)),
			[Math.min(255, palette[1][0] * 0.8), palette[1][2], Math.min(255, palette[1][1] * 1.3)].map(c => Math.min(255, c)),
			[palette[2] ? Math.min(255, palette[2][1] * 1.4) : 100, palette[2] ? palette[2][0] : 80, palette[2] ? Math.min(255, palette[2][2] * 1.1) : 160].map(c => Math.min(255, c)),
		]
	} catch (error) {
		console.error('获取图片颜色失败:', error)
		// 设置默认颜色
		dominantColor.value = [18, 18, 18]
		secondaryColor.value = [255, 23, 68]
		blobPalette.value = [[200, 60, 60], [60, 120, 200], [160, 80, 180], [80, 180, 100], [180, 60, 120], [60, 160, 180]]
	}
}

// 监听封面变化
watch(
	() => playerStore.currentTrack.cover_url,
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

// 弹簧缓动滚动 — 模拟 Apple Music 歌词滑动的惯性减速感
const springScrollTo = (targetTop: number) => {
	if (!lyricsContainer.value) return
	if (animationFrame) {
		cancelAnimationFrame(animationFrame)
		animationFrame = null
	}
	const startTop = lyricsContainer.value.scrollTop
	const delta = targetTop - startTop
	if (Math.abs(delta) < 1) {
		lyricsContainer.value.scrollTop = targetTop
		return
	}
	const duration = 520
	const startTime = performance.now()
	const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
	const animate = (now: number) => {
		const elapsed = now - startTime
		const progress = Math.min(elapsed / duration, 1)
		const easedProgress = easeOutExpo(progress)
		if (lyricsContainer.value) {
			lyricsContainer.value.scrollTop = startTop + delta * easedProgress
		}
		if (progress < 1) {
			animationFrame = requestAnimationFrame(animate)
		} else {
			animationFrame = null
		}
	}
	animationFrame = requestAnimationFrame(animate)
}

// 滚动到当前歌词
const scrollToCurrentLyric = (time: number, immediate = false) => {
	const currentIndex = parsedLyrics.value.findIndex(
		(item: LyricItem, index: number) => time >= item.time && time < (parsedLyrics.value[index + 1]?.time || Infinity)
	)

	if (currentIndex === -1) return

	if (lyricRefs.value[currentIndex] && lyricsContainer.value) {
		const lyricEl = lyricRefs.value[currentIndex]
		const containerHeight = lyricsContainer.value.clientHeight
		const scrollTop = lyricEl.offsetTop - containerHeight * 0.38 + lyricEl.clientHeight / 2

		if (immediate) {
			lyricsContainer.value.scrollTop = scrollTop
		} else {
			springScrollTo(scrollTop)
		}
	}
}

// 进度条拖动结束
const dragEnd = () => {
	if (!playerStore.currentTrack.duration) return

	// 确保值在 0-100 之间
	const clampedValue = Math.max(0, Math.min(100, value.value))

	// 将毫秒转换为秒
	const durationInSeconds = playerStore.currentTrack.duration / 1000
	const newTime = (clampedValue / 100) * durationInSeconds

	// 确保时间不超过总时长
	const clampedTime = Math.min(newTime, durationInSeconds)

	playerStore.setCurrentTime(clampedTime)
	if (audio.value) {
		audio.value.currentTime = clampedTime
	}
}

// 监听播放进度变化来更新进度条
watch(
	() => playerStore.currentProgress,
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
		if (!playerStore.currentTrack.duration) return
		if (!isAutoScrollPaused.value) {
			debouncedScroll(newTime)
		}
	},
	{ immediate: true }
)

// 歌词加载完成后立即滚动到当前时间
watch(
	() => parsedLyrics.value.length,
	newLen => {
		if (newLen > 0) {
			scrollToCurrentLyric(currentTime.value, true)
		}
	},
	{ flush: 'post' }
)

const togglePlay = () => {
	playerStore.setIsPlaying(!playerStore.isPlaying)
}

const prev = () => {
	if (playerStore.currentTrack.url === '') return

	// 如果当前播放时间超过3秒，重新播放当前歌曲
	if (audio.value && audio.value.currentTime > 3) {
		playerStore.setCurrentTime(0)
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

// 添加循环模式切换方法
const repeatMode = () => {
	if (playerStore.playMode == PlayMode.Sequence) {
		playerStore.setPlayMode(PlayMode.Repeat)
		return
	}
	playerStore.setPlayMode(PlayMode.Sequence)
}

// 添加随机播放方法
const shuffle = () => {
	if (playerStore.playMode == PlayMode.Shuffle) {
		playerStore.setPlayMode(PlayMode.Sequence)
		return
	}
	playerStore.setPlayMode(PlayMode.Shuffle)
}

// 跳转到指定时间
const seekToTime = (time: number) => {
	if (!playerStore.currentTrack.duration) return

	playerStore.setCurrentTime(time)
	if (audio.value) {
		audio.value.currentTime = time
	}
}

// 检查登录状态
const isLoggedIn = computed(() => {
	return !!localStorage.getItem('token')
})

// 检查当前歌曲是否已收藏
const isLiked = computed(() => {
	return playerStore.currentTrack.isLike
})

// 处理喜欢/取消喜欢
const toggleLike = async () => {
	if (!isLoggedIn.value) return
	if (!playerStore.currentTrack.name) {
		toast.info('当前没有播放歌曲')
		return
	}
	const track = {
		id: playerStore.currentTrack.id,
		name: playerStore.currentTrack.name,
		artist: playerStore.currentTrack.artist,
		album: playerStore.currentTrack.album,
		cover_url: playerStore.currentTrack.cover_url,
		url: playerStore.currentTrack.url,
		duration: playerStore.currentTrack.duration,
		playlist_id: playerStore.currentTrack.playlist_id,
		original_album: playerStore.currentTrack.original_album,
		original_album_id: playerStore.currentTrack.original_album_id,
		mv: playerStore.currentTrack.mv,
		nId: playerStore.currentTrack.nId,
		ar: playerStore.currentTrack.ar,
		type: playerStore.currentTrack.type,
		isLike: !playerStore.currentTrack.isLike,
	}
	const [res] = await handlePromise(likeTrack(track))
	if (res) {
		playerStore.updateLikeStatus(true)
		toast.success('已添加到收藏')
	} else {
		playerStore.updateLikeStatus(false)
		toast.success('已取消收藏')
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
	background: rgba(255, 255, 255, 0.25);
	border-radius: 2px;
}

/* 渐变遮罩 — 歌词列表顶部/底部淡出 */
.lyrics-scroll-area {
	-webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
	mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
}

/* 歌词行 */
.lyrics-container {
	font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}
.lyrics-text {
	color: white;
}
.lyrics-text p {
	transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
				font-weight 0.5s cubic-bezier(0.22, 1, 0.36, 1),
				font-size 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	will-change: opacity, font-weight, font-size;
}
.lyrics-text:hover {
	background: rgba(255, 255, 255, 0.06);
	border-radius: 6px;
}

/* 歌词行点击反馈 — 白色闪光 */
.lyric-item-clicked {
	position: relative;
}
.lyric-item-clicked::after {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: 6px;
	background: rgba(255, 255, 255, 0.15);
	animation: lyric-flash 0.4s ease-out forwards;
}
@keyframes lyric-flash {
	0% { opacity: 1; }
	100% { opacity: 0; }
}

/* Apple Music 液态背景色块 */
.lyric-blob {
	position: absolute;
	border-radius: 43% 57% 50% 50% / 50% 45% 55% 50%;
	filter: blur(70px) saturate(1.6) brightness(1.1);
	opacity: 0.85;
	animation-timing-function: ease-in-out;
	animation-iteration-count: infinite;
	animation-direction: alternate;
	transition: background 1.5s ease;
	will-change: transform, border-radius;
	mix-blend-mode: screen;
}
.blob-path-0 { animation-name: blob-a; }
.blob-path-1 { animation-name: blob-b; }
.blob-path-2 { animation-name: blob-c; }
.blob-path-3 { animation-name: blob-d; }
.blob-path-4 { animation-name: blob-e; }
.blob-path-5 { animation-name: blob-f; }

@keyframes blob-a {
	0%   { transform: translate(0, 0) scale(1);    border-radius: 43% 57% 50% 50% / 50% 45% 55% 50%; }
	25%  { transform: translate(10vw, -8vh) scale(1.12); border-radius: 55% 45% 48% 52% / 43% 57% 43% 57%; }
	50%  { transform: translate(-3vw, 14vh) scale(0.92); border-radius: 48% 52% 57% 43% / 55% 45% 50% 50%; }
	75%  { transform: translate(8vw, 6vh) scale(1.08);  border-radius: 52% 48% 45% 55% / 48% 52% 55% 45%; }
	100% { transform: translate(-6vw, -4vh) scale(1.04); border-radius: 45% 55% 52% 48% / 52% 48% 48% 52%; }
}
@keyframes blob-b {
	0%   { transform: translate(0, 0) scale(1);    border-radius: 55% 45% 48% 52% / 52% 48% 50% 50%; }
	25%  { transform: translate(-9vw, 10vh) scale(1.1);  border-radius: 48% 52% 55% 45% / 45% 55% 48% 52%; }
	50%  { transform: translate(7vw, -6vh) scale(0.94);   border-radius: 52% 48% 43% 57% / 55% 45% 52% 48%; }
	75%  { transform: translate(-4vw, -12vh) scale(1.06); border-radius: 43% 57% 52% 48% / 48% 52% 55% 45%; }
	100% { transform: translate(5vw, 8vh) scale(1.02);   border-radius: 50% 50% 45% 55% / 52% 48% 50% 50%; }
}
@keyframes blob-c {
	0%   { transform: translate(0, 0) scale(1);    border-radius: 50% 50% 55% 45% / 45% 55% 48% 52%; }
	25%  { transform: translate(6vw, 12vh) scale(1.15);  border-radius: 45% 55% 50% 50% / 52% 48% 55% 45%; }
	50%  { transform: translate(-10vw, -4vh) scale(0.96); border-radius: 55% 45% 43% 57% / 48% 52% 50% 50%; }
	75%  { transform: translate(3vw, -8vh) scale(1.05);   border-radius: 43% 57% 52% 48% / 55% 45% 43% 57%; }
	100% { transform: translate(-7vw, 10vh) scale(0.98);  border-radius: 52% 48% 55% 45% / 50% 50% 52% 48%; }
}
@keyframes blob-d {
	0%   { transform: translate(0, 0) scale(1);    border-radius: 48% 52% 43% 57% / 55% 45% 52% 48%; }
	25%  { transform: translate(-7vw, -10vh) scale(1.08); border-radius: 52% 48% 57% 43% / 43% 57% 48% 52%; }
	50%  { transform: translate(12vw, 5vh) scale(0.93);   border-radius: 43% 57% 48% 52% / 50% 50% 55% 45%; }
	75%  { transform: translate(-3vw, 9vh) scale(1.13);   border-radius: 57% 43% 55% 45% / 48% 52% 43% 57%; }
	100% { transform: translate(5vw, -7vh) scale(1.01);   border-radius: 50% 50% 50% 50% / 52% 48% 48% 52%; }
}
@keyframes blob-e {
	0%   { transform: translate(0, 0) scale(1);    border-radius: 52% 48% 50% 50% / 43% 57% 52% 48%; }
	25%  { transform: translate(8vw, 6vh) scale(1.06);   border-radius: 45% 55% 43% 57% / 55% 45% 48% 52%; }
	50%  { transform: translate(-11vw, -9vh) scale(1.14); border-radius: 48% 52% 57% 43% / 52% 48% 55% 45%; }
	75%  { transform: translate(4vw, -11vh) scale(0.95);  border-radius: 55% 45% 48% 52% / 43% 57% 50% 50%; }
	100% { transform: translate(-5vw, 4vh) scale(1.08);   border-radius: 43% 57% 52% 48% / 48% 52% 43% 57%; }
}
@keyframes blob-f {
	0%   { transform: translate(0, 0) scale(1);    border-radius: 45% 55% 52% 48% / 50% 50% 45% 55%; }
	25%  { transform: translate(-6vw, 11vh) scale(1.11); border-radius: 50% 50% 45% 55% / 55% 45% 52% 48%; }
	50%  { transform: translate(9vw, -7vh) scale(0.97);  border-radius: 55% 45% 50% 50% / 43% 57% 48% 52%; }
	75%  { transform: translate(-8vw, -3vh) scale(1.09); border-radius: 43% 57% 55% 45% / 50% 50% 55% 45%; }
	100% { transform: translate(3vw, 6vh) scale(1.03);   border-radius: 52% 48% 48% 52% / 55% 45% 50% 50%; }
}
</style>
