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
	[
		{ command: 'simple-case.simpleCase.commands', func: simpleCaseCommands },
		{ command: 'simple-case.simpleCase.lowerCase', func: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => runCommand(COMMAND_LABELS.lowerCase, textEditor, edit) },
		{ command: 'simple-case.simpleCase.upperCase', func: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => runCommand(COMMAND_LABELS.upperCase, textEditor, edit) },
		{ command: 'simple-case.simpleCase.toggleCase', func: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => runCommand(COMMAND_LABELS.toggleCase, textEditor, edit) }
	].forEach(
		i => {
			let d = vscode.commands.registerTextEditorCommand(i.command, i.func);
			context.subscriptions.push(d);
		}
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
