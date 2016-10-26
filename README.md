# Postman Runner for VSCode

***NOTE***: *This extension has been recently create and it is still in Beta and new features will come, please report your issues in <https://github.com/eridem/vscode-postman/issues> before negative feedback and I will help you out :-)*

Postman Runner for VSCode allows you to run Postman tests from your VSCode. It analyze the workspace folder and locate *collection* and *environment* files.

- Open VSCode on the folder or parent folder where collections and environments have been exported (section *Exporting collections and environments*)
- Open the `Command Palette`
- Choose `Postman > Run > Question Mode`

![Command palette image](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/command-palette.png?)

# Current features

- `Postman > Run > Question Mode`: It will ask you questions about how to trigger your tests. The bottom toolbar will show you the results of them.

![Running tests](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/toolbar-choosing.gif)
- Display results on the toolbar

![Running tests](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/toolbar-running.gif)

- Show results on VSCode output

![Running tests](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/console-running.gif)


# Future features

- Show better reports
- Integration with the `Debug configurations`
- From your feedback: <https://github.com/eridem/vscode-postman/issues>

# * Exporting collections and environments

Export your collections and environment files from Postman to a directory or subdirectories:

![Exporting collections image](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/export-collection.png)
![Exporting environments image](https://raw.githubusercontent.com/eridem/vscode-postman/master/images/export-environments.png)

## Known Issues

<https://github.com/eridem/vscode-postman/issues>

## Release Notes

### 0.0.5

- Feature: show results on the output

### 0.0.4

- Fix bug: now it is compatible with collections v1 and v2.
- It will not ask for folder if not folders are in the collection.

### 0.0.2

- Initial release, few features but happy with the idea.


# Copyright

Copyright (c) 2016 [Miguel Ángel Domínguez Coloma](http://eridem.net)

Licensed under [the MIT License](./LICENSE).