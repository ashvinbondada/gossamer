import * as vscode from 'vscode';

let lastOpenedUri = '';

export function registerOpenListener(
  context: vscode.ExtensionContext,
  getPreviewUrl: (fileUri: string) => string
) {
  const listener = vscode.workspace.onDidOpenTextDocument((doc) => {
    if (doc.uri.scheme !== 'file') {
      return;
    }
    const isHtml =
      doc.languageId === 'html' || doc.fileName.endsWith('.html');
    if (!isHtml) {
      return;
    }
    const uriString = doc.uri.toString();
    if (uriString === lastOpenedUri) {
      return;
    }
    lastOpenedUri = uriString;

    const openEditor = vscode.workspace
      .getConfiguration('gossamer-preview')
      .get<boolean>('openEditor', false);

    const previewUrl = getPreviewUrl(uriString);
    vscode.commands.executeCommand('simpleBrowser.show', previewUrl).then(() => {
      if (!openEditor) {
        vscode.window.tabGroups.all.forEach((group) => {
          group.tabs.forEach((tab) => {
            if (
              tab.input instanceof vscode.TabInputText &&
              tab.input.uri.toString() === uriString
            ) {
              vscode.window.tabGroups.close(tab);
            }
          });
        });
      }
    });
  });

  context.subscriptions.push(listener);
}

export async function activate(context: vscode.ExtensionContext) {
  registerOpenListener(context, (fileUri) => fileUri);
}

export function deactivate() {}
