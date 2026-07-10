import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as path from 'node:path';
import { parseGlobalVars } from '../utils';

declare var require: any;
declare var __dirname: string;

const newman = require('newman');

const collectionPath = path.join(
    __dirname, '..', '..', 'examples', 'global-vars.postman_collection.json'
);

// Run the global-vars example collection, injecting the given global variables
// exactly as the extension does: a user string is parsed into `{key, value}`
// pairs and handed to Newman's `globalVar` option. Resolves with the summary.
function runWithGlobals(globalVarInput: string): Promise<any> {
    const globalVar = parseGlobalVars(globalVarInput);
    return new Promise((resolve, reject) => {
        newman.run(
            {
                collection: collectionPath,
                globalVar: globalVar.length ? globalVar : undefined,
                reporters: [],
                timeoutRequest: 15000
            },
            (err: any, summary: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(summary);
                }
            }
        );
    });
}

test('injected global variables reach the run and pass assertions (issue #15)', { timeout: 120000 }, async () => {
    const summary = await runWithGlobals('token=s3cr3t-value');

    assert.ok(!summary.run.error, `Newman raised a run error: ${summary.run.error}`);
    assert.ok(summary.run.stats.requests.total > 0, 'no requests executed');
    assert.equal(
        summary.run.failures.length,
        0,
        `expected no assertion failures, got: ${summary.run.failures.map((f: any) => f.error && f.error.test).join(', ')}`
    );
});

test('without a global variable the token assertions fail (issue #15)', { timeout: 120000 }, async () => {
    const summary = await runWithGlobals('');

    assert.ok(!summary.run.error, `Newman raised a run error: ${summary.run.error}`);
    assert.ok(
        summary.run.failures.length > 0,
        'expected assertion failures when the `token` global is not provided'
    );
});
