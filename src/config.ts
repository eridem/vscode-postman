import * as vscode from 'vscode';
let shell = require('shelljs');

export class Config {
    private _CONFIG_MAIN_KEY: string = 'postman';
    private _CONFIG_SHOW_INFO_MESSAGE: string = 'showRunInfoMessage';
    private _CONFIG_SHOW_RESULTS_IN_NEW_DOCUMENT: string = 'showResultsInNewDocument';
    private _CONFIG_SHOW_OUTPUT_AUTOMATICALLY: string = 'showOutputAutomatically';
    private _CONFIG_SHOW_PROGRESS_IN_TOOLBAR: string = 'showProgressInToolbar';
    private _CONFIG_TEST_DEFAULT_DELAY: string = 'testDefaultDelay';
    private _CONFIG_TEST_DEFAULT_ITERATIONS: string = 'testDefaultIterations';

    private _workspaceConfiguration: vscode.WorkspaceConfiguration = null;

    private get WorkspaceConfiguration(): vscode.WorkspaceConfiguration {
        if (!this._workspaceConfiguration) {
            this._workspaceConfiguration = vscode.workspace.getConfiguration(this._CONFIG_MAIN_KEY);
        }
        return this._workspaceConfiguration;
    }

    public get showRunInfoMessage(): boolean {
        return this.WorkspaceConfiguration.get<boolean>(this._CONFIG_SHOW_INFO_MESSAGE, true);
    }

    public get showResultsInNewDocument(): boolean {
        return this.WorkspaceConfiguration.get<boolean>(this._CONFIG_SHOW_RESULTS_IN_NEW_DOCUMENT, true);
    }

    public get showOutputAutomatically(): boolean {
        return this.WorkspaceConfiguration.get<boolean>(this._CONFIG_SHOW_OUTPUT_AUTOMATICALLY, true);
    }

    public get showProgressInToolbar(): boolean {
        return this.WorkspaceConfiguration.get<boolean>(this._CONFIG_SHOW_PROGRESS_IN_TOOLBAR, true);
    }

    public get resultsFileDir(): string {
        return shell.tempdir();
    }

    public get testDefaultDelay() {
        return this.WorkspaceConfiguration.get<number>(this._CONFIG_TEST_DEFAULT_DELAY, 0);
    }

    public get testDefaultIterations() {
        return this.WorkspaceConfiguration.get<number>(this._CONFIG_TEST_DEFAULT_ITERATIONS, 1);
    }
}