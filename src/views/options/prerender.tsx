import * as React from "react";

import { Options } from ".";

export const template = (rendered: string) => `<!DOCTYPE html>
<html>

<head>
    <title>Downloads Options</title>
    <style>
        body {
            background-color: white;
        }
    </style>
</head>

<body>
    <div id="options">${rendered}</div>
    <script src="../scripts/react.js"></script>
    <script src="../scripts/react-dom.js"></script>
    <script src="../scripts/material-ui.js"></script>
    <script src="../scripts/options.js"></script>
</body>

</html>`;

// Exported static site renderer:
export default (_locals: any, callback: (_: any, s: string) => void) => {
    const { renderToString } = require("react-dom/server");
    const { renderStylesToString } = require("emotion-server");
    const rendered = renderStylesToString(renderToString(<Options />));
    const html = template(rendered);

    // server side rendering
    if (typeof callback === "function") {
        callback(null, html);
    } else {
        return html;
    }
};