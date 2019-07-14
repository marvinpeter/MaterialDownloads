export type IconColor = "light" | "dark";
export type ThemeColor = "light" | "dark";

export interface Options {
    iconColor: IconColor,
    theme: ThemeColor,
    useAppBar: boolean,
    colorful: boolean,
    downloadTime: boolean,
}

const defaults: Options = {
    iconColor: "light",
    theme: "light",
    useAppBar: true,
    colorful: true,
    downloadTime: false,
};

export const getOptions = () => new Promise<Options>(resolve =>
    chrome.storage.sync.get(defaults, res => resolve(res as Options)));

export const getOption = <T extends keyof Options>(option: T) => new Promise<Options[T]>(resolve =>
    chrome.storage.sync.get({ [option as string]: defaults[option] }, (res: Options) => resolve(res[option])));

export const setOptions = (data: Options) =>
    chrome.storage.sync.set(data);

export const setOption = <T extends keyof Options, V extends Options[T]>(key: string, value: V) =>
    chrome.storage.sync.set({ [key]: value });