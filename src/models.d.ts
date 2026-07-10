import * as vscode from 'vscode';

export interface ICommand {
    subscribe(context: vscode.ExtensionContext, toolbarItem: vscode.StatusBarItem);
}

export interface INewManOpts {
    collection: string;
    folder: string | null;
    environment: string | null;
    iteractions: number;
    delay: number;
    data: string | null;
    workingDirectory: string;
    globalVars: Array<{ key: string; value: string }>;
    newmanArgs: string[];
}
