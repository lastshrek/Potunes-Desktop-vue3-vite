/*
 * @Author: lastshrek
 * @Date: 2023-06-20 22:20:53
 * @LastEditors: lastshrek
 * @LastEditTime: 2023-06-20 22:37:08
 * @Description:
 * @FilePath: /potunes-desktop-vue3-vite/electron/main.ts
 */
import { app, BrowserWindow, ipcMain, Tray, nativeImage, globalShortcut, Menu, session } from 'electron'
import path from 'node:path'
import type {} from '../types/global'

// 扩展 app 对象
interface ExtendedApp extends Electron.App {
	isQuitting?: boolean
}

// 将 app 转换为扩展类型
const extendedApp = app as ExtendedApp

let win: BrowserWindow | null = null
let previousTray: Tray | null = null
let playTray: Tray | null = null
let nextTray: Tray | null = null
let appTray: Tray | null = null
let lyricsTray: Tray | null = null
let animationTimer: NodeJS.Timeout | null = null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
let currentSongTitle = ''
let lastLyricText = ''
let lastCoverUrl = ''
let appIconPath = ''
let lastQuitTime = 0
let quitHintTimer: NodeJS.Timeout | null = null
const isDev = process.env.NODE_ENV === 'development'

const version = '2.1.0'
Object.defineProperty(globalThis, '__APP_VERSION__', {
	value: version,
	writable: false,
})

// 清理所有托盘图标
const cleanupTrayIcons = () => {
	if (animationTimer) {
		clearTimeout(animationTimer)
		animationTimer = null
	}

	if (previousTray) {
		previousTray.destroy()
		previousTray = null
	}
	if (playTray) {
		playTray.destroy()
		playTray = null
	}
	if (nextTray) {
		nextTray.destroy()
		nextTray = null
	}
	if (appTray) {
		appTray.destroy()
		appTray = null
	}
	if (lyricsTray) {
		lyricsTray.destroy()
		lyricsTray = null
	}
}

// 创建 1x1 透明占位图标（用于纯文字显示的托盘）
function createTextTrayIcon() {
	const TRANSPARENT_PNG =
		'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
	return nativeImage.createFromBuffer(Buffer.from(TRANSPARENT_PNG, 'base64'))
}

// 获取原生图标路径
function getNativeIconPath(name: string) {
	return app.isPackaged
		? path.join(process.resourcesPath, 'dist/assets/menubar', `${name}-template.png`)
		: path.join(__dirname, '../src/assets/images/menubar', `${name}-template.png`)
}

// 创建菜单栏控制按钮
const createMenuBarControls = () => {
	if (process.platform !== 'darwin') return

	cleanupTrayIcons()

	try {
		const emptyIcon = createTextTrayIcon()

		// 歌词/歌曲信息（最左侧）
		lyricsTray = new Tray(emptyIcon)
		lyricsTray.setToolTip('PoTunes')
		lyricsTray.setTitle('')

		// 下一首（置于播放右侧）
		nextTray = new Tray(emptyIcon)
		nextTray.setTitle('▷')
		nextTray.setToolTip('下一首')
		nextTray.on('click', () => {
			win?.webContents.send('tray-control', 'next-track')
		})

		// 播放/暂停
		playTray = new Tray(emptyIcon)
		playTray.setTitle('▶')
		playTray.setToolTip('播放/暂停')
		playTray.on('click', () => {
			win?.webContents.send('tray-control', 'toggle-play')
		})

		// 上一首（置于播放左侧）
		previousTray = new Tray(emptyIcon)
		previousTray.setTitle('◁')
		previousTray.setToolTip('上一首')
		previousTray.on('click', () => {
			win?.webContents.send('tray-control', 'prev-track')
		})

		// 应用图标（最右侧，保留原 PNG 图标）
		const appIcon = nativeImage.createFromPath(getNativeIconPath('app'))
		appIcon.setTemplateImage(true)
		appIconPath = getNativeIconPath('app')
		appTray = new Tray(appIcon.resize({ width: 18, height: 18, quality: 'best' }))
		appTray.setToolTip('PoTunes')
		appTray.on('click', () => {
			if (win) {
				if (win.isVisible()) {
					win.focus()
				} else {
					win.show()
				}
			}
		})

		return playTray
	} catch (error) {
		console.error('创建托盘图标失败:', error)
		cleanupTrayIcons()
		return null
	}
}

