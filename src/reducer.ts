import { Cmd, Loop, loop } from "redux-loop";

import { AppAction, ReduxAction, updateDownload } from "./actions";
import { Download } from "./helpers/downloads";
import * as downloads from "./helpers/downloads";

export interface State {
    downloads: Download[];
}

const initialState: State = {
    downloads: [],
};

export const actionSeq = <State>(state: State, ...args: ReduxAction[]): Loop<State, any> =>
    loop(state, Cmd.list([...args as any]));

export const reducer = (state: State = initialState, action: AppAction): State | Loop<State, any> => {
    switch (action.type) {
        case "downloads/set":
            return { ...state, downloads: action.payload };

        case "download/add":
            return { ...state, downloads: [action.payload, ...state.downloads] };

        case "downloads/clear":
            downloads.clear();
            return { ...state, downloads: state.downloads.filter(({ status }) => status === downloads.DownloadStatus.Downloading || status === downloads.DownloadStatus.Paused) };

        case "download/update":
            return {
                ...state, downloads: state.downloads.map(item => (
                    item.id === action.payload.id
                        ? { ...item, ...action.payload }
                        : { ...item }
                )),
            };

        case "download/pause":
            chrome.downloads.pause(action.payload);
            return actionSeq({ ...state },
                Cmd.run(() => downloads.updateItem(action.payload), {
                    successActionCreator: (res: Partial<Download>) => updateDownload(res),
                }),
            );

        case "download/cancel":
            chrome.downloads.cancel(action.payload);
            return actionSeq({ ...state },
                Cmd.run(() => downloads.updateItem(action.payload), {
                    successActionCreator: (res: Partial<Download>) => updateDownload(res),
                }),
            );

        case "download/resume":
            chrome.downloads.resume(action.payload);
            return actionSeq({ ...state },
                Cmd.run(() => downloads.updateItem(action.payload), {
                    successActionCreator: (res: Partial<Download>) => updateDownload(res),
                }),
            );

        case "download/show":
            chrome.downloads.show(action.payload);
            return { ...state };

        case "download/retry":
            chrome.downloads.download({ url: state.downloads.find(({ id }) => id === action.payload).url }, undefined);
            return { ...state };

        case "download/open":
            chrome.downloads.open(action.payload);
            return { ...state };

        case "download/remove":
            chrome.downloads.erase({ id: action.payload }, undefined);
            return { ...state, downloads: state.downloads.filter(({ id }) => id !== action.payload) };

        case "download/accept-danger":
            chrome.downloads.acceptDanger(action.payload, undefined);
            return actionSeq({ ...state },
                Cmd.run(() => downloads.updateItem(action.payload), {
                    successActionCreator: (res: Partial<Download>) => updateDownload(res),
                }),
            );

        case "download/copy-link":
            downloads.setClipboard(state.downloads.find(({ id }) => id === action.payload).url);
            return { ...state };

        default:
            return { ...state };
    }
};