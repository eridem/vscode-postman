import * as vscode from 'vscode';
import { Config } from './config';

export class Toolbar {
    public constructor(private _toolbarItem: vscode.StatusBarItem, private _config: Config) {
        this._toolbarItem.text = 'Postman';
    }

    public changeText(description: string): void {
        if (this._config.showProgressInToolbar) {
            this._toolbarItem.text = 'Postman - ' + description;
        }
    }
}