import { defineStore } from 'pinia'
import { getLyrics } from '@/api/index'
import { handlePromise } from '@/utils'

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
		async fetchLyrics(id: number, nId?: number, userId?: number) {
			console.log('开始获取歌词')
			if (id === -1) return
			this.loading = true
			this.error = null
			try {
				const [res] = await handlePromise(getLyrics(id, nId, userId))
				console.log(res)
				if (!res) return
				console.log('lrc', res)
				this.lrc = res.lrc
				this.lrc_cn = res.lrc_cn
			} catch (err: any) {
				console.log(err)
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
