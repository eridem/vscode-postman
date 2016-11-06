# Postman Runner for VSCode

Postman Runner for VSCode allows you to run [Postman](https://www.getpostman.com/) tests from your VSCode. It analyze the workspace folder and locate *collection* and *environment* files.

- Export your Postman *collections* and *environments* in a folder (or subfolders) and open it with VSCode.
- Open the `Command Palette`
- Choose `Postman: Run > Question Mode` ( `Ctrl+Q` , `Cmd+Q` )

![Command palette image](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/command-palette.png)

# Current features

- Compatible with Postman collections exported as `v1` or `v2`.
- Question mode: `Postman: Run > Question Mode` ( `Ctrl+Q` , `Cmd+Q` ): It will ask you several quick questions to run your tests.

![Running tests](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/toolbar-choosing.gif)
- Displaying results: It will display the results in a new VSCode output window and the toolbar:

![Running tests](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/console-running.gif)

# Future features

- Colors on reports
- Export reports
- Default `delay` and `iteractions` on settings.
- Integration with the `Debug configurations`
- From your feedback: <https://github.com/eridem/vscode-postman/issues>

# Known Issues

<https://github.com/eridem/vscode-postman/issues>

# Release Notes

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

# Copyright

Copyright (c) 2016 [Miguel Ángel Domínguez Coloma](http://eridem.net)

Licensed under [the MIT License](./LICENSE.md).

# *EXTRA Exporting collections and environments

![Exporting collections image](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/export-collection.png)

![Exporting environments image](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/export-environments.png)