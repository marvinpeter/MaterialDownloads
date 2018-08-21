import { css } from 'emotion'

export const nameOpenable = css({
    '&:active': {
        color: 'var(--color-link-active)',
        cursor: 'pointer'
    },
    '&:hover': {
        color: 'var(--color-link-hover)',
        cursor: 'pointer'
    }
})

export const nameCrossedOut = css({
    textDecoration: 'line-through'
})

export const cutText = css({
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 250,
    whiteSpace: 'nowrap'
})

export const statusDetails = css({
    margin: '-5px 0 0 0'
})

export const url = css({
    fontSize: '0.75em',
    margin: 0
})

export const status = css({
    fontSize: '0.85em'
})

export const avatar = css({
    borderRadius: 0
})