/*
 * @Author       : lastshrek
 * @Date         : 2023-09-06 12:46:29
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-04 13:34:49
 * @FilePath     : /src/store/modules/globalQueue.ts
 * @Description  : Global Queue
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-06 12:46:29
 */
import { defineStore } from 'pinia'
import { useCurrentTrackStore } from './currenttrack'
import { useCurrentIndexStore } from './currentIndex'
export const useGlobalQueueStore = defineStore({
	id: 'globalQueue',
	state: () => ({
		globalQueue: [] as Track[],
	}),
	getters: {
		queue(): Track[] {
			return this.globalQueue
		},
	},
	actions: {
		setGlobalQueue(tracks: Track[], index: number) {
			this.globalQueue = tracks
			console.log(tracks[index], index)
			useCurrentTrackStore().setCurrentTrack(tracks[index])
			useCurrentIndexStore().setCurrentIndex(index)
		},
	},
})
