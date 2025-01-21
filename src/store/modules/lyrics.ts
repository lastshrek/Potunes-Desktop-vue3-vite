import { defineStore } from 'pinia'
import { getLyrics } from '@/api/index'
import { handlePromise } from '@/utils'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'

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
	},
})
