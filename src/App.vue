<template>
	<div class="bg-black min-h-screen" id="app">
		<!-- 导航栏可拖拽 -->
		<NavBar />
		<div class="flex">
			<LeftNav />
			<!-- 内容区域不可拖拽 -->
			<router-view v-slot="{ Component, route }">
				<template v-if="$route.meta.keepAlive">
					<keep-alive>
						<transition
							enter-from-class="translate-x-full opacity-0"
							enter-active-class="transition-all duration-300 ease-out"
							enter-to-class="translate-x-0 opacity-100"
							leave-from-class="translate-x-0 opacity-100"
							leave-active-class="transition-all duration-300 ease-in"
							leave-to-class="translate-x-full opacity-0"
							mode="out-in"
						>
							<component :is="Component" :key="route.path" />
						</transition>
					</keep-alive>
				</template>
				<template v-else>
					<transition
						enter-from-class="translate-x-full opacity-0"
						enter-active-class="transition-all duration-300 ease-out"
						enter-to-class="translate-x-0 opacity-100"
						leave-from-class="translate-x-0 opacity-100"
						leave-active-class="transition-all duration-300 ease-in"
						leave-to-class="translate-x-full opacity-0"
						mode="out-in"
					>
						<component :is="Component" :key="route.path" />
					</transition>
				</template>
			</router-view>
		</div>
		<BottomPlayer />
		<Toaster />
	</div>
</template>

<script setup lang="ts">
import NavBar from '@/components/navbar/NavBar.vue'
import BottomPlayer from './components/player/BottomPlayer.vue'
import { Toaster } from '@/components/ui/toast'
import LeftNav from '@/components/navbar/LeftNav.vue'
</script>

<style lang="scss">
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
