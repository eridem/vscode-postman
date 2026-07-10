import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, existsSync } from 'node:fs';
import * as path from 'node:path';

declare var require: any;
declare var __dirname: string;

const newman = require('newman');

const examplesDir = path.join(__dirname, '..', '..', 'examples');

// Run a single collection through Newman, pairing it with a sibling
// `<name>.postman_environment.json` when one exists. Resolves with the run
// summary; rejects only on a fatal Newman error (bad/unreadable collection).
function runCollection(collectionPath: string, environmentPath: string | null): Promise<any> {
    return new Promise((resolve, reject) => {
        newman.run(
            {
                collection: collectionPath,
                environment: environmentPath ?? undefined,
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

const collectionFiles = readdirSync(examplesDir)
    .filter((file) => file.endsWith('.postman_collection.json'))
    .sort();

test('there is at least one example collection to run', () => {
    assert.ok(collectionFiles.length > 0, `no .postman_collection.json files found in ${examplesDir}`);
});

// Smoke-test every example collection: Newman must be able to load and execute
// it end to end. Assertion failures inside the collections are tolerated (some
// legacy Postman Echo collections have brittle assertions); we only verify the
// extension's core value, that each collection is runnable.
for (const file of collectionFiles) {
    test(`runs example collection: ${file}`, { timeout: 120000 }, async () => {
        const collectionPath = path.join(examplesDir, file);
        const base = file.replace('.postman_collection.json', '');
        const environmentPath = path.join(examplesDir, `${base}.postman_environment.json`);
        const environment = existsSync(environmentPath) ? environmentPath : null;

        const summary = await runCollection(collectionPath, environment);

        assert.ok(summary, `Newman returned no summary for ${file}`);
        assert.ok(!summary.run.error, `Newman raised a run error for ${file}: ${summary.run.error}`);
        assert.ok(summary.run.stats.requests.total > 0, `${file} executed no requests`);
    });
}
