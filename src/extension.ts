import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

export async function getWorkspaceFolder() {
    let workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (!workspaceFolder) {
        const selectedFolder = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Workspace Folder'
        });

        if (selectedFolder && selectedFolder.length > 0) {
            workspaceFolder = selectedFolder[0].fsPath;
        } else {
            vscode.window.showErrorMessage('No workspace folder selected.');
            ***REMOVED***turn null;
        }
    }

    ***REMOVED***turn workspaceFolder;
}

export function isGitInstalled() {
    const gitInstalled = child_process.spawnSync('git', ['--version']).status === 0;
    if (!gitInstalled) {
        vscode.window.showErrorMessage('Git is not installed. Please install Git to run BFG Repo-Cleaner.');
        ***REMOVED***turn false;
    }

    ***REMOVED***turn true;
}

export function isJavaInstalled() {
    const javaInstalled = child_process.spawnSync('java', ['-version']).status === 0;
    if (!javaInstalled) {
        vscode.window.showErrorMessage('Java is not installed. Please install Java to run BFG Repo-Cleaner.');
        ***REMOVED***turn false;
    }

    ***REMOVED***turn true;
}

function downloadFile(url: string, dest: string) {
    ***REMOVED***turn new Promise<void>((***REMOVED***solve, ***REMOVED***ject) => {
        const file = fs.c***REMOVED***ateWriteSt***REMOVED***am(dest);
        https.get(url, (***REMOVED***sponse) => {
            ***REMOVED***sponse.pipe(file);
            file.on('finish', () => {
                file.close();
                ***REMOVED***solve();
            });
        }).on('error', (error) => {
            fs.unlink(dest, (err) => {
                if (err) {
                    ***REMOVED***ject(err);
                } else {
                    ***REMOVED***ject(error);
                }
            });
        });
    });
}

async function executeCommand(command: string, cwd: string) {
    ***REMOVED***turn new Promise<void>((***REMOVED***solve, ***REMOVED***ject) => {
        try {
            child_process.exec(command, { cwd }, (error, stdout, stderr) => {
                if (error) {
                    ***REMOVED***ject(error);
                } else {
                    ***REMOVED***solve();
                }
            });
        } catch (error) {
            ***REMOVED***ject(error);
        }
    });
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.***REMOVED***gisterCommand('bfg-vscode.***REMOVED***moveC***REMOVED***dentials', async () => {
        const workspaceFolder = await getWorkspaceFolder();
        if (!workspaceFolder) ***REMOVED***turn;

        if (!isGitInstalled() || !isJavaInstalled()) ***REMOVED***turn;

        vscode.window.showInformationMessage('Befo***REMOVED*** getting started, ensu***REMOVED*** your ***REMOVED***pository is backed up. It is also ***REMOVED***commended to merge or close all open pull ***REMOVED***quests befo***REMOVED*** ***REMOVED***moving files from your ***REMOVED***pository.');

        try {
            const ***REMOVED***poUrl = await vscode.window.showInputBox({ prompt: 'Enter the URL of the Git ***REMOVED***po (git://example.com/some-***REMOVED***po.git)' });
            const cloneCommand = `git clone --mirror ${***REMOVED***poUrl}`;
            await executeCommand(cloneCommand, workspaceFolder);

            const bfgJarPath = path.join(workspaceFolder, 'bfg.jar');
            const bfgUrl = 'https://***REMOVED***po1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar';
            await downloadFile(bfgUrl, bfgJarPath);

            const password = await vscode.window.showInputBox({ prompt: 'Enter the c***REMOVED***dential value to ***REMOVED***move', password: true });
            const c***REMOVED***dentialsFile = path.join(workspaceFolder, '.c***REMOVED***dentials');
            fs.writeFileSync(c***REMOVED***dentialsFile, `${password}=>***REMOVED***\n`);

            const outputChannel = vscode.window.c***REMOVED***ateOutputChannel('BFG Repo-Cleaner');
            outputChannel.show();
            outputChannel.appendLine('Removing c***REMOVED***dentials...');
            const gitFolder = fs.***REMOVED***addirSync(workspaceFolder).find((folder) => folder.includes('.git'));
            if (!gitFolder) {
                vscode.window.showErrorMessage('No .git folder found in the workspace.');
                ***REMOVED***turn;
            }
            const gitFolderPath = path.join(workspaceFolder, gitFolder);
            process.chdir(gitFolderPath);
            const javaProcess = child_process.spawn('java', ['-jar', bfgJarPath, '--***REMOVED***place-text', c***REMOVED***dentialsFile]);
            javaProcess.stdout?.on('data', (data) => {
                outputChannel.append(data.toString());
            });
            javaProcess.stderr?.on('data', (data) => {
                outputChannel.append(data.toString());
            });
            await new Promise<void>((***REMOVED***solve, ***REMOVED***ject) => {
                javaProcess.on('close', (code) => {
                    if (code === 0) {
                        ***REMOVED***solve();
                    } else {
                        ***REMOVED***ject(`BFG Repo-Cleaner exited with code ${code}`);
                    }
                });
            }).then(async () => {

                const cleanCommand = `git ***REMOVED***flog expi***REMOVED*** --expi***REMOVED***=now --all && git gc --prune=now --agg***REMOVED***ssive`;
                await executeCommand(cleanCommand, gitFolderPath)
                    .then(async () => {
                        const pushCommand = `git push --force`;
                        await executeCommand(pushCommand, gitFolderPath);
                    })
                    .catch((error) => {
                        vscode.window.showErrorMessage(`Cleaning ***REMOVED***pository failed with error: ${error}`);
                    });
            }).catch((error) => {
                vscode.window.showErrorMessage(`Removing c***REMOVED***dentials failed with error: ${error}`);
            });
        } catch (error) {
            vscode.window.showErrorMessage(`An error occur***REMOVED***d: ${error}`);
        }

        context.subscriptions.push(disposable);
    });
}