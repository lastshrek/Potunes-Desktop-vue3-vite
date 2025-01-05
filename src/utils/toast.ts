/*
 * @Author       : lastshrek
 * @Date         : 2025-01-05 14:42:57
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-05 14:42:59
 * @FilePath     : /src/utils/toast.ts
 * @Description  :
 * Copyright 2025 lastshrek, All Rights Reserved.
 * 2025-01-05 14:42:57
 */
import { toast as showToast } from '@/components/ui/toast'
import type { ToastProps } from '@/components/ui/toast'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
	title?: string
	description?: string
	type?: ToastType
	duration?: number
}

const getToastStyle = (type: ToastType) => {
	switch (type) {
		case 'success':
			return 'bg-green-500/90 text-white border-green-600'
		case 'error':
			return 'bg-red-500/90 text-white border-red-600'
		case 'warning':
			return 'bg-yellow-500/90 text-white border-yellow-600'
		case 'info':
		default:
			return 'bg-blue-500/90 text-white border-blue-600'
	}
}

export const toast = ({ title, description, type = 'info', duration = 3000 }: ToastOptions) => {
	showToast({
		title,
		description,
		duration,
		class: getToastStyle(type),
	})
}

// 便捷方法
export const successToast = (title: string, description?: string) => {
	toast({ title, description, type: 'success' })
}

export const errorToast = (title: string, description?: string) => {
	toast({ title, description, type: 'error' })
}

export const infoToast = (title: string, description?: string) => {
	toast({ title, description, type: 'info' })
}

export const warningToast = (title: string, description?: string) => {
	toast({ title, description, type: 'warning' })
}
