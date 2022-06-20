// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { simpleCaseCommands, runCommand, COMMAND_LABELS } from './simple-case-commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "simple-case" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let commandsDisposable   = vscode.commands.registerTextEditorCommand('simple-case.simpleCase.commands', simpleCaseCommands);
	let lowerCaseDisposable  = vscode.commands.registerTextEditorCommand('simple-case.simpleCase.lowerCase', (textEditor, edit) => runCommand(COMMAND_LABELS.lowerCase, textEditor, edit));
	let upperCaseDisposable  = vscode.commands.registerTextEditorCommand('simple-case.simpleCase.upperCase', (textEditor, edit) => runCommand(COMMAND_LABELS.upperCase, textEditor, edit));
	let toggleCaseDisposable = vscode.commands.registerTextEditorCommand('simple-case.simpleCase.toggleCase', (textEditor, edit) => runCommand(COMMAND_LABELS.toggleCase, textEditor, edit));

	[
		commandsDisposable, lowerCaseDisposable, upperCaseDisposable, toggleCaseDisposable
	].forEach(
		d => context.subscriptions.push(d)
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
