import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import * as classNames from 'classnames'
import * as React from 'react'
import { pure } from 'recompose'

import * as style from './styles'

export interface BarLayoutProps {
    colorful: boolean
    open: boolean
    handleMenuOpen: (e: any) => void
    children: JSX.Element | JSX.Element[]
}

export const BarLayout = ({ colorful, open, handleMenuOpen, children }) => (
    <>
        <AppBar className={classNames(style.appBar, { [style.appBarColorful]: colorful })} position="static" color="default">
            <Toolbar>
                <Typography className={style.title} variant="title" color="inherit">Downloads</Typography>
                <div>
                    <IconButton className={style.menuButton} aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup="true" onClick={handleMenuOpen} color="inherit">
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
        {children}
    </>
)

export default pure<BarLayoutProps>(BarLayout)