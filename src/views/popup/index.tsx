import { Paper } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider, Theme } from "@material-ui/core/styles";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import { compose, lifecycle, withState, withStateHandlers } from "recompose";

import { clearDownloads } from "../../actions";
import DownloadList from "../../components/downloadList";
import { BarLayout, FloatingLayout } from "../../layouts";
import * as options from "../../helpers/options";
import { State } from "../../reducer";
import { bindActions, dispatch, store } from "../../store";
import PopupMenu from "./menu";
import { injectGlobal } from "emotion";

interface Options {
    readonly useAppBar: boolean,
    readonly colorful: boolean,
    readonly theme: Theme,
    readonly downloadTime: boolean,
}

interface PopupInnerPros {
    anchorEl?: any,

    options?: Options,
    setOptions?: (opts: Options) => void,

    handleMenuOpen?: (e: any) => void,
    handleMenuClose?: (e: any) => void,
    handleOpenFolder?: (e: any) => void,
    handleShowDownloads?: (e: any) => void,
    handleClear?: (e: any) => void,
}

interface PopupOuterPros { }

type PopupProps = PopupInnerPros & PopupOuterPros;

const downloadListPropMapper = ({ downloads }: State) => ({ downloads });
const downloadListActionMapper = bindActions(({ showDownload, openDownload, resumeDownload, pauseDownload, removeDownload, retryDownload, acceptDangerDownload, cancelDownload, copyLinkDownload }) => ({
    show: showDownload,
    open: openDownload,
    resume: resumeDownload,
    pause: pauseDownload,
    remove: removeDownload,
    retry: retryDownload,
    acceptDanger: acceptDangerDownload,
    cancel: cancelDownload,
    copyLink: copyLinkDownload,
}));
const MappedDownloadList = connect(downloadListPropMapper, downloadListActionMapper)(DownloadList);

const selectTheme = (type: "dark" | "light" = "light") => {
    injectGlobal({
        body: {
            background: type === "dark" ? "#424242" : "#ffffff",
        },
    });

    return createMuiTheme({
        palette: { type },
        props: {
            MuiMenuItem: {
                style: {
                    height: 10,
                },
            },
        },
    });
};

const enhancer = compose<PopupInnerPros, PopupOuterPros>(
    withState("options", "setOptions", {
        useAppBar: false,
        colorful: false,
        downloadTime: false,
        theme: selectTheme(),
    } as Options),

    lifecycle({
        async componentWillMount(this: { props: PopupProps }): Promise<void> {
            if (typeof document === "undefined") {
                return;
            }
            // tslint:disable-next-line:no-invalid-this no-this
            const { setOptions } = this.props;
            const { useAppBar, colorful, theme, downloadTime } = await options.getOptions();
            setOptions({
                useAppBar, colorful,
                theme: selectTheme(theme),
                downloadTime: downloadTime,
            });
        },
    } as any),

    withStateHandlers({ anchorEl: null } as any, {
        handleMenuOpen: _ => event => ({ anchorEl: event.target }),
        handleMenuClose: () => () => ({ anchorEl: null }),

        handleOpenFolder: () => () => {
            chrome.downloads.showDefaultFolder();
            return { anchorEl: null };
        },

        handleShowDownloads: () => () => {
            chrome.tabs.create({ url: "chrome://downloads" });
            return { anchorEl: null };
        },

        handleClear: () => () => {
            dispatch(clearDownloads());
            return { anchorEl: null };
        },
    }),
);

export const Popup = enhancer(({ anchorEl, options: { useAppBar, theme, colorful, downloadTime }, handleClear, handleMenuClose, handleMenuOpen, handleOpenFolder, handleShowDownloads }: PopupProps) => (
    <MuiThemeProvider theme={theme}>
        <Paper>
            {useAppBar
                ? <BarLayout colorful={colorful} open={anchorEl !== null} handleMenuOpen={handleMenuOpen}>
                    <MappedDownloadList downloadTime={downloadTime} />
                </BarLayout>
                : <FloatingLayout open={anchorEl !== null} handleMenuOpen={handleMenuOpen}>
                    <MappedDownloadList downloadTime={downloadTime} />
                </FloatingLayout>}
            <PopupMenu {...{ anchorEl, handleClear, handleMenuClose, handleOpenFolder, handleShowDownloads }} />
        </Paper>
    </MuiThemeProvider>
));

if (process.env.NODE_ENV !== "development" && typeof document !== "undefined") {
    document.addEventListener("contextmenu", e => e.preventDefault());
}

if (typeof document !== "undefined") {
    ReactDOM.hydrate(
        <Provider store={store}>
            <Popup />
        </Provider>,
        document.getElementById("popup"));
}