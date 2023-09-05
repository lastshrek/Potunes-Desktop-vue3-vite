/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 17:09:39
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-05 13:19:43
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
// 获取歌单歌曲
export const tracks = (id: string) => get(`playlists/by/${id}`)
// 获取网易云Top歌单详情及歌单内歌曲
export const neteasePlaylist = (id: string) => get(`/netease/toplist/${id}`)
// 获取网易云音乐专辑详情
export const neteaseAlbum = (id: string) => get(`/netease/album/${id}`)
// 获取网易云日推歌曲
export const neteaseDailyTracks = (data: { cookie: string }) => post('/netease/recommend_tracks', data)
// 获取周榜
export const weeklyTrends = () => get('/tracks/topCharts/week')
// 获取网易云歌单详情及歌曲
export const neteasePlaylistDetail = (id: string) => get(`/netease/playlist_detail/${id}`)
