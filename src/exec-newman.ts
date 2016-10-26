declare var require: any

import * as models from './models.d';
import * as vscode from 'vscode';

const ITERACTION_ICON = "↻ ";
const FOLDER_ICON = "❏ ";
const REQUEST_ICON = "⇆ ";
const PASS_ICON = "✓ ";
const FAIL_ICON = "✖ ";
const HORIZONTAL_LINE = '\n------------------\n';

const ITERACTION_PADDING = "";
const FOLDER_PADDING = ITERACTION_PADDING + "  ";
const REQUEST_PADDING = FOLDER_PADDING + " ";
const REQUEST_URL_PADDING = REQUEST_PADDING + "  ";
const TEST_PADDING = REQUEST_URL_PADDING + "  ";

let _latestFolder = null;
let _isNewFolder = false;

let _toolbarItem: vscode.StatusBarItem;
let channel = vscode.window.createOutputChannel('Postman Results');

function changeToolbar(description: string) {
    _toolbarItem.text = 'Postman - ' + description;
}

function appendToChannel(description: string) {
    channel.show();
    channel.appendLine(description);
}

function execNewman(opts: models.INewManOpts, toolbarItem: vscode.StatusBarItem) {
    const newman = require('newman');
    _toolbarItem = toolbarItem;
    _latestFolder = null;
    _isNewFolder = false;

    appendToChannel(`Preparing tests...${HORIZONTAL_LINE}`);
    changeToolbar(`Preparing tests...`);

    newman.run({
        collection: require(opts.collection),
        environment: require(opts.environment),
        folder: opts.folder,
        delayRequest: opts.delay,
        iterationCount: opts.iteractions
    })
        .on('beforeItem', function (err, args) {
            if (_latestFolder !== args.item.__parent.__parent.name) {
                _latestFolder = args.item.__parent.__parent.name
                appendToChannel('\n' + FOLDER_PADDING + FOLDER_ICON + _latestFolder);
                _isNewFolder = true;
            }
        })
        .on('beforeRequest', function (err, args) {
            if (err) {
                changeToolbar('There was an error getting request.')
                appendToChannel('There was an error getting request.')
            } else {
                appendToChannel((_isNewFolder ? '' : '\n') + REQUEST_PADDING + REQUEST_ICON + args.item.name);
                changeToolbar('Running: ' + args.item.name);
            }
            _isNewFolder = false;
        })
        .on('request', function (err, args) {
            if (err) {
                changeToolbar('There was an error getting request.')
            } else {
                let request = args.request
                let response = args.response
                let url = request.url
                var size = response && response.size();
                size = size && (size.header || 0) + (size.body || 0) || 0;
                let message = `${request.method} ${url.protocol}://${url.host.join(".")}/${url.path.join('/')} [${response.code} ${response.status}, ${size}B, ${response.responseTime}ms]`
                appendToChannel(REQUEST_URL_PADDING + message);
            }
        })
        .on('assertion', function (err, o) {
            let passed = !err;

            // print each test assertions
            let message = (passed ? PASS_ICON : FAIL_ICON) + o.assertion
            appendToChannel(TEST_PADDING + message);
        })
        .on('done', function (err, summary) {
            let stats = summary.run.stats;
            let duration = (summary.run.timings.completed - summary.run.timings.started) / 1000;
            let message = `Duration: ${duration}sec | Iterations: ${stats.iterations.total} | Tests: ${stats.tests.total} | Assertions failed: ${stats.assertions.failed}`;
            changeToolbar(message);
            appendToChannel(`${HORIZONTAL_LINE}${message}`);
        })
        .on('beforeIteration', function (err, args) {
            appendToChannel(ITERACTION_PADDING + ITERACTION_ICON + "Iteraction " + (args.cursor.iteration + 1));
        });
}

export { execNewman };