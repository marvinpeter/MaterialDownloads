import * as React from "react";
import { Provider } from "react-redux";

import { store } from "../../store";
import { Popup } from "./index";

(global as any).chrome = {
    downloads: new Proxy({}, {
        get: (_target, _prop: string) => {
            return undefined
        },
    }),
};


const template = (rendered: string) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset=utf-8 />
    <style>
        :root {
            --chrome-primary-color: #3367d6;
        }
    
        body {
            width: 400px;
            margin: 2px;
            -webkit-font-smoothing: antialiased;
            background: #424242;
            -webkit-user-select: none;
            user-select: none;
        }
    </style>
</head>

<body>
    <div id="popup">${rendered}</div>
    <script src="../scripts/redux.js"></script>
    <script src="../scripts/react.js"></script>
    <script src="../scripts/react-redux.js"></script>
    <script src="../scripts/react-dom.js"></script>
    <script src="../scripts/material-ui.js"></script>
    <script src="../scripts/popup.js"></script>
</body>

</html>`;

// Exported static site renderer:
export default (_locals: any, callback: (_: any, s: string) => void) => {
    const { renderToString } = require("react-dom/server");
    const { renderStylesToString } = require("emotion-server");
    const rendered = renderStylesToString(renderToString(
        <Provider store={store} >
            <Popup />
        </Provider>));
    const html = template(rendered);

    //server side rendering
    if (typeof callback === "function") {
        callback(null, html);
    } else {
        return html;
    }
};