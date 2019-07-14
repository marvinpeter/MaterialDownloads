import { updateDownload, setDownloads, addDownload, ReduxAction } from "../actions";
import * as message from "./message";

const emptyImage = "data:image/gifbase64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export enum DownloadStatus {
    Downloading, Completed, Paused, Canceled, Dangerous, Removed,
}

export interface Download extends Readonly<{
    id: number,
    status: DownloadStatus,
    url: string,
    filePath: string,
    fileName: string,
    totalSize: number,
    downloadedSize: number,
    remainingSize: number,
    speed?: number,
    startTime: string,
    endTime?: string,
    estimatedEndTime?: string,
    image?: string,
    remainingSeconds?: number,
    time: Date,
}> { }

const queryDownloads = (query: chrome.downloads.DownloadQuery = {}): Promise<chrome.downloads.DownloadItem[]> =>
    typeof document === "undefined"
        ? Promise.resolve([])
        : new Promise(resolve => chrome.downloads.search(query, res => resolve(res)));

/**
 * Remove all completed download from download history
 */
export const clear = async () =>
    (await queryDownloads())
        .filter(x => x.state !== "in_progress")
        .forEach(x => chrome.downloads.erase({ id: x.id }, undefined));

/**
 * Get a download item from Chrome
 * @param id download item ID
 */
export async function fetch(id: number): Promise<chrome.downloads.DownloadItem> {
    const downloads = await queryDownloads({ id });
    return downloads.length > 0 ? downloads[0] : undefined;
}

/**
 * Get all download items from Chrome
 */
export const fetchAll = async () =>
    (await queryDownloads({ orderBy: ["-startTime"], filenameRegex: ".*" }))
        .filter(x => x.filename !== "");

/**
 * Copy string to clipboard
 * @param str String to copy
 */
export const setClipboard = (str: string) =>
    new Promise<void>(resolve => {
        const doc: any = document;
        const defaultCopy = doc.oncopy;

        // tslint:disable-next-line:no-object-mutation
        doc.oncopy = (event: any) => {
            event.clipboardData.setData("text", str);
            // tslint:disable-next-line:no-object-mutation
            doc.oncopy = defaultCopy;
            resolve();
            event.preventDefault();
        };
        document.execCommand("Copy", false, null);
    });

/**
* Get proper filename without the crdownload extension
* @param filePath File path
*/
function getFilename(filePath: string): string {
    const backArray = filePath.split("\\");
    const forwardArray = filePath.split("/");
    const array = backArray.length > forwardArray.length ? backArray : forwardArray;
    return array.pop().replace(/.crdownload$/, "");
}

/**
 * Get status of download
 * @param item Download item
 */
const getStatus = (item: chrome.downloads.DownloadItem) => {
    if (item.state === "complete") {
        return item.exists ? DownloadStatus.Completed : DownloadStatus.Removed;
    } else if (item.state === "interrupted") {
        return DownloadStatus.Canceled;
    } else if (item.paused) {
        return DownloadStatus.Paused;
    } else {
        return ((item.totalBytes - item.bytesReceived) === 0 && item.danger !== "safer" && item.danger !== "accepted" && item.danger !== "")
            ? DownloadStatus.Dangerous
            : DownloadStatus.Downloading;
    }
};

/**
 * Get the file icon of a download
 * @param id Download id
 */
async function getIcon(id: number): Promise<string> {
    return new Promise<string>(resolve => {
        // tslint:disable-next-line:no-let
        let counter = 0;
        const tryGet = () => {
            chrome.downloads.getFileIcon(id, {}, image => {
                if (chrome.runtime.lastError === undefined || chrome.runtime.lastError.message === undefined) {
                    resolve(image);
                    return;
                } else {
                    if (counter < 4) {
                        counter++;
                        setTimeout(tryGet, 250);
                    } else {
                        resolve(undefined);
                    }
                }
            });
        };
        tryGet();
    });
}

/**
 * Get a partial download object with only the dynamic parts
 * @param id Download Id
 */
export async function updateItem(id: number): Promise<Partial<Download>> {
    const item = await fetch(id);
    const status = getStatus(item);

    const { totalBytes, bytesReceived, endTime, estimatedEndTime } = item;
    const remainingBytes = totalBytes - bytesReceived;

    const remainingSeconds = status === DownloadStatus.Downloading
        ? estimatedEndTime ? ((new Date(estimatedEndTime) as any) - (new Date() as any)) / 1000 : undefined : undefined;
    const speed = status === DownloadStatus.Downloading
        ? remainingSeconds !== undefined ? remainingBytes / remainingSeconds : undefined : undefined;

    return {
        id, status, speed,
        downloadedSize: bytesReceived,
        remainingSize: remainingBytes,
        endTime, estimatedEndTime,
        remainingSeconds: remainingSeconds,
    };
}

/**
 * Convert a Chrome download item into a download object
 * @param item Chrome download item
 */
export function convertDownloadItem(item: chrome.downloads.DownloadItem): Download {
    const { id, url, filename, totalBytes, bytesReceived, startTime, endTime, estimatedEndTime } = item;
    const remainingSeconds = estimatedEndTime ? ((new Date(estimatedEndTime) as any) - (new Date() as any)) / 1000 : undefined;
    const remainingBytes = totalBytes - bytesReceived;
    const speed = remainingSeconds !== undefined ? remainingBytes / remainingSeconds : undefined;
    const status = getStatus(item);

    return {
        id, status, url,
        filePath: filename,
        fileName: getFilename(filename),
        totalSize: totalBytes,
        downloadedSize: bytesReceived,
        remainingSize: remainingBytes,
        speed: speed,

        startTime, endTime, estimatedEndTime,

        image: emptyImage,
        remainingSeconds: remainingSeconds,

        time: new Date(item.endTime || item.startTime),
    };
}

/**
 * Start listing for download status changes
 * @param dispatch 
 */
export function startListening(dispatch: (action: ReduxAction) => void): void {
    if (typeof document === "undefined") {
        return;
    }

    // Watch new download item
    const processNewDownload = (item: chrome.downloads.DownloadItem) => {
        const download = convertDownloadItem(item);
        console.log(`Status ${download.status}`);

        getIcon(item.id).then(image => dispatch(updateDownload({ id: download.id, image })));

        if (download.status !== DownloadStatus.Completed) {
            const updateWhileDownloading = async () => {
                console.log(`Update ${download.id}`);
                const updated = await updateItem(download.id);
                dispatch(updateDownload(updated));

                if (download.status !== DownloadStatus.Completed) {
                    setTimeout(() => updateWhileDownloading(), 1000);
                }
            };

            setTimeout(updateWhileDownloading, 1000);
        }


        return download;
    };

    // Get initial downloads
    chrome.downloads.search({ limit: 0 }, () => {
        fetchAll().then(items => {
            message.send(message.Type.SetSeen, items.map(({ id }) => id));
            dispatch(setDownloads(items.map(item => processNewDownload(item))));
        });
    });

    // Listen for new downloads
    chrome.downloads.onCreated.addListener(item => {
        message.send(message.Type.SetSeen, [item.id]);
        dispatch(addDownload(processNewDownload(item)));
    });

    // Listen for changes in downloads
    chrome.downloads.onChanged.addListener(async ({ id }) => {
        const updated = await updateItem(id);
        dispatch(updateDownload(updated));
    });
}