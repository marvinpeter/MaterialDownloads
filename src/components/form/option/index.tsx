import { TextField } from '@material-ui/core'
import * as React from 'react'
import { pure } from 'recompose'

export interface OptionProps {
    name: string
    label: string
    value: string
    options: string[]
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Option = ({ name, label, value, options, onChange }: OptionProps) => (
    <TextField {...{ name, value, label, onChange }}
        SelectProps={{ native: true }}
        margin="normal"
        select>
        {options.map(elem => (
            <option value={elem.toLowerCase().replace(/\s+/g, '')}>{elem}</option>
        ))}
    </TextField>
)

export default pure<OptionProps>(Option)