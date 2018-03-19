import * as message from './message'

export interface Options {
    iconColor: 'light' | 'dark'
    theme: 'light' | 'dark'
    startupClear: boolean
    useAppBar: boolean
    colorful: boolean
}

const defaults: Options = {
    iconColor: 'light',
    theme: 'light',
    startupClear: false,
    useAppBar: true,
    colorful: true
}

export function getOptions() {
    return new Promise<Options>(resolve =>
        chrome.storage.sync.get(defaults, res => resolve(res as Options))
    )
}

export function getOption<T extends keyof Options>(option: T) {
    const defaultValue = defaults[option]
    return new Promise<Options[T]>(resolve =>
        chrome.storage.sync.get({ [option as string]: defaultValue }, (res: Options) => resolve(res[option]))
    )
}

export function setOptions(data: Options) {
    chrome.storage.sync.set(data)
}

export async function setOption<T extends keyof Options, V extends Options[T]>(key: string, value: V) {
    chrome.storage.sync.set({ [key]: value })
}