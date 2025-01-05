<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-01 21:16:34
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-05 11:28:33
 * @FilePath     : /src/views/Home.vue
 * @Description  : Home
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-01 21:16:34
-->
<template>
	<div class="md:flex flex-col md:flex-row min-h-screen container mx-auto shadow bg-black pb-20">
		<div class="w-full px-4 pt-2">
			<!-- Mine -->
			<div v-show="isUser">
				<HeaderTitle title="我的" :showmore="false"></HeaderTitle>
				<div class="mt-4 md:grid md:grid-cols-5 md:gap-4 flex flex-wrap">
					<AlbumCard
						name="我的收藏"
						:cover_url="heartSrc"
						max_width="md:max-w-md"
						@click.native="toPlaylist(0, 'favourites')"
					></AlbumCard>
				</div>
			</div>
			<!-- collections -->
			<HeaderTitle title="月度精选" @click.native="pushToPlaylists('collections')"></HeaderTitle>
			<div class="mt-4 md:flex">
				<AlbumCard
					v-for="collection in collections"
					:key="collection.id"
					:name="collection.title"
					:cover_url="collection.cover"
					max_width="md:max-w-md"
					@click.native="toPlaylist(collection.id, '')"
				></AlbumCard>
			</div>
			<!-- finals -->
			<HeaderTitle title="年终精选" @click.native="pushToPlaylists('finals')"></HeaderTitle>
			<div class="mt-4 md:grid md:grid-cols-5 md:gap-4 flex flex-wrap">
				<AlbumCard
					v-for="final in finals"
					:key="final.id"
					:name="final.title"
					:cover_url="final.cover"
					@click.native="toPlaylist(final.id, '')"
				></AlbumCard>
			</div>
			<!-- netease daily -->
			<div v-show="netease_daily.length !== 0">
				<HeaderTitle title="网易日推" :showmore="false"></HeaderTitle>
				<div class="mt-4 md:grid md:grid-cols-5 md:gap-4 flex flex-wrap">
					<div
						class="text-start relative w-full md:mr-2 mb-2 bg-albumcard rounded-lg p-4 shadow-lg hover:bg-albumcardhover text-gray-50 cursor-pointer"
						@click="toPlaylist(0, 'netease-daily-tracks')"
					>
						<div class="mx-auto mb-4 w-full rounded-lg relative text-center">
							<img :src="dailySrc" class="object-cover w-full" />
							<div class="absolute inset-0 flex items-center justify-center">
								<p class="text-gray-800 text-center text-3xl mt-2 font-semibold">
									{{ today }}
								</p>
							</div>
						</div>
						<h5 class="mb-2 text-xs font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">每日歌曲推荐</h5>
					</div>
					<AlbumCard
						v-for="playlist in netease_daily"
						:key="playlist.id"
						:name="playlist.title"
						:cover_url="playlist.cover"
						@click.native="toPlaylist(playlist.id, 'netease-daily')"
					></AlbumCard>
				</div>
			</div>
			<!-- local albums -->
			<HeaderTitle title="站内专辑" @click.native="pushToPlaylists('albums')"></HeaderTitle>
			<div class="mt-4 md:grid md:grid-cols-5 md:gap-4 flex flex-wrap">
				<AlbumCard
					v-for="album in albums"
					:key="album.id"
					:name="album.title"
					:cover_url="album.cover"
					@click.native="toPlaylist(album.id, '')"
				></AlbumCard>
			</div>
			<!-- toplist -->
			<HeaderTitle title="网易榜单" :showmore="false"></HeaderTitle>
			<div class="mt-4 md:grid md:grid-cols-5 md:gap-4 flex flex-wrap">
				<AlbumCard
					v-for="list in netease_toplist"
					:key="list.id"
					:name="list.title"
					:cover_url="list.cover"
					@click.native="toPlaylist(list.nId, 'netease')"
				></AlbumCard>
			</div>
			<HeaderTitle title="热门新碟" @click.native="pushToPlaylists('albums')" :showmore="false"></HeaderTitle>
			<div class="mt-4 md:grid md:grid-cols-5 md:gap-4 flex flex-wrap">
				<AlbumCard
					v-for="album in netease_topalbums"
					:key="album.id"
					:name="album.name"
					:cover_url="album.picUrl"
					:artist="album.artist.name"
					@click.native="toPlaylist(album.id, 'netease-album')"
				></AlbumCard>
			</div>
		</div>
		<loading
			:active="isLoading"
			:can-cancel="true"
			:is-full-page="false"
			background-color="rgba(0, 0, 0, 0.5)"
			color="#EC4899"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { home, neteaseTopAlbum, neteaseRecommendDaily } from '@/api/index'
