<template>
	<div
		class="bg-black shadow-lg text-white fixed bottom-0 left-0 z-50 w-full h-20 flex justify-evenly items-center border-t border-gray-900"
		v-show="isShowMiniPlayer"
	>
		<!-- cover & meta -->
		<div class="flex items-center overflow-hidden w-full h-full justify-start flex-1">
			<div class="ml-4 w-12 h-12 rounded overflow-hidden">
				<img :src="currentTrack.cover_url" />
			</div>
			<div class="ml-3 flex flex-col" @click="showLyrics">
				<div v-text="currentTrack.name" class="text-xs overflow-hidden whitespace-nowrap overflow-ellipsis"></div>
				<div
					v-text="currentTrack.artist"
					class="text-xs text-gray-400 overflow-hidden whitespace-nowrap overflow-ellipsis"
				></div>
			</div>
		</div>
		<!-- control panel -->
		<div class="flex flex-col justify-center h-full w-full flex-1">
			<vue-slider
				:min="0"
				:interval="0.01"
				:drag-on-click="true"
				:duration="0"
				:dot-size="12"
				:height="3"
				:tooltip="'none'"
				:lazy="true"
				@drag-end="dragEnd"
				v-model="value"
				contain
				ref="progress"
				class="h-3 mx-8 mt-1 bar"
				:process-style="{
					backgroundColor: `rgb(${secondaryColor.join(',')})`,
				}"
				:rail-style="{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }"
				:dot-style="{
					backgroundColor: `rgb(${secondaryColor.join(',')})`,
				}"
			></vue-slider>

			<div class="flex justify-center items-center space-x-4">
				<!-- 喜欢按钮 -->
				<Button v-if="isLoggedIn" variant="link" size="icon" @click="toggleLike">
					<div class="relative group">
						<svg
							v-if="isLiked"
							:class="`w-6 h-6 bg-[rgb(${secondaryColor.join(',')})]`"
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
					</div>
				</Button>
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
				<Button variant="link" size="icon" ref="play" @click="play">
					<svg
						t="1691599025349"
						v-if="!isPlaying.isPlaying"
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
						v-if="playMode.playMode !== 2"
						t="1691599262562"
						class="icon"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="7775"
						width="24"
						height="24"
					>
						<path
							d="M768.863 325.733c-48.775 0-170.409 121.182-259.229 207.077-134.661 130.244-261.862 256.802-363.67 256.802h-62.62C57.75 789.612 37 768.828 37 743.223c0-25.604 20.749-46.387 46.342-46.387h62.622c64.335 0 194.592-129.518 299.256-230.745 127.382-123.198 237.392-233.135 323.643-233.135h59.769l-63.418-61.55c-18.113-18.088-18.142-45.665-0.062-63.788 18.08-18.128 47.422-18.164 65.535-0.07l142.708 142.495A46.306 46.306 0 0 1 987 282.83c0 12.308-4.893 24.06-13.604 32.759l-142.71 142.4c-9.043 9.032-20.89 13.328-32.735 13.328-11.875 0-23.749-4.977-32.799-14.05-18.08-18.121-18.05-48.358 0.062-66.445l63.417-65.09h-59.768z m61.824 238.627c-18.113-18.095-47.456-18.066-65.535 0.062-18.08 18.121-18.05 49.237 0.062 67.323l63.417 65.09h-59.768c-38.06 0-101.643-56.357-164.685-115.353-18.69-17.493-48.021-17.394-65.495 1.306-17.486 18.7-16.507 49.382 2.183 66.87 96.042 89.898 160.826 139.952 227.997 139.952h59.769l-63.418 61.549c-18.113 18.087-18.142 46.552-0.062 64.674 9.051 9.072 20.924 13.167 32.799 13.167 11.845 0 23.692-4.74 32.736-13.773l142.708-142.619c8.71-8.7 13.604-20.56 13.604-32.87a46.44 46.44 0 0 0-13.604-32.842L830.687 564.36zM83.342 325.733h62.622c48.84 0 121.646 62.22 179.612 114.893 8.88 8.065 20.026 12.923 31.147 12.923 12.604 0 25.172-4.677 34.315-14.75 17.208-18.954 15.8-49.839-3.146-67.055-90.646-82.365-166.477-138.787-241.928-138.787H83.342C57.749 232.957 37 253.743 37 279.346s20.75 46.387 46.342 46.387z"
							fill="#ffffff"
							p-id="7776"
						></path>
					</svg>
					<svg
						v-else
						class="w-6 h-6 text-pink-500"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 18"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11.484 6.166 13 4h6m0 0-3-3m3 3-3 3M1 14h5l1.577-2.253M1 4h5l7 10h6m0 0-3 3m3-3-3-3"
						/>
					</svg>
				</Button>
			</div>
		</div>
		<!-- volume -->
		<div class="flex items-center justify-end h-full w-full pr-4 space-x-4 flex-1">
			<!-- now playing list -->
			<div class="flex flex-col items-center justify-center">
				<Button variant="link" size="icon" @click="showNowPlayingList">
					<ListMusic class="w-6 h-6" />
				</Button>
			</div>
			<!-- volume control -->
			<div class="flex flex-col items-center justify-center">
				<Button @click="mute" variant="link" size="icon">
					<Volume2 v-if="volume > 0.5" class="w-6 h-6 text-gray-50" />
					<Volume1 v-else-if="volume <= 0.5 && volume !== 0" class="w-6 h-6 text-gray-50" />
					<VolumeOff v-else class="w-6 h-6 text-gray-50" />
				</Button>
			</div>
			<!-- volume slider -->
			<div class="mx-2 items-center w-32 justify-center">
				<vue-slider
					v-model="volume"
					ref="volumeSlider"
					:min="0"
					:max="1"
					:interval="0.01"
					:drag-on-click="true"
					:duration="0"
					tooltip="none"
					:index="2"
					@drag-end="volumeChanged"
					:dot-size="10"
					class="bar"
					:process-style="{
						backgroundColor: `rgb(${secondaryColor.join(',')})`,
					}"
					:rail-style="{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }"
					:dot-style="{
						backgroundColor: `rgb(${secondaryColor.join(',')})`,
					}"
				></vue-slider>
			</div>
			<div class="flex flex-col items-center justify-center">
				<Button variant="link" size="icon" @click="showLyrics">
					<svg
						t="1691597908372"
						class="w-4 h-4 transform rotate-180"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M512 768c-17.066667 0-32-6.4-44.8-19.2l-358.4-358.4c-25.6-25.6-25.6-64 0-89.6s64-25.6 89.6 0L512 614.4l313.6-313.6c25.6-25.6 64-25.6 89.6 0s25.6 64 0 89.6l-358.4 358.4C544 761.6 529.066667 768 512 768z"
							p-id="1962"
							fill="#ffffff"
						></path>
					</svg>
				</Button>
			</div>
		</div>
		<audio :src="currentTrack.url" ref="audio" @timeupdate="timeupdate" @ended="end"></audio>
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="transform translate-y-full opacity-0"
			enter-to-class="transform translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="transform translate-y-0 opacity-100"
			leave-to-class="transform translate-y-full opacity-0"
		>
			<Lyrics v-if="showLyricsPanel" @close="showLyricsPanel = false" />
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, computed } from 'vue'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'
import { useIsShowMiniPlayerStore } from '@/store/modules/isShowMiniPlayer'
import { useGlobalQueueStore } from '@/store/modules/globalQueue'
import { useIsPlayingStore } from '@/store/modules/isPlaying'
import { PlayMode, usePlayModeStore } from '@/store/modules/playMode'
import { useCurrentIndexStore } from '@/store/modules/currentIndex'
import { useCurrentTimeStore } from '@/store/modules/currentTime'
import { getRandomIntInclusive, handlePromise } from '@/utils'
import { useCurrentProgressStore } from '@/store/modules/currentProgress'
import { Button } from '@/components/ui/button'
import { ListMusic, Volume1, Volume2, VolumeOff } from 'lucide-vue-next'
import VueSlider from 'vue-slider-component'
// eventBus
import 'vue-slider-component/theme/default.css'
import '@/assets/css/slider.css'
import Lyrics from '@/views/Lyrics.vue'
import { useLyricsStore } from '@/store/modules/lyrics'
import { emitter } from '@/utils/mitt'
import ColorThief from 'colorthief'
import { fm, likeTrack, updatePlayCount } from '@/api'
// @ts-ignore
const { electron } = window as Window & typeof globalThis & { electron: ElectronAPI }
import { useToast } from '@/composables/useToast'
import { useThrottleFn } from '@vueuse/core'

