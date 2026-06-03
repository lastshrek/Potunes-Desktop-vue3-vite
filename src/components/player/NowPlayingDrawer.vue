<template>
	<Sheet :open="isOpen" @update:open="closeDrawer">
		<SheetContent side="right" class="w-[400px] bg-[#111111] border-l border-gray-800">
			<SheetHeader>
				<SheetTitle class="text-white">当前播放列表</SheetTitle>
			</SheetHeader>
			<div class="mt-4 space-y-2">
				<div
					v-for="(track, index) in playerStore.queue"
					:key="`${track.id}-${index}`"
					class="flex items-center p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors group cursor-pointer"
					:class="{
						'bg-[#1a1a1a]': playerStore.currentIndex === index,
					}"
					@click="playTrack(index)"
				>
					<div class="w-10 h-10 rounded overflow-hidden">
						<img :src="track.cover_url" class="w-full h-full object-cover" />
					</div>
					<div class="ml-3 flex-grow overflow-hidden">
						<div
							class="text-sm truncate"
							:class="{
								'text-white': playerStore.currentIndex === index,
								'text-gray-300': playerStore.currentIndex !== index,
							}"
						>
							{{ track.name }}
						</div>
						<div
							class="text-xs truncate"
							:class="{
								'text-white': playerStore.currentIndex === index,
								'text-gray-400': playerStore.currentIndex !== index,
							}"
						>
							{{ track.artist }}
						</div>
					</div>
				</div>
				<div v-if="playerStore.queue.length === 0" class="text-center text-gray-400 py-8">暂无歌曲</div>
			</div>
		</SheetContent>
	</Sheet>
</template>

<script setup lang="ts">
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { usePlayerStore } from '@/store/modules/player'
import { onUnmounted, ref } from 'vue'
import { emitter } from '@/utils/mitt'

const playerStore = usePlayerStore()
const isOpen = ref(false)

const playTrack = (index: number) => {
	playerStore.setCurrentIndex(index)
}

const removeTrack = (index: number) => {
	const queue = [...playerStore.queue]
	queue.splice(index, 1)
	// playerStore.setGlobalQueue(queue)

	// 如果删除的是当前播放的歌曲，自动播放下一首
	if (index === playerStore.currentIndex) {
		if (queue.length > 0) {
			playerStore.setCurrentIndex(index >= queue.length ? queue.length - 1 : index)
		}
	} else if (index < playerStore.currentIndex) {
		// 如果删除的歌曲在当前播放歌曲之前，需要调整当前索引
		playerStore.setCurrentIndex(playerStore.currentIndex - 1)
	}
}

const closeDrawer = (value: boolean) => {
	isOpen.value = value
}

// 监听打开抽屉事件
emitter.on('showNowPlayingList', () => {
	isOpen.value = true
})

// 组件卸载时移除事件监听
onUnmounted(() => {
	emitter.off('showNowPlayingList')
})
</script>
