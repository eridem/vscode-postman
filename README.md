# Postman Runner for VSCode

Postman Runner for VSCode allows you to run [Postman](https://www.getpostman.com/) tests from your VSCode. It analyze the workspace folder and locate *collection* and *environment* files.

- Export your Postman *collections* and *environments* in a folder (or subfolders) and open it with VSCode.
- Open the `Command Palette`
- Choose `Postman: Run > Question Mode` ( `Ctrl+Q` , `Cmd+R` )

![Command palette image](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/command-palette.png)

**IMPORTANT**: From the version `2.0.0`, this extension will use `newman@5.0.0`. If you get any issue you can downgrade it to the previous `1.0.2`. More info in [newman changelog](https://github.com/postmanlabs/newman/blob/develop/MIGRATION.md#migrating-from-v4-to-v5).

## Current features

- Compatible with Postman collections exported as `v1` or `v2`.
- Question mode: `Postman: Run > Question Mode` ( `Ctrl+Q` , `Cmd+R` ): It will ask you several quick questions to run your tests.

![Toolbar choosing](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/toolbar-choosing.gif)

- Displaying results: it will open a new document with the results in a new tab.

![Showing results](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/document-results.gif)

- Displaying results: It will display the results in a new VSCode output window and the toolbar:

![Console running](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/console-running.gif)

## Settings

The extension can be personalized using the following settings:

```json
  "postman.showRunInfoMessage": true,
  "postman.showResultsInNewDocument": true,
  "postman.showOutputAutomatically": true,
  "postman.showProgressInToolbar": true,
  "postman.testDefaultDelay": 0,
  "postman.testDefaultIterations": 1,
```

Where:

- `postman.showRunInfoMessage`: Show info message before start running a test.
- `postman.showResultsInNewDocument`: On finish, open automatically a document with the results.
- `postman.showOutputAutomatically`: Open up automatically the Output window showing the progress.
- `postman.showProgressInToolbar`: Show or hide the progress and results from the bottom toolbar.
- `postman.testDefaultDelay`: Set default delay for tests when asking questions.
- `postman.testDefaultIterations`: Set default iteractions for tests when asking questions.

## Future features

- Integration with the `Debug configurations`
- From your feedback: <https://github.com/eridem/vscode-postman/issues>

## Known Issues

<https://github.com/eridem/vscode-postman/issues>

## Copyright

Copyright (c) 2016 [Miguel Ángel Domínguez Coloma](http://eridem.net)

Licensed under [the MIT License](./LICENSE.md).

## *EXTRA Exporting collections and environments

![Exporting collections image](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/export-collection.png)

![Exporting environments image](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/export-environments.png)