const currentTrack = useCurrentTrackStore()
// const favourites = useFavouritesStore()
const isShowMiniPlayer = useIsShowMiniPlayerStore()
const volume = ref(JSON.parse(localStorage.getItem('volumeBeforeMuted') || '1'))
const value = ref(0)
const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = useIsPlayingStore()
const playMode = usePlayModeStore()
const currentIndex = useCurrentIndexStore()
const globalQueue = useGlobalQueueStore()
const currentTime = useCurrentTimeStore()
const currentProgress = useCurrentProgressStore()
const lyricsStore = useLyricsStore()
let initial = true
// 歌词相关状态
const currentLyricIndex = ref(-1)
const currentLyricLines = ref<string[]>([])
let lyricUpdateHandler: number | null = null

// 添加控制歌词面板的状态
const showLyricsPanel = ref(false)

// 添加颜色状态
const dominantColor = ref<number[]>([0, 0, 0])
const secondaryColor = ref<number[]>([218, 85, 151]) // 默认粉色

const HISTORY_MAX_LENGTH = 30
const HISTORY_STORAGE_KEY = 'playHistory'

// 添加歌曲到播放历史
const addToHistory = (track: Track) => {
	if (track.id) track.type = 'potunes'
	if (!track.id) track.type = 'netease'
	try {
		// 获取现有历史记录
		const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY)
		let history: Track[] = historyJson ? JSON.parse(historyJson) : []

		// 创建一个干净的对象，只包含需要的属性
		const cleanTrack = {
			id: track.id,
			name: track.name,
			artist: track.artist,
			album: track.album,
			cover_url: track.cover_url,
			url: track.url,
			duration: track.duration,
			playlist_id: track.playlist_id,
			original_album: track.original_album,
			original_album_id: track.original_album_id,
			mv: track.mv,
			nId: track.nId,
			ar: track.ar,
			type: track.type,
			isLike: track.isLike,
		}

		// 移除已存在的相同歌曲
		history = history.filter(item => item.id !== cleanTrack.id || item.nId !== cleanTrack.nId)

		// 将新歌曲添加到开头
		history.unshift(cleanTrack)

		// 限制历史记录长度
		if (history.length > HISTORY_MAX_LENGTH) {
			history = history.slice(0, HISTORY_MAX_LENGTH)
		}

		// 保存更新后的历史记录
		localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
	} catch (error) {
		console.error('保存播放历史失败:', error)
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
		dominantColor.value = color.map(c => Math.max(0, Math.floor(c * 0.7)))

		const palette = colorThief.getPalette(img, 3)
		secondaryColor.value = palette[1].map(c => Math.min(255, Math.floor(c * 1.5)))
	} catch (error) {
		console.error('获取图片颜色失败:', error)
		dominantColor.value = [18, 18, 18]
		secondaryColor.value = [218, 85, 151]
	}
}

