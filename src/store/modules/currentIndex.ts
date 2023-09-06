/*
 * @Author       : lastshrek
 * @Date         : 2023-09-06 12:56:04
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-06 13:12:52
 * @FilePath     : /src/store/modules/currentIndex.ts
 * @Description  : currentIndex store module
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-06 12:56:04
 */
import { defineStore } from 'pinia'

export const currentIndexStore = defineStore({
	id: 'currentIndex',
	state: () => ({
		index: -1,
	}),
	getters: {
		currentIndex(): Track[] {
			return this.currentIndex
		},
	},
	actions: {
		setCurrentIndex(index: number) {
			this.index = index
		},
	},
})
