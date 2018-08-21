import * as React from 'react'
import { Provider } from 'react-redux'

import { store } from '../../store'
import { Popup } from './index'

// tslint:disable-next-line:no-object-mutation
(global as any).chrome = {
    downloads: new Proxy({}, {
        get: (target, prop: string) => {
            console.log(prop)
            return undefined
        }
    })
}

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
            padding: 0 3px 0 3px;
            margin: 0px;
            -webkit-font-smoothing: antialiased;
            background: #f4f4f4;
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

</html>
`

// Exported static site renderer:
export default (locals, callback) => {
    const { renderToString } = require('react-dom/server')
    const { renderStylesToString } = require('emotion-server')
    const rendered = renderStylesToString(renderToString(
        <Provider store={store} >
            <Popup />
        </Provider>))
    const html = template(rendered)

    //server side rendering
    if (typeof callback === 'function') {
        callback(null, html)
    } else {
        return html
    }
}