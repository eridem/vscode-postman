import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortTextAlphabeticallyFn, buildDisplayHeaders, parseGlobalVars } from '../utils';

test('returns 0 for equal strings', () => {
    assert.equal(sortTextAlphabeticallyFn('a', 'a'), 0);
});

test('returns -1 when the first string sorts before the second', () => {
    assert.equal(sortTextAlphabeticallyFn('a', 'b'), -1);
});

test('returns 1 when the first string sorts after the second', () => {
    assert.equal(sortTextAlphabeticallyFn('b', 'a'), 1);
});

test('sorts an array alphabetically', () => {
    const files = ['c.json', 'a.json', 'b.json'];
    assert.deepEqual([...files].sort(sortTextAlphabeticallyFn), ['a.json', 'b.json', 'c.json']);
});

test('synthesizes Content-Type for formdata bodies when it is missing (issue #26)', () => {
    const headers = [{ key: 'User-Agent', value: 'PostmanRuntime/7' }];
    assert.deepEqual(buildDisplayHeaders(headers, 'formdata'), [
        { key: 'User-Agent', value: 'PostmanRuntime/7' },
        { key: 'Content-Type', value: 'multipart/form-data' }
    ]);
});

test('does not duplicate Content-Type when already present (case-insensitive)', () => {
    const headers = [{ key: 'content-type', value: 'multipart/form-data; boundary=xyz' }];
    assert.deepEqual(buildDisplayHeaders(headers, 'formdata'), headers);
});

test('leaves headers untouched for non-formdata bodies', () => {
    const headers = [{ key: 'Accept', value: '*/*' }];
    assert.deepEqual(buildDisplayHeaders(headers, 'raw'), headers);
});

test('handles missing headers and body mode', () => {
    assert.deepEqual(buildDisplayHeaders(null, null), []);
});

test('parses a single global variable pair (issue #15)', () => {
    assert.deepEqual(parseGlobalVars('token=abc123'), [{ key: 'token', value: 'abc123' }]);
});

test('parses multiple semicolon-separated global variables (issue #15)', () => {
    assert.deepEqual(parseGlobalVars('token=abc123; host=https://example.com'), [
        { key: 'token', value: 'abc123' },
        { key: 'host', value: 'https://example.com' }
    ]);
});

test('splits only on the first = so values may contain = (issue #15)', () => {
    assert.deepEqual(parseGlobalVars('auth=Basic dXNlcjpwYXNz=='), [
        { key: 'auth', value: 'Basic dXNlcjpwYXNz==' }
    ]);
});

test('trims keys and values and drops empty segments (issue #15)', () => {
    assert.deepEqual(parseGlobalVars('  token = abc123 ;; host=example.com '), [
        { key: 'token', value: 'abc123' },
        { key: 'host', value: 'example.com' }
    ]);
});

test('treats a pair without = as a key with an empty value (issue #15)', () => {
    assert.deepEqual(parseGlobalVars('flag'), [{ key: 'flag', value: '' }]);
});

test('ignores segments that have no key (issue #15)', () => {
    assert.deepEqual(parseGlobalVars('=orphan; token=abc'), [{ key: 'token', value: 'abc' }]);
});

test('accepts newlines as separators (issue #15)', () => {
    assert.deepEqual(parseGlobalVars('token=abc\nhost=example.com'), [
        { key: 'token', value: 'abc' },
        { key: 'host', value: 'example.com' }
    ]);
});

test('returns an empty array for empty or missing input (issue #15)', () => {
    assert.deepEqual(parseGlobalVars(''), []);
    assert.deepEqual(parseGlobalVars(null), []);
    assert.deepEqual(parseGlobalVars(undefined), []);
});
