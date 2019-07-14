import { Divider, Menu, MenuItem } from "@material-ui/core";
import * as React from "react";
import { pure } from "recompose";

import { Download, DownloadStatus } from "../../helpers/downloads";
import { getStatusAction } from "./helpers";

interface CustomMenuButtonProps {
    id: number,
    status: DownloadStatus,

    handleClose: () => void,

    show: (id: number) => void,
    resume: (id: number) => void,
    pause: (id: number) => void,
    retry: (id: number) => void,
}

const CustomMenuButton = pure<CustomMenuButtonProps>(({ id, status, show, resume, pause, retry, handleClose }) => {
    const [action, label] = getStatusAction(status, { show, resume, pause, retry });
    return <MenuItem onClick={() => { handleClose(); action(id); }}>{label}</MenuItem>;
});

export interface DownloadItemMenuProps {
    item: Download,
    anchorEl: any,

    handleClose: () => void,

    show: (id: number) => void,
    resume: (id: number) => void,
    pause: (id: number) => void,
    cancel: (id: number) => void,
    retry: (id: number) => void,
    remove: (id: number) => void,
    acceptDanger: (id: number) => void,
    copyLink: (id: number) => void,
}

export const DownloadItemMenu = ({ item: { status, id }, anchorEl, handleClose, acceptDanger, show, resume, pause, cancel, retry, remove, copyLink }: DownloadItemMenuProps) => (
    <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={() => { handleClose(); copyLink(id); }}>Copy Link</MenuItem>
        {status === DownloadStatus.Completed
            ? <>
                <MenuItem onClick={() => { handleClose(); show(id); }}>Open in Folder</MenuItem>
                <Divider />
            </> : undefined}
        {status === DownloadStatus.Dangerous
            ? <>
                <MenuItem onClick={() => { handleClose(); acceptDanger(id); }}>Keep</MenuItem>
                <Divider />
            </> : undefined}
        <Divider />
        {status !== DownloadStatus.Completed && status !== DownloadStatus.Removed && status !== DownloadStatus.Dangerous
            ? <>
                <CustomMenuButton {...{ id, status, show, resume, pause, retry, handleClose }} />
                {status !== DownloadStatus.Canceled
                    ? <MenuItem onClick={() => { handleClose(); cancel(id); }}>Cancel</MenuItem>
                    : undefined}
                <Divider />
            </> : undefined}
        <MenuItem onClick={() => { handleClose(); remove(id); }}>Remove</MenuItem>
    </Menu>
);

export default pure<DownloadItemMenuProps>(DownloadItemMenu);