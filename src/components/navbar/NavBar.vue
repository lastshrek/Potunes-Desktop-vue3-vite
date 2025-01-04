<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-01 21:16:34
 * @LastEditors  : lastshrek
 * @LastEditTime : 2025-01-04 12:08:07
 * @FilePath     : /src/components/navbar/NavBar.vue
 * @Description  : 
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-01 21:16:34
-->
<template>
	<div class="fixed top-0 left-0 w-full h-14 z-50 bg-black shadow-md" style="-webkit-app-region: drag">
		<div class="container mx-auto flex items-center justify-between px-4 h-full">
			<!-- navigator button -->
			<div class="flex items-center pl-20 space-x-2" style="-webkit-app-region: no-drag">
				<Button variant="link" size="icon" @click="go('back')">
					<ChevronLeft class="w-6 h-6" />
				</Button>
				<Button variant="link" size="icon" @click="go('forward')">
					<ChevronRight class="w-6 h-6" />
				</Button>
			</div>

			<!-- middle navigator -->
			<div
				class="w-full max-w-md mx-auto absolute left-1/2 -translate-x-1/2 flex justify-center"
				style="-webkit-app-region: no-drag"
			>
				<Tabs v-model="currentTab">
					<TabsList class="gap-4">
						<TabsTrigger value="home">Home</TabsTrigger>
						<TabsTrigger value="trends">Trends</TabsTrigger>
						<TabsTrigger value="feature">Feature</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<!-- user profile -->
			<div class="relative z-10" style="-webkit-app-region: no-drag">
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const neteaseUser = ref({}) as any
const isUserExist = ref(false)
const isNeteaseLogin = ref(false)
const currentTab = ref('home')

// 监听 currentTab 的变化
watch(currentTab, newValue => {
	console.log('Tab changed to:', newValue)
	router.push({ name: newValue }).catch(err => {
		console.error('Navigation failed:', err)
	})
})

// 监听路由变化
watch(
	() => route.name,
	newName => {
		if (typeof newName === 'string') {
			console.log('Route changed to:', newName)
			currentTab.value = newName.toLowerCase()
		}
	},
	{ immediate: true }
)

// 返回前进按钮
const go = (where: string) => {
	console.log('go', where)
	if (where === route.path) return

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

const showProfile = () => {
	console.log('show profile')
}
</script>
