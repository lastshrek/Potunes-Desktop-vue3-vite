/*
 * @Author: lastshrek
 * @Date: 2023-06-20 22:20:53
 * @LastEditors: lastshrek
 * @LastEditTime: 2023-06-20 22:37:08
 * @Description:
 * @FilePath: /potunes-desktop-vue3-vite/electron/main.ts
 */
import { app, BrowserWindow, ipcMain, Tray, nativeImage } from 'electron'
import path from 'node:path'

let win: BrowserWindow | null = null
let previousTray: Tray | null = null
let playTray: Tray | null = null
let nextTray: Tray | null = null
let appTray: Tray | null = null
let lyricsTray: Tray | null = null
let animationTimer: NodeJS.Timeout | null = null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
let currentPosition = 0

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

// 创建菜单栏控制按钮
const createMenuBarControls = () => {
	if (process.platform !== 'darwin') return

	// 先清理已存在的托盘图标
	cleanupTrayIcons()

	try {
		const createTemplateImage = (imageName: string) => {
			const icon = nativeImage.createFromPath(
				path.join(__dirname, `../src/assets/images/menubar/${imageName}-template.png`)
			)
			// 确保图标是模板图像
			icon.setTemplateImage(true)
			// 调整图标大小并保持图标清晰
			return icon.resize({
				width: 18,
				height: 18,
				quality: 'best',
			})
		}

		// 创建应用图标（放在最右边，最先创建）
		const appIcon = nativeImage.createFromPath(path.join(__dirname, '../src/assets/images/menubar/app-template.png'))
		appIcon.setTemplateImage(true)
		appTray = new Tray(appIcon.resize({ width: 18, height: 18, quality: 'best' }))
		appTray.setToolTip('PoTunes')
		appTray.setTitle('') // 应用图标不显示文字
		appTray.on('click', () => {
			if (win) {
				if (win.isVisible()) {
					win.focus()
				} else {
					win.show()
				}
			}
		})

		// 创建下一首按钮
		nextTray = new Tray(createTemplateImage('next'))
		nextTray.setToolTip('下一首')
		nextTray.on('click', () => {
			win?.webContents.send('tray-control', 'next')
		})

		// 创建播放/暂停按钮
		playTray = new Tray(createTemplateImage('play'))
		playTray.setToolTip('播放/暂停')
		playTray.on('click', () => {
			win?.webContents.send('tray-control', 'play-pause')
		})

		// 创建上一首按钮
		previousTray = new Tray(createTemplateImage('previous'))
		previousTray.setToolTip('上一首')
		previousTray.on('click', () => {
			win?.webContents.send('tray-control', 'previous')
		})

		// 创建歌词显示托盘（放在最左侧，最后创建）
		const emptyIcon = nativeImage.createFromPath(
			path.join(__dirname, '../src/assets/images/menubar/empty-template.png')
		)
		emptyIcon.setTemplateImage(true)
		lyricsTray = new Tray(emptyIcon.resize({ width: 18, height: 18, quality: 'best' }))
		lyricsTray.setToolTip('歌词')
		// 设置初始空白标题
		lyricsTray.setTitle('')

		// 设置图标位置，使其紧密排列
		nextTray.setTitle('') // 控制按钮之间不留间距
		playTray.setTitle('')
		previousTray.setTitle('')

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
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js'),
			webSecurity: false,
		},
	})

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
		// 在开发环境下打开开发者工具
		win.webContents.openDevTools()
	} else {
		win.loadFile(path.join(__dirname, '../../dist/index.html'))
	}

	win.on('closed', () => {
		win = null
	})
}

// 监听播放状态变化
ipcMain.on('update-play-state', (_, isPlaying: boolean) => {
	if (!playTray) return

	try {
		const icon = nativeImage.createFromPath(
			path.join(__dirname, `../src/assets/images/menubar/${isPlaying ? 'pause' : 'play'}-template.png`)
		)
		icon.setTemplateImage(true)
		playTray.setImage(
			icon.resize({
				width: 18,
				height: 18,
				quality: 'best',
			})
		)
	} catch (error) {
		console.error('更新播放状态图标失败:', error)
	}
})