// 监听封面变化
watch(
	() => currentTrack.cover_url,
	async newUrl => {
		if (newUrl) {
			await getImageColor(newUrl)
		} else {
			dominantColor.value = [18, 18, 18]
			secondaryColor.value = [218, 85, 151]
		}
	},
	{ immediate: true }
)

// 修改 showLyrics 方法
const showLyrics = () => {
	if (currentTrack.url === '') return
	showLyricsPanel.value = true
}

// 更新音频时间处理函数
const updateLyric = () => {
	if (!audio.value || currentLyricLines.value.length === 0) return
	const currentTime = audio.value.currentTime

	// 找到当前时间对应的歌词
	for (let i = 0; i < currentLyricLines.value.length; i++) {
		const line = currentLyricLines.value[i]
		if (!line || line.trim() === '') continue

		const match = line.match(/\[(\d{2}):(\d{2})\.(\d{1,3})\](.*)/)
		if (!match) continue

		const minutes = parseInt(match[1])
		const seconds = parseInt(match[2])
		const milliseconds = parseInt(match[3])
		const time = minutes * 60 + seconds + milliseconds / 1000
		const text = match[4].trim()

		if (
			currentTime >= time &&
			(!currentLyricLines.value[i + 1] || currentTime < getLyricTime(currentLyricLines.value[i + 1]))
		) {
			if (i !== currentLyricIndex.value) {
				currentLyricIndex.value = i
				electron.updateLyric(text)
			}
			break
		}
	}
}

