<template>
	<div class="bg-black">
		<NavBar />
		<router-view v-slot="{ Component }">
			<keep-alive>
				<component :is="Component" v-if="$route.meta.keepAlive" />
			</keep-alive>
			<component :is="Component" v-if="!$route.meta.keepAlive" />
		</router-view>
		<BottomPlayer />
	</div>
</template>
<script setup lang="ts">
import NavBar from '@/components/navbar/NavBar.vue'
import BottomPlayer from './components/player/BottomPlayer.vue'
</script>
<style scoped lang="scss">
/* 隐藏垂直滚动条 */
::-webkit-scrollbar {
	width: 0;
}

/* 隐藏水平滚动条 */
::-webkit-scrollbar-thumb {
	background: transparent;
}

/* 隐藏水平滚动条轨道 */
::-webkit-scrollbar-track {
	background: transparent;
}
</style>