function createWindow() {
	if (win) return

	win = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 1200,
		minHeight: 800,
		frame: process.platform !== 'darwin',
		titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
		trafficLightPosition: { x: 12, y: 22 },
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	})

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		win.loadURL(`file://${path.join(app.getAppPath(), 'dist/index.html')}#/`)
	}

	// 开发环境打开开发者工具
	if (process.env.NODE_ENV === 'development') {
		win.webContents.openDevTools()
	}

	// 监听窗口关闭事件
	win.on('close', event => {
		// 如果是通过 Command+Q 触发的关闭，让它直接关闭
		if (extendedApp.isQuitting) {
			return
		}

		if (process.platform === 'darwin') {
			// 在 macOS 上阻止默认关闭行为
			event.preventDefault()
			handleWindowClose()
		}
	})

	// 监听窗口焦点变化
	win.on('focus', () => {
		registerShortcuts()
	})

	win.on('blur', () => {
		unregisterShortcuts()
	})
}

// 点击托盘图标时显示窗口
const showWindow = () => {
	if (win) {
		win.show()
		win.focus()
	} else {
		createWindow()
	}
}

// 创建应用菜单
const createMenu = () => {
	const template = [
		{
			label: app.name,
			submenu: [
				{ role: 'about' },
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideOthers' },
				{ role: 'unhide' },
				{ type: 'separator' },
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click: () => {
						const now = Date.now()
						if (now - lastQuitTime <= 1000) {
							// 第二次按下 → 退出
							if (quitHintTimer) {
								clearTimeout(quitHintTimer)
								quitHintTimer = null
							}
							lastQuitTime = 0
							win?.webContents.send('hide-quit-hint')
							extendedApp.isQuitting = true
							cleanupTrayIcons()
							app.quit()
						} else {
							// 第一次按下 → 显示提示
							lastQuitTime = now
							win?.webContents.send('show-quit-hint')
							quitHintTimer = setTimeout(() => {
								quitHintTimer = null
								lastQuitTime = 0
								win?.webContents.send('hide-quit-hint')
							}, 3000)
						}
					},
				},
			],
		},
		{
			label: 'Edit',
			submenu: [
				{ role: 'undo' },
				{ role: 'redo' },
				{ type: 'separator' },
				{ role: 'cut' },
				{ role: 'copy' },
				{ role: 'paste' },
				{ role: 'selectAll' },
			],
		},
		{
			label: 'Window',
			submenu: [{ role: 'minimize' }, { role: 'zoom' }, { type: 'separator' }, { role: 'front' }],
		},
	]

	Menu.setApplicationMenu(Menu.buildFromTemplate(template as any))
}

app.on('ready', () => {
	// 设置 Content-Security-Policy（宽松策略以支持网易云等外部资源）
	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': [
					"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src * data: blob:; media-src *; font-src 'self' data:; connect-src * http://localhost:* ws://localhost:*",
				],
			},
		})
	})

	createWindow()
	createMenu() // 创建应用菜单
	// 等待一会儿再创建托盘图标
	setTimeout(() => {
		const tray = createMenuBarControls()
		if (tray) {
			tray.on('click', showWindow)
		}
	}, 1000)

	// Command+Q 已由菜单加速器处理（双击退出）
	// Command+W 在窗口聚焦时注册
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		cleanupTrayIcons()
		app.quit()
	}
})

// 处理 dock 图标点击
app.on('activate', () => {
	if (win) {
		win.show()
	} else {
		createWindow()
	}
})

app.on('before-quit', () => {
	if (quitHintTimer) {
		clearTimeout(quitHintTimer)
		quitHintTimer = null
	}
	// 标记应用正在退出
	extendedApp.isQuitting = true
	// 注销所有快捷键
	globalShortcut.unregisterAll()
	// 清理托盘图标
	cleanupTrayIcons()
})

// 确保在应用退出时清理资源
app.on('will-quit', () => {
	// 注销所有快捷键
	globalShortcut.unregisterAll()
})

// 监听播放状态变化
ipcMain.on('update-play-state', (_, isPlaying: boolean) => {
	if (!playTray) return
	playTray.setTitle(isPlaying ? '⏸' : '▶')
})

// 确保文本不含换行
const sanitizeTitle = (s: string) => s.replace(/[\r\n]+/g, ' ')

// 滚动歌词
function startMarquee(text: string) {
	if (!lyricsTray) return
	text = sanitizeTitle(text)

	if (animationTimer) {
		clearTimeout(animationTimer)
		animationTimer = null
	}

	if (text.length <= 50) {
		lyricsTray.setTitle(text)
		return
	}

	const displayWidth = 48
	const padding = '     '
	const scrollText = text + padding
	const HOLD_START = 1800
	const HOLD_END = 1200
	const STEP_MS = 80
	let position = 0
	let phase: 'hold-start' | 'scroll' | 'hold-end' = 'hold-start'
	let holdStart = Date.now()

	lyricsTray.setTitle(text.slice(0, displayWidth))

	function tick() {
		if (!lyricsTray) return

		if (phase === 'hold-start') {
			if (Date.now() - holdStart >= HOLD_START) {
				phase = 'scroll'
			}
			animationTimer = setTimeout(tick, STEP_MS)
			return
		}

		if (phase === 'hold-end') {
			if (Date.now() - holdStart >= HOLD_END) {
				position = 0
				phase = 'hold-start'
				holdStart = Date.now()
				lyricsTray.setTitle(text.slice(0, displayWidth))
			}
			animationTimer = setTimeout(tick, STEP_MS)
			return
		}

		position += 2

		if (position + displayWidth >= scrollText.length) {
			lyricsTray.setTitle(scrollText.slice(position))
			phase = 'hold-end'
			holdStart = Date.now()
		} else {
			lyricsTray.setTitle(scrollText.slice(position, position + displayWidth))
		}

		animationTimer = setTimeout(tick, STEP_MS)
	}

	animationTimer = setTimeout(tick, HOLD_START)
}

