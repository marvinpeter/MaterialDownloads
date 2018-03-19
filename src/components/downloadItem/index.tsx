import * as React from 'react'
import * as format from '../../helpers/format'
import * as downloads from '../../helpers/downloads'
import * as classNames from 'classnames'

import { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import { LinearProgress } from 'material-ui/Progress'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import IconButton from 'material-ui/IconButton'

import Menu, { MenuItem } from 'material-ui/Menu'

import ActionButton from '../actionButton'

import * as style from './styles.css'
import Divider from 'material-ui/Divider'

const emtpyImage = 'data:image/gifbase64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export interface DownloadEntryProps {
    id: number
    onRemove: () => void
}
enum DownloadStatus {
    Downloading, Completed, Paused, Canceled, Dangerous, Removed
}

export default class DownloadItem extends React.Component<DownloadEntryProps> {
    public state = {
        imageSrc: emtpyImage,
        fileName: '',
        url: '',
        status: DownloadStatus.Downloading,
        statusText: '',
        action: 'show' as downloads.Action,
        progressWidth: 0,
        openable: false,
        cancelable: false,
        anchorEl: null,
    }

    private static readonly actionLabels = {
        pause: 'Pause',
        resume: 'Resume',
        retry: 'Retry',
        show: 'Show in folder'
    }

    private loadImage = async () => {
        this.setState({ imageSrc: (await downloads.getIcon(this.props.id)) || emtpyImage })
    }

    private downloadAction = (action: downloads.Action) => async () => {
        await downloads.action(this.props.id, action)
        this.updateStatus()
    }

    private handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget })
    }

    private handleClose = () => {
        this.setState({ anchorEl: null })
    }

    private updateStatus = async () => {
        const item = await downloads.fetch(this.props.id)

        let status = DownloadStatus.Downloading
        let statusText = ''
        let progressWidth = 0
        let cancelable = false
        let action = 'retry'

        if (item.state === 'complete') { // completed
            action = 'show'
            if (item.exists) {
                status = DownloadStatus.Completed
                statusText = format.byte(Math.max(item.totalBytes, item.bytesReceived))
                this.loadImage()
            } else {
                status = DownloadStatus.Removed
                statusText = 'Removed'
            }
        } else if (item.state === 'interrupted') { // interrupted
            status = DownloadStatus.Canceled
            statusText = 'Canceled'
        } else {
            progressWidth = (item.bytesReceived * 100 / item.totalBytes)
            cancelable = true

            const remainingSeconds = ((new Date(item.estimatedEndTime) as any) - (new Date() as any)) / 1000
            const remainingBytes = item.totalBytes - item.bytesReceived

            if (item.paused) { // paused
                status = DownloadStatus.Paused
                statusText = `Paused - ${format.byte(item.bytesReceived)} of ${format.byte(item.totalBytes)}`
                action = 'resume'
            } else { // downloading
                const speed = remainingBytes / remainingSeconds

                const time = isNaN(remainingSeconds) ? '' : ', ' + format.time(remainingSeconds)
                statusText = `${format.byte(speed)}/s - ${format.byte(item.bytesReceived)} of ${format.byte(item.totalBytes)}${time}`
                action = 'pause'

                status = (remainingBytes === 0 && item.danger !== 'safer' && item.danger !== 'accepted' && item.danger !== '')
                    ? DownloadStatus.Dangerous
                    : DownloadStatus.Downloading

                setTimeout(this.updateStatus, 1000)
            }
        }

        const openable = item.state === 'complete' && item.exists

        this.setState({
            status, statusText, progressWidth, cancelable, action,
            fileName: downloads.getFilename(item),
            url: openable ? item.filename : item.url,
            openable
        })
    }

    public componentWillMount() {
        this.loadImage()
        this.updateStatus()
    }

    private dragDownload = (e) => {
        e.preventDefault()
        chrome.downloads.drag(this.props.id)
    }


    public render() {
        const { progressWidth, status, statusText, imageSrc, openable, fileName, url, cancelable, action } = this.state
        const actionFunc = this.downloadAction(this.state.action)
        const actionLabel = DownloadItem.actionLabels[this.state.action]
        const crossOut = status === DownloadStatus.Canceled || status === DownloadStatus.Removed
        const { onRemove, id } = this.props

        const { anchorEl } = this.state
        const open = Boolean(anchorEl)

        return (
            <ListItem draggable={openable} onDragStart={this.dragDownload} dense>
                <Avatar src={status === DownloadStatus.Dangerous ? '/icons/danger.png' : imageSrc} style={{ borderRadius: 0 }} />
                <ListItemText
                    primary={
                        <span className={classNames({ [style.nameCrossedOut]: crossOut, [style.nameOpenable]: openable })} onClick={openable ? this.downloadAction('open') : undefined}>{fileName}</span>
                    }
                    secondary={
                        <p className={style.statusDetails}>
                            <p className={classNames(style.cutText, style.url)}>{url}</p>

                            {status === DownloadStatus.Downloading || status === DownloadStatus.Paused
                                ? <LinearProgress variant="determinate" value={progressWidth} />
                                : undefined}

                            <div className={classNames(style.cutText, style.status)}>
                                {status === DownloadStatus.Dangerous
                                    ? <>
                                        <ActionButton primary={action !== 'show'} onClick={this.downloadAction('acceptDanger')}>Keep</ActionButton>
                                        <ActionButton primary={action !== 'show'} onClick={this.downloadAction('remove')}>Remove</ActionButton>
                                        <span>This file may harm your computer.</span>
                                    </>
                                    : <>
                                        <ActionButton primary={action !== 'show'} onClick={this.downloadAction(action)}>{actionLabel}</ActionButton>
                                        <span>{statusText}</span>
                                    </>}
                            </div>
                        </p>
                    } />

                <ListItemSecondaryAction>
                    <IconButton aria-owns={open ? 'menu-appbar' : null} aria-haspopup="true" onClick={this.handleMenu} aria-label="Actions">
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={open}
                        onClose={this.handleClose}>
                        {openable
                            ? <>
                                <MenuItem onClick={() => { this.handleClose(); this.downloadAction('open')() }}>Open</MenuItem>
                                <MenuItem onClick={() => { this.handleClose(); this.downloadAction('show')() }}>Open in Folder</MenuItem>
                                <Divider />
                            </> : undefined}
                        {status === DownloadStatus.Dangerous
                            ? <>
                                <MenuItem onClick={() => { this.handleClose(); this.downloadAction('acceptDanger')() }}>Keep</MenuItem>
                                <MenuItem onClick={() => { this.handleClose(); this.downloadAction('remove')() }}>Remove</MenuItem>
                                <Divider />
                            </> : undefined}
                        {status !== DownloadStatus.Completed && status !== DownloadStatus.Removed && status !== DownloadStatus.Dangerous
                            ? <>
                                <MenuItem onClick={() => { this.handleClose(); this.downloadAction(action)() }}>{actionLabel}</MenuItem>
                                {status !== DownloadStatus.Canceled
                                    ? <MenuItem onClick={() => { this.handleClose(); this.downloadAction('cancel')() }}>Cancel</MenuItem>
                                    : undefined}
                                <Divider />
                            </> : undefined}
                        <MenuItem onClick={() => { this.handleClose(); this.downloadAction('remove')() }}>Remove</MenuItem>
                    </Menu>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
}