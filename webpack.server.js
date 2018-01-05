const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const webpackNodeExternals = require('webpack-node-externals');

const config = {
  // inform webpack that we're building a bundle for node environment, rather than for browser
  target: 'node',

  // root file of the app (entry point)
  entry: './src/index.js',

  // where to put the output file that is generated
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },

  // instructs webpack to not include 'node_modules' libraries into bundle file
  externals: [webpackNodeExternals()]
};

module.exports = merge(baseConfig, config);