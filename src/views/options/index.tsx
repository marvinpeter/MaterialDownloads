import * as React from "react";
import * as ReactDOM from "react-dom";

import { Option, Switch } from "../../components/form";
import * as message from "../../helpers/message";
import * as options from "../../helpers/options";

interface State {
    iconColor: string,
    theme: string,
    useAppBar: boolean,
    colorful: boolean,
    downloadTime: boolean,
}

export class Options extends React.Component<{}, State> {
    public state = {
        iconColor: "light",
        theme: "light",
        useAppBar: true,
        colorful: true,
        downloadTime: false
    };

    public componentDidMount() {
        if (typeof document !== "undefined") {
            // tslint:disable-next-line:no-invalid-this no-this
            options.getOptions().then(res => this.setState(res));
        }
    }

    private updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [e.target.name]: e.target.value } as any);
        options.setOption(e.target.name as any, e.target.value as any);
        if (e.target.name === "iconColor") {
            message.send(message.Type.UpdateIcon);
        }
    }

    private updateSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [e.target.name]: e.target.checked } as any);
        options.setOption(e.target.name as any, e.target.checked);
    }

    public render() {
        const { iconColor, theme, useAppBar, colorful, downloadTime } = this.state;
        return (
            <div style={{ margin: 10 }}>{console.log(colorful)}
                <Option name="iconColor" label="Icon" value={iconColor}
                    onChange={this.updateValue} options={["Light", "Dark"]} />
                <Option name="theme" label="Theme" value={theme}
                    onChange={this.updateValue} options={["Light", "Dark"]} />
                <br />
                <Switch name="useAppBar" label="Use app bar"
                    checked={useAppBar} onChange={this.updateSwitch} />
                <Switch name="colorful" label="Colorful"
                    checked={colorful} onChange={this.updateSwitch} />
                <Switch name="downloadTime" label="Show download time"
                    checked={downloadTime} onChange={this.updateSwitch} />
            </div>
        );
    }
}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () =>
        ReactDOM.hydrate(<Options />, document.getElementById("options")));
}