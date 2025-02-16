// 检测当前运行环境
export const isElectron = () => {
	return window && window.electron !== undefined
}

// 创建一个 mock electron API
export const mockElectron = {
	platform: 'web',
	onTrayControl: () => () => {},
	updatePlayState: () => {},
	updateLyric: () => {},
	updateSongInfo: () => {},
	showUpdateDialog: () => Promise.resolve(),
	openInBrowser: (url: string) => window.open(url, '_blank'),
}

// 获取 electron API
export const getElectronAPI = () => {
	if (isElectron()) {
		return window.electron
	}
	return mockElectron
}