// 监听歌词变化
ipcMain.on('update-lyric', (_, lyric: string) => {
	if (!lyricsTray) {
		console.log('lyricsTray 不存在')
		return
	}

	console.log('收到原始歌词:', lyric)

	// 如果没有歌词，显示空白
	if (!lyric || lyric === 'undefined' || lyric === 'null' || lyric === '[object Object]') {
		console.log('歌词为空或无效')
		lyricsTray.setTitle('')
		return
	}

	// 移除时间标记和首尾空白字符
	const cleanLyric = lyric
		.replace(/\[\d{2}:\d{2}\.\d{1,3}\]/g, '') // 支持 1-3 位毫秒 [00:27.46] 或 [00:27.462]
		.replace(/\[\d{2}:\d{2}\]/g, '') // [00:27]
		.replace(/\【\d{2}:\d{2}\.\d{1,3}\】/g, '') // 【00:27.462】
		.trim()

	console.log('清理后的歌词:', cleanLyric)

	// 如果清理后没有内容，显示空白
	if (!cleanLyric || cleanLyric.length === 0) {
		console.log('清理后歌词为空')
		lyricsTray.setTitle('')
		return
	}

	// 如果歌词长度小于等于最大长度，直接显示
	const maxLength = 60
	if (cleanLyric.length <= maxLength) {
		console.log('显示完整歌词:', cleanLyric)
		lyricsTray.setTitle(cleanLyric)
		return
	}

	// 在歌词后面加上空格，只滚动一次
	const scrollText = cleanLyric + '     '

	// 重置当前位置
	currentPosition = 0

	// 创建滚动效果
	let lastTime = Date.now()
	const scrollSpeed = 0.01 // 降低滚动速度

	const updateScroll = () => {
		if (!lyricsTray) {
			if (animationTimer) {
				clearTimeout(animationTimer)
				animationTimer = null
			}
			return
		}

		const currentTime = Date.now()
		const deltaTime = currentTime - lastTime
		lastTime = currentTime

		currentPosition += scrollSpeed * deltaTime

		// 当滚动到末尾时停止
		if (currentPosition >= cleanLyric.length) {
			if (animationTimer) {
				clearTimeout(animationTimer)
				animationTimer = null
			}
			return
		}

		const displayText = scrollText.substring(currentPosition, currentPosition + maxLength)
		console.log('显示滚动歌词:', displayText)
		lyricsTray.setTitle(displayText)

		// 使用 setTimeout 来模拟 requestAnimationFrame
		animationTimer = setTimeout(updateScroll, 16) // 约60fps
	}

	// 启动动画
	if (animationTimer) {
		clearTimeout(animationTimer)
		animationTimer = null
	}
	updateScroll()
})

// 监听歌曲信息变化
ipcMain.on('update-song-info', (_, { title, artist }: { title: string; artist: string }) => {
	if (!lyricsTray) return

	// 如果没有歌曲信息，显示空白
	if (!title && !artist) {
		lyricsTray.setTitle('')
		return
	}

	// 限制标题长度，防止太长
	const maxLength = 60
	const songInfo = `${title} - ${artist}`
	const displayText = songInfo.length > maxLength ? songInfo.slice(0, maxLength) + '...' : songInfo

	// 只有在没有正在显示歌词时才显示歌曲信息
	if (!lyricsTray.getTitle()) {
		lyricsTray.setTitle(displayText)
	}
})

app.on('ready', () => {
	createWindow()
	// 等待一会儿再创建托盘图标
	setTimeout(createMenuBarControls, 1000)
})

app.on('window-all-closed', () => {
	cleanupTrayIcons()
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (!win) {
		createWindow()
	}
})

app.on('before-quit', () => {
	cleanupTrayIcons()
})
