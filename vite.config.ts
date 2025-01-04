import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { fileURLToPath, URL } from 'node:url'
// https://vitejs.dev/config/
export default defineConfig({
	css: {
		postcss: {
			plugins: [autoprefixer(), tailwind()],
		},
	},
	plugins: [
		vue(),
		electron([
			{
				// Main-Process entry file of the Electron App.
				entry: 'electron/main.ts',
			},
			{
				entry: 'electron/preload.ts',
				onstart(options) {
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
})
