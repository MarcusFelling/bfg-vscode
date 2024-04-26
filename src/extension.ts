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
            return null;
        }
    }

    return workspaceFolder;
}

export function isGitInstalled() {
    const gitInstalled = child_process.spawnSync('git', ['--version']).status === 0;
    if (!gitInstalled) {
        vscode.window.showErrorMessage('Git is not installed. Please install Git to run BFG Repo-Cleaner.');
        return false;
    }

    return true;
}

export function isJavaInstalled() {
    const javaInstalled = child_process.spawnSync('java', ['-version']).status === 0;
    if (!javaInstalled) {
        vscode.window.showErrorMessage('Java is not installed. Please install Java to run BFG Repo-Cleaner.');
        return false;
    }

    return true;
}

export function downloadFile(url: string, dest: string) {
    return new Promise<void>((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (error) => {
            fs.unlink(dest, (err) => {
                if (err) {
                    reject(err);
                } else {
                    reject(error);
                }
            });
        });
    });
}

export async function executeCommand(command: string, cwd: string) {
    return new Promise<void>((resolve, reject) => {
        try {
            child_process.exec(command, { cwd }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('bfg-vscode.removeCredentials', async () => {
        const workspaceFolder = await getWorkspaceFolder();
        if (!workspaceFolder) return;

        if (!isGitInstalled() || !isJavaInstalled()) return;

        vscode.window.showInformationMessage('Before getting started, ensure your repository is backed up. It is also recommended to merge or close all open pull requests before removing files from your repository.');

        try {
            // Prompt user to enter repo URL
            const repoUrl = await vscode.window.showInputBox({ prompt: 'Enter the URL of the Git repo (https://example.com/some-repo.git)' });

            if (!repoUrl || !repoUrl.endsWith('.git')) {
                throw new Error('Invalid Git repository URL. Please make sure the URL ends with ".git".');
            }

            // If .git folder already exists skip cloning
            const gitFolder = fs.readdirSync(workspaceFolder).find((folder) => folder.endsWith('.git'));
            const gitFolderPath = path.join(workspaceFolder, gitFolder || '');
            if (!gitFolder) {
                const cloneCommand = `git clone --mirror ${repoUrl}`;
                await executeCommand(cloneCommand, workspaceFolder); 
            }
            // If .git folder exists, fetch latest changes
            else {
                const fetchCommand = `git fetch --all`;
                await executeCommand(fetchCommand, gitFolderPath);
            }

            // Download BFG Repo-Cleaner jar
            const bfgJarPath = path.join(workspaceFolder, 'bfg.jar');
            const bfgUrl = 'https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar';

            // If BFG jar already exists skip download
            if (!fs.existsSync(bfgJarPath)) {
                await downloadFile(bfgUrl, bfgJarPath);
            }

            // Prompt user for credential to remove
            let credential = await vscode.window.showInputBox({ prompt: 'Enter the credential value to remove', password: true });
            
            // Keep prompt open if user switches focus to copy/paste credential
            while (!credential) {
                credential = await vscode.window.showInputBox({ prompt: 'Enter the credential value to remove', password: true });
            }
            const credentialsFile = path.join(workspaceFolder, '.credentials');
            fs.writeFileSync(credentialsFile, `${credential}`);

            // Run BFG Repo-Cleaner and capture output
            const outputChannel = vscode.window.createOutputChannel('BFG Repo-Cleaner');
            outputChannel.show();
            outputChannel.appendLine('Removing credentials...');
            const existingGitFolder = fs.readdirSync(workspaceFolder).find((folder) => folder.endsWith('.git'));
            const gitFolderFullPath = path.join(workspaceFolder, existingGitFolder || '');            
            process.chdir(gitFolderFullPath);
            const javaProcess = child_process.spawn('java', ['-jar', bfgJarPath, '--replace-text', credentialsFile]);
            javaProcess.stdout?.on('data', (data) => {
                outputChannel.append(data.toString());
            });
            javaProcess.stderr?.on('data', (data) => {
                outputChannel.append(data.toString());
            });
            await new Promise<void>((resolve, reject) => {
                javaProcess.on('exit', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(`BFG Repo-Cleaner exited with code ${code}`);
                    }
                });
            }).then(async () => {
                // Strip out the unwanted dirty data, which Git will now recognise as surplus to requirements:
                const cleanCommand = `git reflog expire --expire=now --all && git gc --prune=now --aggressive`;
                await executeCommand(cleanCommand, gitFolderFullPath)
                    .then(async () => {
                        // Push changes to remote
                        const pushCommand = `git push --force`;
                        await executeCommand(pushCommand, gitFolderFullPath);
                        vscode.window.showInformationMessage('Repository cleaning completed successfully.');
                    })
                    .catch((error) => {
                        vscode.window.showErrorMessage(`Cleaning repository failed with error: ${error}`);
                    });
            }).catch((error) => {
                vscode.window.showErrorMessage(`Removing credentials failed with error: ${error}`);
            });
        } catch (error) {
            vscode.window.showErrorMessage(`An error occurred: ${error}`);
        }

        context.subscriptions.push(disposable);
    });
}