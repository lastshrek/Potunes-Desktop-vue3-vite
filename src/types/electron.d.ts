import { App } from 'electron'

declare module 'electron' {
	interface App {
		isQuitting?: boolean
	}
}

interface IpcRendererEvent extends Event {
	sender: any
	senderId: number
}

interface ElectronAPI {
	platform: string
	onTrayControl: (callback: (event: IpcRendererEvent, command: string) => void) => () => void
	updatePlayState: (isPlaying: boolean) => void
	updateLyric: (lyric: string) => void
	updateSongInfo: (info: { title: string; artist: string }) => void
	showUpdateDialog: (version: string, currentVersion: string, url: string) => Promise<void>
	openInBrowser: (url: string) => Promise<void>
}

interface Window {
	electron: ElectronAPI
}
