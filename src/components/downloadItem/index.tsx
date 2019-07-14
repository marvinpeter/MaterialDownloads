import { Avatar, IconButton, ListItem, ListItemSecondaryAction } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";
import { compose, withStateHandlers } from "recompose";

import { Download, DownloadStatus } from "../../helpers/downloads";
import DownloadItemMenu from "./menu";
import DownloadItemStatus from "./status";

export interface DownloadItemOuterProps {
    item: Download,
    downloadTime: boolean,

    show: (id: number) => void,
    open: (id: number) => void,
    resume: (id: number) => void,
    pause: (id: number) => void,
    cancel: (id: number) => void,
    retry: (id: number) => void,
    remove: (id: number) => void,
    acceptDanger: (id: number) => void,
    copyLink: (id: number) => void,
}

export interface DownloadItemInnerProps {
    anchorEl: any,
    setAnchorEl: (value: any) => void,
    handleMenuOpen: () => void,
    handleMenuClose: () => void
}

export type DownloadItemProps = DownloadItemOuterProps & DownloadItemInnerProps;

const enhancer = compose<DownloadItemInnerProps, DownloadItemOuterProps>(
    withStateHandlers({ anchorEl: null } as any, {
        handleMenuOpen: _ => event => ({ anchorEl: event.target }),
        handleMenuClose: () => () => ({ anchorEl: null }),
    }),
);

export const DownloadItem = ({ item, anchorEl, handleMenuOpen, handleMenuClose, show, open, resume, pause, remove, retry, acceptDanger, copyLink, cancel, downloadTime }: DownloadItemProps) => (
    <ListItem draggable={item.status === DownloadStatus.Completed} onDragStart={e => { e.preventDefault(); chrome.downloads.drag(item.id); }} dense>
        <Avatar src={item.status === DownloadStatus.Dangerous ? "/icons/danger.png" : item.image} style={{ borderRadius: 0 }} />
        <DownloadItemStatus {...{ item, show, open, resume, pause, remove, retry, acceptDanger, downloadTime }} />
        <ListItemSecondaryAction>
            <IconButton aria-owns={anchorEl !== null ? "menu-appbar" : null} aria-haspopup="true" onClick={handleMenuOpen} aria-label="Actions">
                <MoreVertIcon />
            </IconButton>
            <DownloadItemMenu handleClose={handleMenuClose} {...{ item, anchorEl, show, resume, pause, remove, retry, acceptDanger, copyLink, cancel }} />
        </ListItemSecondaryAction>
    </ListItem>
);

export default enhancer(DownloadItem);