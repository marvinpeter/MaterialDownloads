import { LinearProgress, ListItemText } from "@material-ui/core";
import * as classNames from "classnames";
import * as React from "react";
import { pure } from "recompose";

import { Download, DownloadStatus } from "../../helpers/downloads";
import ActionButton from "../actionButton";
import { getProcessWidth, getStatusAction, getStatusText } from "./helpers";
import style from "./styles";

interface CustomActionButtonProps {
    primary: boolean,
    id: number,
    status: DownloadStatus,

    show: (id: number) => void,
    resume: (id: number) => void,
    pause: (id: number) => void,
    retry: (id: number) => void,
}

const CustomActionButton = pure<CustomActionButtonProps>(({ primary, id, status, show, resume, pause, retry }) => {
    const [action, label] = getStatusAction(status, { show, resume, pause, retry });
    return <ActionButton primary={primary} onClick={() => action(id)}>{label}</ActionButton>;
});

export interface DownloadItemStatusProps {
    item: Download,
    downloadTime: boolean,

    show: (id: number) => void,
    open: (id: number) => void,
    resume: (id: number) => void,
    pause: (id: number) => void,
    remove: (id: number) => void,
    retry: (id: number) => void,
    acceptDanger: (id: number) => void,
}

export const DownloadItemStatus = ({ item, open, acceptDanger, remove, show, resume, pause, retry, downloadTime }: DownloadItemStatusProps) => (
    <ListItemText
        primary={
            <span className={classNames({
                [style.nameCrossedOut]: item.status === DownloadStatus.Canceled || item.status === DownloadStatus.Removed,
                [style.nameOpenable]: item.status === DownloadStatus.Completed,
            })} onClick={() => item.status === DownloadStatus.Completed ? open(item.id) : undefined}>{item.fileName}</span>
        }
        secondary={
            <p className={style.statusDetails}>
                <p className={classNames(style.cutText, style.url)}>{item.status === DownloadStatus.Completed ? item.filePath : item.url}</p>
                {downloadTime ? <p className={classNames(style.cutText, style.time)}>Download Time: {item.time.toLocaleString("default")}</p> : undefined}

                {item.status === DownloadStatus.Downloading || item.status === DownloadStatus.Paused
                    ? <LinearProgress variant="determinate" value={getProcessWidth(item)} />
                    : undefined}

                <div className={classNames(style.cutText, style.status)}>
                    {item.status === DownloadStatus.Dangerous
                        ? <>
                            <ActionButton primary onClick={() => acceptDanger(item.id)}>Keep</ActionButton>
                            <ActionButton primary onClick={() => remove(item.id)}>Remove</ActionButton>
                            <span>This file may harm your computer.</span>
                        </>
                        : <>
                            <CustomActionButton primary={item.status !== DownloadStatus.Completed} id={item.id} status={item.status}
                                {...{ show, resume, pause, retry }} />
                            <span>{getStatusText(item)}</span>
                        </>}
                </div>
            </p>
        } />
);

export default pure<DownloadItemStatusProps>(DownloadItemStatus);