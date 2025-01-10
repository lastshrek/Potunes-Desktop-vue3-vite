<template>
	<div class="relative w-full h-full bg-[#181818] p-4 rounded-lg shadow-lg">
		<div class="relative w-full mb-2" :class="imageRatio === 'square' ? 'aspect-square' : 'aspect-[32/15]'">
			<Skeleton class="w-full h-full rounded-lg bg-[#282828]" />
		</div>
		<div>
			<Skeleton class="h-4 w-3/4 mb-2 bg-[#282828]" />
			<Skeleton v-if="showArtist" class="h-3 w-1/2 bg-[#282828]" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'

defineProps({
	imageRatio: {
		type: String,
		default: 'square',
	},
	showArtist: {
		type: Boolean,
		default: false,
	},
})
</script> 
