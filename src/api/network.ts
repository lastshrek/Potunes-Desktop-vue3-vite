/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 17:08:49
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-16 20:34:51
 * @FilePath     : /src/api/network.ts
 * @Description  : network
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 17:08:49
 */
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

axios.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}
		const neteaseCookie = localStorage.getItem('netease-cookie')
		if (neteaseCookie) {
			config.headers['Netease-Cookie'] = neteaseCookie
		}
		return config
	},
	error => Promise.reject(error)
)

axios.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			localStorage.removeItem('user')
			localStorage.removeItem('userId')
			localStorage.removeItem('token')
			localStorage.removeItem('netease-cookie')
			localStorage.removeItem('netease-user')
			window.location.href = '/login'
		}
		return Promise.reject(error)
	}
)

export const get = <T = any>(url: string, params?: Record<string, any>) =>
	axios.get<{ data: T }>(url, { params }).then(res => res.data.data)

export const post = <T = any>(url: string, params?: Record<string, any>) =>
	axios.post<{ statusCode: number; data: T; message?: string }>(url, params).then(res => {
		if (res.data.statusCode === 200) return res.data.data
		throw new Error(res.data.message || '请求失败')
	})

export const put = <T = any>(url: string, params?: Record<string, any>) =>
	axios.put<{ data: T }>(url, params).then(res => res.data.data)

export const del = <T = any>(url: string, config?: { params?: any; data?: any }) =>
	axios.delete<{ data: T }>(url, config).then(res => res.data.data)

export const patch = <T = any>(url: string, params?: Record<string, any>) =>
	axios.patch<{ data: T }>(url, params).then(res => res.data.data)

export const all = <T = any>(requestArray: Promise<T>[]) => Promise.all(requestArray)
