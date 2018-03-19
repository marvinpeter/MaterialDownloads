import * as React from 'react'
import * as classNames from 'classnames'
import * as style from './styles.css'

export interface ActionButtonProps {
    primary?: boolean
    onClick?: () => void
    children: any
}

export default function ActionButton({ primary, onClick, children }: ActionButtonProps) {
    return (
        <a className={classNames(style.actionButton, { [style.primary]: primary })} onClick={onClick}>{children}</a>
    )
}