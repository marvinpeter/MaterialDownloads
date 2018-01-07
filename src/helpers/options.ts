const defaults = {
    iconColor: 'light',
    startupClear: false
}

export default class Settings {
    public static setOptions(data: { [key: string]: any }) {
        return new Promise<void>(resolve => chrome.storage.sync.set(data, () => resolve()))
    }

    public static setOption<T>(key: string, value: T) {
        return Settings.setOptions({ [key]: value })
    }
    
    public static getOptions<T extends { [key: string]: any }>(data: T) {
        return new Promise<T>(resolve => chrome.storage.sync.get(data, res => resolve(res as T)))
    }

    public static async getOption<T>(key: string, defaultValue?: T) {
        return (await Settings.getOptions({ [key]: defaultValue }))[key] as T
    }

    public static get all() {
        return Settings.getOptions(defaults)
    }

    public static get iconColor() {
        return Settings.getOption('iconColor', defaults.iconColor)
    }

    public static set iconColor(value: any) {
        Settings.setOption('iconColor', value)
    }

    public static get startupClear() {
        return Settings.getOption('startupClear', defaults.startupClear)
    }

    public static set startupClear(value: any) {
        Settings.setOption('startupClear', value)
    }
}



