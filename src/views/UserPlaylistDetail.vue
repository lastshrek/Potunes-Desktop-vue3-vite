<template>
	<div class="w-full">
		<div class="bg-black w-full pt-16 pb-20 h-screen">
			<div class="h-full overflow-y-scroll flex flex-col text-white px-6">
				<!-- Loading -->
				<div v-if="isLoading" class="flex items-center justify-center pt-20">
					<div class="animate-spin h-8 w-8 border-2 border-[#da5597] border-t-transparent rounded-full" />
				</div>

				<template v-else-if="playlist">
					<!-- 顶部信息 -->
					<div class="flex items-start space-x-6 w-full">
						<div class="w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
							<img v-if="playlist.cover" v-lazy="playlist.cover" class="w-full h-full object-cover" />
							<Music v-else class="h-16 w-16 text-gray-600" />
						</div>
						<div class="flex flex-col flex-grow">
							<h1 class="text-3xl font-bold mb-2 album-title">{{ playlist.title }}</h1>
							<p class="text-sm text-gray-400 mb-4 player-text">
								{{ playlist.count || tracks.length }} songs
								<span v-if="playlist.duration"> · {{ formatDuration(playlist.duration) }}</span>
							</p>
							<div class="flex items-center space-x-4">
								<button
									class="bg-[#da5597] text-white px-8 py-2 rounded-full hover:bg-[#da5597]/90 flex items-center justify-center space-x-2 player-text"
									@click="playAll"
								>
									<Play class="w-5 h-5" />
									<span>Play</span>
								</button>
								<button
									class="bg-[#da5597] text-white px-8 py-2 rounded-full hover:bg-[#da5597]/90 flex items-center justify-center space-x-2 player-text"
									@click="playRandom"
								>
									<Shuffle class="w-5 h-5" />
									<span>Shuffle</span>
								</button>
								<button
									class="text-gray-400 hover:text-red-400 px-4 py-2 rounded-full hover:bg-gray-800/50 flex items-center space-x-2 player-text"
									@click="handleDeletePlaylist"
								>
									<Trash2 class="w-4 h-4" />
									<span>Delete</span>
								</button>
							</div>
						</div>
					</div>

					<!-- 歌曲列表 -->
					<div class="mt-8">
						<div class="grid grid-cols-12 text-gray-400 text-sm py-2 px-4 border-b border-gray-800 player-text">
							<div class="col-span-1">#</div>
							<div class="col-span-5">Title</div>
							<div class="col-span-3">Album</div>
							<div class="col-span-2 text-right">Duration</div>
							<div class="col-span-1" />
						</div>
						<div
							v-for="(item, index) in tracks"
							:key="'track-' + (item.id || item.nId) + '-' + index"
							class="grid grid-cols-12 items-center py-3 px-4 rounded-lg group player-text cursor-pointer"
							:class="{
								'bg-[#da5597] text-white': isCurrentTrack(item),
								'hover:bg-gray-800/50': !isCurrentTrack(item),
							}"
							@click="selectTrack(index)"
						>
							<div class="col-span-1 text-sm" :class="{ 'text-gray-400': !isCurrentTrack(item) }">
								{{ index + 1 }}
							</div>
							<div class="col-span-5 flex items-center space-x-3">
								<img v-lazy="item.cover_url" class="w-10 h-10 rounded" />
								<div>
									<p class="text-sm font-medium album-title">
										{{ item.name }}
										<span v-if="item.type === 'netease'" class="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-[#da5597]/20 text-[#da5597]">网易</span>
									</p>
									<div class="flex text-xs mt-1" :class="{ 'text-gray-400': !isCurrentTrack(item) }">
										<div
											v-for="(artist, idx) in item.ar"
											:key="'artist' + artist.id + idx"
										>
											<span class="cursor-pointer hover:underline">{{ artist.name }}</span>
											<span v-if="idx < item.ar.length - 1 && item.ar.length > 1" class="mx-1">/</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-span-3 text-sm" :class="{ 'text-gray-400': !isCurrentTrack(item) }">
								{{ item.album || '-' }}
							</div>
							<div class="col-span-2 text-sm text-right" :class="{ 'text-gray-400': !isCurrentTrack(item) }">
								{{ formatTime(item.duration) }}
							</div>
							<div class="col-span-1 flex justify-end">
								<button
									class="opacity-0 group-hover:opacity-100 transition-opacity"
									@click.stop="showTrackMenu($event, item, index)"
								>
									<MoreHorizontal class="h-4 w-4 text-gray-400 hover:text-white" />
								</button>
							</div>
						</div>
						<div v-if="tracks.length === 0" class="text-center text-gray-500 py-10 player-text">
							No tracks yet. Add songs from search or other playlists.
						</div>
					</div>
				</template>

				<div v-else class="flex items-center justify-center pt-20 text-gray-500 player-text">
					Playlist not found
				</div>
			</div>

			<!-- Track menu dialog -->
			<Dialog :open="showTrackMenuDialog" @update:open="showTrackMenuDialog = false">
				<DialogContent class="sm:max-w-xs bg-[#1A1A1A] border-gray-800 text-white">
					<DialogHeader>
						<DialogTitle class="text-sm text-gray-400 font-normal">{{ selectedTrack?.name }}</DialogTitle>
					</DialogHeader>
					<div class="space-y-1">
						<button
							class="w-full text-left px-3 py-2.5 rounded-md text-sm text-red-400 hover:bg-white/5"
							@click="handleRemoveTrack"
						>
							<MinusCircle class="h-4 w-4 inline mr-2" />
							Remove from playlist
						</button>
					</div>
				</DialogContent>
			</Dialog>

			<!-- Delete playlist confirm -->
			<Dialog :open="showDeleteConfirm" @update:open="showDeleteConfirm = false">
				<DialogContent class="sm:max-w-sm bg-[#1A1A1A] border-gray-800 text-white">
					<DialogHeader>
						<DialogTitle class="text-base font-medium">Delete playlist?</DialogTitle>
					</DialogHeader>
					<p class="text-sm text-gray-400">Are you sure you want to delete "{{ playlist?.title }}"? This action cannot be undone.</p>
					<div class="flex justify-end gap-2 mt-2">
						<Button variant="ghost" class="text-gray-400 hover:text-white" @click="showDeleteConfirm = false">
							Cancel
						</Button>
						<Button class="bg-red-500 hover:bg-red-600 text-white" @click="confirmDeletePlaylist">
							Delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Music, Play, Shuffle, MoreHorizontal, Trash2, MinusCircle } from 'lucide-vue-next'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getUserPlaylistDetail, deletePlaylist, removeTracksFromPlaylist } from '@/api'
