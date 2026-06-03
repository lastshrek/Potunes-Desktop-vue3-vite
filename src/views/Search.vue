<template>
	<div class="w-full">
		<div class="bg-black w-full pt-16 pb-20 h-screen">
			<div ref="scrollContainer" class="h-full overflow-y-scroll flex flex-col text-white px-6 pt-8">
				<!-- 标题 -->
				<h2 v-if="keyword" class="text-xl font-bold mb-4 album-title">Results for "{{ keyword }}"</h2>

				<!-- 加载中 -->
				<div v-if="isLoading" class="space-y-2 mt-4">
					<div v-for="i in 10" :key="i" class="grid grid-cols-12 items-center py-3 px-4 rounded-lg animate-pulse">
						<div class="col-span-1"><div class="h-4 w-4 bg-gray-800 rounded" /></div>
						<div class="col-span-5 flex items-center space-x-3">
							<div class="w-10 h-10 bg-gray-800 rounded" />
							<div class="space-y-2">
								<div class="h-3 w-32 bg-gray-800 rounded" />
								<div class="h-2 w-20 bg-gray-800 rounded" />
							</div>
						</div>
						<div class="col-span-4"><div class="h-3 w-24 bg-gray-800 rounded" /></div>
						<div class="col-span-2 flex justify-end"><div class="h-3 w-10 bg-gray-800 rounded" /></div>
					</div>
				</div>

				<!-- 空结果 -->
				<div v-else-if="tracks.length === 0 && !isLoading" class="flex flex-col items-center justify-center pt-20 text-gray-500">
					<Music class="h-16 w-16 mb-4 opacity-30" />
					<p class="text-sm player-text">No results found for "{{ keyword }}"</p>
				</div>

				<!-- 结果列表 -->
				<template v-else-if="tracks.length > 0">
					<div class="grid grid-cols-12 text-gray-400 text-sm py-2 px-4 border-b border-gray-800 player-text">
						<div class="col-span-1">#</div>
						<div class="col-span-5">Title</div>
						<div class="col-span-4">Album</div>
						<div class="col-span-2 text-right">Duration</div>
					</div>
					<div
						v-for="(item, index) in tracks"
						:key="item.id + '-' + item.nId + '-' + index"
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
						<div class="col-span-4 text-sm" :class="{ 'text-gray-400': !isCurrentTrack(item) }">
							{{ item.album || '-' }}
						</div>
						<div class="col-span-2 flex items-center justify-end space-x-4" :class="{ 'text-gray-400': !isCurrentTrack(item) }">
							<span class="text-sm">{{ formatTime(item.duration) }}</span>
							<button
								v-if="isLoggedIn"
								class="opacity-0 group-hover:opacity-100 transition-opacity"
								@click.stop="showTrackMenu($event, item)"
							>
								<MoreHorizontal class="h-4 w-4 text-gray-400 hover:text-white" />
							</button>
						</div>
					</div>

					<!-- 加载更多 spinner -->
					<div v-if="isLoadingMore" class="flex justify-center py-6">
						<div class="animate-spin h-6 w-6 border-2 border-[#da5597] border-t-transparent rounded-full" />
					</div>
				</template>
			</div>

			<!-- 歌曲操作菜单 -->
			<Dialog :open="showTrackMenuDialog" @update:open="showTrackMenuDialog = false">
				<DialogContent class="sm:max-w-md bg-[#1A1A1A] border-gray-800 text-white">
					<DialogHeader>
						<DialogTitle class="text-base font-medium">Track options</DialogTitle>
					</DialogHeader>
					<div class="space-y-1">
						<button
							class="w-full text-left px-3 py-2.5 rounded-md text-sm text-gray-300 hover:bg-white/5 hover:text-white"
							@click="handleAddToPlaylist"
						>
							<svg class="h-4 w-4 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
							Add to playlist
						</button>
					</div>
				</DialogContent>
			</Dialog>

			<!-- 选择歌单对话框 -->
			<Dialog :open="showPlaylistPicker" @update:open="showPlaylistPicker = false">
				<DialogContent class="sm:max-w-sm bg-[#1A1A1A] border-gray-800 text-white">
					<DialogHeader>
						<DialogTitle class="text-base font-medium">Choose a playlist</DialogTitle>
					</DialogHeader>
					<ScrollArea class="max-h-60">
						<div class="space-y-1">
							<button
								v-for="pl in userPlaylists"
								:key="pl.id"
								class="w-full text-left px-3 py-2.5 rounded-md text-sm text-gray-300 hover:bg-white/5 hover:text-white"
								@click="confirmAddToPlaylist(pl)"
							>
								{{ pl.title }}
							</button>
							<div v-if="userPlaylists.length === 0" class="text-sm text-gray-500 px-3 py-4 text-center">
								No playlists yet. Create one first.
							</div>
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Music, MoreHorizontal } from 'lucide-vue-next'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { search, getUserPlaylists, addTrackToPlaylist } from '@/api'
import { useToast } from '@/composables/useToast'
import { useGlobalQueueStore } from '@/store/modules/globalQueue'
import { useCurrentTrackStore } from '@/store/modules/currenttrack'

