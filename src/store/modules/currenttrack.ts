/*
 * @Author       : lastshrek
 * @Date         : 2023-09-03 11:43:08
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-11 19:07:32
 * @FilePath     : /src/store/modules/currenttrack.ts
 * @Description  : currentTrack
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-03 11:43:08
 */
import { defineStore } from 'pinia'
export const useCurrentTrackStore = defineStore({
	id: 'currenttrack',
	state: (): Track => ({
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
	}),
	getters: {
		getCurrentTrack(state): Track {
			// let obj: Track = {
			// 	id: 0,
			// 	name: '',
			// 	artist: '',
			// 	cover_url: '',
			// 	url: '',
			// 	album: '',
			// 	playlist_id: -1,
			// 	original_album: '',
			// 	original_album_id: -1,
			// 	duration: 0,
			// 	mv: 0,
			// 	nId: 0,
			// 	type: 'potunes',
			// 	ar: [],
			// }
			// const tracks = globalQueueStore().globalQueue

			// if (tracks.length != 0) {
			// 	const index = useCurrentIndexStore().currentIndex
			// 	obj = tracks[index]
			// }
			return state
		},
	},
	actions: {
		setCurrentTrack(currentTrack: Track) {
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
			this.type = currentTrack.type
		},
	},
})
