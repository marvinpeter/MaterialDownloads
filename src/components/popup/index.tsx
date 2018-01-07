import * as React from 'react'
import DownloadList from '../download-list'

import * as style from './styles.css'

export default class Popup extends React.Component {
    private downloadList: DownloadList

    public render() {
        return (
            <>
                <h1 className={style.title}>Downloads</h1>
                <button className={style.clear} onClick={() => this.downloadList.clear()}>Clear</button>
                <DownloadList ref={val => this.downloadList = val} />
                <a className={style.showAll} onClick={() => chrome.tabs.create({ url: 'chrome://downloads' })} draggable={false}>Show All Downloads</a>
            </>
        )
    }
}