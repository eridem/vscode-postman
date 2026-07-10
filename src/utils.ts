function sortTextAlphabeticallyFn(a:string, b:string) {
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
}

interface HeaderEntry {
    key: string;
    value: string;
}

interface KeyValue {
    key: string;
    value: string;
}

/**
 * Parses a user-supplied string of global variables into the `{key, value}`
 * pairs Newman expects for its `globalVar` option (see issue #15).
 *
 * Pairs are separated by `;` or newlines; within a pair the first `=` splits
 * the key from the value, so values may themselves contain `=`. Keys and
 * values are trimmed, empty segments are dropped, and a pair without a key is
 * ignored. A pair with no `=` becomes a key with an empty value.
 *
 * Example: `token=abc123; host=https://example.com` ->
 *   [{ key: 'token', value: 'abc123' }, { key: 'host', value: 'https://example.com' }]
 */
function parseGlobalVars(input: string | null | undefined): KeyValue[] {
    if (!input) return [];
    return input
        .split(/[;\n]/)
        .map(pair => pair.trim())
        .filter(pair => pair.length > 0)
        .map(pair => {
            const separatorIndex = pair.indexOf('=');
            if (separatorIndex === -1) {
                return { key: pair, value: '' };
            }
            return {
                key: pair.slice(0, separatorIndex).trim(),
                value: pair.slice(separatorIndex + 1).trim()
            };
        })
        .filter(entry => entry.key.length > 0);
}

/**
 * Builds the header list to display for a request.
 *
 * For `formdata` bodies Newman injects the `Content-Type` header (with the
 * generated boundary) at the transport layer, so it is never present in the
 * request-header collection. As a result any representation that iterates over
 * the declared headers shows Content-Type missing even though it is actually
 * sent. We synthesize a `Content-Type: multipart/form-data` entry so the
 * displayed headers match what leaves the machine. See issue #26.
 */
function buildDisplayHeaders(headers: HeaderEntry[] | null | undefined, bodyMode?: string | null): HeaderEntry[] {
    const result = (headers || []).map(h => ({ key: h.key, value: h.value }));
    const hasContentType = result.some(h => h.key.toLowerCase() === 'content-type');
    if (bodyMode === 'formdata' && !hasContentType) {
        result.push({ key: 'Content-Type', value: 'multipart/form-data' });
    }
    return result;
}

export { sortTextAlphabeticallyFn, buildDisplayHeaders, parseGlobalVars, HeaderEntry, KeyValue };