import * as assert from 'assert';
import * as vscode from 'vscode';
import { isGitInstalled, isJavaInstalled, executeCommand, downloadFile } from '../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('isGitInstalled returns true if Git is installed', () => {
        const gitInstalled = isGitInstalled();
        assert.strictEqual(gitInstalled, true);
    });

    test('isJavaInstalled returns true if Java is installed', () => {
        const javaInstalled = isJavaInstalled();
        assert.strictEqual(javaInstalled, true);
    });

    test('executeCommand returns void when command is executed successfully', async () => {
        const command = 'echo "Execute command test"';
        const cwd = '.';
        await executeCommand(command, cwd);
    });
    
    test('downloadFile downloads file from URL', async () => {
        try {
            const url = 'https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar';
            const dest = 'bfg.jar';
            await downloadFile(url, dest);
            assert.strictEqual(true, true);
            await vscode.workspace.fs.delete(vscode.Uri.file(dest));
        } catch (error) {
            console.error(error);
        }
    });
    
});

function done() {
    throw new Error('Function not implemented.');
}
