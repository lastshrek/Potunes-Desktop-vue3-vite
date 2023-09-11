/*
 * @Author       : lastshrek
 * @Date         : 2023-09-11 19:10:18
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-11 19:10:20
 * @FilePath     : /src/store/modules/isPlaying.ts
 * @Description  : isPlaying module
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-11 19:10:18
 */
import { defineStore } from 'pinia'

export const useIsPlayingStore = defineStore({
	id: 'isPlaying',
	state: () => ({
		isPlaying: false,
	}),
	getters: {
		getIsPlaying(): boolean {
			return this.isPlaying
		},
	},
	actions: {
		setIsPlaying(isPlaying: boolean) {
			this.isPlaying = isPlaying
		},
	},
})
