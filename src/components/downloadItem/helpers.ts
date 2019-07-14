import { Download, DownloadStatus } from "../../helpers/downloads";
import * as format from "../../helpers/format";

/**
 * Get the status text of a donwload item
 * @param param0 Download object
 */
export const getStatusText = ({ status, totalSize, downloadedSize, speed, remainingSeconds }: Download): string => (({
    [DownloadStatus.Removed]: "Removed",
    [DownloadStatus.Canceled]: "Canceled",
    [DownloadStatus.Completed]:
        format.byte(Math.max(totalSize, downloadedSize)),
    [DownloadStatus.Paused]:
        `Paused - ${format.byte(downloadedSize)} of ${format.byte(totalSize)}`,
    [DownloadStatus.Downloading]:
        `${format.byte(speed)}/s - ${format.byte(downloadedSize)} of ${format.byte(totalSize)}${isNaN(remainingSeconds) ? "" : ", " + format.time(remainingSeconds)}`,
} as any)[status]);

/**
 * Get the progress bar width based on the current download percentage
 * @param param0 Download object
 */
export const getProcessWidth = ({ status, downloadedSize, totalSize }: Download) =>
    status === DownloadStatus.Downloading || status === DownloadStatus.Paused
        ? (downloadedSize * 100 / totalSize) : 0;

export interface Actions {
    show: (id: number) => void,
    resume: (id: number) => void,
    pause: (id: number) => void,
    retry: (id: number) => void,
}

/**
 * Get the main action of a download based on its status
 * @param status Download status
 * @param param1 Available actions
 */
export const getStatusAction = (status: DownloadStatus, { show, resume, pause, retry }: Actions) => (({
    [DownloadStatus.Removed]:
        [retry, "Retry"],
    [DownloadStatus.Canceled]:
        [retry, "Retry"],
    [DownloadStatus.Completed]:
        [show, "Show in folder"],
    [DownloadStatus.Paused]:
        [resume, "Resume"],
    [DownloadStatus.Downloading]:
        [pause, "Pause"],
} as any)[status]);
