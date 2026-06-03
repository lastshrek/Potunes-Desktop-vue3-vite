/*
 * @Author       : lastshrek
 * @Date         : 2023-09-05 20:12:06
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-05 20:12:08
 * @FilePath     : /src/interfaces/ar.ts
 * @Description  : ar
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 20:12:06
 */
export interface Ar {
	id: number
	name: string
	alias: string[]
	picId?: number
	trans: string | null
	img1v1?: number
	picUrl: string
	albumSize?: number
	fansGroup: string | null
	img1v1Url?: string
	tns?: string[]
}
