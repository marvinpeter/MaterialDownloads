import { css } from 'emotion'

export const appBar = css({
    height: '42px !important'
})

export const appBarColorful = css({
    backgroundColor: 'var(--chrome-primary-color) !important',
    color: 'white !important'
})

export const title = css({
    fontSize: '15px!important',
    lineHeight: '42px!important',
    position: 'absolute !important' as any,
    top: 0
})

export const menuButton = css({
    right: 0,
    top: 0,
    position: 'absolute !important' as any,
    height: '42px !important'
})