/*
 * @Author       : lastshrek
 * @Date         : 2023-09-12 11:24:29
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-12 12:41:47
 * @FilePath     : /src/store/modules/playMode.ts
 * @Description  : playmode store module
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-12 11:24:29
 */
import { defineStore } from 'pinia'
export enum PlayMode {
	Sequence = 0,
	Shuffle = 1,
	Repeat = 2,
}
export const usePlayModeStore = defineStore({
	id: 'playMode',
	state: () => ({
		playMode: PlayMode.Sequence,
	}),
	getters: {
		getPlayMode(): PlayMode {
			return this.playMode
		},
	},
	actions: {
		setPlayMode(mode: number) {
			this.playMode = mode
		},
	},
})
