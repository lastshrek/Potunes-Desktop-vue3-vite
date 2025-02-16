import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'
import { join } from 'path'
import { readFileSync } from 'fs'

// 读取 package.json
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)).toString())

export default defineConfig(({ command, mode }) => {
	const isElectronBuild = mode === 'electron'

	return {
		mode: process.env.NODE_ENV,
		plugins: [
			vue(),
			...(isElectronBuild
				? [
						electron([
							{
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
				  ]
				: []),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'~@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		base: mode === 'electron' ? './' : '/',
		build: {
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ['vue', 'vue-router', 'pinia'],
						ui: ['@headlessui/vue', 'radix-vue'],
					},
					assetFileNames: assetInfo => {
						if (assetInfo.name) {
							const info = assetInfo.name.split('.')
							let extType = info[info.length - 1]
							if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
								extType = 'media'
							} else if (/\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(assetInfo.name)) {
								extType = 'images'
							} else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
								extType = 'fonts'
							} else if (/\.(css|scss)(\?.*)?$/i.test(assetInfo.name)) {
								extType = 'css'
							}
							return `assets/${extType}/[name]-[hash][extname]`
						}
						return 'assets/[name]-[hash][extname]'
					},
				},
			},
			assetsDir: 'assets',
			assetsInlineLimit: 4096,
			chunkSizeWarningLimit: 1000,
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true,
				},
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `
						@use "sass:math";
						@import "@/assets/css/variables.scss";
					`,
				},
			},
		},
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version),
		},
		html: {
			templateParameters: {
				mode: mode,
			},
		},
	}
})
