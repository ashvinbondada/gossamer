"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
let lastOpenedUri = '';
function activate(context) {
    const listener = vscode.workspace.onDidOpenTextDocument((doc) => {
        if (doc.uri.scheme !== 'file') {
            return;
        }
        const isHtml = doc.languageId === 'html' || doc.fileName.endsWith('.html');
        if (!isHtml) {
            return;
        }
        const uriString = doc.uri.toString();
        if (uriString === lastOpenedUri) {
            return;
        }
        lastOpenedUri = uriString;
        const openEditor = vscode.workspace
            .getConfiguration('htmlAutoPreview')
            .get('openEditor', false);
        vscode.commands.executeCommand('simpleBrowser.show', uriString).then(() => {
            if (!openEditor) {
                // Close the editor tab that was just opened for this HTML file
                vscode.window.tabGroups.all.forEach((group) => {
                    group.tabs.forEach((tab) => {
                        if (tab.input instanceof vscode.TabInputText &&
                            tab.input.uri.toString() === uriString) {
                            vscode.window.tabGroups.close(tab);
                        }
                    });
                });
            }
        });
    });
    context.subscriptions.push(listener);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map