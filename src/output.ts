import * as vscode from 'vscode';
import { Config } from './config';

export class Output {
    public constructor(private _channel: vscode.OutputChannel, private _config: Config) {}

    public appendText(description: string): void {
        if (this._config.showOutputAutomatically) {
            this._channel.show();
        }
        this._channel.appendLine(description);
    }
}