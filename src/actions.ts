import { Action } from 'redux'

import { Download } from './helpers/downloads'

export interface ReduxAction<Type = any> extends Action {
    readonly type: Type
}

export interface ReduxPayloadAction<Type = any, Payload = any> extends ReduxAction<Type> {
    readonly payload: Payload
}

export type SetDownloadsAction = ReduxPayloadAction<'downloads/set', Download[]>
export type ClearDownloadsAction = ReduxAction<'downloads/clear'>

export type AddDownloadAction = ReduxPayloadAction<'download/add', Download>
export type UpdateDownloadAction = ReduxPayloadAction<'download/update', Partial<Download>>

export type PauseDownloadAction = ReduxPayloadAction<'download/pause', number>
export type CancelDownloadAction = ReduxPayloadAction<'download/cancel', number>
export type ResumeDownloadAction = ReduxPayloadAction<'download/resume', number>
export type RetryDownloadAction = ReduxPayloadAction<'download/retry', number>
export type ShowDownloadAction = ReduxPayloadAction<'download/show', number>
export type OpenDownloadAction = ReduxPayloadAction<'download/open', number>
export type RemoveDownloadAction = ReduxPayloadAction<'download/remove', number>
export type AcceptDangerDownloadAction = ReduxPayloadAction<'download/accept-danger', number>
export type CopyLinkDownloadAction = ReduxPayloadAction<'download/copy-link', number>

export type AppAction = SetDownloadsAction | ClearDownloadsAction | AddDownloadAction | UpdateDownloadAction
    | PauseDownloadAction | CancelDownloadAction | ResumeDownloadAction | RetryDownloadAction | ShowDownloadAction
    | OpenDownloadAction | RemoveDownloadAction | AcceptDangerDownloadAction | CopyLinkDownloadAction

export const setDownloads = (items: Download[]): SetDownloadsAction => ({
    type: 'downloads/set', payload: items
})

export const clearDownloads = (): ClearDownloadsAction => ({
    type: 'downloads/clear'
})


export const addDownload = (item: Download): AddDownloadAction => ({
    type: 'download/add',
    payload: item
})

export const updateDownload = (delta: Partial<Download>): UpdateDownloadAction => ({
    type: 'download/update',
    payload: delta
})


export const pauseDownload = (id: number): PauseDownloadAction => ({
    type: 'download/pause', payload: id
})

export const cancelDownload = (id: number): CancelDownloadAction => ({
    type: 'download/cancel', payload: id
})

export const resumeDownload = (id: number): ResumeDownloadAction => ({
    type: 'download/resume', payload: id
})

export const showDownload = (id: number): ShowDownloadAction => ({
    type: 'download/show', payload: id
})

export const openDownload = (id: number): OpenDownloadAction => ({
    type: 'download/open', payload: id
})

export const retryDownload = (id: number): RetryDownloadAction => ({
    type: 'download/retry', payload: id
})

export const removeDownload = (id: number): RemoveDownloadAction => ({
    type: 'download/remove', payload: id
})

export const acceptDangerDownload = (id: number): AcceptDangerDownloadAction => ({
    type: 'download/accept-danger', payload: id
})

export const copyLinkDownload = (id: number): CopyLinkDownloadAction => ({
    type: 'download/copy-link', payload: id
})