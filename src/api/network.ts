/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 17:08:49
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-05 14:52:59
 * @FilePath     : /src/api/network.ts
 * @Description  : network
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 17:08:49
 */
import axios from 'axios'
// axios.defaults.baseURL = 'https://api.poche.pink'
axios.defaults.baseURL = 'http://localhost:3000'

// 添加请求拦截器
axios.interceptors.request.use(
	config => {
		// 从 localStorage 获取 token
		const token = localStorage.getItem('token')

		// 如果有 token，添加到请求头
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}

		// 如果有网易云 cookie，也添加到请求头
		const neteaseCookie = localStorage.getItem('netease-cookie')
		if (neteaseCookie) {
			config.headers['Netease-Cookie'] = neteaseCookie
		}

		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// 添加响应拦截器
axios.interceptors.response.use(
	response => {
		return response
	},
	error => {
		// 处理 401 未授权错误
		if (error.response?.status === 401) {
			// 清除本地存储
			localStorage.removeItem('user')
			localStorage.removeItem('userId')
			localStorage.removeItem('token')
			localStorage.removeItem('netease-cookie')
			localStorage.removeItem('netease-user')

			// 重定向到登录页
			window.location.href = '/login'
		}
		return Promise.reject(error)
	}
)

export const get = (url: string, params: any = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.get(url, { params: params })
			.then(res => {
				resolve(res.data.data)
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
				if (res.data.code === 200) {
					resolve(res.data.data)
				} else {
					reject(new Error(res.data.message || '请求失败'))
				}
			})
			.catch(err => {
				reject(new Error(err.response?.data?.message || '网络请求失败'))
			})
	})
}

export const put = (url: string, params: any = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.put(url, params)
			.then(res => {
				resolve(res.data.data)
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
				resolve(res.data.data)
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
				resolve(res.data.data)
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
