import { createApp } from 'vue'

import '@/assets/css/main.css'
// tailwind
import '@/assets/css/base.scss'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// loading
import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
// pinia
const pinia = createPinia()
// lazy image
import VueLazyLoad from 'vue3-lazyload'
import { Toaster } from '@/components/ui/toast'

createApp(App)
	.use(pinia)
	.use(router)
	.use(LoadingPlugin)
	.use(VueLazyLoad, {})
	.component('Toaster', Toaster)
	.mount('#app')
	.$nextTick(() => {
		// 延迟发送移除加载动画的消息
		setTimeout(() => {
			postMessage({ payload: 'removeLoading' }, '*')
		}, 3000) // 从 5000 改为 3000
	})
