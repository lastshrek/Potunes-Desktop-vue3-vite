/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 17:08:49
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-02 17:10:03
 * @FilePath     : /src/api/network.ts
 * @Description  : network
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 17:08:49
 */
import axios from 'axios'
axios.defaults.baseURL = 'https://api.poche.pink'
axios.defaults.timeout = 20000

// add request interceptor
axios.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

export const get = (url: string, params: any = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.get(url, { params: params })
			.then(res => {
				resolve(res.data)
			})
			.catch(err => {
				reject(err.data)
			})
	})
}

export const post = (url: string, params: any = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.post(url, params)
			.then(res => {
				resolve(res.data)
			})
			.catch(err => {
				reject(err.data)
			})
	})
}

export const put = (url: string, params: any = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.put(url, params)
			.then(res => {
				resolve(res.data)
			})
			.catch(err => {
				reject(err.data)
			})
	})
}

export const del = (url: string, params: any = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(url, { params: params })
			.then(res => {
				resolve(res.data)
			})
			.catch(err => {
				reject(err.data)
			})
	})
}

export const patch = (url: string, params: any = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.patch(url, params)
			.then(res => {
				resolve(res.data)
			})
			.catch(err => {
				reject(err.data)
			})
	})
}

export const all = (requestArray: any) => {
	return new Promise((resolve, reject) => {
		axios
			.all(requestArray)
			.then(
				axios.spread((...res) => {
					resolve(res)
				})
			)
			.catch(err => {
				reject(err.data)
			})
	})
}
