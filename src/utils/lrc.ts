export interface LrcLine {
	time: number
	text: string
}

const LRC_LINE_RE = /\[(\d{2}):(\d{2})\.(\d{1,3})\](.*)/

export function parseLrc(lrcText: string): LrcLine[] {
	if (!lrcText) return []
	const lines = lrcText.split('\n')
	const result: LrcLine[] = []

	for (const line of lines) {
		const match = line.trim().match(LRC_LINE_RE)
		if (match) {
			const minutes = parseInt(match[1])
			const seconds = parseInt(match[2])
			const milliseconds = parseInt(match[3])
			result.push({
				time: minutes * 60 + seconds + milliseconds / 1000,
				text: match[4].trim(),
			})
		}
	}

	return result
}

export function getCurrentLyricText(lrcText: string, time: number): string {
	const lines = parseLrc(lrcText)
	let currentText = ''
	for (const line of lines) {
		if (time >= line.time) {
			currentText = line.text
		} else {
			break
		}
	}
	return currentText
}