// 辅助函数：获取歌词时间戳
const getLyricTime = (line: string) => {
	const match = line.match(/\[(\d{2}):(\d{2})\.(\d{1,3})\]/)
	if (!match) return Infinity
	const minutes = parseInt(match[1])
	const seconds = parseInt(match[2])
	const milliseconds = parseInt(match[3])
	return minutes * 60 + seconds + milliseconds / 1000
}

// 设置歌词更新处理器
const setupLyricHandler = () => {
	if (lyricUpdateHandler) {
		clearInterval(lyricUpdateHandler)
		lyricUpdateHandler = null
	}

	// 使用 setInterval 替代 timeupdate 事件
	lyricUpdateHandler = window.setInterval(() => {
		if (audio.value && !audio.value.paused) {
			updateLyric()
		}
	}, 100) // 每 100ms 更新一次歌词
}

// 监听歌词变化
watch(
	() => lyricsStore.lrc,
	newLyric => {
		// 清除当前歌词
		electron.updateLyric('')
		currentLyricIndex.value = -1

		if (!newLyric) {
			currentLyricLines.value = []
			return
		}

		// 解析歌词，过滤掉空行
		currentLyricLines.value = newLyric.split('\n').filter(line => line.trim() !== '')

		// 设置新的事件监听器
		setupLyricHandler()

		// 立即执行一次更新，显示当前时间点的歌词
		updateLyric()
	}
)

// 监听当前歌曲变化 - 更新歌曲信息
watch(
	() => currentTrack.$state,
	newSong => {
		// 清除当前歌词
		electron.updateLyric('')
		currentLyricIndex.value = -1
		currentLyricLines.value = []

		if (newSong && newSong.name) {
			electron.updateSongInfo({
				title: newSong.name,
				artist: newSong.ar.map((a: { name: string }) => a.name).join('/'),
			})
			// 获取歌词
			lyricsStore.fetchLyrics(newSong.id, newSong.nId)
		} else {
			electron.updateSongInfo({ title: '', artist: '' })
			lyricsStore.clearLyrics()
		}
	},
	{ deep: true }
)

// 监听当前歌曲变化 - 处理播放
watch(
	() => ({
		url: currentTrack.url,
		id: currentTrack.id,
		nId: currentTrack.nId,
		name: currentTrack.name,
		artist: currentTrack.artist,
		cover_url: currentTrack.cover_url,
		duration: currentTrack.duration,
	}),
	async newValue => {
		if (!audio.value || !currentTrack.url) return

		// 添加到播放历史
		if (currentTrack.id || currentTrack.nId) {
			addToHistory(currentTrack)
		}

		const player = audio.value

		// 先暂停当前播放
		try {
			await player.pause()
		} catch (err) {
			console.log('暂停失败:', err)
		}

		// 设置新的音频源
		player.src = currentTrack.url

		// 设置音量
		if (volume.value === 0) {
			player.volume = 0
		} else {
			player.volume = volume.value
		}

		// 等待音频加载完成
		await new Promise((resolve, reject) => {
			const handleCanPlay = () => {
				player.removeEventListener('canplay', handleCanPlay)
				player.removeEventListener('error', handleError)
				resolve(true)
			}
			const handleError = (error: Event) => {
				player.removeEventListener('canplay', handleCanPlay)
				player.removeEventListener('error', handleError)
				reject(error)
			}
			player.addEventListener('canplay', handleCanPlay)
			player.addEventListener('error', handleError)
		})

		// 如果初始化，则不播放
		if (initial) {
			initial = false
			return
		}

		try {
			// 尝试播放
			await player.play()
			isPlaying.setIsPlaying(true)
		} catch (err) {
			console.error('播放出错:', err)
			isPlaying.setIsPlaying(false)
		}
	},
	{ deep: true }
)

