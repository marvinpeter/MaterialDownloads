/**
 * Convert number of bytes to a formated string
 * @param bytes number of bytes
 */
export function byte(bytes: number) {
	if (!bytes) { return '0 B' }
	if (bytes < 1000 * 1000) { return (bytes / 1000).toFixed() + ' KB' }
	if (bytes < 1000 * 1000 * 10) { return (bytes / 1000 / 1000).toFixed(1) + ' MB' }
	if (bytes < 1000 * 1000 * 1000) { return (bytes / 1000 / 1000).toFixed() + ' MB' }
	if (bytes < 1000 * 1000 * 1000 * 1000) { return (bytes / 1000 / 1000 / 1000).toFixed(1) + ' GB' }
	return bytes + ' B'
}

/**
 * Convert seconds to formated time string
 * @param s number of seconds
 */
export function time(s) {
	if (s < 60) { return Math.ceil(s) + ' secs' }
	if (s < 60 * 5) { return `${Math.floor(s / 60)} mins ${Math.ceil(s % 60)} secs` }
	if (s < 60 * 60) { return Math.ceil(s / 60) + ' mins' }
	if (s < 60 * 60 * 5) { return `${Math.floor(s / 60 / 60)} hours ${(Math.ceil(s / 60) % 60)} mins` }
	if (s < 60 * 60 * 24) { return Math.ceil(s / 60 / 60) + ' hours' }
	return Math.ceil(s / 60 / 60 / 24) + ' days'
}