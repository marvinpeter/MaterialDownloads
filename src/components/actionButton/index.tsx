import * as classNames from 'classnames'
import * as React from 'react'
import { pure } from 'recompose'

import * as style from './styles'

export interface ActionButtonProps {
    primary?: boolean
    onClick?: () => void
    children: any
}

export const ActionButton = ({ primary, onClick, children }: ActionButtonProps) => (
    <a className={classNames(style.actionButton, { [style.primary]: primary })}
        onClick={onClick}>{children}</a>
)

export default pure<ActionButtonProps>(ActionButton)