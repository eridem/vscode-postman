### 2.1.1

- Feature: Question Mode now prompts for **extra Newman arguments** via a checkbox list (`--insecure` to disable SSL validation, `--bail`, `--ignore-redirects`, `--verbose`). Selections are remembered per workspace between sessions, so testing endpoints that use self-signed certificates just needs `--insecure` ticked once. [#20](https://github.com/eridem/vscode-postman/issues/20)
- Feature: Question Mode now prompts for **global variables** before a run, so you can inject values like `token=abc123; host=https://example.com` without editing an environment file. [#15](https://github.com/eridem/vscode-postman/issues/15)
- Feature: the output now lists each request's **headers**, synthesizing the `Content-Type: multipart/form-data` entry for `formdata` bodies that Newman only adds at the transport layer. [#26](https://github.com/eridem/vscode-postman/issues/26)
- Improvement: migrate build to esbuild (bundles to `dist/extension.js`) and lint to ESLint (flat config); drop TSLint, the deprecated `vscode` module in favor of `@types/vscode`, and the `.nvmrc`/`postinstall` legacy setup.
- Improvement: add GitHub Actions CI and Release workflows, and modernize the toolchain (TypeScript strict mode, Prettier, Node test runner).
- Improvement: upgrade `newman` to `6.2.2`, `shelljs` to `0.10.0`, and TypeScript to `6.0.3`. Added a `newman-reporter-html` override so the HTML reporter resolves cleanly against Newman 6.
- Improvement: add an `examples/` folder with a modern Collection Format v2.1.0 collection, environment, and iteration-data file (Postman Echo) to try out and smoke-test the extension.

### 2.0.0

- Improvement: Use `newman: 5.0.0`.
- Improvement: Improve the paths where the extension look for the files. By [samlikins](https://github.com/samlikins) | [#11](https://github.com/eridem/vscode-postman/pull/11)

### 1.0.2

- Bugfix: fix Homepage url

### 1.0.1

- Bugfix: error not showing the report on vscode.

### 1.0.0

- Improvement: Use `newman: ^4.5.0`.
- Improvement: Upgrade the rest of the libraries.

### 0.5.2

- Improvement: Change Mac OSX shortcut to `Cmd+R`.
- Improvement: Upgrade libraries to latest versions.
- Bugfix: error with reports that may not show request information.
- Bugfix: fix default value for `postman.testDefaultDelay` and `postman.testDefaultIterations`.

### 0.5.1

- Bugfix: settings was not showing correctly.

### 0.5.0

- Feature: show results in a new document when the tests finish.
- Feature: setting options to personalize extension behaviour.
- Improvement: add info message to advice that the tests are running.
- Improvement: `postman.showRunInfoMessage` setting to deactive info message.
- Improvement: `postman.showResultsInNewDocument` setting to activate/deactivate generation of results document.
- Improvement: `postman.showOutputAutomatically` setting to activate/deactivate showing automatically the output window.
- Improvement: `postman.showProgressInToolbar` setting to activate/deactivate messages in the toolbar.
- Improvement: `postman.testDefaultDelay` setting to set default delay for tests.
- Improvement: `postman.testDefaultIterations` setting to set default iterations for tests.

### 0.4.1

- Improvement: search tags on Marketplace, homepage, ...

### 0.4.0

- Feature: add Data files support (CSV and JSON)
- BugFix: there was a bug that did not allow to start tests without environments. Fixed!

### 0.3.1

- Improvement: cancel any question with ESC

### 0.3.0

- Feature: add shortcuts `Ctrl+Q` or `Cmd+Q`
- Improvement: add category `Postman` to the *Command Palette*

### 0.2.0

- Feature: show results on the output

### 0.0.4

- BugFix: now it is compatible with collections v1 and v2
- Improvement: it will not ask for folder if not folders are in the collection

### 0.0.2

- Initial release, few features but happy with the idea
