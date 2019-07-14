import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as classNames from "classnames";
import * as React from "react";
import { pure } from "recompose";
import { css } from "emotion";

const style = {
    appBar: css({
        height: "42px !important",
    }),

    appBarColorful: css({
        backgroundColor: "var(--chrome-primary-color) !important",
        color: "white !important",
    }),

    title: css({
        fontSize: "15px!important",
        lineHeight: "42px!important",
        position: "absolute !important" as any,
        top: 0,
    }),

    menuButton: css({
        right: 0,
        top: 0,
        position: "absolute !important" as any,
        height: "42px !important",
    }),
};

export interface BarLayoutProps {
    colorful: boolean,
    open: boolean,
    handleMenuOpen: (e: any) => void,
    children: JSX.Element | JSX.Element[],
}

export const BarLayout = ({ colorful, open, handleMenuOpen, children }: BarLayoutProps) => (
    <>
        <AppBar className={classNames(style.appBar, { [style.appBarColorful]: colorful })} position="static" color="default">
            <Toolbar>
                <Typography className={style.title} color="inherit">Downloads</Typography>
                <div>
                    <IconButton className={style.menuButton} aria-owns={open ? "menu-appbar" : null}
                        aria-haspopup="true" onClick={handleMenuOpen} color="inherit">
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
        {children}
    </>
);

export default pure<BarLayoutProps>(BarLayout);