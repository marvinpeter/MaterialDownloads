import * as React from 'react'
import * as downloads from '../../helpers/downloads'
import * as message from '../../helpers/message'
import DownloadItem from '../downloadItem'
import List from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'

import * as style from './styles.css'

export default class DownloadList extends React.Component {
    public state = {
        items: [] as number[]
    }

    private fetchDownloads = () => {
        downloads.fetchIds().then(items => {
            message.send(message.Type.SetSeen, items)
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

    /**
     * Clear refresh list
     */
    public onRemove = (id: number) => {
        this.setState({ items: this.state.items.filter(x => x !== id) })
    }

    public componentWillMount() {
        // Listen for changes concerning downloads
        chrome.downloads.search({ limit: 0 }, () => this.fetchDownloads())
        chrome.downloads.onCreated.addListener(_ => this.fetchDownloads())
        chrome.downloads.onChanged.addListener(_ => this.fetchDownloads())
    }

    public render() {
        return <List className={style.downloads}>
            {this.state.items.map((id, index) => (
                <>
                    <DownloadItem key={id} id={id} onRemove={() => this.onRemove(id)} />
                    {index !== this.state.items.length - 1
                        ? <Divider inset />
                        : undefined}
                </>
            ))}
            <ListItem dense />
        </List>
    }
}