'use strict';
import * as vscode from 'vscode';
import * as models from '../models.d';
import * as utils from '../utils';
import * as newman from '../exec-newman';
declare var require: any

export class RunnerRunQuestionMode implements models.ICommand {
    private COLLECTION_EXTENSION = "postman_collection.json";
    private ENVIRONMENT_EXTENSION = "postman_environment.json";
    private ALL_TEXT = '- ALL -';
    private DEFAULT_NR_INTERACTIONS: number = 1;
    private DEFAULT_DELAY: number = 0;

    private _toolbarItem: vscode.StatusBarItem;

    private _collectionFiles: Array<vscode.Uri>;
    private _environmentFiles: Array<vscode.Uri>;

    private _collectionFile: string;
    private _folder: string;
    private _environmentFile: string;
    private _iteractions: number;
    private _delay: number;

    public cleanUp(): void {
        this._collectionFiles = null;
        this._environmentFiles = null;
        this._collectionFile = null;
        this._folder = null;
        this._environmentFile = null;
        this._iteractions = null;
        this._delay = null;
    }

    public subscribe(context: vscode.ExtensionContext, toolbarItem: vscode.StatusBarItem) {
        console.log('Registering: RunnerRunQuestionMode');
        this._toolbarItem = toolbarItem;

        let disposable = vscode.commands.registerCommand('extension.question-mode', () => {
            try {
                this.cleanUp();
                this.getCollectionFiles()
                    .then(() => this.errorIfNotCollectionsFound()
                    .then(() => this.askForCollections()
                    .then(() => this.askForFolder()
                    .then(() => this.getEnvironmentFiles()
                    .then(() => this.askForEnvironments()
                    .then(() => this.askForInteractions()
                    .then(() => this.askForDelay()
                    .then(() => this.onDoneWithQuestions()
                    ))))))));
            } catch(ex) {
                console.error(ex);
            }
        });
        context.subscriptions.push(disposable)
    }

//region Private

    private getOnlyFileNames(files: Array<vscode.Uri>) {
        // Get just names of files
        let rootPath = vscode.workspace.rootPath;
        let fileNames = files.map((f) => f.fsPath.replace(rootPath, ""));
        let fileNamesSort = fileNames.sort(utils.sortTextAlphabeticallyFn);
        return fileNamesSort;
    }

    private getCollectionFiles(): Promise<void> {
        return new Promise<void>((resolve) => {
            vscode.workspace.findFiles(`*.${this.COLLECTION_EXTENSION}`, "").then((files) => {
                // Save value
                this._collectionFiles = files;
                resolve();
            });
        })
    }

    private errorIfNotCollectionsFound(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // Show message if no collection files found
            if (this._collectionFiles.length === 0) {
                vscode.window.showInformationMessage(`No files with extension "${this.COLLECTION_EXTENSION}" found.`);
                return reject();
            }
            resolve();
        })
    }

    private getEnvironmentFiles(): Promise<void> {
        return new Promise<void>((resolve) => {
            vscode.workspace.findFiles(`*.${this.ENVIRONMENT_EXTENSION}`, "").then((files) => {
                // Save value
                this._environmentFiles = files;

                resolve();
            });
        })
    }

    private askForCollections(): Promise<void> {
        return new Promise<void>((resolve) => {
            let fileNames = this.getOnlyFileNames(this._collectionFiles);

            vscode.window.showQuickPick(fileNames, { placeHolder: 'Collection files' }).then((value) => {
                // Save value
                this._collectionFile = vscode.workspace.rootPath + value;

                resolve();
            })
        })
    }

    private getFoldersForVersion1(collection:any):Array<string> {
        return collection.folders.map(f => f.name)
    }

    private getFoldersForVersion2(collection:any):Array<string> {
        return collection.item.filter(f => f.item).map(f => f.name)
    }

    private askForFolder(): Promise<void> {
        return new Promise<void>((resolve) => {
            // Parse collection
            let collection = require(this._collectionFile)
            let folders = []

            // Filter by version of the collection
            if (collection.folders || collection.requests) {
                folders = [this.ALL_TEXT, ...this.getFoldersForVersion1(collection)];
            } else {
                folders = [this.ALL_TEXT, ...this.getFoldersForVersion2(collection)];
            }

            // If not folders, skip step
            if (folders.length === 1) {
                return resolve();
            }

            vscode.window.showQuickPick(folders, { placeHolder: 'Folders' }).then((value) => {
                // Save value
                this._folder = value === this.ALL_TEXT ? null : value;

                resolve();
            });
        })
    }

    private askForInteractions(): Promise<void> {
        return new Promise<void>((resolve) => {
            vscode.window.showInputBox({ placeHolder: `Number of iteractions (default: ${this.DEFAULT_NR_INTERACTIONS})` }).then((value) => {
                // Save value
                this._iteractions = parseInt(value) || this.DEFAULT_NR_INTERACTIONS

                resolve();
            });
        })
    }

    private askForDelay(): Promise<void> {
        return new Promise<void>((resolve) => {
            vscode.window.showInputBox({ placeHolder: `Delay (default: ${this.DEFAULT_DELAY})` }).then((value) => {
                // Save value
                this._delay = parseInt(value) || this.DEFAULT_DELAY;

                resolve();
            });
        })
    }

    private askForEnvironments(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this._environmentFiles) return resolve();

            let fileNames = this.getOnlyFileNames(this._environmentFiles);
            vscode.window.showQuickPick(fileNames, { placeHolder: 'Environments' }).then((value) => {
                // Save value
                this._environmentFile = vscode.workspace.rootPath + value;

                resolve();
            });
        })
    }

    private onDoneWithQuestions(): void {
        const newmanOptions: models.INewManOpts = {
            collection: this._collectionFile,
            folder: this._folder,
            environment: this._environmentFile,
            iteractions: this._iteractions,
            delay: this._delay
        }

        newman.execNewman(newmanOptions, this._toolbarItem);
    }

//endregion
}