// 监听歌词变化
ipcMain.on('update-lyric', (_, lyric: string) => {
	if (!lyricsTray) return

	const cleanLyric = lyric
		.replace(/\[\d{2}:\d{2}\.\d{1,3}\]/g, '')
		.replace(/\[\d{2}:\d{2}\]/g, '')
		.replace(/\【\d{2}:\d{2}\.\d{1,3}\】/g, '')
		.replace(/[\r\n]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

	if (cleanLyric === lastLyricText) return

	if (!cleanLyric) {
		if (animationTimer) {
			clearTimeout(animationTimer)
			animationTimer = null
		}
		lastLyricText = ''
		if (currentSongTitle) {
			lyricsTray.setTitle(currentSongTitle.length > 50 ? currentSongTitle.slice(0, 50) + '...' : currentSongTitle)
		} else {
			lyricsTray.setTitle('')
		}
		return
	}

	lastLyricText = cleanLyric
	startMarquee(cleanLyric)
})

// 更新专辑封面到状态栏图标
async function updateAppTrayCover(coverUrl: string) {
	if (!appTray) return
	if (coverUrl === lastCoverUrl) return
	lastCoverUrl = coverUrl

	if (!coverUrl) {
		const img = nativeImage.createFromPath(appIconPath)
		img.setTemplateImage(true)
		appTray.setImage(img.resize({ width: 18, height: 18, quality: 'best' }))
		return
	}

	try {
		const res = await fetch(coverUrl)
		const buf = Buffer.from(await res.arrayBuffer())
		const img = nativeImage.createFromBuffer(buf)
		img.setTemplateImage(true)
		appTray.setImage(img.resize({ width: 18, height: 18, quality: 'best' }))
	} catch {
		const img = nativeImage.createFromPath(appIconPath)
		img.setTemplateImage(true)
		appTray.setImage(img.resize({ width: 18, height: 18, quality: 'best' }))
	}
}

// 监听歌曲信息变化
ipcMain.on('update-song-info', (_, { title, artist, cover_url }: { title: string; artist: string; cover_url?: string }) => {
	if (!lyricsTray) return

	if (!title && !artist) {
		currentSongTitle = ''
		lastCoverUrl = ''
		updateAppTrayCover('')
		if (lyricsTray.getTitle() === '' || !lyricsTray.getTitle()) {
			lyricsTray.setTitle('')
		}
		return
	}

	currentSongTitle = sanitizeTitle(`${title} - ${artist}`)
	lastLyricText = ''

	updateAppTrayCover(cover_url || '')

	if (!lyricsTray.getTitle()) {
		const displayText = sanitizeTitle(currentSongTitle.length > 50 ? currentSongTitle.slice(0, 50) + '...' : currentSongTitle)
		lyricsTray.setTitle(displayText)
	}
})

// 添加退出应用的方法
ipcMain.on('quit-app', () => {
	cleanupTrayIcons()
	app.quit()
})

// 渲染层点击"退出"按钮确认退出
ipcMain.on('confirm-quit', () => {
	if (quitHintTimer) {
		clearTimeout(quitHintTimer)
		quitHintTimer = null
	}
	lastQuitTime = 0
	extendedApp.isQuitting = true
	cleanupTrayIcons()
	app.quit()
})

// 处理窗口关闭
const handleWindowClose = () => {
	console.log('handleWindowClose 被调用，平台:', process.platform)
	if (process.platform === 'darwin') {
		// macOS 上点击关闭按钮时只隐藏窗口
		if (win) {
			console.log('macOS: 隐藏窗口')
			win.hide()
		}
	} else {
		// 其他平台直接退出应用
		console.log('非 macOS: 退出应用')
		cleanupTrayIcons()
		app.quit()
	}
}

// 注册快捷键
function registerShortcuts() {
	// Cmd+Q 已由菜单加速器统一处理
	globalShortcut.register('CommandOrControl+W', () => {
		if (win) win.hide()
	})
}

// 注销快捷键
function unregisterShortcuts() {
	globalShortcut.unregister('CommandOrControl+Q')
	globalShortcut.unregister('CommandOrControl+W')
}
