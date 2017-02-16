const debug = process.env.NODE_ENV === 'development';
const path = require('path');
/* eslint-disable */
const webpack = require('webpack');
/* eslint-enable */

module.exports = {
    context: path.join(__dirname, './src/client'),
    devtool: debug ? 'inline-sourcemap' : null,
    entry: debug ? ['webpack-hot-middleware/client', './Client.js'] : './Client.js',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: debug ? ['react', 'latest', 'react-hmre'] : ['react', 'latest'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties', 'transform-strict-mode'],
                },
            },
        ],
    },
    output: {
        path: path.join(__dirname, '../public/'),
        filename: 'javascripts/client.min.js',
    },
    plugins: debug ? [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};