const route = useRoute()
const toast = useToast()
const globalQueue = useGlobalQueueStore()
const currentTrack = useCurrentTrackStore()

const scrollContainer = ref<HTMLElement | null>(null)
const keyword = ref('')
const tracks = ref<any[]>([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const page = ref(1)
const showTrackMenuDialog = ref(false)
const showPlaylistPicker = ref(false)
const selectedTrack = ref<any>(null)
const userPlaylists = ref<any[]>([])
const isLoggedIn = ref(!!localStorage.getItem('token'))

const formatTime = (ms: number) => {
	if (!ms || ms <= 0) return '--:--'
	const totalSeconds = Math.floor(ms / 1000)
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60
	return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const isCurrentTrack = (item: any) => {
	return currentTrack.type === 'netease'
		? currentTrack.nId === item.nId
		: currentTrack.id === item.id
}

const fetchResults = async (reset: boolean) => {
	const q = keyword.value.trim()
	if (!q) return
	if (reset) {
		page.value = 1
		hasMore.value = true
		isLoading.value = true
	} else {
		if (isLoadingMore.value || !hasMore.value) return
		isLoadingMore.value = true
	}
	try {
		const data = await search(q, page.value) as any
		if (data.tracks) {
			if (reset) {
				tracks.value = data.tracks
			} else {
				tracks.value.push(...data.tracks)
			}
		}
		if (data.pagination) {
			hasMore.value = page.value < (data.pagination.totalPages || 1)
		}
	} catch {
		if (reset) toast.error('Search failed')
	} finally {
		isLoading.value = false
		isLoadingMore.value = false
	}
}

const loadMore = () => {
	page.value++
	fetchResults(false)
}

const selectTrack = (index: number) => {
	globalQueue.setGlobalQueue(tracks.value, index)
}

const showTrackMenu = (e: MouseEvent, track: any) => {
	e.stopPropagation()
	selectedTrack.value = track
	showTrackMenuDialog.value = true
}

const handleAddToPlaylist = async () => {
	showTrackMenuDialog.value = false
	try {
		const list = await getUserPlaylists() as any[]
		userPlaylists.value = Array.isArray(list) ? list : []
	} catch {
		toast.error('Failed to load playlists')
	}
	showPlaylistPicker.value = true
}

const confirmAddToPlaylist = async (pl: any) => {
	if (!selectedTrack.value) return
	showPlaylistPicker.value = false
	try {
		await addTrackToPlaylist(pl.id, [selectedTrack.value])
		toast.success(`Added to "${pl.title}"`)
	} catch {
		toast.error('Failed to add track')
	}
}

const handleScroll = () => {
	const el = scrollContainer.value
	if (!el || isLoadingMore.value || !hasMore.value) return
	const threshold = 300
	if (el.scrollHeight - el.scrollTop - el.clientHeight < threshold) {
		loadMore()
	}
}

watch(
	() => route.query.q,
	(val) => {
		if (val && typeof val === 'string') {
			keyword.value = val
			fetchResults(true)
		}
	},
	{ immediate: true }
)

onMounted(() => {
	const el = scrollContainer.value
	if (el) el.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
	const el = scrollContainer.value
	if (el) el.removeEventListener('scroll', handleScroll)
})
</script>
