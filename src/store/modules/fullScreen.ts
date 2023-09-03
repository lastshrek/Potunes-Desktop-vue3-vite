/*
 * @Author       : lastshrek
 * @Date         : 2023-09-03 11:50:02
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-03 11:50:04
 * @FilePath     : /src/store/modules/fullScreen.ts
 * @Description  : fullScreen store module
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-03 11:50:02
 */

import { defineStore } from 'pinia'

export const useFullScreenStore = defineStore({
	id: 'fullScreen',
	state: () => ({
		isFullScreen: false,
	}),
	getters: {
		getIsFullScreen(): boolean {
			return this.isFullScreen
		},
	},
	actions: {
		setIsFullScreen(isFullScreen: boolean) {
			this.isFullScreen = isFullScreen
		},
	},
})
