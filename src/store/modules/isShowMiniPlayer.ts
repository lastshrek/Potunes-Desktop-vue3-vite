/*
 * @Author       : lastshrek
 * @Date         : 2023-09-03 11:44:26
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-03 12:04:40
 * @FilePath     : /src/store/modules/isShowMiniPlayer.ts
 * @Description  : is show mini player store module
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-03 11:44:26
 */
import { defineStore } from 'pinia'
export const useIsShowMiniPlayerStore = defineStore({
	id: 'isShowMiniPlayer',
	state: () => ({
		isShowMiniPlayer: true,
	}),
	getters: {
		getIsShowMiniPlayer(): boolean {
			return this.isShowMiniPlayer
		},
	},
	actions: {
		setIsShowMiniPlayer(isShowMiniPlayer: boolean) {
			this.isShowMiniPlayer = isShowMiniPlayer
		},
	},
})
