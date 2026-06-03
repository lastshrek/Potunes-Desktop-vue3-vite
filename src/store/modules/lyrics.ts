import { defineStore } from 'pinia'
import { getLyrics } from '@/api'
import { handlePromise } from '@/utils'
import { getCurrentLyricText as getLrcText } from '@/utils/lrc'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'
// @ts-ignore
const { electron } = window as Window & typeof globalThis & { electron: ElectronAPI }

interface LyricsState {
	lrc: string
	lrc_cn: string
	loading: boolean
	error: string | null
}

export const useLyricsStore = defineStore('lyrics', {
	state: (): LyricsState => ({
		lrc: '',
		lrc_cn: '',
		loading: false,
		error: null,
	}),

	actions: {
		async fetchLyrics(id: number, nId?: number) {
			if (id === -1) return
			this.loading = true
			this.error = null
			this.lrc = ''
			this.lrc_cn = ''
			try {
				const [res] = await handlePromise(getLyrics(id, nId))
				if (!res) return
				this.lrc = res.lrc
				this.lrc_cn = res.lrc_cn
				const currentTrack = useCurrentTrackStore()
				currentTrack.$patch({ isLike: res.isLike })
			} catch (err: any) {
				this.error = err.message
			} finally {
				this.loading = false
			}
		},

		clearLyrics() {
			this.lrc = ''
			this.lrc_cn = ''
			this.error = null
		},

		// 解析当前时间的歌词文本
		getCurrentLyricText(time: number) {
			return getLrcText(this.lrc, time)
		},

		// 更新托盘歌词
		updateTrayLyric(time: number) {
			const lyricText = this.getCurrentLyricText(time)
			if (lyricText) {
				console.log('发送歌词到托盘:', lyricText)
				electron.updateLyric(lyricText)
			}
		},
	},
})
