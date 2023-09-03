/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 18:30:22
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-03 00:23:39
 * @FilePath     : /src/utils/index.ts
 * @Description  : utils
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 18:30:22
 */
// 相对优雅的处理promise
export const handlePromise = <T>(promise: Promise<T>) => {
	return promise.then((data: T) => [data, undefined]).catch((error: any) => [undefined, error])
}

// 判断用户是否登录
export const isUserLogin = () => {
	return localStorage.getItem('account') !== null
}

// 返回当前日期
// 返回当前的日期
export const getCurrentDate = () => {
	const date = new Date()
	const day = date.getDate()
	return `${day}`
}
