/*
 * @Author       : lastshrek
 * @Date         : 2023-09-06 12:46:29
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-06 13:09:04
 * @FilePath     : /src/store/modules/globalQueue.ts
 * @Description  : Global Queue
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-06 12:46:29
 */
import { defineStore } from 'pinia'

export const globalQueueStore = defineStore({
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
		},
	},
})
