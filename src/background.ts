/// <reference path='../node_modules/@types/chrome/index.d.ts' />
import * as options from './helpers/options'
import * as downloads from './helpers/downloads'
import * as toolbarIcon from './helpers/toolbar-icon'
import { onMessageReceived, MessageType } from './helpers/messages'

options.getStartupClear().then((res: boolean) => res && downloads.clear())

// Disable download bar
chrome.downloads.setShelfEnabled(false)

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

	let receivedBytes = 0
	let totalBytes = 0
	let unseenCount = 0

	items.forEach(item => {
		receivedBytes += item.bytesReceived
		totalBytes += item.totalBytes
		// Increment if false (=1)
		unseenCount += +!seen.has(item.id)
	})

	const progress = receivedBytes / totalBytes
	toolbarIcon.setIcon(progress)
	toolbarIcon.setBadge(unseenCount)
}

function refresh() {
	chrome.downloads.search({ state: 'in_progress', paused: false }, refreshToolbarIcon)
}

chrome.downloads.onCreated.addListener(refresh)
chrome.downloads.onChanged.addListener(delta => (delta.state || delta.paused) && refresh())
onMessageReceived(MessageType.UpdateIcon, () => toolbarIcon.updateColor().then(refresh))
onMessageReceived(MessageType.SetSeen, (items: number[]) => items.forEach(x => seen.add(x)))

toolbarIcon.updateColor().then(refresh)