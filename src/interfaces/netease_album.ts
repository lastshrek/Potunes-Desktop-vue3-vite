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

export interface NeteaseArtist {
	name: string
	id: number
	picUrl?: string
	img1v1Url?: string
	alias?: string[]
}

export interface NeteaseAlbum {
	name: string
	id: number
	type: string
	size: number
	picUrl: string
	artist: NeteaseArtist
	artists: NeteaseArtist[]
	company?: string
	description?: string
	publishTime?: number
}
