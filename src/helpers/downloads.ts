function queryDownloads(query: chrome.downloads.DownloadQuery = {}) {
    return new Promise<chrome.downloads.DownloadItem[]>(resolve =>
        chrome.downloads.search(query, res => resolve(res))
    )
}

/**
 * Remove all completed download from download history
 */
export async function clear() {
    (await queryDownloads())
        .filter(x => x.state !== 'in_progress')
        .forEach(x => chrome.downloads.erase({ id: x.id }, undefined))
}

/**
 * Get a download item from Chrome
 * @param id download item ID
 */
export async function fetch(id: number) {
    const downloads = await queryDownloads({ id })
    return downloads.length > 0 ? downloads[0] : undefined
}

/**
 * Get all download items from Chrome
 */
export async function fetchAll() {
    return (await queryDownloads({ orderBy: ['-startTime'], filenameRegex: '.*' })).filter(x => x.filename !== '')
}

/**
 * Get all downloads from Chrome, but return only the IDs
 */
export async function fetchIds() {
    return (await fetchAll()).map(x => x.id)
}

export type Action = 'pause' | 'cancel' | 'resume' | 'retry' | 'show' | 'open' | 'remove' | 'acceptDanger'

/**
 * Execute on action upon an download item
 * @param id download item ID
 * @param action pause, cancel, resume, retry, show or open
 */
export async function action(id: number, action: Action) {
    switch (action) {
        case 'retry':
            return chrome.downloads.download({ url: (await fetch(id)).url }, undefined)
        case 'show':
            return chrome.downloads.show(id)
        case 'open':
            return chrome.downloads.open(id)
        case 'acceptDanger':
            return chrome.downloads.acceptDanger(id, undefined)
        case 'remove':
            return chrome.downloads.erase({ id }, undefined)
        default:
            return chrome.downloads[action](id)
    }
}

/**
 * Get icon for a download item
 * @param id download item ID
 */
export function getIcon(id: number) {
    return new Promise<string>(resolve =>
        chrome.downloads.getFileIcon(id, {}, resolve)
    )
}

/**
 * Get proper filename without the crdownload extension
 * @param item download item
 */
export function getFilename(item: chrome.downloads.DownloadItem) {
    const backArray = item.filename.split('\\')
    const forwardArray = item.filename.split('/')
    const array = backArray.length > forwardArray.length ? backArray : forwardArray
    return array.pop().replace(/.crdownload$/, '')
}