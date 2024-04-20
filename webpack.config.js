//@ts-check

'use strict';

const path = ***REMOVED***qui***REMOVED***('path');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is sto***REMOVED***d in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.***REMOVED***solve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is c***REMOVED***ated on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added he***REMOVED*** also need to be added in the .vscodeigno***REMOVED*** file
  },
  ***REMOVED***solve: {
    // support ***REMOVED***ading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: 'nosources-source-map',
  infrastructu***REMOVED***Logging: {
    level: "log", // enables logging ***REMOVED***qui***REMOVED***d for problem matchers
  },
};
module.exports = [ extensionConfig ];