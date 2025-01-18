/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 18:30:22
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-18 21:01:00
 * @FilePath     : /src/utils/index.ts
 * @Description  : utils
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 18:30:22
 */
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

// 相对优雅的处理promise
export const handlePromise = <T>(promise: Promise<T>) => {
	return promise.then((data: T) => [data, undefined]).catch((error: any) => [undefined, error])
}

// 判断用户是否登录
export const isUserLogin = () => {
	return localStorage.getItem('account') !== null
}

// 返回当前的日期
export const getCurrentDate = () => {
	const date = new Date()
	const day = date.getDate()
	return `${day}`
}
// 格式化时间
export const formatTime = (time: number) => {
	if (!time) return ''
	const min = Math.floor(time / 1000 / 60)
	let sec = Math.floor((time / 1000) % 60) + ''
	sec = parseInt(sec) < 10 ? `0${sec}` : sec
	return `${min}:${sec}`
}
// 格式化当前时间 秒转分钟
export const formatCurrentTime = (time: number) => {
	const min = Math.floor(time / 60)
	let sec = Math.floor(time % 60) + ''
	sec = parseInt(sec) < 10 ? `0${sec}` : sec
	return `${min}:${sec}`
}
// 展示错误
export const showError = (message: string) => {
	useToast().open({
		message,
		type: 'error',
		duration: 3000,
		dismissible: true,
		position: 'top-right',
	})
}
// 随机数
export const getRandomIntInclusive = (min: number, max: number) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}

// 格式化专辑更新时间
export const formatPlaylistUpdateTime = (time: string) => {
	const date = new Date(time)
	// 使用英文locale
	const month = date.toLocaleString('en-US', { month: 'long' })
	return `${date.getDate()} ${month}. ${date.getFullYear()}`
}

// 格式化专辑时长
export const formatPlaylistDurationToHourStr = (millisecond: number) => {
	const hour = Math.floor(millisecond / 60 / 60 / 1000)
	const min = Math.floor((millisecond / 60 / 1000) % 60)
	if (hour > 0) return `${hour}h ${min}m`
	if (min > 0) return `${min}m`
	return ''
}

export function compareVersions(v1: string, v2: string): number {
	const v1Parts = v1.split('.').map(Number)
	const v2Parts = v2.split('.').map(Number)

	for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
		const v1Part = v1Parts[i] || 0
		const v2Part = v2Parts[i] || 0

		if (v1Part > v2Part) return 1
		if (v1Part < v2Part) return -1
	}

	return 0
}
