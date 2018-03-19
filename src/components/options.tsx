import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as message from '../helpers/message'
import * as options from '../helpers/options'

import TextField from 'material-ui/TextField'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'
import Snackbar from 'material-ui/Snackbar'

export default class Options extends React.Component {
    public state = {
        status: '',
        iconColor: '',
        theme: '',
        startupClear: false,
        useAppBar: true,
        colorful: true
    }

    public componentWillMount() {
        options.getOptions().then(res => this.setState(res))
    }

    private showUpdateMessage = () => {
        this.setState({ status: 'Settings updated.' })
        setTimeout(() => this.setState({ status: '' }), 750)
    }

    private updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [e.target.name]: e.target.value })
        options.setOption(e.target.name as any, e.target.value as any)
        this.showUpdateMessage()
        if (e.target.name === 'iconColor') {
            message.send(message.Type.UpdateIcon)
        }
    }

    public updateSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [e.target.name]: e.target.checked })
        options.setOption(e.target.name as any, e.target.checked)
        this.showUpdateMessage()
    }

    public render() {
        return (
            <div style={{ margin: 10 }}>
                <TextField
                    name="iconColor"
                    label="Icon theme"
                    value={this.state.iconColor}
                    onChange={this.updateValue}
                    SelectProps={{ native: true }}
                    margin="normal"
                    select>
                    <option value={'light'}>Light</option>
                    <option value={'dark'}>Dark</option>
                </TextField>
                <TextField
                    name="theme"
                    label="Theme"
                    value={this.state.theme}
                    onChange={this.updateValue}
                    SelectProps={{ native: true }}
                    margin="normal"
                    select>
                    <option value={'light'}>Light</option>
                    <option value={'dark'}>Dark</option>
                </TextField>
                <FormControlLabel
                    control={
                        <Switch
                            name="startupClear"
                            checked={this.state.startupClear}
                            onChange={this.updateSwitch}
                            color="primary"
                        />
                    }
                    label="Clear downloads on startup"
                />
                <FormControlLabel
                    control={
                        <Switch
                            name="useAppBar"
                            checked={this.state.useAppBar}
                            onChange={this.updateSwitch}
                            color="primary"
                        />
                    }
                    label="Use app bar"
                />
                <FormControlLabel
                    control={
                        <Switch
                            name="colorful"
                            checked={this.state.colorful}
                            onChange={this.updateSwitch}
                            color="primary"
                        />
                    }
                    label="Colorful"
                />
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={Boolean(this.state.status)}
                    SnackbarContentProps={{ 'aria-describedby': 'message-id' }}
                    message={<span id="message-id">{this.state.status}</span>}
                />
            </div>
        )
    }
}