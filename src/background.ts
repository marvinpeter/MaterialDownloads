/// <reference path='../node_modules/@types/chrome/index.d.ts' />
import * as message from './helpers/message'
import * as toolbarIcon from './helpers/toolbar-icon'

// Disable download bar
chrome.downloads.setShelfEnabled(false)

// tslint:disable-next-line:no-let
let timer: NodeJS.Timer
const seen = new Set<number>()

function refreshToolbarIcon(items: chrome.downloads.DownloadItem[]) {
	if (!items.length) {
		clearInterval(timer)
		timer = null
		toolbarIcon.setIcon()
		toolbarIcon.setBadge()
		return
	}

	if (!timer) {
		timer = setInterval(refresh, 500) as any
	}

	const [receivedBytes, totalBytes, unseenCount] = items.reduce(([receivedBytes, totalBytes, unseenCount], item) => [
		receivedBytes + item.bytesReceived,
		totalBytes + item.totalBytes,

		// Increment if false (=1)
		unseenCount + +!seen.has(item.id)
	], [0, 0, 0])

	const progress = receivedBytes / totalBytes
	toolbarIcon.setIcon(progress)
	toolbarIcon.setBadge(unseenCount)
}

function refresh() {
	chrome.downloads.search({ state: 'in_progress', paused: false }, refreshToolbarIcon)
}

chrome.downloads.onCreated.addListener(refresh)
chrome.downloads.onChanged.addListener(delta => (delta.state || delta.paused) && refresh())
message.on(message.Type.UpdateIcon, () => toolbarIcon.updateColor().then(refresh))
message.on(message.Type.SetSeen, (items: number[]) => items.forEach(x => seen.add(x)))

toolbarIcon.updateColor().then(refresh)