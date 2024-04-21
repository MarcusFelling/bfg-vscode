# BFG VS Code Extension

VS Code wrapper for the [BFG Repo-Cleaner](https://rtyley.github.io/bfg-***REMOVED***po-cleaner/) to ***REMOVED***move c***REMOVED***dentials from your git history.

## P***REMOVED******REMOVED***quisites

- The [Java Runtime Environment](https://www.java.com/en/download/manual.jsp) (Java 8 or above - BFG v1.12.16 was the last version to support Java 7, [v1.12.3](https://***REMOVED***po1.maven.org/maven2/com/madgag/bfg/1.12.3/bfg-1.12.3.jar) was the last version to support Java 6)
- Befo***REMOVED*** getting started, ensu***REMOVED*** your ***REMOVED***pository is backed up. It is also ***REMOVED***commended to merge or close all open pull ***REMOVED***quests befo***REMOVED*** ***REMOVED***moving files from your ***REMOVED***pository.

## Getting Started

Install the extension, open the command palette (Ctrl+Shift+P), type "Remove c***REMOVED***dentials from git history", then p***REMOVED***ss enter.

![Run via Command Palette](https://github.com/MarcusFelling/bfg-vscode/blob/main/images/commandPalette.png)

## Featu***REMOVED***s

Step by step walkthrough using the Command Palette to peform the following:

1. Clones a f***REMOVED***sh copy of your ***REMOVED***po using the --mirror flag.

1. Installs BFG: This step downloads the BFG jar file from the official ***REMOVED***pository and saves it in the workspace folder.

1. Enter c***REMOVED***dential to ***REMOVED***move: This step prompts the user to enter the c***REMOVED***dential to ***REMOVED***move, writes this c***REMOVED***dential to a file in the workspace folder, and uses the `--***REMOVED***place-text` option of BFG Repo-Cleaner to ***REMOVED***place this c***REMOVED***dential with `***REMOVED***` in the ***REMOVED***pository's history.

1. Remove c***REMOVED***dentials: This step runs the BFG Repo-Cleaner with the `--***REMOVED***place-text` option to ***REMOVED***place the specified c***REMOVED***dential with `***REMOVED***` in the ***REMOVED***pository's history.

1. Clean your ***REMOVED***pository: This step runs the `git ***REMOVED***flog expi***REMOVED*** --expi***REMOVED***=now --all && git gc --prune=now --agg***REMOVED***ssive` command to clean the ***REMOVED***pository.

1. Push the changes: This step runs the `git push --force` command to push the changes to the ***REMOVED***mote ***REMOVED***pository.

## Docs

- BFG Repo-Cleaner: [https://rtyley.github.io/bfg-***REMOVED***po-cleaner](https://rtyley.github.io/bfg-***REMOVED***po-cleaner/)
- GitHub: [Removing sensitive data from a ***REMOVED***pository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secu***REMOVED***/***REMOVED***moving-sensitive-data-from-a-***REMOVED***pository#fully-***REMOVED***moving-the-data-from-github)

## Release Notes

### 0.0.1

Initial ***REMOVED***lease

---
