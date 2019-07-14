import { Button } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";
import { pure } from "recompose";
import { css } from "emotion";

const style = {
    floatingMenuButton: css({
        bottom: 10,
        right: 10,
        position: "absolute !important" as any,
        height: "38px!important",
        width: "38px!important",
        backgroundColor: "var(--chrome-primary-color) !important",
    }),
};

export interface FloatingLayoutProps {
    open: boolean,
    handleMenuOpen: (e: any) => void,
    children: JSX.Element | JSX.Element[],
}

export const FloatingLayout = ({ open, handleMenuOpen, children }: FloatingLayoutProps) => (
    <>
        {children}
        <Button className={style.floatingMenuButton} variant="fab" color="primary" aria-label="add" aria-owns={open ? "menu-appbar" : null}
            aria-haspopup="true" onClick={handleMenuOpen}>
            <MoreVertIcon />
        </Button>
    </>
);

export default pure<FloatingLayoutProps>(FloatingLayout);