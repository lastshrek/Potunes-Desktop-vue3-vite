/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 17:09:39
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-04 19:57:58
 * @FilePath     : /src/api/index.ts
 * @Description  : api
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 17:09:39
 */
import { get, post } from './network'
// 获取首页数据
export const home = () => get('/playlists/home')
// 获取网易云音乐热门新碟
export const neteaseTopAlbum = () => get('/netease/top_album')
// 获取网易云每日推荐歌单
export const neteaseRecommendDaily = (data: { cookie: string }) => post('/netease/recommend_daily', data)