// 进度条拖动结束
const dragEnd = () => {
	if (value.value == 0) return
	const newTime = (value.value / 100) * audio.value!.duration
	audio.value!.currentTime = newTime
	currentTime.setCurrentTime(newTime)
}
// 设置循环格式
const repeatMode = () => {
	if (playMode.playMode == PlayMode.Sequence) {
		playMode.setPlayMode(PlayMode.Repeat)
		return
	}
	playMode.setPlayMode(PlayMode.Sequence)
}
// 上一首
const prev = () => {
	if (currentTrack.url === '') return

	// 如果当前播放时间超过3秒，重新播放当前歌曲
	if (audio.value && audio.value.currentTime > 3) {
		audio.value.currentTime = 0
		// 重置更新状态，允许再次更新播放次数
		hasUpdated.value = false
		return
	}

	// 否则播放上一首
	currentIndex.setCurrentIndex(currentIndex.currentIndex - 1)
}
// 播放/暂停
const play = async () => {
	if (currentTrack.url === '') return

	try {
		if (isPlaying.isPlaying) {
			await audio.value?.pause()
		} else {
			await audio.value?.play()
		}
		isPlaying.setIsPlaying(!isPlaying.isPlaying)
	} catch (err) {
		console.error('播放切换失败:', err)
	}
}
// 下一首
const next = () => {
	setIndex()
}
// 随机播放
const shuffle = () => {
	if (playMode.playMode == PlayMode.Shuffle) {
		usePlayModeStore().setPlayMode(PlayMode.Sequence)
		return
	}
	usePlayModeStore().setPlayMode(PlayMode.Shuffle)
}
// 静音
const mute = () => {
	const audioVolume = audio.value!.volume
	if (audioVolume > 0) {
		audio.value!.volume = 0
		volume.value = 0
		return
	}
	const restoreVolume = JSON.parse(localStorage.getItem('volumeBeforeMuted') || '')
	volume.value = restoreVolume
	audio.value!.volume = restoreVolume
}
// 音量改变
const volumeChanged = () => {
	const newVolume = volume.value
	audio.value!.volume = newVolume
	if (newVolume == 0) return
	localStorage.setItem('volumeBeforeMuted', JSON.stringify(newVolume))
}
// 播放结束
const end = () => {
	// 如果是单曲循环，重置更新状态
	if (playMode.playMode === PlayMode.Repeat) {
		hasUpdated.value = false
	}
	setIndex()
}
// 播放时间改变
const timeupdate = () => {
	if (!audio.value) return
	const curTime = audio.value.currentTime
	const duration = audio.value.duration
	const newValue = (curTime / duration) * 100
	if (isNaN(newValue)) return
	value.value = newValue
	currentTime.setCurrentTime(curTime)
	currentProgress.setCurrentProgress(newValue)

	// 更新播放时长
	playDuration.value = curTime

	// 当播放时长超过30秒时更新歌曲信息
	if (curTime >= 30 && !hasUpdated.value) {
		updateTrackInfo()
	}
}
// 显示播放列表
const showNowPlayingList = () => {
	emitter.emit('showNowPlayingList')
}
// 设置下一首播放歌曲的索引
const setIndex = async () => {
	if (currentTrack.type === 'fm') {
		const [res] = await handlePromise(fm())
		if (!res) return
		globalQueue.setGlobalQueue([res], 0)
	}
	if (playMode.playMode == PlayMode.Sequence) {
		// 顺序循环
		currentIndex.setCurrentIndex(currentIndex.currentIndex + 1)
	} else if (playMode.playMode == PlayMode.Shuffle) {
		// 随机播放
		const index = getRandomIntInclusive(0, globalQueue.globalQueue.length - 1)
		currentIndex.setCurrentIndex(index)
	} else {
		audio.value!.currentTime = 0
		audio.value!.play()
		// 单曲循环时重置更新状态
		hasUpdated.value = false
	}
	console.log(currentIndex.currentIndex)
	// TODO 更新歌曲播放次数
}

