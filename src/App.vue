<template>
	<div class="bg-black min-h-screen" id="app">
		<!-- 导航栏可拖拽 -->
		<NavBar />
		<div class="flex">
			<LeftNav />
			<!-- 移除所有过渡动画，直接渲染组件 -->
			<router-view v-slot="{ Component }">
				<keep-alive :include="['Suggestion']">
					<component :is="Component" v-if="$route.meta.keepAlive" />
				</keep-alive>
				<component :is="Component" v-if="!$route.meta.keepAlive" />
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
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
	console.log('App mounted')
})

onUnmounted(() => {
	console.log('App unmounted')
})
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
