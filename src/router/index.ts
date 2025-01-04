/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 15:51:57
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-04 11:31:45
 * @FilePath     : /src/router/index.ts
 * @Description  : router
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 15:51:57
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Playlist from '@/views/Playlist.vue'
import Favourites from '@/views/Favourites.vue'
import Albums from '@/views/Albums.vue'
import Trends from '@/views/Trends.vue'
import Suggestions from '@/views/Suggestion.vue'
import Artist from '@/views/Artist.vue'
import Login from '@/views/Login.vue'
const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta: { keepAlive: true },
	},
	{
		path: '/playlist/:id',
		name: 'Playlist',
		component: Playlist,
		meta: {
			keepAlive: false,
		},
	},
	{
		path: '/netease-playlist/:id',
		name: 'netease-playlist',
		component: Playlist,
	},
	{
		path: '/netease-daily/:id',
		name: 'netease-daily',
		component: Playlist,
	},
	{
		path: '/netease-daily-tracks/',
		name: 'netease-daily-tracks',
		component: Playlist,
	},
	{
		path: '/netease-album/:id',
		name: 'netease-album',
		component: Playlist,
	},
	{
		path: '/favourites',
		name: 'favourites',
		component: Favourites,
		meta: { keepAlive: false },
	},
	{
		path: '/albums/:type',
		name: 'albums',
		component: Albums,
	},
	{
		path: '/trends',
		name: 'trends',
		component: Trends,
		meta: { keepAlive: false },
	},
	{
		path: '/feature',
		name: 'feature',
		component: Suggestions,
		meta: { keepAlive: true },
	},
	{
		path: '/artist/:id',
		name: 'artist',
		component: Artist,
	},
	{
		path: '/login',
		name: 'login',
		component: Login,
		meta: { keepAlive: true },
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})
/** 解决跳转重复路由报错问题 */
const originalPush = router.push
router.push = function push(location: any) {
	return (originalPush.call(this, location) as any).catch((err: any) => err)
}
export default router
