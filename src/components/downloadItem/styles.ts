import { css } from "emotion";

export default {
    nameOpenable: css({
        "&:active": {
            color: "var(--color-link-active)",
            cursor: "pointer",
        },
        "&:hover": {
            color: "var(--color-link-hover)",
            cursor: "pointer",
        },
    }),

    nameCrossedOut: css({
        textDecoration: "line-through",
    }),

    cutText: css({
        textOverflow: "ellipsis",
        overflow: "hidden",
        width: 250,
        whiteSpace: "nowrap",
    }),

    statusDetails: css({
        margin: "-5px 0 0 0",
    }),

    url: css({
        fontSize: "0.75em",
        margin: 0,
    }),

    time: css({
        fontSize: "0.75em",
        margin: "-5px 0 0 0",
    }),

    status: css({
        fontSize: "0.85em",
    }),

    avatar: css({
        borderRadius: 0,
    }),
};
