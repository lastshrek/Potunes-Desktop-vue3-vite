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
			></vue-slider>

			<div class="flex justify-center items-center space-x-4">
				<!-- 循环 -->
				<button
					@click="repeatMode"
					class="px-2 w-10 h-10 flex justify-center items-center rounded-full hover:bg-albumcardhover"
				>
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
				</button>
				<!-- 上一首 -->
				<button
					@click="prev"
					class="px-2 w-10 h-10 flex justify-center items-center rounded-full hover:bg-albumcardhover"
				>
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
				</button>
				<!-- 暂停/播放 -->
				<button
					ref="play"
					@click="play"
					class="px-2 w-10 h-10 flex justify-center items-center rounded-full hover:bg-albumcardhover"
				>
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
				</button>
				<!-- 下一首 -->
				<button
					@click="next"
					class="px-2 w-10 h-10 flex justify-center items-center rounded-full hover:bg-albumcardhover"
				>
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
				</button>
				<!-- 随机 -->
				<button
					@click="shuffle"
					class="px-2 w-10 h-10 flex justify-center items-center rounded-full hover:bg-albumcardhover"
				>
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
				</button>
			</div>
		</div>
		<!-- volume -->
		<div class="flex items-center justify-end h-full w-full pr-4 space-x-4 flex-1">
			<!-- now playing list -->
			<div class="flex flex-col items-center justify-center">
				<button
					icon
					@click="showNowPlayingList"
					class="px-2 w-10 h-10 flex justify-center items-center rounded-full hover:bg-albumcardhover"
				>
					<svg
						class="w-6 h-6 text-gray-50"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 18 16"
					>
						<path
							d="M14.316.051A1 1 0 0 0 13 1v8.473A4.49 4.49 0 0 0 11 9c-2.206 0-4 1.525-4 3.4s1.794 3.4 4 3.4 4-1.526 4-3.4a2.945 2.945 0 0 0-.067-.566c.041-.107.064-.22.067-.334V2.763A2.974 2.974 0 0 1 16 5a1 1 0 0 0 2 0C18 1.322 14.467.1 14.316.051ZM10 3H1a1 1 0 0 1 0-2h9a1 1 0 1 1 0 2Z"
						/>
						<path d="M10 7H1a1 1 0 0 1 0-2h9a1 1 0 1 1 0 2Zm-5 4H1a1 1 0 0 1 0-2h4a1 1 0 1 1 0 2Z" />
					</svg>
				</button>
			</div>
			<!-- volume control -->
			<div class="flex flex-col items-center justify-center">
				<button
					@click="mute"
					class="px-2 w-10 h-10 flex justify-center items-center rounded-full hover:bg-albumcardhover"
				>
					<svg
						v-if="volume > 0.5"
						class="w-6 h-6 text-gray-50"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 18"
					>
						<path
							d="M10.836.357a1.978 1.978 0 0 0-2.138.3L3.63 5H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1.63l5.07 4.344a1.985 1.985 0 0 0 2.142.299A1.98 1.98 0 0 0 12 15.826V2.174A1.98 1.98 0 0 0 10.836.357Zm2.728 4.695a1.001 1.001 0 0 0-.29 1.385 4.887 4.887 0 0 1 0 5.126 1 1 0 0 0 1.674 1.095A6.645 6.645 0 0 0 16 9a6.65 6.65 0 0 0-1.052-3.658 1 1 0 0 0-1.384-.29Zm4.441-2.904a1 1 0 0 0-1.664 1.11A10.429 10.429 0 0 1 18 9a10.465 10.465 0 0 1-1.614 5.675 1 1 0 1 0 1.674 1.095A12.325 12.325 0 0 0 20 9a12.457 12.457 0 0 0-1.995-6.852Z"
						/>
					</svg>
					<svg
						v-else-if="volume <= 0.5 && volume !== 0"
						class="w-6 h-6 text-gray-50"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 16 18"
					>
						<path
							d="M10.836.357a1.978 1.978 0 0 0-2.138.3L3.63 5H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1.63l5.07 4.344a1.985 1.985 0 0 0 2.142.299A1.98 1.98 0 0 0 12 15.826V2.174A1.98 1.98 0 0 0 10.836.357Zm4.112 4.985a1 1 0 1 0-1.674 1.095 4.887 4.887 0 0 1 0 5.126 1 1 0 1 0 1.674 1.095A6.645 6.645 0 0 0 16 9a6.65 6.65 0 0 0-1.052-3.658Z"
						/>
					</svg>
					<!-- 静音 -->
					<svg
						v-else
						class="w-6 h-6 text-gray-50"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 16 18"
					>
						<path
							d="M10.836.357a1.978 1.978 0 0 0-2.138.3L3.63 5H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1.63l5.07 4.344a1.985 1.985 0 0 0 2.142.299A1.98 1.98 0 0 0 12 15.826V2.174A1.98 1.98 0 0 0 10.836.357Zm4.112 4.985a1 1 0 1 0-1.674 1.095 4.887 4.887 0 0 1 0 5.126 1 1 0 1 0 1.674 1.095A6.645 6.645 0 0 0 16 9a6.65 6.65 0 0 0-1.052-3.658Z"
						/>
					</svg>
				</button>
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
				></vue-slider>
			</div>
			<div class="flex flex-col items-center justify-center">
				<button
					icon
					@click="showLyrics"
					class="px-2 w-10 h-10 flex justify-center items-center rounded-full hover:bg-albumcardhover"
				>
					<svg
						t="1691597908372"
						class="w-4 h-4"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="1961"
						width="24"
						height="24"
					>
						<path
							d="M84.48 648.896C71.456 661.472 64.096 678.752 64 696.832 65.696 737.632 100 769.408 140.8 767.968 161.92 768.064 182.176 759.712 197.12 744.8L512 432.096 826.88 744.8C841.824 759.712 862.08 768.064 883.2 767.968 924 769.408 958.304 737.632 960 696.832 959.904 678.752 952.544 661.472 939.52 648.896L568.32 279.04C537.056 248.32 486.944 248.32 455.68 279.04L84.48 648.896Z"
							p-id="1962"
							fill="#ffffff"
						></path>
					</svg>
				</button>
			</div>
		</div>
		<audio :src="currentTrack.url" ref="audio" @timeupdate="timeupdate" @ended="end"></audio>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useCurrentTrackStore } from '@/store/modules/currentTrack'
