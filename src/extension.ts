'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as models from './models.d';
import { RunnerRunQuestionMode } from './commands/question-mode';

let _commands: Array<models.ICommand> = [];
function getCommands(): Array<models.ICommand> {
    if (!_commands.length) {
        _commands = [
            new RunnerRunQuestionMode()
        ]
    }
    return _commands;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const toolbarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    toolbarItem.text = 'Postman';
    toolbarItem.show();
    getCommands().forEach(c => c.subscribe(context, toolbarItem));
}

// this method is called when your extension is deactivated
export function deactivate() {
}