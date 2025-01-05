/*
 * @Author       : lastshrek
 * @Date         : 2023-09-11 19:07:04
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-04 14:42:35
 * @FilePath     : /src/store/modules/currentTime.ts
 * @Description  : current time module
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-11 19:07:04
 */
import { defineStore } from 'pinia'

export const useCurrentTimeStore = defineStore({
	id: 'currentTime',
	state: () => ({
		currentTime: 0,
	}),
	getters: {
		getCurrentTime(): number {
			return this.currentTime
		},
	},
	actions: {
		setCurrentTime(currentTime: number) {
			this.currentTime = currentTime
		},
	},
})
