import { Paper } from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider, Theme } from '@material-ui/core/styles'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { compose, lifecycle, withState, withStateHandlers } from 'recompose'

import { clearDownloads } from '../../actions'
import DownloadList from '../../components/downloadList'
import BarLayout from '../../components/layouts/bar'
import FloatingLayout from '../../components/layouts/floating'
import * as options from '../../helpers/options'
import { State } from '../../reducer'
import { bindActions, dispatch, store } from '../../store'
import PopupMenu from './menu'

interface Options {
    readonly useAppBar: boolean
    readonly colorful: boolean
    readonly theme: Theme
}

interface PopupInnerPros {
    anchorEl?: any

    options?: Options
    setOptions?: (opts: Options) => void

    handleMenuOpen?: (e: any) => void
    handleMenuClose?: (e: any) => void
    handleOpenFolder?: (e: any) => void
    handleShowDownloads?: (e: any) => void
    handleClear?: (e: any) => void
}

interface PopupOutterPros { }

type PopupProps = PopupInnerPros & PopupOutterPros

const downloadListPropMapper = ({ downloads }: State) => ({ downloads })
const downloadListActionMapper = bindActions(({ showDownload, openDownload, resumeDownload, pauseDownload, removeDownload, retryDownload, acceptDangerDownload, cancelDownload, copyLinkDownload }) => ({
    show: showDownload,
    open: openDownload,
    resume: resumeDownload,
    pause: pauseDownload,
    remove: removeDownload,
    retry: retryDownload,
    acceptDanger: acceptDangerDownload,
    cancel: cancelDownload,
    copyLink: copyLinkDownload
}))
const MappedDownloadList = connect(downloadListPropMapper, downloadListActionMapper)(DownloadList)

const selectTheme = (type: 'dark' | 'light' = 'light') => createMuiTheme({
    palette: { type },
    props: {
        MuiMenuItem: {
            style: {
                height: 10
            }
        }
    }
})

const enhancer = compose<PopupInnerPros, PopupOutterPros>(
    withState('options', 'setOptions', {
        useAppBar: false,
        colorful: false,
        theme: selectTheme()
    } as Options),

    lifecycle({
        async componentWillMount(this: { props: PopupProps }) {
            if (typeof document === 'undefined') {
                return
            }
            // tslint:disable-next-line:no-invalid-this no-this
            const { setOptions } = this.props
            const { useAppBar, colorful, theme } = await options.getOptions()
            setOptions({
                useAppBar, colorful,
                theme: selectTheme(theme)
            })
        }
    }),

    withStateHandlers({ anchorEl: null } as any, {
        handleMenuOpen: _ => event => ({ anchorEl: event.target }),
        handleMenuClose: () => () => ({ anchorEl: null }),

        handleOpenFolder: () => () => {
            chrome.downloads.showDefaultFolder()
            return { anchorEl: null }
        },

        handleShowDownloads: () => () => {
            chrome.tabs.create({ url: 'chrome://downloads' })
            return { anchorEl: null }
        },

        handleClear: () => () => {
            dispatch(clearDownloads())
            return { anchorEl: null }
        }
    })
)

export const Popup = enhancer(({ anchorEl, options: { useAppBar, theme, colorful }, handleClear, handleMenuClose, handleMenuOpen, handleOpenFolder, handleShowDownloads }: PopupProps) => (
    <MuiThemeProvider theme={theme}>
        <Paper>
            {useAppBar
                ? <BarLayout colorful={colorful} open={anchorEl !== null} handleMenuOpen={handleMenuOpen}>
                    <MappedDownloadList />
                </BarLayout>
                : <FloatingLayout open={anchorEl !== null} handleMenuOpen={handleMenuOpen}>
                    <MappedDownloadList />
                </FloatingLayout>}
            <PopupMenu anchorEl={anchorEl} handleClear={handleClear} handleMenuClose={handleMenuClose} handleOpenFolder={handleOpenFolder} handleShowDownloads={handleShowDownloads} />
        </Paper>
    </MuiThemeProvider>
))

if (process.env.NODE_ENV !== 'development' && typeof document !== 'undefined') {
    document.addEventListener('contextmenu', e => e.preventDefault())
}

if (typeof document !== 'undefined') {
    ReactDOM.render(
        <Provider store={store}>
            <Popup />
        </Provider>,
        document.getElementById('popup'))
}