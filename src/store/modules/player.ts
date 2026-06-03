import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Track } from '@/interfaces/track'

export enum PlayMode {
	Sequence = 0,
	Repeat = 1,
	Shuffle = 2,
}

export const usePlayerStore = defineStore('player', () => {
	// state
	const currentTrack = ref<Track>({
		id: -1,
		name: '',
		artist: '',
		url: '',
		cover_url: '',
		album: '',
		playlist_id: -1,
		original_album: '',
		original_album_id: -1,
		duration: 0,
		mv: 0,
		nId: -1,
		ar: [],
		type: 'potunes',
		isLike: false,
		playMode: 'sequence',
	})
	const globalQueue = ref<Track[]>([])
	const currentIndex = ref(-1)
	const currentTime = ref(0)
	const currentProgress = ref(0)
	const isPlaying = ref(false)
	const isShowMiniPlayer = ref(true)
	const playMode = ref<PlayMode>(PlayMode.Sequence)

	// getters
	const queue = computed(() => globalQueue.value)
	const getCurrentTrack = computed(() => currentTrack.value)
	const getCurrentIndex = computed(() => currentIndex.value)
	const getCurrentTime = computed(() => currentTime.value)
	const getCurrentProgress = computed(() => currentProgress.value)
	const getIsPlaying = computed(() => isPlaying.value)
	const getIsShowMiniPlayer = computed(() => isShowMiniPlayer.value)
	const getPlayMode = computed(() => playMode.value)

	// actions
	function setCurrentTrack(track: Track) {
		currentTrack.value = track
	}

	function setCurrentIndex(index: number) {
		if (index < 0) {
			index = globalQueue.value.length - 1
		} else if (index > globalQueue.value.length - 1) {
			index = 0
		}
		currentIndex.value = index
		if (globalQueue.value.length > 0) {
			setCurrentTrack(globalQueue.value[index])
		}
	}

	function setGlobalQueue(tracks: Track[], index: number) {
		globalQueue.value = tracks
		setCurrentTrack(tracks[index])
		setCurrentIndex(index)
	}

	function setCurrentTime(time: number) {
		currentTime.value = time
	}

	function setCurrentProgress(progress: number) {
		currentProgress.value = progress
	}

	function setIsPlaying(playing: boolean) {
		isPlaying.value = playing
	}

	function setIsShowMiniPlayer(show: boolean) {
		isShowMiniPlayer.value = show
	}

	function setPlayMode(mode: PlayMode) {
		playMode.value = mode
	}

	function updateLikeStatus(isLike: boolean) {
		currentTrack.value.isLike = isLike
	}

	function resetLikeStatus() {
		currentTrack.value.isLike = false
	}

	return {
		currentTrack,
		globalQueue,
		currentIndex,
		currentTime,
		currentProgress,
		isPlaying,
		isShowMiniPlayer,
		playMode,
		queue,
		getCurrentTrack,
		getCurrentIndex,
		getCurrentTime,
		getCurrentProgress,
		getIsPlaying,
		getIsShowMiniPlayer,
		getPlayMode,
		setCurrentTrack,
		setCurrentIndex,
		setGlobalQueue,
		setCurrentTime,
		setCurrentProgress,
		setIsPlaying,
		setIsShowMiniPlayer,
		setPlayMode,
		updateLikeStatus,
		resetLikeStatus,
	}
})
