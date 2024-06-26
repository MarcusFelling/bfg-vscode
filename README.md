# Git Credential Purge VS Code Extension

VS Code wrapper for the [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) to remove credentials from your git history.

## ⚙️ Prerequisites

- The [Java Runtime Environment](https://www.java.com/en/download/manual.jsp) (Java 8 or above - BFG v1.12.16 was the last version to support Java 7, [v1.12.3](https://repo1.maven.org/maven2/com/madgag/bfg/1.12.3/bfg-1.12.3.jar) was the last version to support Java 6)
- Before getting started, ensure your repository is backed up. It is also recommended to merge or close all open pull requests before removing files from your repository.

## ✅ Getting Started

1. Install the extension
1. Open the command palette (Ctrl+Shift+P), type "Remove credentials from git history", press enter.
![Run via Command Palette](./images/commandPalette.png)
1. Enter repo URL.
![Enter repo URL](./images/enterRepoURL.png)
1. Enter credential to remove.
![Enter cred to remove](./images/enterCred.png)

## 💡 Features

Step by step walkthrough using the Command Palette to peform the following:

1. Clones a fresh copy of your repo using the --mirror flag.

1. Installs BFG: This step downloads the BFG jar file from the official repository and saves it in the workspace folder.

1. Enter credential to remove: This step prompts the user to enter the credential to remove, writes this credential to a file in the workspace folder, and uses the `--replace-text` option of BFG Repo-Cleaner to replace this credential with `***REMOVED***` in the repository's history.

1. Remove credentials: This step runs the BFG Repo-Cleaner with the `--replace-text` option to replace the specified credential with `***REMOVED***` in the repository's history.

1. Clean your repository: This step runs the `git reflog expire --expire=now --all && git gc --prune=now --aggressive` command to clean the repository.

1. Push the changes: This step runs the `git push --force` command to push the changes to the remote repository.

## 📃 Docs

- BFG Repo-Cleaner: [https://rtyley.github.io/bfg-repo-cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- GitHub: [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository#fully-removing-the-data-from-github)

## 🚚 Release Notes

### 0.1.6

Initial release

### 0.1.7

Set up CI with GitHub Actions

### 0.1.8

Show progress bar between git commands

### 0.1.9

Show feedback message to file GitHub Issue

### 0.2.0

Support repos that don't use post-fixed .git URLs

---
