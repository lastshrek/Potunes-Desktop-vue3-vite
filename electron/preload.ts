import { contextBridge, ipcRenderer } from 'electron'

// 暴露 API 到渲染进程
contextBridge.exposeInMainWorld('electron', {
	platform: process.platform,
	onTrayControl: (callback: (event: Electron.IpcRendererEvent, command: string) => void) => {
		ipcRenderer.on('tray-control', callback)
		return () => {
			ipcRenderer.removeListener('tray-control', callback)
		}
	},
	updatePlayState: (isPlaying: boolean) => {
		ipcRenderer.send('update-play-state', isPlaying)
	},
	updateLyric: (lyric: string) => {
		ipcRenderer.send('update-lyric', lyric)
	},
	updateSongInfo: (info: { title: string; artist: string }) => {
		ipcRenderer.send('update-song-info', info)
	},
})

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
	return new Promise(resolve => {
		if (condition.includes(document.readyState)) {
			resolve(true)
		} else {
			document.addEventListener('readystatechange', () => {
				if (condition.includes(document.readyState)) {
					resolve(true)
				}
			})
		}
	})
}

const safeDOM = {
	append(parent: HTMLElement, child: HTMLElement) {
		if (!Array.from(parent.children).find(e => e === child)) {
			parent.appendChild(child)
		}
	},
	remove(parent: HTMLElement, child: HTMLElement) {
		if (Array.from(parent.children).find(e => e === child)) {
			parent.removeChild(child)
		}
	},
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
	const className = `loaders-css__square-spin`
	const styleContent = `
.${className} > div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.${className} img {
  width: 300px;
  height: auto;
  animation: logo-animation 2s cubic-bezier(0.215, 0.61, 0.355, 1);
  animation-fill-mode: forwards;
  opacity: 0;
  transform: scale(0.95);
}

@keyframes logo-animation {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  40% {
    opacity: 0.6;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  z-index: 999999;
}
    `
	const oStyle = document.createElement('style')
	const oDiv = document.createElement('div')

	oStyle.id = 'app-loading-style'
	oStyle.innerHTML = styleContent
	oDiv.className = 'app-loading-wrap'
	oDiv.innerHTML = `<div class="${className}"><div><img src="../src/assets/images/LoginLogoNoBg@3x.png" alt="loading" /></div></div>`

	return {
		appendLoading() {
			safeDOM.append(document.head, oStyle)
			safeDOM.append(document.body, oDiv)
		},
		removeLoading() {
			safeDOM.remove(document.head, oStyle)
			safeDOM.remove(document.body, oDiv)
		},
	}
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
	ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 3000)