// 监听播放状态变化
watch(
	() => isPlaying.isPlaying,
	async newValue => {
		// 更新菜单栏播放状态
		electron.updatePlayState(newValue)

		if (!audio.value || currentTrack.url === '') return

		try {
			if (newValue) {
				await audio.value.play()
			} else {
				await audio.value.pause()
			}
		} catch (err) {
			console.error('播放状态切换失败:', err)
			isPlaying.setIsPlaying(!newValue)
		}
	},
	{ deep: true }
)

// 从 localStorage 恢复播放状态
const restorePlayState = () => {
	try {
		const savedQueue = localStorage.getItem('playQueue')
		const savedIndex = localStorage.getItem('playIndex')
		const isFirstLaunch = localStorage.getItem('isFirstLaunch')

		// 如果是首次启动，设置标记并返回
		if (!isFirstLaunch) {
			localStorage.setItem('isFirstLaunch', 'false')
			return
		}

		if (savedQueue && savedIndex) {
			const queue = JSON.parse(savedQueue)
			const index = parseInt(savedIndex)

			if (queue.length > 0 && index >= 0 && index < queue.length) {
				initial = true // 确保不会自动播放
				globalQueue.setGlobalQueue(queue, index)
			}
		}
	} catch (error) {
		console.error('恢复播放状态失败:', error)
	}
}

// 保存播放状态到 localStorage
const savePlayState = () => {
	try {
		localStorage.setItem('playQueue', JSON.stringify(globalQueue.queue))
		localStorage.setItem('playIndex', currentIndex.currentIndex.toString())
	} catch (error) {
		console.error('保存播放状态失败:', error)
	}
}

// 监听播放队列和索引变化
watch(
	[() => globalQueue.queue, () => currentIndex.currentIndex],
	() => {
		savePlayState()
	},
	{ deep: true }
)

// 处理 tray 控制命令
const handleTrayControl = (event: Electron.IpcRendererEvent, command: string) => {
	switch (command) {
		case 'toggle-play':
			if (isPlaying.isPlaying) {
				isPlaying.setIsPlaying(false)
			} else {
				isPlaying.setIsPlaying(true)
			}
			break
		case 'prev-track':
			if (currentIndex.currentIndex > 0) {
				currentIndex.setCurrentIndex(currentIndex.currentIndex - 1)
			}
			break
		case 'next-track':
			if (currentIndex.currentIndex < globalQueue.queue.length - 1) {
				currentIndex.setCurrentIndex(currentIndex.currentIndex + 1)
			}
			break
	}
}

// 检查当前歌曲是否已收藏
const isLiked = computed(() => {
	return currentTrack.isLike
})

// 检查登录状态
const isLoggedIn = ref(false)

// 初始化登录状态
const initLoginStatus = () => {
	const token = localStorage.getItem('token')
	const user = localStorage.getItem('user')
	try {
		isLoggedIn.value = !!(token && user && JSON.parse(user))
	} catch (error) {
		console.error('Error parsing user info:', error)
		isLoggedIn.value = false
	}
}

const toast = useToast()

