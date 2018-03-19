import * as React from 'react'
import * as classNames from 'classnames'
import DownloadList from '../downloadList'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import { createMuiTheme } from 'material-ui/styles'

import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import Menu, { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'

import * as options from '../../helpers/options'

import * as style from './styles.css'

export default class Popup extends React.Component {
    private downloadList: DownloadList

    public state = {
        anchorEl: null,
        useAppBar: false,
        colorful: false,
        theme: 'light' as 'dark' | 'light'
    }

    public componentWillMount() {
        options.getOption('useAppBar').then(useAppBar => this.setState({ useAppBar }))
        options.getOption('colorful').then(colorful => this.setState({ colorful }))
        options.getOption('theme').then(theme => this.setState({ theme }))
    }

    private handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget })
    }

    private handleClose = () => {
        this.setState({ anchorEl: null })
    }

    public render() {
        const { anchorEl, useAppBar, colorful, theme } = this.state
        const open = Boolean(anchorEl)

        const themeStyle = createMuiTheme({
            palette: {
                type: theme,
            }
        })

        return (
            <MuiThemeProvider theme={themeStyle}>
                <Paper>
                    {useAppBar
                        ? <AppBar className={classNames(style.appBar, { [style.appBarColorful]: colorful })} position="static" color="default">
                            <Toolbar>
                                <Typography className={style.title} variant="title" color="inherit">Downloads</Typography>
                                <div>
                                    <IconButton className={style.menuButton} aria-owns={open ? 'menu-appbar' : null} aria-haspopup="true" onClick={this.handleMenu} color="inherit">
                                        <MoreVertIcon />
                                    </IconButton>
                                </div>
                            </Toolbar>
                        </AppBar> : undefined}
                    <DownloadList ref={x => this.downloadList = x} />
                    {!useAppBar
                        ? <Button className={style.floatingMenuButton} variant="fab" color="primary" aria-label="add" aria-owns={open ? 'menu-appbar' : null} aria-haspopup="true" onClick={this.handleMenu}>
                            <MoreVertIcon />
                        </Button> : undefined}
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={open}
                        onClose={this.handleClose}>
                        <MenuItem onClick={() => { this.handleClose(); chrome.downloads.showDefaultFolder() }}>Open Folder</MenuItem>
                        <MenuItem onClick={() => { this.handleClose(); chrome.tabs.create({ url: 'chrome://downloads' }) }}>Show All Downloads</MenuItem>
                        <Divider />
                        <MenuItem onClick={() => { this.handleClose(); this.downloadList.clear() }}>Clear</MenuItem>
                    </Menu>
                </Paper>
            </MuiThemeProvider>
        )
    }
}