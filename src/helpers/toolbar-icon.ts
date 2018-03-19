import * as options from './options'

const canvas = document.createElement('canvas')
canvas.width = 38
canvas.height = 38

const ctx = canvas.getContext('2d')

const scale = (window.devicePixelRatio < 2) ? 0.5 : 1
const size = scale * 38

ctx.scale(scale, scale)

let color = '#5e5e5e'

/**
 * Generate toolbar icon with progress bar beneath it
 * @param progress process in percent [0, 1]
 */
function getProgressIcon(progress: number) {
    const w = progress * 38

    ctx.clearRect(0, 0, 38, 38)

    ctx.lineWidth = 2
    ctx.fillStyle = '#b0b0b0'
    ctx.fillRect(0, 28, 38, 12)

    ctx.fillStyle = color
    ctx.fillRect(0, 28, w, 12)

    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.moveTo(20, 0)
    ctx.lineTo(20, 14)
    ctx.stroke()

    ctx.moveTo(6, 10)
    ctx.lineTo(34, 10)
    ctx.lineTo(20, 24)
    ctx.fill()

    const icon: any = { imageData: {} }
    icon.imageData[size] = ctx.getImageData(0, 0, size, size)
    return icon as chrome.browserAction.TabIconDetails
}

/**
 * Generate standard toolbar icon
 */
function getIcon() {
    console.log(color)
    ctx.clearRect(0, 0, 38, 38)

    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.moveTo(20, 2)
    ctx.lineTo(20, 18)
    ctx.stroke()

    ctx.moveTo(0, 18)
    ctx.lineTo(38, 18)
    ctx.lineTo(20, 38)
    ctx.fill()

    const icon: any = { imageData: {} }
    icon.imageData[size] = ctx.getImageData(0, 0, size, size)
    return icon as chrome.browserAction.TabIconDetails
}

/**
 * Update color based on whether dark mode is used or not
 */
export async function updateColor() {
    color = (await options.getOption('iconColor')) === 'dark' ? '#d8d8d8' : '#5e5e5e'
}

/**
 * Set toolbar icon (browser action)
 * @param progress progress for loading bar (optional)
 */
export function setIcon(progress?: number) {
    chrome.browserAction.setIcon(progress === undefined ? getIcon() : getProgressIcon(progress))
}

/**
 * Set toolbar icon badge (browser action badge)
 * @param count number to be displayed on the badge (optional)
 */
export function setBadge(count = 0) {
    chrome.browserAction.setBadgeText({ text: '' + (count === 0 ? '' : count) })
	chrome.browserAction.setBadgeBackgroundColor({ color: '#666666' })
}