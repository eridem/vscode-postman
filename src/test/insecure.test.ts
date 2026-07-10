import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as https from 'node:https';
import type { AddressInfo } from 'node:net';

declare var require: any;
declare var __dirname: string;

const newman = require('newman');

const fixturesDir = path.join(__dirname, 'fixtures');
const collectionPath = path.join(fixturesDir, 'insecure.postman_collection.json');
const key = fs.readFileSync(path.join(fixturesDir, 'selfsigned.key'));
const cert = fs.readFileSync(path.join(fixturesDir, 'selfsigned.cert'));

// Start a throwaway HTTPS server backed by the committed self-signed certificate
// and return its ephemeral port plus a stop() to close it.
function startSelfSignedServer(): Promise<{ port: number; stop: () => Promise<void> }> {
    return new Promise((resolve) => {
        const server = https.createServer({ key, cert }, (_req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('ok');
        });
        server.listen(0, '127.0.0.1', () => {
            const port = (server.address() as AddressInfo).port;
            resolve({
                port,
                stop: () => new Promise<void>((r) => server.close(() => r()))
            });
        });
    });
}

// Run the fixture collection against the local server, mapping the `insecure`
// selection exactly as exec-newman does: a selected key becomes `insecure: true`.
function runAgainst(port: number, insecure: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
        newman.run(
            {
                collection: collectionPath,
                globalVar: [{ key: 'port', value: String(port) }],
                insecure: insecure || undefined,
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

test('insecure option lets a self-signed HTTPS request succeed (issue #20)', { timeout: 120000 }, async () => {
    const { port, stop } = await startSelfSignedServer();
    try {
        const summary = await runAgainst(port, true);

        assert.ok(!summary.run.error, `Newman raised a run error: ${summary.run.error}`);
        assert.equal(summary.run.stats.requests.failed, 0, 'the request should not fail with insecure enabled');
        assert.equal(
            summary.run.failures.length,
            0,
            `expected no failures, got: ${summary.run.failures.map((f: any) => f.error && (f.error.message || f.error.test)).join(', ')}`
        );
    } finally {
        await stop();
    }
});

test('without insecure a self-signed HTTPS request is rejected (issue #20)', { timeout: 120000 }, async () => {
    const { port, stop } = await startSelfSignedServer();
    try {
        const summary = await runAgainst(port, false);

        assert.ok(
            summary.run.failures.length > 0,
            'expected the request to fail SSL validation when insecure is not enabled'
        );
    } finally {
        await stop();
    }
});
