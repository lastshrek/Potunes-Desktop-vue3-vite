/*
 * @Author       : lastshrek
 * @Date         : 2023-09-05 20:11:44
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-05 20:11:45
 * @FilePath     : /src/interfaces/track.ts
 * @Description  : track
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 20:11:44
 */
interface Track {
	id: number
	name: string
	artist: string
	url: string
	cover_url: string
	album: string
	playlist_id: number
	original_album: string
	original_album_id: number
	duration: number
	mv: number
	nId: number
	type: string
	ar: Ar[]
}
