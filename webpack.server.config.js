const path = require('path');
const fs = require('fs');
/* eslint-disable */
const webpack = require('webpack');
/* eslint-enable */
const isDevelopment = true;// env && env.development;

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach((mod) => {
        nodeModules[mod] = `commonjs ${mod}`;
    });

module.exports = function config(env) {
    if (isDevelopment) {
        fs.writeFileSync('./src/server/webpack.client.config.js', fs.readFileSync('./webpack.client.config.js'));
    }

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
