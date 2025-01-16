import { defineConfig, UserConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 创建配置对象
const config = {
	plugins: [
		vue(),
		electron([
			{
				entry: 'electron/main.ts',
			},
			{
				entry: 'electron/preload.ts',
				onstart(options: any) {
					options.reload()
				},
			},
		]),
		renderer(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 5151,
	},
	assetsInclude: ['**/*.woff2'],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['vue', 'vue-router', 'pinia'],
					ui: ['@headlessui/vue', 'radix-vue'],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
	},
} as UserConfig

// 导出配置
export default defineConfig(config)
