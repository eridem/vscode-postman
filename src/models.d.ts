import * as vscode from 'vscode';

export interface ICommand {
    subscribe(context: vscode.ExtensionContext, toolbarItem: vscode.StatusBarItem);
}

export interface INewManOpts {
    collection: string;
    folder: string;
    environment: string;
    iteractions: number;
    delay: number;
}