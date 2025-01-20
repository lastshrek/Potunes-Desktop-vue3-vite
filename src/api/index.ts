/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 17:09:39
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-20 19:40:57
 * @FilePath     : /src/api/index.ts
 * @Description  : api
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 17:09:39
 */
import { get, patch, post } from './network'
// 获取首页数据
export const home = () => get('/playlists/home')
// 获取网易云音乐新碟发布
export const neteaseTopAlbum = () => get('/netease/top_album')
// 获取网易云每日推荐歌单
export const neteaseRecommendDaily = (data: { cookie: string }) => post('/netease/recommend_daily', data)
// 获取歌单歌曲
export const tracks = (id: string) => get(`playlists/by/${id}`)
// 获取网易云Top歌单列表
export const neteaseToplist = () => get('/netease/toplist')
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
// 获取网易云音乐歌手详情
export const neteaseArtist = (id: string) => get(`/netease/artist/${id}`)
// 获取网易云音乐歌手专辑
export const neteaseArtistAlbum = (id: string, limit: string, offset: string) =>
	get(`/netease/artist_album?id=${id}&limit=${limit}&offset=${offset}`)
// 获取网易云音乐歌手热门歌曲
export const neteaseArtistHotSongs = (id: string) => get(`/netease/artist_hot_songs/${id}`)
// 获取所有月度精选
export const playlists = () => get('/playlists')
// 获取所有年终精选
export const finals = () => get('/playlists/finals')
// 获取所有站内专辑
export const innerAlbums = () => get('/playlists/albums')

/**
 * @description: 获取短信验证码
 * @param {object} data
 */
export const captcha = (data: { phone: string }) => post('/users/captcha', data)
/**
 * @description: 验证短信验证码
 * @param {object} data
 */
export const verifyCaptcha = (data: { phone: string; captcha: string }) => post('/users/verify', data)
/**
 * @description: 获取网易云扫码登录二维码
 */
export const neteaseQrCode = () => get('/netease/qrcode')
/**
 * @description: 获取网易云二维码登录状态
 */
export const neteaseQrCodeStatus = (key: string) => get(`/netease/qrcode_status/${key}`)
/**
 * @description: 获取网易云扫码登录状态
 */
export const neteaseLoginStatus = (cookie: string) => post('/netease/login_status', { cookie })
/**
 * @description: v1 版本
 */
const playlistsPrefix = '/v1/playlists'
/**
 * @description: 获取最新三个月的精选集
 */
export const latestCollection = () => get(`${playlistsPrefix}/collection/latest`)
/**
 * @description: 获取最新年终精选集
 */
export const latestFinal = () => get(`${playlistsPrefix}/final/latest`)
/**
 * @description: 获取最新站内专辑
 */
export const latestInnerAlbum = () => get(`${playlistsPrefix}/album/latest`)
/**
 * @description: 获取所有月度精选集
 */
export const allCollections = () => get(`${playlistsPrefix}/collection/all`)
/**
 * @description: 获取所有年终精选集
 */
export const allFinals = () => get(`${playlistsPrefix}/finals`)
/**
 * @description: 获取所有站内专辑
 */
export const allInnerAlbums = () => get(`${playlistsPrefix}/albums`)
/**
 * @description: 更新用户头像
 */
export const updateUserAvatar = (avatar: string) => patch('/v1/users/avatar', { avatar })
/**
 * @description: 更新用户信息
 */
export const updateUserInfo = (data: any) => patch('/v1/users/profile', data)
/**
 * @description: 获取FM歌曲
 */
export const fm = () => get('v1/tracks/fm')
/**
 * @description: 获取新版本
 */
export const newVersion = (platform: string) => get(`v1/versions`, { platform })
/**
 * @description: 获取用户喜欢歌曲列表
 */
export const getFavouriteTracks = () => get('v1/users/favs')
/**
 * @description: 获取歌词
 */
export const getLyrics = (id: number, nId?: number) => get(`/v1/lyrics/${id}/${nId}`)
