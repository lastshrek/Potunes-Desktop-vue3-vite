/*
 * @Author       : lastshrek
 * @Date         : 2023-09-06 12:56:04
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-04 13:33:35
 * @FilePath     : /src/store/modules/currentIndex.ts
 * @Description  : currentIndex store module
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-06 12:56:04
 */
import { defineStore } from 'pinia'
import { useGlobalQueueStore } from './globalQueue'
import { useCurrentTrackStore } from './currenttrack'
export const useCurrentIndexStore = defineStore({
	id: 'currentIndex',
	state: () => ({
		currentIndex: -1,
	}),
	getters: {
		getCurrentIndex(): number {
			return this.currentIndex
		},
	},
	actions: {
		setCurrentIndex(index: number) {
			if (index < 0) {
				index = useGlobalQueueStore().globalQueue.length - 1
			} else if (index > useGlobalQueueStore().globalQueue.length - 1) {
				index = 0
			}
			this.currentIndex = index
			console.log('currentIndex: ' + this.currentIndex)
			if (useGlobalQueueStore().globalQueue.length > 0) {
				useCurrentTrackStore().setCurrentTrack(useGlobalQueueStore().globalQueue[index])
			}
		},
	},
})
