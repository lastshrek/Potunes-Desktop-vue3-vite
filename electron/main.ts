/*
 * @Author: lastshrek
 * @Date: 2023-06-20 22:20:53
 * @LastEditors: lastshrek
 * @LastEditTime: 2023-06-20 22:37:08
 * @Description:
 * @FilePath: /potunes-desktop-vue3-vite/electron/main.ts
 */
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: false,
		},
		width: 1080,
		height: 700,
		frame: false,
		resizable: false,
		titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
		backgroundColor: '#000000',

		trafficLightPosition: { x: 20, y: 24 },
	})

	// if (process.platform === 'darwin') {
	// 	app.dock.setIcon(path.join(process.env.PUBLIC, 'electron-vite.svg'))
	// }

	if (VITE_DEV_SERVER_URL) {
		win.webContents.openDevTools()
	}

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString())
	})

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(process.env.DIST, 'index.html'))
	}

	// 处理窗口控制事件
	ipcMain.on('window-minimize', () => {
		win?.minimize()
	})

	ipcMain.on('window-maximize', () => {
		if (win?.isMaximized()) {
			win?.unmaximize()
		} else {
			win?.maximize()
		}
	})

	ipcMain.on('window-close', () => {
		win?.close()
	})
}

app.on('window-all-closed', () => {
	win = null
})

app.whenReady().then(createWindow)
