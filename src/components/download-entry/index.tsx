import * as React from 'react'
import * as format from '../../helpers/format'
import * as downloads from '../../helpers/downloads'
import * as classNames from 'classnames'

import * as style from './styles.css'

export default class DownloadEntry extends React.Component<{ id: number }> {
    public state = {
        imageSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        action: 'retry' as 'pause' | 'resume' | 'retry' | 'show',
        fileName: '',
        status: '',
        progressWidth: '0%',
        progressClass: '',
        openable: false,
        cancelable: false
    }

    private static readonly actionLabels = {
        pause: 'Pause',
        resume: 'Resume',
        retry: 'Retry download',
        show: 'Show in folder'
    }

    private loadImage = async () => {
        this.setState({ imageSrc: await downloads.getIcon(this.props.id) })
    }

    private downloadAction = (action: downloads.Action) => async () => {
        await downloads.action(this.props.id, action)
        this.updateStatus()
    }

    private updateStatus = async () => {
        const item = await downloads.fetch(this.props.id)

        let status = ''
        let progressWidth = '0%'
        let progressClass = ''
        let cancelable = false
        let action = 'retry'

        if (item.state === 'complete') { // completed
            action = 'show'
            status = item.exists
                ? format.byte(Math.max(item.totalBytes, item.bytesReceived))
                : 'Removed'
        } else if (item.state === 'interrupted') { // interrupted
            status = 'Canceled'
        } else {
            progressWidth = (item.bytesReceived * 100 / item.totalBytes) + '%'
            cancelable = true

            if (item.paused) { // paused
                status = 'Paused'
                progressClass = style.progressBarPaused
                action = 'resume'
            } else { // downloading
                const remainingSeconds = ((new Date(item.estimatedEndTime) as any) - (new Date() as any)) / 1000
                const remainingBytes = item.totalBytes - item.bytesReceived
                const speed = remainingBytes / remainingSeconds

                const time = isNaN(remainingSeconds) ? '' : ', ' + format.time(remainingSeconds)
                status = `${format.byte(speed)}/s - ${format.byte(item.bytesReceived)} of ${format.byte(item.totalBytes)}${time}`
                progressClass = style.progressBarDownloading

                action = 'pause'

                setTimeout(this.updateStatus, 1000)
            }
        }

        this.setState({
            status, progressWidth, cancelable, progressClass, action,
            fileName: downloads.getFilename(item),
            openable: item.state === 'complete' && item.exists
        })
    }

    public componentWillMount() {
        this.loadImage()
        this.updateStatus()
    }

    public render() {
        const { progressClass, progressWidth, status, imageSrc, openable, fileName, cancelable, action } = this.state
        const actionFunc = this.downloadAction(this.state.action)
        const actionLabel = DownloadEntry.actionLabels[this.state.action]
        const crossOut = status === 'Canceled' || status === 'Removed'

        return (
            <div className={style.download}>
                {cancelable ?
                    <a className={style.cancelButton} onClick={this.downloadAction('cancel')} title="Cancel">x</a> : undefined
                }
                <img className={style.icon} src={imageSrc} />
                <div className={classNames(style.nameWrapper, style.cutText)}>
                    {openable
                        ? <a className={classNames(style.name, style.nameOpenable)} onClick={this.downloadAction('open')} title="Open">{fileName}</a>
                        : <span className={classNames(style.name, { [style.nameCrossedOut]: crossOut })}>{fileName}</span>
                    }
                </div>
                <div className={classNames(style.progressBar, progressClass)}>
                    <div className={style.progress} style={{ width: progressWidth }}></div>
                </div>
                <div className={classNames(style.controls, style.cutText)}>
                    <a onClick={actionFunc}>{actionLabel}</a>
                    <span className={style.status}>{status}</span>
                </div>
            </div>
        )
    }
}