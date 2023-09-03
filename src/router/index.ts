/*
 * @Author       : lastshrek
 * @Date         : 2023-09-02 15:51:57
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-03 11:03:09
 * @FilePath     : /src/router/index.ts
 * @Description  : router
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 15:51:57
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Playlist from '@/views/Playlist.vue'
const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			keepAlive: true,
		},
	},
	{
		path: '/playlist/:id',
		name: 'Playlist',
		component: Playlist,
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
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
