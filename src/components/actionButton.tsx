import * as classNames from "classnames";
import * as React from "react";
import { pure } from "recompose";
import { css } from "emotion";

const style = {
    actionButton: css({
        margin: "0 5px 0 0",
        "&:hover": {
            cursor: "pointer",
        },
    }),

    primary: css({
        color: "#3367d6",
        textTransform: "uppercase",
    }),
};

export interface ActionButtonProps {
    primary?: boolean,
    onClick?: () => void
    children: any,
}

export const ActionButton = ({ primary, onClick, children }: ActionButtonProps) => (
    <a className={classNames(style.actionButton, { [style.primary]: primary })}
        onClick={onClick}>{children}</a>
);

export default pure<ActionButtonProps>(ActionButton);