/*
 * @Author       : lastshrek
 * @Date         : 2023-09-06 12:56:04
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-10 22:37:52
 * @FilePath     : /src/store/modules/currentIndex.ts
 * @Description  : currentIndex store module
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-06 12:56:04
 */
import { defineStore } from 'pinia'

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
			this.currentIndex = index
		},
	},
})
