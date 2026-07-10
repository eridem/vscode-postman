const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
    const ctx = await esbuild.context({
        entryPoints: ['src/extension.ts'],
        bundle: true,
        format: 'cjs',
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: 'node',
        outfile: 'dist/extension.js',
        // `vscode` is provided by the host. `newman` resolves its reporters
        // (e.g. `newman-reporter-html`) dynamically at runtime, so it and its
        // companions stay external and are shipped in `node_modules`.
        external: ['vscode', 'newman', 'newman-reporter-html', 'shelljs'],
        logLevel: 'silent',
        plugins: [esbuildProblemMatcherPlugin],
    });

    if (watch) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

/**
 * Emits build start/end markers so the VS Code $esbuild-watch problem matcher
 * can surface bundling errors in the Problems panel.
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
    name: 'esbuild-problem-matcher',
    setup(build) {
        build.onStart(() => {
            console.log('[watch] build started');
        });
        build.onEnd((result) => {
            result.errors.forEach(({ text, location }) => {
                console.error(`✘ [ERROR] ${text}`);
                if (location) {
                    console.error(`    ${location.file}:${location.line}:${location.column}:`);
                }
            });
            console.log('[watch] build finished');
        });
    },
};

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
