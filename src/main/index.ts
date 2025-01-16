import { app, BrowserWindow, globalShortcut } from 'electron'
import { join } from 'path'

let mainWindow: BrowserWindow | null = null
let lastQuitTime = 0
const QUIT_INTERVAL = 500 // 双击间隔时间（毫秒）
let isAppActive = false
const isDev = process.env.NODE_ENV === 'development'

function createWindow(): void {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === 'linux'
			? {
					icon: join(__dirname, '../../build/icon.png'),
			  }
			: {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	// 加载页面
	if (isDev) {
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL as string)
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
		// 设置资源路径
		global.resourcesPath = isDev ? 'src' : join(process.resourcesPath, 'assets')
	}

	// 监听窗口获得焦点事件
	mainWindow.on('focus', () => {
		isAppActive = true
		registerShortcuts()
	})

	// 监听窗口失去焦点事件
	mainWindow.on('blur', () => {
		isAppActive = false
		unregisterShortcuts()
	})

	// 处理窗口关闭事件
	mainWindow.on('close', event => {
		if (isAppActive) {
			const now = Date.now()
			if (now - lastQuitTime > QUIT_INTERVAL) {
				// 第一次点击，阻止关闭并记录时间
				event.preventDefault()
				lastQuitTime = now
				mainWindow?.hide()
			} else {
				// 第二次点击，允许关闭
				lastQuitTime = 0
			}
		}
	})
}

// 注册快捷键
function registerShortcuts() {
	// 注册 Command+W 快捷键
	globalShortcut.register('CommandOrControl+W', () => {
		if (isAppActive && mainWindow) {
			mainWindow.hide()
		}
	})
}

// 注销快捷键
function unregisterShortcuts() {
	globalShortcut.unregisterAll()
}

// 在应用准备就绪时创建窗口
app.whenReady().then(() => {
	createWindow()
})

// 处理 dock 图标点击
app.on('activate', () => {
	isAppActive = true
	if (mainWindow) {
		mainWindow.show()
	} else {
		createWindow()
	}
})

// 处理所有窗口关闭
app.on('window-all-closed', (event: { preventDefault: () => void }) => {
	if (isAppActive) {
		const now = Date.now()
		if (now - lastQuitTime > QUIT_INTERVAL) {
			// 第一次点击，阻止关闭
			event.preventDefault()
			if (mainWindow) {
				mainWindow.hide()
			}
		} else {
			// 第二次点击，允许关闭
			if (process.platform !== 'darwin') {
				app.quit()
			}
		}
	}
})

// 处理 before-quit 事件
app.on('before-quit', event => {
	if (isAppActive) {
		const now = Date.now()
		if (now - lastQuitTime > QUIT_INTERVAL) {
			// 第一次点击，阻止退出
			event.preventDefault()
			lastQuitTime = now
			mainWindow?.hide()
		}
	}
})

// 应用退出时清理
app.on('will-quit', () => {
	unregisterShortcuts()
})

// 只有在显式调用 app.quit() 时才真正退出应用
process.on('SIGTERM', () => {
	app.quit()
})
