import { createApp } from 'vue'

import './style.css'
// tailwind
import '@/assets/css/main.css'
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
createApp(App)
	.use(pinia)
	.use(router)
	.use(LoadingPlugin)
	.use(VueLazyLoad, {})
	.mount('#app')
	.$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'))
