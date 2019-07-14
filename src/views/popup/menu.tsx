import { Menu, MenuItem, Divider } from "@material-ui/core";
import * as React from "react";
import { pure } from "recompose";

export interface PopupMenuProps {
    anchorEl: undefined,

    handleMenuClose: (e: any) => void,
    handleOpenFolder: (e: any) => void,
    handleShowDownloads: (e: any) => void,
    handleClear: (e: any) => void,
}

export const PopupMenu = ({ anchorEl, handleMenuClose, handleOpenFolder, handleShowDownloads, handleClear }: PopupMenuProps) => (
    <Menu id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={anchorEl !== null}
        onClose={handleMenuClose}>
        <MenuItem onClick={handleOpenFolder}>Open Folder</MenuItem>
        <MenuItem onClick={handleShowDownloads}>Show All Downloads</MenuItem>
        <Divider />
        <MenuItem onClick={handleClear}>Clear</MenuItem>
    </Menu>
);

export default pure<PopupMenuProps>(PopupMenu);