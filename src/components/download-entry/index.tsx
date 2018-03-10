import * as React from 'react'
import * as format from '../../helpers/format'
import * as downloads from '../../helpers/downloads'
import * as classNames from 'classnames'
import * as style from './styles.css'

const emtpyImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export interface DownloadEntryProps {
    id: number
    onRemove: () => void
}

export default class DownloadEntry extends React.Component<DownloadEntryProps> {
    public state = {
        imageSrc: emtpyImage,
        action: 'retry' as 'pause' | 'resume' | 'retry' | 'show',
        fileName: '',
        url: '',
        status: '',
        progressWidth: '0%',
        progressClass: '',
        openable: false,
        cancelable: false,
        isDangerous: false
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

    private updateStatus = async () => {
        const item = await downloads.fetch(this.props.id)

        let status = ''
        let progressWidth = '0%'
        let progressClass = ''
        let cancelable = false
        let action = 'retry'
        let isDangerous = false

        if (item.state === 'complete') { // completed
            action = 'show'
            if (item.exists) {
                status = format.byte(Math.max(item.totalBytes, item.bytesReceived))
                this.loadImage()
            } else  {
                status = 'Removed'
            }
        } else if (item.state === 'interrupted') { // interrupted
            status = 'Canceled'
        } else {
            progressWidth = (item.bytesReceived * 100 / item.totalBytes) + '%'
            cancelable = true

            const remainingSeconds = ((new Date(item.estimatedEndTime) as any) - (new Date() as any)) / 1000
            const remainingBytes = item.totalBytes - item.bytesReceived

            if (item.paused) { // paused
                status = `Paused - ${format.byte(item.bytesReceived)} of ${format.byte(item.totalBytes)}`
                progressClass = style.progressBarPaused
                action = 'resume'
            } else { // downloading
                const speed = remainingBytes / remainingSeconds

                const time = isNaN(remainingSeconds) ? '' : ', ' + format.time(remainingSeconds)
                status = `${format.byte(speed)}/s - ${format.byte(item.bytesReceived)} of ${format.byte(item.totalBytes)}${time}`
                progressClass = style.progressBarDownloading

                action = 'pause'

                if (remainingBytes === 0 && item.danger !== 'safer' && item.danger !== 'accepted' && item.danger !== '') {
                    isDangerous = true
                }

                setTimeout(this.updateStatus, 1000)
            }
        }

        this.setState({
            status, progressWidth, cancelable, progressClass, action, isDangerous,
            fileName: downloads.getFilename(item),
            url: item.url,
            openable: item.state === 'complete' && item.exists
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
        const { progressClass, progressWidth, status, imageSrc, openable, fileName, url, cancelable, action, isDangerous } = this.state
        const actionFunc = this.downloadAction(this.state.action)
        const actionLabel = DownloadEntry.actionLabels[this.state.action]
        const crossOut = status === 'Canceled' || status === 'Removed'
        const { onRemove, id } = this.props

        return (
            <div className={style.entry}>
                <div className={style.content} ref="item" draggable={openable} onDragStart={this.dragDownload}>
                    {cancelable
                        ? <a className={style.cancelRemoveButton} onClick={this.downloadAction('cancel')} title="Cancel">x</a>
                        : <a className={style.cancelRemoveButton} onClick={() => { this.downloadAction('remove')(); onRemove() }} title="Remove">x</a>
                    }
                    <div className={style.icon}>
                        {isDangerous
                            ? <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style={{ pointerEvents: 'none', display: 'block', width: '32px', height: '32px', }}>
                                <g>
                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" style={{ fill: 'var(--google-red-700)' }}>
                                    </path>
                                </g>
                            </svg>
                            : <img className={style.img} src={imageSrc} />
                        }
                    </div>
                    <div className={style.details}>
                        <div className={classNames(style.nameWrapper, style.cutText)}>
                            {openable
                                ? <a className={classNames(style.name, style.nameOpenable)} onClick={this.downloadAction('open')} title="Open">{fileName}</a>
                                : <span className={classNames(style.name, { [style.nameCrossedOut]: crossOut })} title={url}>{fileName}</span>
                            }
                        </div>
                        <div className={classNames(style.progressBar, progressClass)}>
                            <div className={style.progress} style={{ width: progressWidth }}></div>
                        </div>
                        {isDangerous
                            ? < div className={style.cutText}>
                                <a className={style.action} onClick={() => { this.downloadAction('remove')(); onRemove() }}>Discard</a>
                                <a className={style.action} onClick={this.downloadAction('acceptDanger')}>Keep</a>
                                <span className={style.status}>This file may harm your computer.</span>
                            </div>
                            : <div className={style.cutText}>
                                <a className={classNames(style.action)} onClick={actionFunc}>{actionLabel}</a>
                                <span className={style.status}>{status}</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}