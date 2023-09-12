/*
 * @Author       : lastshrek
 * @Date         : 2023-09-06 12:46:29
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-12 13:11:07
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
		setGlobalQueue(tracks: Track[]) {
			this.globalQueue = tracks
			useCurrentTrackStore().setCurrentTrack(tracks[useCurrentIndexStore().currentIndex])
		},
	},
})