import { usePlayerStore } from '@/store/modules/player'
import { emitter } from '@/utils/mitt'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const playerStore = usePlayerStore()

const playlist = ref<any>(null)
const tracks = ref<any[]>([])
const isLoading = ref(true)
const showTrackMenuDialog = ref(false)
const showDeleteConfirm = ref(false)
const selectedTrack = ref<any>(null)
const selectedTrackIndex = ref(-1)

const formatTime = (ms: number) => {
	if (!ms || ms <= 0) return '--:--'
	const totalSeconds = Math.floor(ms / 1000)
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60
	return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatDuration = (ms: number) => {
	const totalSeconds = Math.floor(ms / 1000)
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	if (hours > 0) return `${hours}h ${minutes}m`
	return `${minutes}min`
}

const isCurrentTrack = (item: any) => {
	return playerStore.currentTrack.type === 'netease'
		? playerStore.currentTrack.nId === item.nId
		: playerStore.currentTrack.id === item.id
}

const loadDetail = async () => {
	const id = Number(route.params.id)
	if (!id) return
	isLoading.value = true
	try {
		const data = await getUserPlaylistDetail(id) as any
		playlist.value = data
		tracks.value = Array.isArray(data.tracks) ? data.tracks : []
	} catch {
		playlist.value = null
		tracks.value = []
	} finally {
		isLoading.value = false
	}
}

const playAll = () => {
	if (tracks.value.length === 0) return
	playerStore.setGlobalQueue(tracks.value, 0)
}

const playRandom = () => {
	if (tracks.value.length === 0) return
	const index = Math.floor(Math.random() * tracks.value.length)
	playerStore.setGlobalQueue(tracks.value, index)
}

const selectTrack = (index: number) => {
	playerStore.setGlobalQueue(tracks.value, index)
}

const showTrackMenu = (e: MouseEvent, track: any, index: number) => {
	e.stopPropagation()
	selectedTrack.value = track
	selectedTrackIndex.value = index
	showTrackMenuDialog.value = true
}

const handleRemoveTrack = async () => {
	showTrackMenuDialog.value = false
	if (!selectedTrack.value || !playlist.value) return
	const trackId = selectedTrack.value.id
	if (!trackId) {
		toast.error('Cannot remove this track')
		return
	}
	try {
		await removeTracksFromPlaylist(playlist.value.id, [trackId])
		tracks.value = tracks.value.filter((_, i) => i !== selectedTrackIndex.value)
		toast.success('Track removed')
	} catch {
		toast.error('Failed to remove track')
	}
}

const handleDeletePlaylist = () => {
	showDeleteConfirm.value = true
}

const confirmDeletePlaylist = async () => {
	showDeleteConfirm.value = false
	if (!playlist.value) return
	try {
		await deletePlaylist(playlist.value.id)
		toast.success('Playlist deleted')
		emitter.emit('playlist-changed')
		router.push('/')
	} catch {
		toast.error('Failed to delete playlist')
	}
}

onMounted(loadDetail)
</script>