import { useIsShowMiniPlayerStore } from '@/store/modules/isShowMiniPlayer'
import { useFullScreenStore } from '@/store/modules/fullScreen'
import { useGlobalQueueStore } from '@/store/modules/globalQueue'
import { useIsPlayingStore } from '@/store/modules/isPlaying'
import { PlayMode, usePlayModeStore } from '@/store/modules/playMode'
import { useCurrentIndexStore } from '@/store/modules/currentIndex'
import { useCurrentTimeStore } from '@/store/modules/currentTime'
import { getRandomIntInclusive } from '@/utils'
import { useCurrentProgressStore } from '@/store/modules/currentProgress'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import '@/assets/css/slider.css'
const currentTrack = useCurrentTrackStore()
const isShowMiniPlayer = useIsShowMiniPlayerStore()
const volume = ref(JSON.parse(localStorage.getItem('volumeBeforeMuted') || '1'))
const isMac = ref(false)
const value = ref(0)
const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = useIsPlayingStore()
const playMode = usePlayModeStore()
const currentIndex = useCurrentIndexStore()
const globalQueue = useGlobalQueueStore()
const currentTime = useCurrentTimeStore()
const currentProgress = useCurrentProgressStore()
// 显示歌词界面
const showLyrics = () => {
	if (currentTrack.url === '') return
	useFullScreenStore().setIsFullScreen(true)
	isShowMiniPlayer.setIsShowMiniPlayer(false)
}
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
	currentIndex.setCurrentIndex(currentIndex.currentIndex - 1)
}
// 播放/暂停
const play = () => {
	if (currentTrack.url === '') return
	isPlaying.setIsPlaying(!isPlaying.isPlaying)
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
const volumeChanged = () => {}
// 播放结束
const end = () => {
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
}
// 显示播放列表
const showNowPlayingList = () => {}
// 设置下一首播放歌曲的索引
const setIndex = () => {
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
		// 单曲循环
	}
	console.log(currentIndex.currentIndex)
	// TODO 更新歌曲播放次数
}
onMounted(() => {
	const version = navigator.userAgent.toLowerCase()
	const mac = version.indexOf('mac')
	const os = version.indexOf('os')
	if (mac > 0 && os > 0) {
		isMac.value = true
	}
	// TODO 通知主进程播放
	// ipcRenderer.on('play', () => {
	//     this.setIsPlaying(!this.isPlaying)
	//   })
	//   ipcRenderer.on('previous', () => {
	//     this.prev()
	//   })
	//   ipcRenderer.on('next', () => {
	//     this.next()
	//   })
})
watch(
	() => currentTrack,
	newValue => {
		if (newValue) {
			const player = audio.value
			if (volume.value == 0) player!.volume = 0
			const playPromise = player!.play()
			if (playPromise !== undefined) {
				playPromise
					.then(() => {
						player!.play()
						isPlaying.setIsPlaying(true)
					})
					.catch(_err => {
						player!.play()
						isPlaying.setIsPlaying(true)
					})
			}
			player!.play()
		}
	},
	{ deep: true }
)
watch(
	() => isPlaying,
	(newValue, oldValue) => {
		if (currentTrack.name === '' && oldValue.isPlaying === false) return
		if (newValue.isPlaying) {
			audio.value!.play()
			if (isMac.value) {
				// TODO 通知主进程播放
				// ipcRenderer.send('isPause')
			}
		} else {
			audio.value!.pause()
			if (isMac.value) {
				// TODO 通知主进程暂停
				// ipcRenderer.send('isPlay')
			}
		}
	},
	{ deep: true }
)
</script>

<style lang="scss" scoped>
.bar {
	-webkit-app-region: no-drag;
}
</style>
