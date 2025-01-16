export {}

declare global {
	var __APP_VERSION__: string
	var __DEV__: boolean
	var __PROD__: boolean
	var __TEST__: boolean
	var resourcesPath: string

	interface Window {
		electron: {
			platform: string
			onTrayControl: (callback: (event: Electron.IpcRendererEvent, command: string) => void) => void
			updatePlayState: (isPlaying: boolean) => void
			updateLyric: (lyric: string) => void
			updateSongInfo: (info: { title: string; artist: string }) => void
			getAssetPath: (path: string) => string
		}
	}
}
