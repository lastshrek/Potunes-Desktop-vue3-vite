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
						}
						return `assets/${extType}/[name]-[hash][extname]`
					}
					return 'assets/[name]-[hash][extname]'
				},
			},
		},
		assetsInlineLimit: 4096,
		chunkSizeWarningLimit: 1000,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg', '**/*.gif', '**/*.woff2'],
		copyPublicDir: true,
	},
	publicDir: 'src/assets',
} as UserConfig

// 导出配置
export default defineConfig(config)
