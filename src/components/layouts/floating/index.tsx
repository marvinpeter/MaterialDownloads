import { Button } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import * as React from 'react'
import { pure } from 'recompose'

import * as style from './styles'

export interface FloatingLayoutProps {
    open: boolean
    handleMenuOpen: (e: any) => void
    children: JSX.Element | JSX.Element[]
}

export const FloatingLayout = ({ open, handleMenuOpen, children }) => (
    <>
        {children}
        <Button className={style.floatingMenuButton} variant="fab" color="primary" aria-label="add" aria-owns={open ? 'menu-appbar' : null}
            aria-haspopup="true" onClick={handleMenuOpen}>
            <MoreVertIcon />
        </Button>
    </>
)

export default pure<FloatingLayoutProps>(FloatingLayout)