declare var require: any

import * as models from './models.d';
import * as vscode from 'vscode';

let _toolbarItem: vscode.StatusBarItem;

function changeToolbar(description: string) {
    _toolbarItem.text = 'Postman - ' + description;
}

function execNewman(opts: models.INewManOpts, toolbarItem: vscode.StatusBarItem) {
    const newman = require('newman');
    _toolbarItem = toolbarItem;

    changeToolbar('Preparing tests...');
    
    newman.run({
        collection: require(opts.collection),
        environment: require(opts.environment),
        folder: opts.folder,
        delayRequest: opts.delay,
        iterationCount: opts.iteractions
    })
    .on('beforeRequest', function(err, summary) {
        if (err) {
            changeToolbar('There was an error getting request.')
        } else {
            changeToolbar('Running: ' + summary.item.name);
        }
    })
    .on('done', function(err, summary) {
        let stats = summary.run.stats;
        let duration = (summary.run.timings.completed - summary.run.timings.started) / 1000;
        let message = `Duration: ${duration}sec | Iterations: ${stats.iterations.total} | Tests: ${stats.tests.total} | Assertions failed: ${stats.assertions.failed}`;
        changeToolbar(message);
    });
}

export { execNewman };