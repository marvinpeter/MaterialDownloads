import { Divider, List, ListItem } from '@material-ui/core'
import * as React from 'react'
import { pure } from 'recompose'

import { Download } from '../../helpers/downloads'
import DownloadItem from '../downloadItem'
import * as style from './styles'

export interface DownloadListProps {
    downloads: Download[]

    show: (id: number) => void
    open: (id: number) => void
    resume: (id: number) => void
    pause: (id: number) => void
    cancel: (id: number) => void
    retry: (id: number) => void
    remove: (id: number) => void
    acceptDanger: (id: number) => void
    copyLink: (id: number) => void
}

export const DownloadList = ({ downloads, show, open, resume, pause, cancel, remove, retry, acceptDanger, copyLink }: DownloadListProps) => (
    <List className={style.downloads}>
        {downloads.map((item, index) => (
            <>
                <DownloadItem key={item.id} {...{ item, show, open, resume, pause, cancel, remove, retry, acceptDanger, copyLink }} />
                {index !== downloads.length - 1 ? <Divider inset /> : undefined}
            </>
        ))}
        <ListItem dense />
    </List>
)

export default pure<DownloadListProps>(DownloadList)