import { handlePromise, isUserLogin, getCurrentDate, showError } from '@/utils/index'
import { useRouter } from 'vue-router'
import { Netease_Album } from '@/interfaces/netease_album'
import Loading from 'vue-loading-overlay'
import HeaderTitle from '@/components/headertitle/HeaderTitle.vue'
import AlbumCard from '@/components/albumcard/AlbumCard.vue'
import 'vue-toast-notification/dist/theme-sugar.css'
// 本地图片
import dailySrc from '@/assets/images/daily.png'
import heartSrc from '@/assets/images/heart.png'
import { emitter } from '@/utils/mitt'
// eventBus

// 今天日期
const today = getCurrentDate()
// 加载状态
const isLoading = ref(true)
// 用户是否登录
const collections: Ref<Playlist[]> = ref([])
const finals: Ref<Playlist[]> = ref([])
const albums: Ref<Playlist[]> = ref([])
const netease_toplist: Ref<Playlist[]> = ref([])
const isUser = ref(false)
// router
const router = useRouter()
// gethome
const homedata = async () => {
	try {
		const [res, err] = await handlePromise(home())
		if (err) return showError('获取首页数据失败')
		const result = res.data
		collections.value = result.collections
		finals.value = result.finals
		albums.value = result.albums
		netease_toplist.value = result.netease_toplist
	} catch (error: any) {
		showError(error.message)
	} finally {
		isLoading.value = false
	}
}
const netease_topalbums: Ref<Netease_Album[]> = ref([])
// get netease top albums
const getNeteaseTopAlbums = async () => {
	try {
		const [res, err] = await handlePromise(neteaseTopAlbum())
		if (err) return showError('获取网易热门新碟失败')
		netease_topalbums.value = res.data
	} catch (error: any) {
		showError(error.message)
	}
}
// get netease user recommand playlist
const netease_daily: Ref<Playlist[]> = ref([])
const getNeteaseDaily = async () => {
	// get netease user cookie
	const cookie = localStorage.getItem('netease-cookie')
	if (!cookie) return
	try {
		const [res, err] = await handlePromise(
			neteaseRecommendDaily({
				cookie,
			})
		)
		if (err) return showError('获取网易日推失败')
		netease_daily.value = res.data
	} catch (error: any) {
		showError(error.message)
	}
}
// toplaylist
const toPlaylist = (id: number, type: string) => {
	console.log('toPlaylist', id, type)
	if (type == '') {
		router.push({
			path: `playlist/${id}`,
		})
		return
	}
	if (type === 'netease') {
		router.push({
			path: `netease-playlist/${id}`,
		})
		return
	}
	if (type === 'netease-album') {
		router.push({
			path: `netease-album/${id}`,
		})
		return
	}
	if (type === 'netease-daily') {
		router.push({
			path: `netease-daily/${id}`,
		})
		return
	}
	if (type === 'favourites') {
		router.push({
			path: 'favourites/',
		})
		return
	}
	router.push({
		path: 'netease-daily-tracks/',
	})
}
// to all playlist(collection, final, albums)
const pushToPlaylists = (type: string) => {
	router.push({
		path: `albums/${type}`,
	})
}
onMounted(async () => {
	await initial()
	eventBus()
})
const initial = async () => {
	await homedata()
	await getNeteaseTopAlbums()
	await getNeteaseDaily()
	isUser.value = isUserLogin()
}
const eventBus = () => {
	emitter.on('userLogin', async () => {
		await initial()
	})
	emitter.on('userLoout', async () => {
		isUser.value = false
	})
}
</script>

<style lang="scss" scoped></style>
