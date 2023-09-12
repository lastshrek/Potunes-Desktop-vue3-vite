/*
 * @Author       : lastshrek
 * @Date         : 2023-09-12 16:17:16
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-12 16:17:18
 * @FilePath     : /src/store/modules/currentProgress.ts
 * @Description  : current progress module store
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-12 16:17:16
 */
import { defineStore } from 'pinia'
export const useCurrentProgressStore = defineStore({
	id: 'currentProgress',
	state: () => ({
		currentProgress: 0,
	}),
	getters: {
		getCurrentProgress(): number {
			return this.currentProgress
		},
	},
	actions: {
		setCurrentProgress(currentProgress: number) {
			this.currentProgress = currentProgress
		},
	},
})
