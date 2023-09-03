/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 23:30:20
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-02 23:30:20
 * @FilePath     : /src/interfaces/artist.ts
 * @Description  : atrtist
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 23:30:20
 */

export interface Artist {
	name: string
	id: number
	picId: number
	img1v1Id: number
	briefDesc: string
	picUrl: string
	img1v1Url: string
	albumSize: number
	alias: string[]
	trans: string
	musicSize: number
	topicPerson: number
	picId_str: string
	img1v1Id_str: string
	transNames?: string[]
}
