import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Popup from './components/popup'
import './styles.global.css'

if (!isDebug) {
    document.addEventListener('contextmenu', e => e.preventDefault())
}

ReactDOM.render(<Popup />, document.getElementById('popup'))
