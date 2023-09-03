/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 23:31:09
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-02 23:31:10
 * @FilePath     : /src/interfaces/netease_album.ts
 * @Description  :
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 23:31:09
 */
import { Artist } from './artist'

export interface Netease_Album {
	name: string
	id: number
	type: string
	size: number
	picId: number
	blurPicUrl: string
	companyId: number
	pic: number
	picUrl: string
	publishTime: number
	description: string
	tags: string
	company: string
	briefDesc: string
	artist: Artist
	songs: any
	alias: string[]
	status: number
	copyrightId: number
	commentThreadId: string
	artists: Artist[]
	paid: boolean
	onSale: boolean
	picId_str: string
}
