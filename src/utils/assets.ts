const isDev = import.meta.env.DEV

export const getAssetUrl = (path: string) => {
	if (isDev) {
		return new URL(`../assets/${path}`, import.meta.url).href
	}
	return new URL(`../../dist/assets/${path}`, import.meta.url).href
}

export const getImageUrl = (name: string) => getAssetUrl(`images/${name}`)
export const getFontUrl = (name: string) => getAssetUrl(`fonts/${name}`)
export const getCssUrl = (name: string) => getAssetUrl(`css/${name}`)
