declare var require: any

import * as models from './models.d';
import * as vscode from 'vscode';
import * as path from 'path';
import { Config } from './config';
import { Toolbar } from './toolbar';
import { Output } from './output';
import { Symbol, Space } from './formating';

let _latestFolder = null;
let _isNewFolder = false;

let toolbar: Toolbar;
let output: Output;

function execNewman(opts: models.INewManOpts, toolbarItem: vscode.StatusBarItem, config: Config) {
    const newman = require('newman');
    toolbar = new Toolbar(toolbarItem, config);
    output = new Output(vscode.window.createOutputChannel('Postman Results'), config);

    _latestFolder = null;
    _isNewFolder = false;

    // Show or hide info message
    if (config.showRunInfoMessage) {
        vscode.window.showInformationMessage('Postman tests are loading. You can see the progress in the OUTPUT window.');
    }

    // Messages on toolbar
    output.appendText(`Preparing tests...${Symbol.HORIZONTAL_LINE}`);
    toolbar.changeText(`Preparing tests...`);

    // Preparing options
    let newmanOptions = {
        collection: require(opts.collection),
        environment: opts.environment ? require(opts.environment) : null,
        folder: opts.folder,
        delayRequest: opts.delay,
        iterationCount: opts.iteractions,
        iterationData: opts.data,
        reporters: null,
        reporter: null
    };

    // Save results using a template
    if (config.showResultsInNewDocument) {
        let resultsFilePath = path.join(config.resultsFileDir, './vscode-postman-results/results-' + new Date().toISOString().replace(/[-|:|Z|\.]/gi, '_').replace(/T/gi, '-') + '.yml');
        newmanOptions.reporters = ['html'];
        newmanOptions.reporter = { html: { export: resultsFilePath, template: path.join(__dirname, '../../html-templates', 'template.hbs') } }
    }

    newman.run(newmanOptions)
        .on('beforeItem', function (err, args) {
            if (_latestFolder !== args.item.__parent.__parent.name) {
                _latestFolder = args.item.__parent.__parent.name
                output.appendText('\n' + Space.FOLDER_PADDING + Symbol.FOLDER_ICON + _latestFolder);
                _isNewFolder = true;
            }
        })
        .on('beforeRequest', function (err, args) {
            if (err) {
                toolbar.changeText('There was an error getting request.')
                output.appendText('There was an error getting request.')
            } else {
                toolbar.changeText('Running: ' + args.item.name);
                output.appendText((_isNewFolder ? '' : '\n') + Space.REQUEST_PADDING + Symbol.REQUEST_ICON + args.item.name);
            }
            _isNewFolder = false;
        })
        .on('request', function (err, args) {
            if (err) {
                toolbar.changeText('There was an error getting request.')
            } else {
                let request = args.request
                let response = args.response
                let url = request.url
                var size = response && response.size();
                size = size && (size.header || 0) + (size.body || 0) || 0;
                let message = `${request.method} ${url.protocol}://${url.host.join(".")}/${url.path.join('/')} [${response.code} ${response.status}, ${size}B, ${response.responseTime}ms]`
                output.appendText(Space.REQUEST_URL_PADDING + message);
            }
        })
        .on('assertion', function (err, o) {
            let passed = !err;

            // print each test assertions
            let message = (passed ? Symbol.PASS_ICON : Symbol.FAIL_ICON) + o.assertion
            output.appendText(Space.TEST_PADDING + message);
        })
        .on('done', function (err, summary) {
            // Results on toolbar and output
            let stats = summary.run.stats;
            let duration = (summary.run.timings.completed - summary.run.timings.started) / 1000;
            let message = `Duration: ${duration}sec | Iterations: ${stats.iterations.total} | Tests: ${stats.tests.total} | Assertions failed: ${stats.assertions.failed}`;
            toolbar.changeText(message);
            output.appendText(`${Symbol.HORIZONTAL_LINE}${message}`);

            // Open automatically new document with results
            if (config.showResultsInNewDocument) {
                vscode.workspace.openTextDocument(vscode.Uri.file(newmanOptions.reporter.html.export)).then(doc => {
                    vscode.window.showTextDocument(doc, vscode.ViewColumn.One);
                });
            }
        })
        .on('beforeIteration', function (err, args) {
            output.appendText(Space.ITERACTION_PADDING + Symbol.ITERACTION_ICON + "Iteraction " + (args.cursor.iteration + 1));
        });
}

export { execNewman };