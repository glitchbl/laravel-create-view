// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import mkdirp = require('mkdirp');
import path = require('path');
import fs = require('fs');
import actionProvider from './providers/actionProvider';

function createView(view: string) {
	if (Array.isArray(vscode.workspace.workspaceFolders) && vscode.workspace.workspaceFolders.length > 0) {
		let view_explode = view.split('.');
		let directory_path = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'resources/views', view_explode.splice(0, view_explode.length - 1).join('/'));
		let filename = `${view_explode.pop()}.blade.php`;
		let full_path = path.join(directory_path, filename);
		if (fs.existsSync(full_path)) {
			vscode.window.showWarningMessage('La vue est déjà présente.');
		} else {
			mkdirp(directory_path, (err: any) => {
				if (err) vscode.window.showErrorMessage(`Impossible de créer le répertoire ${directory_path}.`);
				fs.writeFileSync(full_path, '', 'utf8');
				vscode.window.showInformationMessage('La vue a bien été créé.');

				let file = vscode.Uri.file(full_path);
				vscode.workspace.openTextDocument(file).then(doc => {
					vscode.window.showTextDocument(doc);
				});
			})
		}
	} else {
		vscode.window.showErrorMessage('Aucun espace de travail disponible.');
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.createView', view_name => {
		if (view_name) {
			createView(view_name);
		} else {
			vscode.window.showInputBox().then(_value => {
				let value: string = String(_value);
				if (/^[_a-z0-9]+(\.[_a-z0-9]+)*$/.test(value)) {
					createView(value);
				} else {
					vscode.window.showErrorMessage("La vue renseignée n'est pas valide.");
				}
			});
		}
	});

	let action = vscode.languages.registerCodeActionsProvider(['php', 'blade'], new actionProvider);

	context.subscriptions.push(disposable, action);
}

// this method is called when your extension is deactivated
export function deactivate() {}
