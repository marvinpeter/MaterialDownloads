import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { compose, lifecycle, withHandlers, withState } from 'recompose'

import { Option, Switch } from '../../components/form'
import * as message from '../../helpers/message'
import * as options from '../../helpers/options'

interface State {
    iconColor: string
    theme: string
    useAppBar: boolean
    colorful: boolean
}

interface OptionInnerProps extends State {
    setState: (state: State) => void
    updateValue: (e: React.ChangeEvent<HTMLInputElement>) => void
    updateSwitch: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const enhancer = compose<OptionInnerProps, {}>(
    withState('state', 'setState', {
        iconColor: '',
        theme: '',
        useAppBar: true,
        colorful: true
    } as State),

    lifecycle<OptionInnerProps, OptionInnerProps>({
        componentDidMount() {
            if (typeof document !== 'undefined') {
                // tslint:disable-next-line:no-invalid-this no-this
                options.getOptions().then(res => this.setState(res))
            }
        }
    }),

    withHandlers({
        updateValue: ({ setState, iconColor, theme, useAppBar, colorful }: OptionInnerProps) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setState({ iconColor, theme, useAppBar, colorful, [e.target.name]: e.target.value })
            options.setOption(e.target.name as any, e.target.value as any)
            if (e.target.name === 'iconColor') {
                message.send(message.Type.UpdateIcon)
            }
        },

        updateSwitch: ({ setState, iconColor, theme, useAppBar, colorful }: OptionInnerProps) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setState({ iconColor, theme, useAppBar, colorful, [e.target.name]: e.target.checked })
            options.setOption(e.target.name as any, e.target.checked)
        }
    })
)

export const Options = enhancer(({ iconColor, theme, useAppBar, colorful, updateSwitch, updateValue }) => (
    <div style={{ margin: 10 }}>
        <Option name="iconColor" label="Icon theme" value={iconColor}
            onChange={updateValue} options={['Light', 'Dark']} />
        <Option name="theme" label="Theme" value={theme}
            onChange={updateValue} options={['Light', 'Dark']} />
        <br />
        <Switch name="useAppBar" label="Use app bar"
            checked={useAppBar} onChange={updateSwitch} />
        <Switch name="colorful" label="Colorful"
            checked={colorful} onChange={updateSwitch} />
    </div>
))

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () =>
        ReactDOM.hydrate(<Options />, document.getElementById('options')))
}