// 显示歌曲信息
const toggleLike = async () => {
	if (!isLoggedIn.value) return
	if (!currentTrack.name) {
		toast.info('当前没有播放歌曲')
		return
	}
	const track = {
		id: currentTrack.id,
		name: currentTrack.name,
		artist: currentTrack.artist,
		album: currentTrack.album,
		cover_url: currentTrack.cover_url,
		url: currentTrack.url,
		duration: currentTrack.duration,
		playlist_id: currentTrack.playlist_id,
		original_album: currentTrack.original_album,
		original_album_id: currentTrack.original_album_id,
		mv: currentTrack.mv,
		nId: currentTrack.nId,
		ar: currentTrack.ar,
		type: currentTrack.type,
		isLike: !currentTrack.isLike,
	}
	const [res] = await handlePromise(likeTrack(track))
	if (res) {
		currentTrack.updateLikeStatus(true)
		toast.success('已添加到收藏')
	} else {
		currentTrack.updateLikeStatus(false)
		toast.success('已取消收藏')
	}
}

// 记录歌曲播放时间的状态
const playDuration = ref(0)
const hasUpdated = ref(false)

// 更新歌曲信息的函数
const updateTrackInfo = useThrottleFn(async () => {
	console.log('更新歌曲信息', !currentTrack.id, !currentTrack.nId)
	if (!currentTrack.id && !currentTrack.nId) return
	if (hasUpdated.value) return

	try {
		const track = {
			id: currentTrack.id,
			name: currentTrack.name,
			artist: currentTrack.artist,
			album: currentTrack.album,
			cover_url: currentTrack.cover_url,
			url: currentTrack.url,
			duration: currentTrack.duration,
			playlist_id: currentTrack.playlist_id,
			original_album: currentTrack.original_album,
			original_album_id: currentTrack.original_album_id,
			mv: currentTrack.mv,
			nId: currentTrack.nId,
			ar: currentTrack.ar,
			type: currentTrack.id ? 'potunes' : 'netease',
			isLike: currentTrack.isLike,
		}
		hasUpdated.value = true
		const [res] = await handlePromise(updatePlayCount(track))
		if (!res) return
		console.log('更新歌曲播放信息成功')
	} catch (error) {
		console.error('更新歌曲播放信息失败:', error)
	}
}, 1000)

// 当切换歌曲时重置状态
watch(
	() => currentTrack.id,
	() => {
		playDuration.value = 0
		hasUpdated.value = false
	}
)

onMounted(() => {
	// 监听进度跳转事件
	emitter.on('showLyrics', async value => {
		if (!audio.value) return
		try {
			audio.value.currentTime = value as number
		} catch (err) {
			console.error('设置播放进度失败:', err)
		}
	})

	// 监听下一首事件
	emitter.on('next', next)

	// 监听上一首事件
	emitter.on('prev', prev)

	// 如果当前应该播放，尝试恢复播放
	if (isPlaying.isPlaying && audio.value && currentTrack.url) {
		audio.value.play().catch(err => {
			console.error('恢复播放失败:', err)
			isPlaying.setIsPlaying(false)
		})
	}

	// 组件加载时恢复播放状态
	restorePlayState()

	// 注册 tray 控制监听
	window.electron?.onTrayControl(handleTrayControl)

	// 监听登出事件
	emitter.on('logout', () => {
		// 重置喜欢状态
		currentTrack.resetLikeStatus()
		isLoggedIn.value = false
	})

	// 监听登录成功事件
	emitter.on('login-success', () => {
		isLoggedIn.value = true
	})

	// 初始化登录状态
	initLoginStatus()
})

// 在组件卸载时清除歌词
onUnmounted(() => {
	if (lyricUpdateHandler) {
		clearInterval(lyricUpdateHandler)
		lyricUpdateHandler = null
	}
	electron.updateLyric('')
	electron.updateSongInfo({ title: '', artist: '' })

	// 移除事件监听
	// @ts-ignore
	if (window.electron?.ipcRenderer) window.electron?.ipcRenderer.removeListener('tray-control', handleTrayControl)

	emitter.off('logout')
})
</script>

<style lang="scss" scoped>
.bar {
	-webkit-app-region: no-drag;
	transition: all 0.3s ease;
}
</style>
