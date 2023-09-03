/*
 * @Author       : lastshrek
 * @Date         : 2023-09-03 11:43:08
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-03 11:46:49
 * @FilePath     : /src/store/modules/currenttrack.ts
 * @Description  : currentTrack
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-03 11:43:08
 */
import { defineStore } from 'pinia'
interface CurrentTrack {
	id: number
	name: string
	artist: string
	url: string
	cover_url: string
	album: string
	playlist_id: number
	original_album: string
	original_album_id: number
	duration: number
	mv: number
	nId: number
	ar: Ar[]
}

interface Ar {
	id: number
	name: string
	alias: any[]
	picId?: number
	trans: any
	img1v1?: number
	picUrl: any
	albumSize?: number
	fansGroup: any
	img1v1Url?: string
	tns?: any[]
}

export const useCurrentTrackStore = defineStore({
	id: 'currenttrack',
	state: (): CurrentTrack => ({
		id: 0,
		name: '',
		artist: '',
		url: '',
		cover_url: '',
		album: '',
		playlist_id: 0,
		original_album: '',
		original_album_id: 0,
		duration: 0,
		mv: 0,
		nId: 0,
		ar: [],
	}),
	getters: {
		getCurrentTrack(): CurrentTrack {
			return this
		},
	},
	actions: {
		setCurrentTrack(currentTrack: CurrentTrack) {
			this.id = currentTrack.id
			this.name = currentTrack.name
			this.artist = currentTrack.artist
			this.url = currentTrack.url
			this.cover_url = currentTrack.cover_url
			this.album = currentTrack.album
			this.playlist_id = currentTrack.playlist_id
			this.original_album = currentTrack.original_album
			this.original_album_id = currentTrack.original_album_id
			this.duration = currentTrack.duration
			this.mv = currentTrack.mv
			this.nId = currentTrack.nId
			this.ar = currentTrack.ar
		},
	},
})
