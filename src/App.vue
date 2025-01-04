<template>
	<div class="bg-black min-h-screen" id="app">
		<!-- 导航栏可拖拽 -->
		<NavBar />
		<!-- 内容区域不可拖拽 -->
		<div class="pt-14">
			<router-view v-slot="{ Component }">
				<transition enter-from-class="translate-x-[150%] opacity-0" enter-active-class="transition duration-300">
					<keep-alive v-if="$route.meta.keepAlive">
						<component :is="Component" />
					</keep-alive>
					<component :is="Component" v-else />
				</transition>
			</router-view>
			<BottomPlayer />
		</div>
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

#app {
	height: 100vh;
	overflow-y: auto;
}
</style>
