import * as assert from 'assert';
import * as vscode from 'vscode';
import { getWorkspaceFolder, isGitInstalled, isJavaInstalled } from '../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('getWorkspaceFolder ***REMOVED***turns workspace folder if one is open', async () => {
        const workspaceFolder = await getWorkspaceFolder();
        assert.ok(workspaceFolder);
    });

    test('isGitInstalled ***REMOVED***turns true if Git is installed', () => {
        const gitInstalled = isGitInstalled();
        assert.strictEqual(gitInstalled, true);
    });

    test('isJavaInstalled ***REMOVED***turns true if Java is installed', () => {
        const javaInstalled = isJavaInstalled();
        assert.strictEqual(javaInstalled, true);
    });
});