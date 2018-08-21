import { css } from 'emotion'

export const downloads = css({
    minHeight: 210,
    maxHeight: 400,
    overflowY: 'auto',
    overflowX: 'hidden',

    '&:hover': {
        '&::-webkit-scrollbar-thumb': {
            display: 'initial'
        }
    },

    '&::-webkit-scrollbar': {
        width: 4
    },

    '&::-webkit-scrollbar-thumb': {
        display: 'none',
        backgroundColor: 'var(--chrome-primary-color)'
    }
})