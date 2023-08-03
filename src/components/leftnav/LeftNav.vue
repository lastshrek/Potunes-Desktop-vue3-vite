<!--
 * @Author       : lastshrek
 * @Date         : 2023-08-03 23:48:21
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-08-03 23:57:04
 * @FilePath     : /src/components/leftnav/LeftNav.vue
 * @Description  : LeftNav
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-08-03 23:48:21
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import config from '../../../package.json'
// 版本号
const version = config.version
onMounted(() => {})
</script>

<style scoped></style>
<template>
	<div class="h-full p-6 w-[240px] fixed z-50 bg-black">
		<RouterLink to="/">
			<div class="flex items-end">
				<img width="30" src="/images/icons/popo.png" />
				<span class="ml-2 text-base font-bold text-white">破破</span>
				<span class="text-xs ml-2 mb-0.5 font-bold">v{{ version }}</span>
			</div>
		</RouterLink>
		<div class="my-8"></div>
		<ul>
			<RouterLink to="/">
				<MenuItem class="ml-[1px]" :iconSize="23" name="Home" iconString="home" pageUrl="/" />
			</RouterLink>
			<RouterLink to="/search">
				<MenuItem class="ml-[1px]" :iconSize="24" name="Search" iconString="search" pageUrl="/search" />
			</RouterLink>
			<RouterLink to="/library">
				<MenuItem class="ml-[2px]" :iconSize="23" name="Your Library" iconString="library" pageUrl="/library" />
			</RouterLink>
			<div class="py-3.5"></div>
			<MenuItem :iconSize="24" name="Create Playlist" iconString="playlist" pageUrl="/playlist" />
			<MenuItem class="-ml-[1px]" :iconSize="27" name="Liked Songs" iconString="liked" pageUrl="/liked" />
		</ul>
		<div class="border-b border-b-gray-700"></div>
		<ul>
			<li class="font-semibold text-[13px] mt-3 text-gray-300 hover:text-white">My Playlist #1</li>
			<li class="font-semibold text-[13px] mt-3 text-gray-300 hover:text-white">My Playlist #2</li>
			<li class="font-semibold text-[13px] mt-3 text-gray-300 hover:text-white">My Playlist #3</li>
			<li class="font-semibold text-[13px] mt-3 text-gray-300 hover:text-white">My Playlist #4</li>
		</ul>
	</div>
</template>
