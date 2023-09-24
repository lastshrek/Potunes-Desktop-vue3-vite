<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-05 16:26:25
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-23 23:35:55
 * @FilePath     : /src/views/Albums.vue
 * @Description  : Albums
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-05 16:26:25
-->
<template>
	<div class="overflow-y-scroll pt-16 pb-16 container mx-auto bg-black min-h-screen">
		<div class="flex-row flex-wrap grid grid-cols-4 gap-4 w-full px-4">
			<div v-for="album in albums" :key="album.id">
				<router-link :to="{ name: 'Playlist', params: { id: album.id } }">
					<AlbumCard
						:name="album.title"
						:cover_url="album.cover"
						max_width="md:max-w-md"
						@click="selectItem(album.id)"
					></AlbumCard>
				</router-link>
			</div>
			<loading
				:active.sync="isLoading"
				:can-cancel="true"
				background-color="rgba(0, 0, 0, 0.5)"
				color="#ec4899"
				:is-full-page="true"
			></loading>
			<!-- TODO use slot -->
			<transition name="slide-up">
				<router-view></router-view>
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { playlists, finals, innerAlbums } from '@/api/index'
import { handlePromise, showError } from '@/utils/index'
import AlbumCard from '@/components/albumcard/AlbumCard.vue'
import Loading from 'vue-loading-overlay'
// TODO: add type
const albums = ref([] as any[])
const isLoading = ref(true)
const router = useRouter()
const route = useRoute()
// 点击专辑
const selectItem = (id: string) => {
	router.push({ name: 'album-details', params: { id } })
}
onMounted(async () => {
	const type = route.params.type
	switch (type) {
		case 'collections':
			const [pRes, pErr] = await handlePromise(playlists())
			if (pErr) return showError(pErr)
			albums.value = pRes.data
			break
		case 'finals':
			const [fRes, fErr] = await handlePromise(finals())
			if (fErr) return showError(fErr)
			albums.value = fRes.data
			break
		case 'albums':
			const [aRes, aErr] = await handlePromise(innerAlbums())
			if (aErr) return showError(aErr)
			albums.value = aRes.data
			break
		default:
			break
	}
	isLoading.value = false
})
</script>

<style scoped lang="scss">
.playlist {
	position: fixed;
	top: 5rem;
	bottom: 0;
	left: 0;
	right: 0;
	background: black;
}
</style>
