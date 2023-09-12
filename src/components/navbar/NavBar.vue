<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-01 21:16:34
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-12 21:08:28
 * @FilePath     : /src/components/navbar/NavBar.vue
 * @Description  : 
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-01 21:16:34
-->
<template>
	<div class="fixed top-0 left-0 bg-black w-full h-14 bar">
		<div class="container mx-auto flex items-center justify-between px-4">
			<!-- navigator button -->
			<div class="flex">
				<ChevronLeftIcon class="h-10 w-10 py-1 px-2 text-2xl rounded-full hover:bg-album-hover" @click="go('back')" />
				<ChevronRightIcon
					class="h-10 w-10 py-1 ml-2 px-2 text-2xl rounded-full hover:bg-album-hover"
					@click="go('forward')"
				/>
			</div>
			<!-- middle navigator -->
			<!-- <div class="flex gap-x-8 mx-auto h-full justify-between items-center">
      <a type="button" class="nav-a" @click="redirect('Home')">
        Home
      </a>
      <a @click="redirect('trends')" type="button" class="nav-a">
        Weekly
        Trends </a>
      <a @click="redirect('feature')" type="button" class="nav-a">
        Implement a Feature</a>      
    </div> -->
			<div class="w-full max-w-md px-2 sm:px-0">
				<TabGroup>
					<TabList class="flex space-x-1 rounded-xl p-1">
						<Tab v-for="(category, index) in categories" as="template" :key="category" v-slot="{ selected }">
							<button
								:class="[
									'w-full rounded-lg py-2.5 text-sm font-bold leading-5 text-white hover:border-pink-400 hover:border-2',
									selected ? 'bg-pink-500 shadow' : 'hover:text-white',
								]"
								@click="tabChange(index)"
							>
								{{ category }}
							</button>
						</Tab>
					</TabList>
				</TabGroup>
			</div>

			<!-- user profile -->
			<div class="">
				<button
					class="hover:bg-albumcardhover text-white py-2 px-4 rounded text-sm"
					@click="go('login')"
					v-if="!isUserExist && !isNeteaseLogin"
				>
					Log In
				</button>
				<button
					class="hover:bg-albumcardhover text-white py-2 px-4 rounded text-sm"
					@click="go('login')"
					v-else-if="isUserExist && !isNeteaseLogin"
				>
					Log In Netease
				</button>
				<div v-else>
					<div class="flex justify-end pr-4 mt-2">
						<p class="text-xs font-semibold text-right text-white" @click="showProfile">
							欢迎你，{{ neteaseUser.nickname }}
						</p>
						<svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<p class="text-xs font-semibold text-right text-white0">{{ neteaseUser.signature }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { TabGroup, TabList, Tab } from '@headlessui/vue'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const neteaseUser = ref({}) as any
const isUserExist = ref(false)
const isNeteaseLogin = ref(false)
// 返回前进按钮
const go = (where: string) => {
	if (where === route.path) return
	if (where === 'back') {
		router.go(-1)
		return
	}
	if (route.path) {
		router.go(1)
	}
	switch (where) {
		case 'back':
			router.go(-1)
			break
		case 'forward':
			router.go(1)
			break
		case 'login':
			router.push({ name: where })
			break
		default:
			break
	}
}

const tabChange = (index: number) => {
	switch (index) {
		case 0:
			router.push({ name: 'Home' })
			break
		case 1:
			router.push({ name: 'trends' })
			break
		case 2:
			router.push({ name: 'feature' })
			break
		default:
			break
	}
}
const categories = ref(['Home', 'Trending', 'Implement'])
const showProfile = () => {
	console.log('show profile')
}
</script>

<style lang="scss" scoped>
// 可以拖动
.bar {
	-webkit-app-region: drag;
}

.nav-a {
	@apply text-sm font-semibold leading-6 text-white;
}

.nav-a:hover {
	@apply underline text-pink-500;
}
</style>
