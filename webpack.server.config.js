const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach((mod) => {
        nodeModules[mod] = `commonjs ${mod}`;
    });

module.exports = function config(env) {
    const isDevelopment = env && env.development;

    if (isDevelopment)
        fs.copySync('./webpack.client.config.js', './src/server/webpack.client.config.js', { overwrite: true });

    return {
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        context: path.join(__dirname, '/src/server'),
        entry: './Server.ts',
        target: 'node',
        devtool: 'inline-sourcemap',
        externals: nodeModules,
        module: {
            loaders: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: 'awesome-typescript-loader',
                },
            ],
        },
        output: {
            path: path.join(__dirname),
            filename: 'Server.bundle.js',
        },
        node: {
            __dirname: false,
            __filename: false,
        },
        plugins: isDevelopment ? [
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') }),
            new webpack.NoEmitOnErrorsPlugin(),
        ] : [
            new webpack.NoEmitOnErrorsPlugin(),
        ],
    };
};
