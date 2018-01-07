import * as React from 'react'
import * as downloads from '../../helpers/downloads'
import { sendMessage, MessageType } from '../../helpers/messages'
import DownloadEntry from './../download-entry'

import * as style from './styles.css'

export default class DownloadList extends React.Component {
    public state = {
        items: []
    }

    private fetchDownloads = () => {
        downloads.fetchIds().then(items => {
            sendMessage(MessageType.SetSeen, items)
            this.setState({ items })
        })
    }

    /**
     * Clear downloads and refresh list
     */
    public async clear() {
        await downloads.clear()
        this.fetchDownloads()
    }

    public componentWillMount() {
        // Listen for changes concerning downloads
        chrome.downloads.search({ limit: 0 }, () => this.fetchDownloads())
        chrome.downloads.onCreated.addListener(_ => this.fetchDownloads())
        chrome.downloads.onChanged.addListener(_ => this.fetchDownloads())
    }

    public render() {
        return <div className={style.downloads}>{this.state.items.map(id => <DownloadEntry key={id} id={id} />)}</div>
    }
}