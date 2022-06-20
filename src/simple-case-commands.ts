import * as vscode from 'vscode';

export const COMMAND_LABELS = {
    lowerCase: 'lowerCase',
    upperCase: 'upperCase',
    toggleCase: 'toggleCase'
};

type CommandDefinition = {
    label: string,
    description: string,
    func: (text: string) => string | undefined
};

const COMMAND_DEFINITIONS: CommandDefinition[] = [
    { label: COMMAND_LABELS.lowerCase, description: 'Convert upper case to lower case', func: toLower },
    { label: COMMAND_LABELS.upperCase, description: 'Convert lower case to upper case', func: toUpper },
    { label: COMMAND_LABELS.toggleCase, description: 'Convert lower case to upper case, and upper case to lower case', func: toggleCase }
];

export function simpleCaseCommands(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const items: vscode.QuickPickItem[] = COMMAND_DEFINITIONS.map(c => ({
        label: c.label,
        description: c.description
    }));

    vscode.window.showQuickPick(items)
        .then(command => runCommand(command?.label ?? '', textEditor, edit));
}

export function runCommand(commandLabel: string, textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const commandDefinition = COMMAND_DEFINITIONS.filter(c => c.label === commandLabel)[0];
    if (!commandDefinition) {
        return;
    }

    // const textEditor = vscode.window.activeTextEditor; //xzf
    // const { document, selections } = textEditor ?? {};
    const { document, selections } = textEditor;

    if (!document || !selections) {
        vscode.window.showInformationMessage('simple-case: Hi, here is nothing to do!');
        return;
    }
    let updatedSelections: vscode.Selection[] = [];

    textEditor.edit(editBuilder => {
        selections.forEach(selection => {
            let replacement: string | undefined;
            let replacementSelection: vscode.Selection;
            let newSelection: vscode.Selection;

            if (isEmptyRange(selection)) {
                let currentLine = document.lineAt(selection.active);

                if (isEndOfLine(currentLine, selection)) {
                    newSelection = isLastLine(document, selection)
                        ? selection
                        // Move the cursor to the begining of the next line
                        : new vscode.Selection(selection.active.line + 1, 0, selection.active.line + 1, 0);

                    updatedSelections.push(newSelection);
                    return;
                }

                let targetSelection = selection;
                let currentChar = document.lineAt(targetSelection.active).text[targetSelection.active.character];

                replacement = commandDefinition.func(currentChar);
                replacementSelection = new vscode.Selection(targetSelection.active.line, targetSelection.active.character, targetSelection.active.line, targetSelection.active.character + 1);
                // Advance the cursor on the same line
                newSelection = new vscode.Selection(targetSelection.active.line, targetSelection.active.character + 1, targetSelection.active.line, targetSelection.active.character + 1);
            }
            else {
                const selectedText = document.getText(selection);
                replacement = commandDefinition.func(selectedText);
                replacementSelection = selection;
                newSelection = selection;
            }

            if (replacement !== undefined) {
                editBuilder.replace(replacementSelection, replacement);
            }
            updatedSelections.push(newSelection);
        });
    }).then(() => {
        textEditor.selections = updatedSelections;
    });
}

function isEmptyRange(range: vscode.Range): boolean {
    return range.start.line === range.end.line && range.start.character === range.end.character;
}

function isEndOfLine(line: vscode.TextLine, currentSelection: vscode.Selection): boolean {
    return line.text.length === currentSelection.active.character;
}

function isLastLine(document: vscode.TextDocument, currentSelection: vscode.Selection): boolean {
    return document.lineCount === currentSelection.active.line + 1;
}

function toLower(str: string): string | undefined {
    let result = str.toLowerCase();
    return str === result ? undefined : result;
}

function toUpper(str: string): string | undefined {
    let result = str.toUpperCase();
    return str === result ? undefined : result;
}

function toggleCase(str: string): string | undefined {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        const lower = str[i].toLowerCase();
        result += str[i] === lower ? str[i].toUpperCase() : lower;
    }
    return str === result ? undefined : result;
}

// https://stackoverflow.com/a/62032796
// https://www.regular-expressions.info/unicode.html#prop
function isLetter(str: string): boolean {
    return RegExp(/^\p{L}/, 'u').test(str);
}