import { FormControlLabel, Switch as RawSwitch } from '@material-ui/core'
import * as React from 'react'
import { pure } from 'recompose';

export interface SwitchProps {
    name: string
    label: string
    checked: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Switch = ({ name, label, checked, onChange }: SwitchProps) => (
    <FormControlLabel label={label} control={
        <RawSwitch color="primary" {...{ name, checked, onChange }} />
    } />
)

export default pure<SwitchProps>(Switch)