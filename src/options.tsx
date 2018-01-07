import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { sendMessage, MessageType } from './helpers/messages'
import Options from './helpers/options'

class OptionsView extends React.Component {
    public state = {
        status: '',
        iconColor: '',
        startupClear: false
    }

    public componentWillMount() {
        Options.all.then(res => this.setState(res))
    }

    private showUpdateMessage = () => {
        this.setState({ status: 'Settings updated.' })
        setTimeout(() => this.setState({ status: '' }), 750)
    }

    private updateIconColor = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ iconColor: e.target.value })
        Options.iconColor = e.target.value
        this.showUpdateMessage()
        sendMessage(MessageType.UpdateIcon)
    }

    public updateStartupClear = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ startupClear: e.target.checked })
        Options.startupClear = e.target.checked
        this.showUpdateMessage()
    }

    public render() {
        return (
            <div>
                <div style={{ display: 'inline-block' }}>
                    <label style={{ marginRight: 5 }}>Icon color:</label>
                    <select value={this.state.iconColor} onChange={this.updateIconColor}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <br />
                <div style={{ display: 'inline-block' }}>
                    <input type="checkbox" checked={this.state.startupClear} onChange={this.updateStartupClear} />
                    <label>Remove finished downloads on startup</label>
                </div>
                <div>{this.state.status}</div>
            </div>
        )
    }
}

document.addEventListener('DOMContentLoaded', () => ReactDOM.render(<OptionsView />, document.getElementById('options')));