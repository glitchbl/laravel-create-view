import {
    CodeActionProvider,
    TextDocument,
    Range,
    CodeActionContext,
    CancellationToken,
    ProviderResult,
    Command,
    CodeAction,
} from 'vscode';

export default class actionProvider implements CodeActionProvider {
    provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext, token: CancellationToken): ProviderResult<(Command | CodeAction)[]> {
        let text = document.getText(range);
		if (/^(\'|\")[_a-z0-9]+(\.[_a-z0-9]+)*(\"|\')$/.test(text)) {
            let view_name = text.replace(/\"|\'/g, '');
            return [{
                title: 'Laravel: Create view',
                command: 'extension.createView',
                arguments: [view_name],
            }];
        } else {
            return;
        }
    }
}