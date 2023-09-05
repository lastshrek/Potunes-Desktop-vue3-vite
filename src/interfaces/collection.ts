/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 19:12:51
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-05 16:38:47
 * @FilePath     : /src/interfaces/collection.ts
 * @Description  : collection interface
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 19:12:51
 */
interface Playlist {
	id: number
	nId: number
	title: string
	type: string
	cover: string
	is_ready: boolean
	count: number
	content?: string
	updated_at?: string
}
