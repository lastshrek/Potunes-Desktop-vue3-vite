<template>
	<div>
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
import NavBar from "@/components/navbar/NavBar.vue";
import BottomPlayer from "./components/player/BottomPlayer.vue";
</script>
<style scoped lang="scss"></style>
