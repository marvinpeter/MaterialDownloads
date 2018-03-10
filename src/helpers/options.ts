const defaults = {
    iconColor: 'light',
    startupClear: false
}

function setOptions(data: { [key: string]: any }) {
    return new Promise<void>(resolve => chrome.storage.sync.set(data, () => resolve()))
}

function setOption<T>(key: string, value: T) {
    return setOptions({ [key]: value })
}

function getOptions<T extends { [key: string]: any }>(data: T) {
    return new Promise<T>(resolve => chrome.storage.sync.get(data, res => resolve(res as T)))
}

async function getOption<T>(key: string, defaultValue?: T) {
    return (await getOptions({ [key]: defaultValue }))[key] as T
}

export async function getAll() {
    return getOptions(defaults)
}

export function getIconColor() {
    return getOption('iconColor', defaults.iconColor)
}

export function setIconColor(value: any) {
    setOption('iconColor', value)
}

export function getStartupClear() {
    return getOption('startupClear', defaults.startupClear)
}

export function setStartupClear(value: any) {
    setOption('startupClear', value)
}